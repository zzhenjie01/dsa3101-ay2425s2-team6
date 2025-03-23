"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
import { getLastYear, getLastYearData } from "./helpers/getLastYear";

export function Corruption(props) {
  //chartData is an array containing {year: ???, cases: ???}, both year and cases are integers
  const chartData = props.data;

  //Extract min and max year to display
  const { minYear, maxYear } = chartData.reduce(
    (acc, item) => ({
      minYear: Math.min(acc.minYear, item.year),
      maxYear: Math.max(acc.maxYear, item.year),
    }),
    { minYear: Infinity, maxYear: -Infinity }
  );

  const caseDifference = props.lastyeardata.cases - props.lastyeardata.avg;

  const chartConfig = {
    cases: {
      label: "Cases",
      color: "#2563eb",
    },
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Number of Corruption Cases</CardTitle>
        <CardDescription>
          {props.name}, {minYear} - {maxYear}
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
              content={<ChartTooltipContent hideLabel />}
              wrapperStyle={{
                backgroundColor: "white",
                borderStyle: "ridge",
                borderRadius: 10,
              }}
            />
            <Bar dataKey="cases" fill="var(--color-cases)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {props.name !== "Industry Average" && (
          <div className="flex gap-2 font-medium leading-none">
            {Math.abs(caseDifference)} {caseDifference >= 0 ? "more" : "fewer"}{" "}
            cases than the industry average{" "}
            {caseDifference >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing total corruption cases for the last {maxYear - minYear + 1}{" "}
          years
        </div>
      </CardFooter>
    </Card>
  );
}
