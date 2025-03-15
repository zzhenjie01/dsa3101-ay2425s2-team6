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
  ChartLegend,
  ChartLegendContent,
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

export function GenderRatio(props) {
  //chartData is an array containing {year: ???, male: ???, female:???}, all values are integers
  const chartData = props.data;

  const chartConfig = {
    male: {
      label: "Male",
      color: "#2563eb",
    },
    female: {
      label: "Female",
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

  const ratio = +(props.lastyeardata.avg - props.lastyeardata.company).toFixed(
    2
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Gender Ratio of Employees</CardTitle>
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
              content={<ChartTooltipContent hideLabel />}
              wrapperStyle={{
                backgroundColor: "white",
                borderStyle: "ridge",
                borderRadius: 10,
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="male"
              stackId="a"
              fill="var(--color-male)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="female"
              stackId="a"
              fill="var(--color-female)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {props.name !== "Industry Average" && (
          <div className="flex gap-2 font-medium leading-none">
            {Math.abs(ratio)}% {ratio >= 0 ? "better" : "worse"} than the
            industry average{" "}
            {ratio >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing gender ratio of employees for the last {maxYear - minYear + 1}{" "}
          years
        </div>
      </CardFooter>
    </Card>
  );
}
