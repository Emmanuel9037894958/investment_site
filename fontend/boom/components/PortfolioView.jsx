import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler } from "chart.js";
import { useClient } from "@/app/context/ClientContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function PortfolioView() {
  const { client } = useClient();
  const labels = client?.history?.map(h=>h.date) || ["Jan","Feb","Mar","Apr","May","Jun"];
  const dataPoints = client?.history?.map(h=>h.value) || [100,120,140,130,160,180];

  const data = { labels, datasets:[{ label:"Portfolio value", data:dataPoints, fill:true, backgroundColor: ctx => {const g=ctx.chart.ctx.createLinearGradient(0,0,0,300); g.addColorStop(0,"rgba(79,70,229,0.18)"); g.addColorStop(1,"rgba(79,70,229,0)"); return g;}, borderColor:"#4f46e5", tension:0.4, pointRadius:0 }]};

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="h-48">
        <Line data={data} options={{ responsive:true, plugins:{legend:{display:false}} }} />
      </div>
    </div>
  );
}
