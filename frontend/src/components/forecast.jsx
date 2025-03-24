"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Forecast(props) {
  const chartConfig = {
    historical: {
      label: "Past",
      color: "#2563eb",
    },
    forecasted: {
      label: "Forecast",
      color: "#60a5fa",
    },
  };

  //Get minimum date of data
  const getMinDate = (existingData) => {
    if (!existingData || existingData.length === 0) return null; // Handle empty data

    return existingData.reduce(
      (minDate, entry) =>
        new Date(entry.date) < new Date(minDate) ? entry.date : minDate,
      existingData[0].date
    );
  };

  //Get maximum date of data
  const getMaxDate = (existingData) => {
    if (!existingData || existingData.length === 0) return null; // Handle empty data

    return existingData.reduce(
      (maxDate, entry) =>
        new Date(entry.date) > new Date(maxDate) ? entry.date : maxDate,
      existingData[0].date
    );
  };

  //combine both existing and forecast data into one object in the format
  // { date: "???", "existing data": ??? , "forecasted data": ??? },
  const combineData = (forecast) => {
    const {
      "existing data": existingData = [],
      "forecasted data": forecastedData = [],
    } = forecast;

    // Create a map to store combined data by date
    const combinedMap = new Map();

    // Add existing data to the map
    existingData.forEach(({ date, value }) => {
      if (!combinedMap.has(date)) {
        combinedMap.set(date, { date });
      }
      combinedMap.get(date)["historical"] = value;
    });

    // Add forecasted data to the map
    forecastedData.forEach(({ date, value }) => {
      if (!combinedMap.has(date)) {
        combinedMap.set(date, { date });
      }
      combinedMap.get(date)["forecasted"] = value;
    });

    // Convert the map values to an array and sort by date
    return Array.from(combinedMap.values()).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  };

  const chartData = combineData(props.data);
  const maxExistingDate = getMaxDate(props.data["existing data"]);

  //Format minDate and maxDate to MMM YYYY
  const minDate = new Date(getMinDate(chartData)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const maxDate = new Date(getMaxDate(chartData)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  //timeRange state for filtering existing data by last x days
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date(maxExistingDate);
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <section className="py-32 ">
      <div className="mx-auto max-w-4xl items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>Stock Price Historical Data & Forecast</CardTitle>
              <CardDescription>
                Showing stock prices for {props.name}, {minDate} - {maxDate}
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto bg-white"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white">
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient
                    id="fillHistorical"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-historical)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-historical)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient
                    id="fillForecasted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-forecasted)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-forecasted)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                  wrapperStyle={{
                    backgroundColor: "white",
                    borderStyle: "ridge",
                    borderRadius: 10,
                  }}
                />
                <Area
                  dataKey="historical"
                  type="natural"
                  fill="url(#fillHistorical)"
                  stroke="var(--color-historical)"
                  stackId="a"
                />
                <Area
                  dataKey="forecasted"
                  type="natural"
                  fill="url(#fillForecasted)"
                  stroke="var(--color-forecasted)"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
