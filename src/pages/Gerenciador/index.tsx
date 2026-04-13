
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./gerenciar.css";

type Controlador = {
  id_controlador: number;
  nome: string;
};

type Sensor = {
  id_sensor: number;
  tipo_sensor: string;
  unidade_medida: string;
  id_controlador: number;
};

export function GerenciarDispositivos() {
  const [controladores, setControladores] = useState<Controlador[]>([]);
  const [sensores, setSensores] = useState<Sensor[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ctrlRes, sensorRes] = await Promise.all([
          api.get("/api/v1/controladores/"),
          api.get("/api/v1/sensores/")
        ]);

        console.log("📡 Controladores:", ctrlRes.data);
        console.log("📡 Sensores:", sensorRes.data);

        setControladores(ctrlRes.data);
        setSensores(sensorRes.data);

      } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="wrapper">

        {/* TOPO */}
        <div className="top-action">
          <button 
            className="btn-primary"
            onClick={() => navigate("/adicionar-controlador")}
          >
            + Adicionar Controlador
          </button>
        </div>

        {/* GRID */}
        <div className="grid">

          {controladores.map((ctrl) => {
            const sensoresDoControlador = sensores.filter(
              (s) => s.id_controlador === ctrl.id_controlador
            );

            return (
              <div key={ctrl.id_controlador} className="card">
                
                <div className="card-header">
                  <span>{ctrl.nome}</span>
                  <span className="status">ONLINE</span>
                </div>

                <p className="location">Meu Sistema</p>

                <div className="sensor-list">
                  {sensoresDoControlador.length > 0 ? (
                    <>
                      <p>
                        {sensoresDoControlador.map(s => `Sensor ${s.id_sensor}`).join(", ")}
                      </p>

                      <p>🌡 {sensoresDoControlador[0].tipo_sensor}</p>
                      <p>📏 {sensoresDoControlador[0].unidade_medida}</p>
                    </>
                  ) : (
                    <p>Nenhum sensor cadastrado</p>
                  )}
                </div>

                <button
                  className="btn-secondary"
                  onClick={() => navigate("/adicionar-sensor")}
                >
                  + Adicionar Sensor
                </button>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

