"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

export function Turnover(props) {
  const chartData = props.data;
  const chartConfig = {
    company: {
      label: `${props.name}`,
      color: "#2563eb",
    },
    average: {
      label: "Average",
      color: "#60a5fa",
    },
  };

  //Extract min and max year to display
  const { minYear, maxYear } = chartData.reduce(
    (acc, item) => ({
      minYear: Math.min(acc.minYear, item.year),
      maxYear: Math.max(acc.maxYear, item.year),
    }),
    { minYear: Infinity, maxYear: -Infinity }
  );

  const lastYearData = chartData[chartData.length - 1]; // Most recent year
  const secondLastYearData = chartData[chartData.length - 2]; // Second most recent year
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
        <CardTitle>Employee Turnover Rate</CardTitle>
        <CardDescription>
          {props.name}, {minYear} - {maxYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
              wrapperStyle={{
                backgroundColor: "white",
                borderStyle: "ridge",
                borderRadius: 10,
              }}
            />
            <Area
              dataKey="company"
              type="natural"
              fill="var(--color-company)"
              fillOpacity={0.4}
              stroke="var(--color-company)"
              stackId="a"
            />
            {props.name !== "Industry Average" && (
              <Area
                dataKey="average"
                type="natural"
                fill="var(--color-average)"
                fillOpacity={0.4}
                stroke="var(--color-average)"
                stackId="a"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending {percentageDifference >= 0 ? "up" : "down"} by{" "}
              {Math.abs(percentageDifference)}% this year{" "}
              {percentageDifference >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing turnover of employees for the last {maxYear - minYear + 1}{" "}
              years
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
