import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./form.css";

type Zona = {
  id_zona_sensor: number;
  nome_zona: string;
};

const DIAS = [
  { key: "dom", label: "DOM" },
  { key: "seg", label: "SEG" },
  { key: "ter", label: "TER" },
  { key: "qua", label: "QUA" },
  { key: "qui", label: "QUI" },
  { key: "sex", label: "SEX" },
  { key: "sab", label: "SAB" },
];

export function NovoAgendamento() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState(10);
  const [idZonaSensor, setIdZonaSensor] = useState<number | "">("");
  const [repetirTodosDias, setRepetirTodosDias] = useState(false);
  const [diasSelecionados, setDiasSelecionados] = useState<Record<string, boolean>>({
    dom: false,
    seg: true,
    ter: true,
    qua: true,
    qui: true,
    sex: true,
    sab: false,
  });
  const [ativo, setAtivo] = useState(true);
  const [zonas, setZonas] = useState<Zona[]>([]);

  useEffect(() => {
    api.get("/api/v1/zonas/").then((res) => setZonas(res.data));
  }, []);

  const toggleDia = (dia: string) => {
    setDiasSelecionados((prev) => ({ ...prev, [dia]: !prev[dia] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idZonaSensor) {
      alert("Selecione uma zona");
      return;
    }

    const diasCsv = repetirTodosDias
      ? null
      : Object.entries(diasSelecionados)
          .filter(([, v]) => v)
          .map(([k]) => k)
          .join(",") || null;

    const payload = {
      nome,
      hora_inicio: horaInicio,
      duracao_minutos: duracaoMinutos,
      id_zona_sensor: idZonaSensor,
      repetir_todos_dias: repetirTodosDias,
      dias_semana: diasCsv,
      ativo,
    };

    try {
      await api.post("/api/v1/agendamento/", payload);
      navigate("/agendamentos");
    } catch (error: any) {
      const detalhe = error?.response?.data?.detail;
      alert(detalhe ?? "Erro ao criar agendamento");
    }
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Novo Agendamento</h2>

        <div className="input-group">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Zona de Irrigação</label>
          <select
            value={idZonaSensor}
            onChange={(e) => setIdZonaSensor(Number(e.target.value))}
            required
          >
            <option value="">Selecione uma zona</option>
            {zonas.map((z) => (
              <option key={z.id_zona_sensor} value={z.id_zona_sensor}>
                {z.nome_zona}
              </option>
            ))}
          </select>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>Hora de início</label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Duração (min)</label>
            <input
              type="number"
              min={1}
              value={duracaoMinutos}
              onChange={(e) => setDuracaoMinutos(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div className="toggle-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={repetirTodosDias}
              onChange={(e) => setRepetirTodosDias(e.target.checked)}
            />
            <span>Repetir todos os dias</span>
          </label>
        </div>

        {!repetirTodosDias && (
          <div className="section">
            <span className="section-title">Dias da semana</span>
            <div className="checkbox-grid">
              {DIAS.map(({ key, label }) => (
                <label
                  key={key}
                  className={`day-chip ${diasSelecionados[key] ? "day-chip--on" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={diasSelecionados[key]}
                    onChange={() => toggleDia(key)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="toggle-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
            <span>Ativar imediatamente</span>
          </label>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-submit">Criar</button>
          <button type="button" className="btn-cancel" onClick={() => navigate("/agendamentos")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
