import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import "./index.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export function Monitoramento() {

  // 🔥 DADOS FAKES (já prontos pro backend depois)
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  const umidadeData = [45, 38, 50, 42, 60, 55, 48];

  const irrigacaoData = [0, 1, 0, 1, 0, 0, 1]; 
  // 1 = irrigou | 0 = não irrigou

  // 📊 GRÁFICO 1 (UMIDADE)
  const dataUmidade = {
    labels: dias,
    datasets: [
      {
        label: "Umidade (%)",
        data: umidadeData,
        borderColor: "#2ecc71",
        backgroundColor: "rgba(46,204,113,0.2)",
        tension: 0.4,
      },
    ],
  };

  // 📊 GRÁFICO 2 (IRRIGAÇÃO)
  const dataIrrigacao = {
    labels: dias,
    datasets: [
      {
        label: "Irrigação",
        data: irrigacaoData,
        borderColor: "#00e5ff",
        backgroundColor: "rgba(0,229,255,0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#ccc" },
      },
      y: {
        ticks: { color: "#ccc" },
      },
    },
  };

  return (
    <div className="monitor-page">

      <div className="monitor-container">

       <div className="left-panel">
  <div className="left-card">

    <h2>Monitoramento em Tempo Real</h2>

    <div className="card-info">
      <span>Jardim Frontal</span>
      <span className="online">ONLINE</span>
    </div>

    <div className="info-box">
      🌱 Umidade do solo
      <span>45%</span>
    </div>

    <div className="info-box">
      💧 Status da irrigação
      <span>Desligada</span>
    </div>

    <div className="actions">
     
      <button className="btn-primary">Iniciar</button>
      <button className="btn-danger">Parar</button>
    </div>

  </div>
</div>

        {/* LADO DIREITO */}
        <div className="right-panel">

          <div className="chart-box">
            <h3>Umidade ao longo dos dias</h3>
            <Line data={dataUmidade} options={options} />
          </div>

          <div className="chart-box">
            <h3>Histórico de Irrigação</h3>
            <Line data={dataIrrigacao} options={options} />
          </div>

        </div>

      </div>
    </div>
  );
}