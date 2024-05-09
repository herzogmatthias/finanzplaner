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
import { useEffect } from "react";

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
  useEffect(() => {
    const unsubscribe = subscribe((filters) => {
      console.log("RevenueExpenditureChart fetching with filters:", filters);
      // Fetch data based on filters
    });
    return unsubscribe;
  }, []);

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"], // Example months
    datasets: [
      {
        label: "Revenue",
        data: [200, 450, 300, 500, 400, 600], // Example data
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Expenditure",
        data: [500, 300, 400, 200, 450, 300], // Example data
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

  return <Bar data={data} options={options} />;
};

export default RevenueExpenditureChart;
