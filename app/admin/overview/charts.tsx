"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Charts = ({
  data: { salesData },
}: {
  data: { salesData: { month: string; totalSales: number }[] };
}) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={salesData}>
        <XAxis
          dataKey="month"
          //   stroke="#88888"
          //   fontSize={12}
          //   tickLine={false}
          //   axisLine={false}
        />
        <YAxis tickFormatter={(value) => `$${value}`} />
        <Bar
          dataKey="totalSales"
          fill="#8884d8"
          // className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
