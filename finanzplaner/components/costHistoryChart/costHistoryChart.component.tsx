"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Skeleton } from "@chakra-ui/react";
import { Chart, registerables } from "chart.js";
import InsuranceService from "@/services/Insurance.service";
import { IGroupedData } from "@/models/IInsurance";

Chart.register(...registerables);

const CostHistoryChart = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const service = InsuranceService.getInstance();
      const chartData = await service.fetchChart2Data();

      const groupedData: IGroupedData = chartData.insuranceCosts.reduce(
        (acc: IGroupedData, { month, insurance, cost }) => {
          if (!acc[month]) acc[month] = {};
          acc[month][insurance] = cost;
          return acc;
        },
        {} as IGroupedData
      );

      const months = Object.keys(groupedData);
      const insurances = [
        ...new Set(chartData.insuranceCosts.map((item) => item.insurance)),
      ];

      const datasets = insurances.map((insurance) => ({
        label: insurance,
        data: months.map((month) => groupedData[month][insurance] || 0),
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)},0.6)`,
        borderColor: `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
          Math.random() * 255
        )},${Math.floor(Math.random() * 255)},1)`,
        borderWidth: 1,
      }));

      setData({
        labels: months,
        datasets,
      });
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Box>
      {isLoading ? (
        <Skeleton height="200px" width="400px" />
      ) : (
        <Bar
          width={"350px"}
          height={300}
          data={data}
          options={{
            plugins: {
              legend: {
                position: "bottom",
              },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { stacked: true }, y: { stacked: true } },
          }}
        />
      )}
    </Box>
  );
};

export default CostHistoryChart;
