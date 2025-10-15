"use client";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

export const StatCard = ({ title, value, icon: Icon, change }) => {
  const formattedValue = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(value);
  const changeAmt = (change||0);
  const formattedChange = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(Math.abs(changeAmt));
  const changeColor = changeAmt>=0?'text-green-600':'text-red-600';
  const arrow = changeAmt>=0?'▲':'▼';
  
  return (
    <Card className="hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
      <div className="flex justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon className="h-6 w-6 text-teal-500" />
      </div>
      <CardContent>
        <div className="text-3xl font-extrabold text-gray-900">{formattedValue}</div>
        {change!==undefined && <p className={`text-sm ${changeColor} mt-1 font-medium`}>{arrow} {formattedChange} Today</p>}
      </CardContent>
    </Card>
  );
};
