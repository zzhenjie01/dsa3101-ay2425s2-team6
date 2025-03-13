"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

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

export function BoardGender(props) {
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

  //Add fill key and value for styling
  const chartData = props.data.data.map((item) => ({
    ...item,
    fill: `var(--color-${item.gender})`, // Assign pie chart colors depending on male or female
  }));

  //Calculate absolute difference between company ratio and average ratio to 1dp
  const ratio = +(props.data.company_ratio - props.data.average_ratio).toFixed(
    2
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Board Diversity Ratio</CardTitle>
        <CardDescription>{props.data.year}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              wrapperStyle={{
                backgroundColor: "white",
                borderStyle: "ridge",
                borderRadius: 10,
              }}
            />
            <Pie data={chartData} dataKey="number" nameKey="gender"></Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {props.data.company !== "Industry Average" && (
          <div className="flex items-center gap-2 font-medium leading-none">
            {Math.abs(ratio) * 100}% {ratio >= 0 ? "better" : "worse"} than the
            industry average{" "}
            {ratio >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing board gender ratio in {props.data.year}
        </div>
      </CardFooter>
    </Card>
  );
}
