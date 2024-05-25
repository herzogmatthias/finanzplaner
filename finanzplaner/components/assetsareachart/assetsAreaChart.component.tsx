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
  const [data, setData] = useState<AccountData[]>([]);
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
        setError("Failed to fetch account data.");
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

  if (data.length === 0 && firstRender) {
    return (
      <Box>
        <Alert status="info">
          <AlertIcon />
          Please press 'start' to fetch data.
        </Alert>
      </Box>
    );
  }
  if (data.length === 0 && !firstRender) {
    return (
      <Box>
        <Alert status="warning">
          <AlertIcon />
          No data available.
        </Alert>
      </Box>
    );
  }

  const chartData = {
    labels: data[0].data.map((item) => item.date), // Assuming all accounts have the same dates
    datasets: data.map((account) => ({
      label: account.name,
      data: account.data.map((item) => item.value),
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
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { fill: "start" } },
  };

  return <Line data={chartData} options={options} />;
};

export default AssetsAreaChart;
