import { useEffect, useState } from "react";
import { api } from "../../services/api";
import "./index.css";

type Agendamento = {
  id_agendamento: number;
  nome: string;
  horario: string;
  duracao: number;
  ativo: boolean;
  dispositivo?: string;
};

export function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await api.get("/api/v1/agendamento/");
        console.log("📡 Agendamentos:", response.data);
        setAgendamentos(response.data);
      } catch (error) {
        console.error("❌ Erro ao buscar agendamentos:", error);
      }
    };

    fetchAgendamentos();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <div className="cards-container">
          <div className="cards-grid">

            {agendamentos.map((ag) => (
              <div
                key={ag.id_agendamento}
                className={`card ${ag.ativo ? "active" : ""}`}
              >
                
                <div className="card-header">
                  <h3>{ag.nome}</h3>
                  <span className={`status ${ag.ativo ? "on" : "off"}`}>
                    {ag.ativo ? "Ativa" : "Inativa"}
                  </span>
                </div>

                <p className="time">
                  {ag.horario} por {ag.duracao} min
                </p>

                <span className="device">
                  {ag.dispositivo || "Sem dispositivo"}
                </span>

                <div className="card-actions">
                  <button className="btn-edit">Editar</button>

                  {ag.ativo ? (
                    <button className="btn-danger">Pausar</button>
                  ) : (
                    <button className="btn-primary">Ativar</button>
                  )}
                </div>
              </div>
            ))}

          </div>

          <div className="bottom-action">
            <button className="btn-new">+ Nova Regra</button>
          </div>

        </div>
      </div>
    </div>
  );
}

