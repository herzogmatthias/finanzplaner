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
import { useEffect } from "react";

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
  useEffect(() => {
    const unsubscribe = subscribe((filters) => {
      console.log("AssetsAreaChart fetching with filters:", filters);
      // Fetch data based on filters
    });
    return unsubscribe;
  }, []);

  const data = {
    labels: ["January", "February", "March", "April", "May", "June"], // This should be dynamically generated based on the data
    datasets: [
      {
        label: "Account #1",
        data: [20000, 21000, 22000, 23000, 24000, 25000], // Example data
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
      {
        label: "Account #2",
        data: [30000, 30500, 31000, 31500, 32000, 32500], // Example data
        fill: true,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
      },
    ],
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

  return <Line data={data} options={options} />;
};

export default AssetsAreaChart;
