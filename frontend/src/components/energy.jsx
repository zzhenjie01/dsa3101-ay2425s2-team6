"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Lightning } from "./icons/lightning";

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

export function Energy(props) {
  // chartData is an array with each row containing {year:???, company:???, average:???}
  const chartData = props.data.sort((a, b) => a.year - b.year);

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

  // Extract min and max year of data to display
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Energy Consumption</CardTitle>
        <CardDescription>
          {minYear} - {maxYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
              wrapperStyle={{
                backgroundColor: "white",
                borderStyle: "ridge",
                borderRadius: 10,
              }}
            />
            {props.name !== "Industry Average" && (
              <Bar dataKey="company" fill="var(--color-company)" radius={4} />
            )}
            <Bar dataKey="average" fill="var(--color-average)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {percentageDifference >= 0 ? "Increase" : "Decrease"} of{" "}
              {Math.abs(percentageDifference)}% this year{" "}
              <Lightning className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total energy (in MWh) for the last {maxYear - minYear + 1}{" "}
              years
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
