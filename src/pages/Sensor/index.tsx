
import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./sensor.css";

type Controlador = {
  id_controlador: number;
  nome: string;
};

export function Sensor() {
  const navigate = useNavigate();

  const [tipoSensor, setTipoSensor] = useState("Umidade");
  const [tipoMedida, setTipoMedida] = useState("Porcentagem");

  const [controladores, setControladores] = useState<Controlador[]>([]);
  const [selecionados, setSelecionados] = useState<Record<number, boolean>>({});

  // 🔥 BUSCAR CONTROLADORES
  useEffect(() => {
    const fetchControladores = async () => {
      try {
        const response = await api.get("/api/v1/controladores/");
        console.log("📡 Controladores:", response.data);

        setControladores(response.data);

        // inicializa todos como false
        const initialState: Record<number, boolean> = {};
        response.data.forEach((c: Controlador) => {
          initialState[c.id_controlador] = false;
        });

        setSelecionados(initialState);

      } catch (error) {
        console.error("❌ Erro ao buscar controladores:", error);
      }
    };

    fetchControladores();
  }, []);

  const handleCheckboxChange = (id: number) => {
    setSelecionados(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const selecionado = Object.entries(selecionados)
      .find(([_, v]) => v);

    if (!selecionado) {
      alert("Selecione um controlador");
      return;
    }

    const id_controlador = Number(selecionado[0]);

    try {
      const payload = {
        tipo_sensor: tipoSensor,
        unidade_medida: tipoMedida,
        id_controlador
      };

      console.log("📡 Enviando:", payload);

      const response = await api.post("/api/v1/sensores/", payload);

      console.log("✅ Sensor criado:", response.data);

      alert("Sensor criado com sucesso!");

      navigate("/gerenciar"); // 🔥 volta pra tela de dispositivos

    } catch (error: any) {
      console.error("❌ Erro:", error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Erro ao conectar com o servidor");
      }
    }
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Adicionar Sensor</h2>

        <div className="input-group">
          <label>Tipo de Sensor</label>
          <select
            value={tipoSensor}
            onChange={(e) => setTipoSensor(e.target.value)}
          >
            <option>Umidade</option>
            <option>Temperatura</option>
          </select>
        </div>

        <div className="input-group">
          <label>Tipo de Medida</label>
          <select
            value={tipoMedida}
            onChange={(e) => setTipoMedida(e.target.value)}
          >
            <option>Porcentagem</option>
            <option>Celsius</option>
          </select>
        </div>

        <div className="section">
          <span className="section-title">Controladores</span>

          <div className="checkbox-grid">
            {controladores.map((ctrl) => (
              <label key={ctrl.id_controlador} className="checkbox-card">
                <input
                  type="checkbox"
                  checked={selecionados[ctrl.id_controlador] || false}
                  onChange={() => handleCheckboxChange(ctrl.id_controlador)}
                />
                {ctrl.nome}
              </label>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">
            Adicionar
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

