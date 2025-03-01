"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function LineChartMultiple(props) {
  // const chartData = [
  //   { month: "January", desktop: 186, mobile: 80 },
  //   { month: "February", desktop: 305, mobile: 200 },
  //   { month: "March", desktop: 237, mobile: 120 },
  //   { month: "April", desktop: 73, mobile: 190 },
  //   { month: "May", desktop: 209, mobile: 130 },
  //   { month: "June", desktop: 214, mobile: 140 },
  // ];

  const chartConfig = {
    company: {
      label: props.name === "Industry Average" ? "Average" : props.name,
      color: "#2563eb",
    },
    average: {
      label: "Average",
      color: "#60a5fa",
    },
  };

  // const chartData = props.data;
  // const avgData = props.avg;

  const combinedData = Object.keys(props.data)
    .map((year) => ({
      year: parseInt(year),
      company: props.data[year],
      average: props.avg[year],
    }))
    .sort((a, b) => a.year - b.year);

  console.log(combinedData);

  const { minYear, maxYear } = combinedData.reduce(
    (acc, item) => ({
      minYear: Math.min(acc.minYear, item.year),
      maxYear: Math.max(acc.maxYear, item.year),
    }),
    { minYear: Infinity, maxYear: -Infinity }
  );
  const lastYearData = combinedData[combinedData.length - 1]; // Most recent year
  const secondLastYearData = combinedData[combinedData.length - 2]; // Second most recent year
  const percentageDifference =
    Math.round(
      ((lastYearData.company - secondLastYearData.company) /
        secondLastYearData.company) *
        100 *
        10
    ) / 10;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>
          {minYear} - {maxYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={combinedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="company"
              type="monotone"
              stroke="var(--color-company)"
              strokeWidth={2}
              dot={false}
            />
            {props.name !== "Industry Average" && (
              <Line
                dataKey="average"
                type="monotone"
                stroke="var(--color-average)"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending {percentageDifference >= 0 ? "up" : "down"} by{" "}
              {Math.abs(percentageDifference)}% this year{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total GHG emissions for the last {maxYear - minYear + 1}{" "}
              years
            </div>
          </div>
        </div>
      </CardFooter>
      {/* <p>{props.name}</p> */}
    </Card>
  );
}
