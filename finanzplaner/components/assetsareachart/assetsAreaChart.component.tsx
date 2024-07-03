import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useFilters } from "@/context/filter.context";
import { useEffect, useState } from "react";
import { Box, Skeleton, Alert, AlertIcon } from "@chakra-ui/react";
import AccountService, { AccountData } from "@/services/Account.service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AssetsAreaChart = () => {
  const { subscribe } = useFilters()!;
  const [data, setData] = useState<{
    accounts: { [key: string]: AccountData };
  }>({ accounts: {} });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (filters: any) => {
      setIsLoading(true);
      setFirstRender(false);
      setError(null);
      try {
        const service = AccountService.getInstance();
        const result = await service.fetchAccountData(filters);
        setData(result);
      } catch (err) {
        setError("Fehler beim Laden der Daten");
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = subscribe((filters) => {
      console.log("AssetsAreaChart fetching with filters:", filters);
      fetchData(filters);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <Box>
        <Skeleton height="250px" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  if (Object.keys(data.accounts).length === 0 && firstRender) {
    return (
      <Box>
        <Alert status="info">
          <AlertIcon />
          Bitte drücke Start um Daten zu laden.
        </Alert>
      </Box>
    );
  }
  if (Object.keys(data.accounts).length === 0 && !firstRender) {
    return (
      <Box>
        <Alert status="warning">
          <AlertIcon />
          Keine Daten verfügbar.
        </Alert>
      </Box>
    );
  }

  const chartData = {
    labels: data.accounts[Object.keys(data.accounts)[0]].data.map((item) =>
      new Date(item.date).toLocaleDateString()
    ), // Assuming all accounts have the same dates
    datasets: Object.entries(data.accounts).map((account) => ({
      label: account["1"].accountName,
      data: account["1"].data.map((item) => item.value),
      fill: true,
    })),
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: localStorage.getItem("currency") || "EUR",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { fill: "start" } },
  };

  return <Line data={chartData} options={options as any} />;
};

export default AssetsAreaChart;
