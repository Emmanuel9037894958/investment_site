"use client";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export const PerformanceChart = ({ data, isLoading }) => (
  <Card className="col-span-full lg:col-span-3 h-[450px]">
    <CardHeader><CardTitle>7-Day Portfolio Performance (USD)</CardTitle></CardHeader>
    <CardContent className="h-full pt-4">
      {isLoading ? (
        <div className="h-full flex items-center justify-center text-teal-600">
          <span className="w-8 h-8 animate-spin mr-3">⏳</span> Loading Chart Data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={data} margin={{ top:5, right:20, left:10, bottom:5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#888888" />
            <YAxis stroke="#888888" tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v)} />
            <Line type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={3} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      )}
    </CardContent>
  </Card>
);
