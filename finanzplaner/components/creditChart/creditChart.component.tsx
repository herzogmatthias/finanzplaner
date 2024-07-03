import { ICreditChart } from "./ICreditChart.props";

import { Box, Text, VStack, Center } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const CreditChart = ({
  loanAmount,
  endDate,
  startDate,
  interestRate,
  additionalCosts,
}: ICreditChart) => {
  const term =
    new Date(endDate).getFullYear() - new Date(startDate).getFullYear();

  const calculateMonthlyPayment = (
    loanAmount: number,
    interestRate: number,
    term: number,
    additionalCosts: number
  ) => {
    const monthlyRate = interestRate / 12 / 100; // convert annual rate to a monthly and percentage
    const totalPayments = term * 12; // total number of monthly payments

    // Monthly payment calculation using the formula for an annuity
    const monthlyPayment =
      (monthlyRate * loanAmount) /
      (1 - Math.pow(1 + monthlyRate, -totalPayments));

    // Adding other annual fees spread out over the monthly payments
    const monthlyFees = additionalCosts / 12;

    return monthlyPayment + monthlyFees;
  };
  const calculateTotalAmountToBePaidBack = () => {
    const monthlyPayment = calculateMonthlyPayment(
      loanAmount,
      interestRate,
      term,
      additionalCosts
    );
    return monthlyPayment * term * 12; // Total amount paid over the loan term
  };

  const data = {
    labels: ["Kreditbetrag", "Zinsbetrag"],
    datasets: [
      {
        label: "Kredit Details",
        data: [loanAmount, calculateTotalAmountToBePaidBack() - loanAmount],
        backgroundColor: ["rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const plugins = [
    {
      id: "custom_canvas_background_color",
      beforeDraw: function (chart: any) {
        if (chart.config.options.elements.center) {
          // Get ctx from string
          var ctx = chart.ctx;

          // Get options from the center object in options
          var centerConfig = chart.config.options.elements.center;
          var fontStyle = centerConfig.fontStyle || "Arial";
          var txt = centerConfig.text;
          var color = centerConfig.color || "#000";
          var maxFontSize = centerConfig.maxFontSize || 75;
          var sidePadding = centerConfig.sidePadding || 20;
          var sidePaddingCalculated =
            (sidePadding / 100) * (chart.innerRadius * 2);
          // Start with a base font of 30px
          ctx.font = "30px " + fontStyle;

          // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          var stringWidth = ctx.measureText(txt).width;
          var elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

          // Find out how much the font can grow in width.
          var widthRatio = elementWidth / stringWidth;
          var newFontSize = Math.floor(30 * widthRatio);
          var elementHeight = chart.innerRadius * 2;

          // Pick a new font size so it will not be larger than the height of label.
          var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
          var minFontSize = centerConfig.minFontSize;
          var lineHeight = centerConfig.lineHeight || 25;
          var wrapText = true;

          if (minFontSize === undefined) {
            minFontSize = 20;
          }

          if (minFontSize && fontSizeToUse < minFontSize) {
            fontSizeToUse = minFontSize;
            wrapText = true;
          }

          // Set font settings to draw it correctly.
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.font = fontSizeToUse + "px " + fontStyle;
          ctx.fillStyle = color;

          if (!wrapText) {
            ctx.fillText(txt, centerX, centerY);
            return;
          }

          var words = txt.split(" ");
          var line = "";
          var lines = [];

          // Break words up into multiple lines if necessary
          for (var n = 0; n < words.length; n++) {
            lines.push(line);
            line = words[n] + " ";
          }
          // Move the center up depending on line height and number of lines
          centerY -= (lines.length / 2) * lineHeight;

          for (var n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], centerX, centerY);
            centerY += lineHeight;
          }
          //Draw text in center
          ctx.fillText(line, centerX, centerY);
        }
        ctx.save();
      },
    },
  ];

  return (
    <Box width={350} height={350}>
      <Doughnut
        data={data}
        width={350}
        height={350}
        plugins={plugins}
        options={
          {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "90%",
            elements: {
              center: {
                text:
                  "Gesamtbetrag " +
                  new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: localStorage.getItem("currency") || "EUR",
                  }).format(calculateTotalAmountToBePaidBack()),
                color: "#000000", // Default is #000000
                sidePadding: 20, // Default is 20 (as a percentage)
                minFontSize: 10, // Default is 20 (in px), set to false and text will not wrap.
                lineHeight: 25, // Default is 25 (in px), used for when text wraps
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context: any) {
                    let label = context.label || "";
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
              legend: {
                display: true,
                position: "bottom",
              },
            },
          } as any
        }
      />
    </Box>
  );
};

export default CreditChart;
