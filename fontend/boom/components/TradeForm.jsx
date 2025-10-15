"use client";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

export const TradeForm = ({ tradeSymbol, setTradeSymbol, tradeQty, setTradeQty, tradeType, setTradeType, handlePlaceOrder }) => (
  <Card className="max-w-lg">
    <CardHeader><CardTitle className="text-teal-900">Trade Execution Form</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">Stock Symbol</label>
        <input 
          type="text" 
          value={tradeSymbol} 
          onChange={e=>setTradeSymbol(e.target.value.toUpperCase())}
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">Quantity</label>
        <input 
          type="number" 
          value={tradeQty} 
          onChange={e=>setTradeQty(Number(e.target.value))}
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">Order Type</label>
        <select 
          value={tradeType} 
          onChange={e=>setTradeType(e.target.value)}
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <button 
        onClick={handlePlaceOrder}
        className="w-full bg-teal-600 text-white font-bold p-3 rounded-lg hover:bg-teal-700 transition-colors"
      >
        Execute Order
      </button>
    </CardContent>
  </Card>
);
