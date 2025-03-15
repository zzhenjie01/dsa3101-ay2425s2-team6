"use client";

import { Pie, PieChart } from "recharts";

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

const chartConfig = {
  scope: {
    label: "Scope",
  },
  scope1: {
    label: "Scope 1",
    color: "#2563eb",
  },
  scope2: {
    label: "Scope 2",
    color: "#60a5fa",
  },
  scope3: {
    label: "Scope 3",
    color: "hsl(240, 100%, 50%)",
  },
};

export function ScopeGHG(props) {
  //Format scope GHG data to
  // {
  //   scope: 1/2/3.
  //   emissions: ???,
  //   fill: ???
  // }
  const convertGHGData = (data) => {
    return Object.keys(data).map((key) => ({
      scope: key,
      emissions: data[key],
      fill: `var(--color-${key})`,
    }));
  };

  const chartData = convertGHGData(props.data);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>GHG Emissions by Scope</CardTitle>
        <CardDescription>{props.year}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              wrapperStyle={{
                backgroundColor: "white",
                borderStyle: "ridge",
                borderRadius: 10,
              }}
            />
            <Pie data={chartData} dataKey="emissions" nameKey="scope" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing GHG emissions by scope in {props.year}
        </div>
      </CardFooter>
    </Card>
  );
}
