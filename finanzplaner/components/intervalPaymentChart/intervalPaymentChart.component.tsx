"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Box, Skeleton } from "@chakra-ui/react";
import InsuranceService from "@/services/Insurance.service";

const IntervalPaymentChart = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const service = InsuranceService.getInstance();
      const chartData = await service.fetchChart1Data();
      console.log(chartData);
      setData({
        labels: ["Monatlich", "Quartalsweise", "Jährlich"],
        datasets: [
          {
            data: [
              chartData.monthlyPayment,
              chartData.quarterlyPayment,
              chartData.yearlyPayment,
            ],
            backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
            borderWidth: 1,
          },
        ],
      });
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Box>
      {isLoading ? (
        <Skeleton height="200px" width="200px" />
      ) : (
        <Doughnut
          options={{
            plugins: {
              legend: {
                position: "bottom",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed !== null) {
                      label += new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: localStorage.getItem("currency") || "EUR",
                      }).format(context.parsed);
                    }
                    return label;
                  },
                },
              },
            },
            responsive: true,
            maintainAspectRatio: false,
            cutout: "75%",
          }}
          width={"350px"}
          height={250}
          data={data}
        />
      )}
    </Box>
  );
};

export default IntervalPaymentChart;
