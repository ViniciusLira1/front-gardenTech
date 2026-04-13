import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./form.css";

export function NovoAgendamento() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [hora, setHora] = useState("");
  const [duracao, setDuracao] = useState(10);

  const [controladores, setControladores] = useState<any[]>([]);
  const [controladorSelecionado, setControladorSelecionado] = useState<number | null>(null);

  const [diasSemana, setDiasSemana] = useState<any>({
    dom: false,
    seg: true,
    ter: true,
    qua: true,
    qui: true,
    sex: true,
    sab: false,
  });

  // 🔥 buscar controladores
  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/api/v1/controladores/");
      setControladores(res.data);
    };
    fetch();
  }, []);

  const toggleDia = (dia: string) => {
    setDiasSemana((prev: any) => ({
      ...prev,
      [dia]: !prev[dia],
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!controladorSelecionado) {
      alert("Selecione um controlador");
      return;
    }

    const diasSelecionados = Object.entries(diasSemana)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    try {
      const payload = {
        nome,
        hora,
        duracao,
        dias: diasSelecionados,
        id_controlador: controladorSelecionado
      };

      console.log("📡 Enviando:", payload);

      const res = await api.post("/api/v1/agendamento/", payload);

      console.log("✅ Criado:", res.data);

      alert("Agendamento criado!");

      navigate("/agendamentos");

    } catch (error: any) {
      console.error(error);
      alert("Erro ao criar agendamento");
    }
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Novo Agendamento</h2>

        <div className="input-group">
          <label>Nome</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Horário</label>
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Duração (min)</label>
          <input
            type="number"
            value={duracao}
            onChange={(e) => setDuracao(Number(e.target.value))}
          />
        </div>

        <div className="section">
          <span className="section-title">Dias da Semana</span>
          <div className="checkbox-grid">
            {Object.entries(diasSemana).map(([dia, ativo]) => (
              <label key={dia} className="checkbox-card">
                <input
                  type="checkbox"
                  checked={ativo as boolean}
                  onChange={() => toggleDia(dia)}
                />
                {dia.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Controlador</label>
          <select
            onChange={(e) => setControladorSelecionado(Number(e.target.value))}
          >
            <option value="">Selecione</option>
            {controladores.map((c) => (
              <option key={c.id_controlador} value={c.id_controlador}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button className="btn-primary">Criar</button>
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
