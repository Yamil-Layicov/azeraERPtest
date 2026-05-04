import { useEffect, useRef, useState, memo } from "react";

interface PieChartProps {
  series?: number[];
  labels?: string[];
  colors?: string[];
  title?: string;
  totalAmount?: number;
}

const PieChart = memo(
  ({
    series = [17350, 12000],
    labels = ["Mədaxil", "Məxaric"],
    colors,
    title,
    totalAmount,
  }: PieChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<any>(null); 

    const [currentTheme, setCurrentTheme] = useState(() => {
      if (typeof window !== "undefined") {
        return (
          document.documentElement.getAttribute("data-theme") ||
          localStorage.getItem("theme") ||
          "light"
        );
      }
      return "light";
    });

    useEffect(() => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-theme"
          ) {
            setCurrentTheme(
              document.documentElement.getAttribute("data-theme") || "light",
            );
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      const renderChart = async () => {
        const { default: ApexChartsLib } = await import("apexcharts");

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        if (chartRef.current) {
          const isDark = currentTheme === "dark";
          const textColor = isDark ? "#f3f4f6" : "#374151";
          const borderColor = isDark ? "#1f2937" : "#ffffff";

          const options = {
            series: series,
            labels: labels,
            colors: colors,
            chart: {
              type: "donut",
              width: "100%",
              height: 350,
              background: "transparent",
              foreColor: textColor,
            },
            title: title
              ? {
                  text: title,
                  align: "left",
                  style: {
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: textColor,
                  },
                }
              : undefined,
            dataLabels: {
              enabled: true,
              formatter: function (val: number) {
                return val.toFixed(1) + "%";
              },
              style: {
                colors: ["#fff"],
              },
            },
            tooltip: {
              y: {
                formatter: function (val: number) {
                  return (
                    val.toLocaleString("az-AZ", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) + " ₼"
                  );
                },
              },
            },
            plotOptions: {
              pie: {
                offsetX: 40,
                donut: {
                  labels: {
                    show: false,
                  },
                },
              },
            },
            legend: {
              position: "right",
              fontSize: "13px",
              fontWeight: 500,
              fontFamily: "Poppins, sans-serif",
              itemMargin: {
                vertical: 8,
                horizontal: 10,
              },
              markers: {
                width: 5,
                height: 5,
                radius: 7,
                offsetX: 0,
                offsetY: 0,
              },
              formatter: function (seriesName: string, opts: any) {
                const amount = opts.w.globals.series[opts.seriesIndex];
                const formattedAmount = amount.toLocaleString("az-AZ", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
                return `${seriesName}  •  ${formattedAmount} ₼`;
              },
              labels: {
                colors: textColor,
                useSeriesColors: false,
              },
            },
            stroke: {
              show: true,
              colors: [borderColor],
              width: 2,
            },

            responsive: [
              {
                breakpoint: 1600,
                options: {
                  chart: {
                    width: "100%",
                    height: 400,
                  },
                  plotOptions: {
                    pie: {
                      offsetX: 0,
                    },
                  },
                  legend: {
                    position: "bottom",
                    itemMargin: {
                      vertical: 5,
                      horizontal: 10,
                    },
                  },
                },
              },
            ],
          };

          chartInstance.current = new ApexChartsLib(chartRef.current, options);
          chartInstance.current.render();
        }
      };

      renderChart();

      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
          chartInstance.current = null;
        }
      };
    }, [series, labels, colors, title, totalAmount, currentTheme]);

    return (
      <div
        ref={chartRef}
        style={{ width: "100%", display: "flex", justifyContent: "center" }}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.series) === JSON.stringify(nextProps.series) &&
      JSON.stringify(prevProps.labels) === JSON.stringify(nextProps.labels) &&
      JSON.stringify(prevProps.colors) === JSON.stringify(nextProps.colors) &&
      prevProps.title === nextProps.title &&
      prevProps.totalAmount === nextProps.totalAmount
    );
  },
);

export default PieChart;