import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./zona.css";

type Controlador = { id_controlador: number; nome: string };
type Sensor = { id_sensor: number; tipo_sensor: string; unidade_medida: string };

export const AdicionarZona = () => {
  const navigate = useNavigate();
  const [zonaNome, setZonaNome] = useState("");
  const [controladores, setControladores] = useState<Controlador[]>([]);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [controladorId, setControladorId] = useState<number | "">("");
  const [sensorId, setSensorId] = useState<number | "">("");

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/controladores/"),
      api.get("/api/v1/sensores/"),
    ]).then(([ctrlRes, sensorRes]) => {
      setControladores(ctrlRes.data);
      setSensores(sensorRes.data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!zonaNome || !controladorId || !sensorId) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await api.post("/api/v1/zonas/", {
        nome_zona: zonaNome,
        id_controlador: controladorId,
        id_sensor: sensorId,
      });
      alert("Zona criada com sucesso!");
      navigate("/gerenciar");
    } catch (error: any) {
      alert(error?.response?.data?.detail ?? "Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Adicionar Zona</h2>

        <div className="input-group">
          <label>Nome da Zona</label>
          <input
            type="text"
            value={zonaNome}
            onChange={(e) => setZonaNome(e.target.value)}
            placeholder="Ex: Área externa"
            required
          />
        </div>

        <div className="input-group">
          <label>Controlador</label>
          <select
            value={controladorId}
            onChange={(e) => setControladorId(Number(e.target.value))}
            required
          >
            <option value="">Selecione um controlador</option>
            {controladores.map((c) => (
              <option key={c.id_controlador} value={c.id_controlador}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Sensor</label>
          <select
            value={sensorId}
            onChange={(e) => setSensorId(Number(e.target.value))}
            required
          >
            <option value="">Selecione um sensor</option>
            {sensores.map((s) => (
              <option key={s.id_sensor} value={s.id_sensor}>
                Sensor {s.id_sensor} — {s.tipo_sensor} ({s.unidade_medida})
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">Adicionar</button>
          <button type="button" className="btn-secondary" onClick={() => navigate("/gerenciar")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
