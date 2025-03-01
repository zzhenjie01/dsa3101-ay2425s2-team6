"use client";

import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

import { WaterDroplet } from "./icons/waterDroplet";

export function Water(props) {
  const chartConfig = {
    water: {
      label: `${props.name}`,
      color: "hsl(240, 100%, 50%)",
    },
    average: {
      label: "Average",
    },
  };

  const chartData = [{ ...props.data, fill: "var(--color-water)" }];

  const getPercWater = (data) => {
    return Math.round((data[0].water / data[0].average) * 100, 1);
  };

  const percWater = getPercWater(chartData);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Water Consumption</CardTitle>
        <CardDescription>
          {chartData[0].company}, {props.year}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={Math.min(100, percWater) * 3.6}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="water" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].water.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          cubic metres
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {chartData[0].company !== "Industry Average" && (
          <div className="flex items-center gap-2 font-medium leading-none">
            {percWater}% of the industry average{" "}
            <WaterDroplet className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Showing water consumption for {props.year}
        </div>
      </CardFooter>
    </Card>
  );
}
