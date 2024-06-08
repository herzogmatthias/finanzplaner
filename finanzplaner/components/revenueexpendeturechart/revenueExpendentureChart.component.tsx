import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useFilters } from "@/context/filter.context";
import { useEffect, useState } from "react";
import { Box, Skeleton, Alert, AlertIcon } from "@chakra-ui/react";
import AccountService, { RevenueExpenditure } from "@/services/Account.service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueExpenditureChart = () => {
  const { subscribe } = useFilters()!;
  const [data, setData] = useState<RevenueExpenditure[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (filters: any) => {
      setIsLoading(true);
      setError(null);
      setFirstRender(false);
      try {
        const service = AccountService.getInstance();
        const result = await service.fetchRevenueExpenditure(filters);
        setData(result);
      } catch (err) {
        setError("Failed to fetch revenue and expenditure data.");
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = subscribe((filters) => {
      console.log("RevenueExpenditureChart fetching with filters:", filters);
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
          Bitte drücke 'Start' um die Daten zu laden.
        </Alert>
      </Box>
    );
  }

  if (data.length === 0 && !firstRender) {
    return (
      <Box>
        <Alert status="warning">
          <AlertIcon />
          Keine Daten gefunden.
        </Alert>
      </Box>
    );
  }

  const chartData = {
    labels: data.map((item) => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: "Einnahmen",
        data: data.map((item) => item.revenue),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Ausgaben",
        data: data.map((item) => item.expense),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
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
  };

  return <Bar data={chartData} options={options} />;
};

export default RevenueExpenditureChart;
