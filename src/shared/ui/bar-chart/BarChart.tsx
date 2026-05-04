import { useEffect, useRef, useState, memo } from "react";
// ApexCharts birbaşa importunu sildik, yalnız tipləri saxladıq
import type { ApexOptions } from "apexcharts";

interface BarChartProps {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  categories: string[] | string[][];
  colors?: string[];
  height?: number;
  title?: string;
}

const BarChart = memo(
  ({ series, categories, colors, height = 350, title }: BarChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<any>(null); // Dinamik import üçün ref

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

    const [isMobile, setIsMobile] = useState(() => {
      if (typeof window !== "undefined") {
        return window.innerWidth <= 768;
      }
      return false;
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
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      const renderChart = async () => {
        // Kitabxananı dinamik yükləyirik
        const { default: ApexChartsLib } = await import("apexcharts");

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        if (chartRef.current) {
          const isDark = currentTheme === "dark";

          const textColor = isDark ? "#f3f4f6" : "#1a1a1a";
          const mutedColor = isDark ? "#9ca3af" : "#6b7280";
          const borderColor = isDark ? "#374151" : "#e5e7eb";

          const needsPadding = categories.length <= 2;
          const paddedCategories = needsPadding
            ? [...categories, ...Array(4 - categories.length).fill("")]
            : categories;
          const paddedColors =
            needsPadding && colors
              ? [...colors, ...Array(4 - categories.length).fill("transparent")]
              : colors;
          const paddedSeries = needsPadding
            ? (series as { name: string; data: number[] }[]).map((s) => ({
                ...s,
                data: [...s.data, ...Array(4 - categories.length).fill(null)],
              }))
            : series;

          const options: ApexOptions = {
            chart: {
              type: "bar",
              height: height,
              width: "100%",
              background: "transparent",
              foreColor: textColor,
              toolbar: {
                show: false,
              },
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
            series: paddedSeries as any,
            colors: paddedColors,
            plotOptions: {
              bar: {
                columnWidth: categories.length <= 2 ? "40px" : "45%",
                distributed: true,
                borderRadius: 4,
              },
            },
            dataLabels: {
              enabled: false,
            },
            legend: {
              show: false,
            },
            xaxis: {
              categories: paddedCategories,
              labels: {
                style: {
                  colors: mutedColor,
                  fontSize: "12px",
                },
                rotate: -45,
                rotateAlways: false,
                hideOverlappingLabels: false,
                trim: false,
                maxHeight: 100,
              },
              axisBorder: {
                show: true,
                color: borderColor,
              },
              axisTicks: {
                color: borderColor,
              },
            },
            yaxis: {
              labels: {
                style: {
                  colors: mutedColor,
                },
                formatter: (value) => {
                  return value.toLocaleString("az-AZ", {
                    maximumFractionDigits: 0,
                  });
                },
              },
            },
            grid: {
              borderColor: borderColor,
              strokeDashArray: 4,
            },
            tooltip: {
              theme: isDark ? "dark" : "light",
              y: {
                formatter: function (val) {
                  return val.toLocaleString("az-AZ");
                },
              },
            },
            responsive: [
              {
                breakpoint: 768,
                options: {
                  chart: {
                    width: "100%",
                  },
                  xaxis: {
                    labels: {
                      style: {
                        fontSize: "11px",
                      },
                      rotate: -45,
                      rotateAlways: true,
                    },
                  },
                  plotOptions: {
                    bar: {
                      columnWidth: "50%",
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
    }, [series, categories, colors, height, title, currentTheme]);

    const barCount = categories.length;
    const shouldHaveMinWidth = isMobile || barCount >= 8;
    const minChartWidth = shouldHaveMinWidth
      ? Math.max(600, barCount * 100)
      : undefined;

    return (
      <div
        ref={chartRef}
        style={{
          width: "100%",
          ...(minChartWidth && { minWidth: `${minChartWidth}px` }),
        }}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.series) === JSON.stringify(nextProps.series) &&
      JSON.stringify(prevProps.categories) ===
        JSON.stringify(nextProps.categories) &&
      JSON.stringify(prevProps.colors) === JSON.stringify(nextProps.colors) &&
      prevProps.title === nextProps.title &&
      prevProps.height === nextProps.height
    );
  },
);

export default BarChart;