"use client"

import * as React from "react"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Card, Chart, type ChartConfig, ChartTooltip, ChartTooltipContent, Toggle } from "ui"

const generateChartData = (startDate: string, endDate: string) => {
  const result = []
  const currentDate = new Date(startDate)

  while (currentDate <= new Date(endDate)) {
    const date = currentDate.toISOString().split("T")[0]
    result.push({
      date,
      revenue: Math.floor(Math.random() * 5000), // Random revenue value
      expenses: Math.floor(Math.random() * 3000) // Random expenses value
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return result
}

const chartData = generateChartData("2024-04-01", "2024-06-30")

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)"
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig

export default function LineChartControlledDemo() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("revenue")

  return (
    <Card>
      <Card.Header className="flex justify-between items-center flex-row">
        <div className="space-y-1">
          <Card.Title>Revenue vs Expenses</Card.Title>
          <Card.Description>Tracking daily revenue and expenses over the last 3 months</Card.Description>
        </div>
        <div className="flex gap-x-1">
          {["revenue", "expenses"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <Toggle key={chart} isSelected={activeChart === chart} onPress={() => setActiveChart(chart)}>
                {chartConfig[chart].label}
              </Toggle>
            )
          })}
        </div>
      </Card.Header>
      <Card.Content className="px-2 sm:p-6">
        <Chart config={chartConfig} className="aspect-auto h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </Chart>
      </Card.Content>
    </Card>
  )
}
