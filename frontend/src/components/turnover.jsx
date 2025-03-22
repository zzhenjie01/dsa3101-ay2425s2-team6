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

export function Turnover(props) {
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

  //chartData is an array containing the company's and average turnover rate per year, in the format
  // {year:???, company:???, average:???}
  const chartData = props.data;

  //Extract min and max year to display
  const { minYear, maxYear } = chartData.reduce(
    (acc, item) => ({
      minYear: Math.min(acc.minYear, item.year),
      maxYear: Math.max(acc.maxYear, item.year),
    }),
    { minYear: Infinity, maxYear: -Infinity }
  );

  // Extract last 2 years' data to compare percentage difference
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
