import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Tooltip, Legend, Filler,
} from "chart.js";
import { Droplets, Zap, Calendar, Filter, X, Clock, RefreshCw } from "lucide-react";
import { api } from "../../services/api";
import "./index.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

type Zona    = { id_zona_sensor: number; nome_zona: string; id_sensor: number };
type Leitura = { id_leitura: number; id_sensor: number; valor: number; data_hora: string };
type Execucao = {
  id_execucao: number; id_zona_sensor: number; id_agendamento: number | null;
  tipo: string; iniciado_em: string; duracao_minutos: number;
  status: string; nome_zona: string | null; nome_agendamento: string | null;
  descricao: string | null;
};
type AgendamentoItem = {
  id_agendamento: number; nome: string; hora_inicio: string;
  duracao_minutos: number; repetir_todos_dias: boolean;
  dias_semana: string | null; id_zona_sensor: number; ativo: boolean;
};
type AgendamentoComStatus = AgendamentoItem & { execucao: Execucao | null };

type Preset = "hoje" | "7d" | "14d" | "30d" | "custom";

function buildRangeParams(preset: Preset, customInicio: string, customFim: string): string {
  if (preset === "custom") {
    return `data_inicio=${encodeURIComponent(customInicio + ":00")}&data_fim=${encodeURIComponent(customFim + ":00")}`;
  }
  const inicio = new Date();
  if (preset === "hoje")       inicio.setHours(0, 0, 0, 0);
  else if (preset === "7d")    inicio.setDate(inicio.getDate() - 7);
  else if (preset === "14d")   inicio.setDate(inicio.getDate() - 14);
  else if (preset === "30d")   inicio.setDate(inicio.getDate() - 30);
  return `data_inicio=${encodeURIComponent(inicio.toISOString())}&data_fim=${encodeURIComponent(new Date().toISOString())}`;
}

function toLocalISO(d: Date) { return d.toISOString().slice(0, 16); }

function utcToLocal(iso: string): Date {
  return new Date(iso.endsWith("Z") || iso.includes("+") ? iso : iso + "Z");
}

function fmtDt(iso: string) {
  return utcToLocal(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtDia(iso: string) {
  return utcToLocal(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function fmtHora(t: string) { return t.slice(0, 5); }

const STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente", em_andamento: "Em andamento", concluido: "Concluído",
  interrompido: "Interrompido", erro: "Erro",
};

export function Monitoramento() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [zonaId, setZonaId] = useState<number | null>(null);
  const [sensorId, setSensorId] = useState<number | null>(null);

  const [preset, setPreset] = useState<Preset>("7d");
  const [customInicio, setCustomInicio] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return toLocalISO(d);
  });
  const [customFim, setCustomFim] = useState(() => toLocalISO(new Date()));

  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [leituraAtual, setLeituraAtual] = useState<Leitura | null>(null);
  const [execucoes, setExecucoes] = useState<Execucao[]>([]);
  const [agendamentos, setAgendamentos] = useState<AgendamentoItem[]>([]);
  const [execucoesHoje, setExecucoesHoje] = useState<Execucao[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "manual" | "agendado">("todos");
  const [bombLigada, setBombLigada] = useState(false);
  const [duracaoManual, setDuracaoManual] = useState(5);
  const [carregando, setCarregando] = useState(false);
  const [sidebar, setSidebar] = useState<AgendamentoComStatus | null>(null);

  // ── FETCH ────────────────────────────────────────────────────────────
  const carregarLeituras = useCallback(async () => {
    if (!sensorId) return;
    const params = buildRangeParams(preset, customInicio, customFim);
    const [histRes, latestRes] = await Promise.allSettled([
      api.get(`/api/v1/leitura/sensor/${sensorId}?${params}`),
      api.get(`/api/v1/leitura/sensor/${sensorId}/latest`),
    ]);
    if (histRes.status === "fulfilled") setLeituras(histRes.value.data);
    else setLeituras([]);
    if (latestRes.status === "fulfilled") setLeituraAtual(latestRes.value.data);
  }, [sensorId, preset, customInicio, customFim]);

  const carregarExecucoes = useCallback(async () => {
    if (!zonaId) return;
    const params = buildRangeParams(preset, customInicio, customFim);
    try {
      const res = await api.get(`/api/v1/execucoes/?id_zona_sensor=${zonaId}&${params}`);
      setExecucoes(res.data);
    } catch { setExecucoes([]); }
  }, [zonaId, preset, customInicio, customFim]);

  const carregarExecucoesHoje = useCallback(async () => {
    const inicio = new Date(); inicio.setHours(0, 0, 0, 0);
    const params = `data_inicio=${encodeURIComponent(inicio.toISOString())}&data_fim=${encodeURIComponent(new Date().toISOString())}`;
    try {
      const res = await api.get(`/api/v1/execucoes/?${params}`);
      setExecucoesHoje(res.data);
    } catch { setExecucoesHoje([]); }
  }, []);

  const carregarAgendamentos = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/agendamento/");
      setAgendamentos(res.data.filter((a: AgendamentoItem) => a.ativo));
    } catch { setAgendamentos([]); }
  }, []);

  // ── EFFECTS ──────────────────────────────────────────────────────────
  useEffect(() => {
    api.get("/api/v1/zonas/").then((res) => {
      setZonas(res.data);
      if (res.data.length > 0) {
        setZonaId(res.data[0].id_zona_sensor);
        setSensorId(res.data[0].id_sensor);
      }
    });
    carregarAgendamentos();
    carregarExecucoesHoje();
  }, [carregarAgendamentos, carregarExecucoesHoje]);

  useEffect(() => {
    const zona = zonas.find((z) => z.id_zona_sensor === zonaId);
    if (zona) setSensorId(zona.id_sensor);
  }, [zonaId, zonas]);

  useEffect(() => { carregarLeituras(); }, [carregarLeituras]);
  useEffect(() => { carregarExecucoes(); }, [carregarExecucoes]);

  // Polling do status da bomba — 30s fixo
  const prevBombRef = useRef(false);
  useEffect(() => {
    const tick = async () => {
      try {
        const r = await api.get("/api/v1/bomba/status");
        const ligada: boolean = r.data.ligada;
        if (prevBombRef.current && !ligada) {
          await carregarExecucoes();
          await carregarExecucoesHoje();
        }
        prevBombRef.current = ligada;
        setBombLigada(ligada);
      } catch { /* ignora */ }
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [carregarExecucoes, carregarExecucoesHoje]);

  // Auto-refresh: rápido quando bomba ativa, lento quando idle
  useEffect(() => {
    const intervalo = bombLigada ? 10_000 : 30_000;
    const id = setInterval(() => {
      carregarExecucoes();
      carregarExecucoesHoje();
    }, intervalo);
    return () => clearInterval(id);
  }, [bombLigada, carregarExecucoes, carregarExecucoesHoje]);

  // Gráfico de umidade: atualiza a cada 10 minutos (ESP32 envia a cada 10 min)
  useEffect(() => {
    const id = setInterval(() => { carregarLeituras(); }, 10 * 60_000);
    return () => clearInterval(id);
  }, [carregarLeituras]);

  // ── AÇÕES ────────────────────────────────────────────────────────────
  const ligarBomba = async () => {
    if (!zonaId) return;
    setCarregando(true);
    try {
      await api.post("/api/v1/bomba/ligar", { id_zona_sensor: zonaId, duracao_minutos: duracaoManual });
      setBombLigada(true);
      await carregarExecucoes();
      await carregarExecucoesHoje();
    } catch { } finally { setCarregando(false); }
  };

  const desligarBomba = async () => {
    setCarregando(true);
    try {
      await api.post("/api/v1/bomba/desligar");
      setBombLigada(false);
      await carregarExecucoes();
      await carregarExecucoesHoje();
    } catch { } finally { setCarregando(false); }
  };

  // ── COMPUTED ─────────────────────────────────────────────────────────
  const agendamentosComStatus = useMemo<AgendamentoComStatus[]>(() => {
    return agendamentos.map((ag) => {
      // Procura a execução mais recente de hoje para este agendamento
      const execHoje = execucoesHoje
        .filter((e) => e.id_agendamento === ag.id_agendamento)
        .sort((a, b) => b.id_execucao - a.id_execucao)[0] ?? null;
      return { ...ag, execucao: execHoje };
    });
  }, [agendamentos, execucoesHoje]);

  const { chartLabels, chartUmidade } = useMemo(() => {
    const byDay: Record<string, number[]> = {};
    leituras.forEach((l) => {
      const key = fmtDia(l.data_hora);
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(l.valor);
    });
    const labels = Object.keys(byDay);
    const media = labels.map((k) => {
      const v = byDay[k];
      return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10;
    });
    return { chartLabels: labels, chartUmidade: media };
  }, [leituras]);

  const { irrLabels, irrMinutos } = useMemo(() => {
    const byDay: Record<string, number> = {};
    execucoes.forEach((e) => {
      const key = fmtDia(e.iniciado_em);
      byDay[key] = (byDay[key] ?? 0) + e.duracao_minutos;
    });
    return { irrLabels: Object.keys(byDay), irrMinutos: Object.values(byDay) };
  }, [execucoes]);

  const execucoesFiltradas = useMemo(
    () => execucoes.filter((e) => filtroTipo === "todos" || e.tipo === filtroTipo),
    [execucoes, filtroTipo]
  );

  const totalIrr = execucoes.length;
  const totalMin = execucoes.reduce((a, e) => a + e.duracao_minutos, 0);
  const ultimaExec = execucoes[0] ? fmtDt(execucoes[0].iniciado_em) : "—";

  const optsLine = {
    responsive: true,
    plugins: { legend: { labels: { color: "#c8e6e0" } } },
    scales: {
      x: { ticks: { color: "#8ab4ae" }, grid: { color: "rgba(44,194,149,0.08)" } },
      y: { ticks: { color: "#8ab4ae" }, grid: { color: "rgba(44,194,149,0.08)" }, min: 0, max: 100 },
    },
  };

  const optsBar = {
    responsive: true,
    plugins: { legend: { labels: { color: "#c8e6e0" } } },
    scales: {
      x: { ticks: { color: "#8ab4ae" }, grid: { color: "rgba(0,200,255,0.06)" } },
      y: { ticks: { color: "#8ab4ae" }, grid: { color: "rgba(0,200,255,0.06)" }, min: 0 },
    },
  };

  const dataUmidade = {
    labels: chartLabels,
    datasets: [{ label: "Umidade média (%)", data: chartUmidade, borderColor: "#2CC295",
      backgroundColor: "rgba(44,194,149,0.18)", tension: 0.4, fill: true, pointRadius: 4,
      pointBackgroundColor: "#2CC295" }],
  };

  const dataIrrigacao = {
    labels: irrLabels,
    datasets: [{ label: "Minutos irrigados", data: irrMinutos,
      backgroundColor: "rgba(0,200,255,0.5)", borderColor: "#00c8ff",
      borderWidth: 1, borderRadius: 5 }],
  };

  const PRESETS: { key: Preset; label: string }[] = [
    { key: "hoje", label: "Hoje" }, { key: "7d", label: "7 dias" },
    { key: "14d", label: "14 dias" }, { key: "30d", label: "30 dias" },
    { key: "custom", label: "Personalizado" },
  ];

  return (
    <div className="monitor-page">
      <div className="monitor-wrap">

        {/* ── CABEÇALHO ── */}
        <div className="monitor-header">
          <div className="header-left">
            <h2>Monitoramento</h2>
            <select className="zona-select" value={zonaId ?? ""}
              onChange={(e) => setZonaId(Number(e.target.value))}>
              {zonas.map((z) => (
                <option key={z.id_zona_sensor} value={z.id_zona_sensor}>{z.nome_zona}</option>
              ))}
            </select>
          </div>
          <div className="filter-block">
            <div className="dias-tabs">
              {PRESETS.map((p) => (
                <button key={p.key} className={`tab ${preset === p.key ? "tab--on" : ""}`}
                  onClick={() => setPreset(p.key)}>{p.label}</button>
              ))}
            </div>
            {preset === "custom" && (
              <div className="custom-range">
                <Calendar size={14} color="#8ab4ae" />
                <input type="datetime-local" value={customInicio}
                  onChange={(e) => setCustomInicio(e.target.value)} />
                <span>até</span>
                <input type="datetime-local" value={customFim}
                  onChange={(e) => setCustomFim(e.target.value)} />
              </div>
            )}
          </div>
        </div>

        {/* ── CORPO ── */}
        <div className="monitor-body">
          <div className="left-panel">
            <div className="stat-card">
              <div className="stat-icon stat-icon--green"><Droplets size={20} /></div>
              <div>
                <span className="stat-label">Umidade atual</span>
                <span className="stat-value">{leituraAtual ? `${leituraAtual.valor}%` : "—"}</span>
                {leituraAtual && <span className="stat-sub">{fmtDt(leituraAtual.data_hora)}</span>}
              </div>
            </div>
            <div className="stat-card">
              <div className={`stat-icon ${bombLigada ? "stat-icon--yellow" : "stat-icon--gray"}`}>
                <Zap size={20} />
              </div>
              <div>
                <span className="stat-label">Bomba</span>
                <span className={`stat-value ${bombLigada ? "val--on" : "val--neutral"}`}>
                  {bombLigada ? "Ligada" : "Desligada"}
                </span>
              </div>
            </div>
            <div className="ctrl-card">
              <div className="ctrl-title"><Filter size={14} /> Controle Manual</div>
              <div className="duration-row">
                <label>Duração (min)</label>
                <input type="number" min={1} max={60} value={duracaoManual}
                  onChange={(e) => setDuracaoManual(Number(e.target.value))}
                  disabled={bombLigada} />
              </div>
              <div className="ctrl-btns">
                <button className="btn-start" onClick={ligarBomba}
                  disabled={bombLigada || carregando || !zonaId}>Iniciar</button>
                <button className="btn-stop" onClick={desligarBomba}
                  disabled={!bombLigada || carregando}>Parar</button>
              </div>
            </div>
            <div className="stats-grid">
              <div className="mini-stat"><span>{totalIrr}</span><label>Irrigações</label></div>
              <div className="mini-stat"><span>{totalMin}min</span><label>Total</label></div>
              <div className="mini-stat wide">
                <span style={{ fontSize: 13 }}>{ultimaExec}</span>
                <label>Última execução</label>
              </div>
            </div>
          </div>

          <div className="right-panel">
            <div className="chart-box">
              <h3>Umidade do solo — média diária</h3>
              {chartLabels.length > 0
                ? <Line data={dataUmidade} options={optsLine} />
                : <p className="no-data">Sem leituras no período selecionado</p>}
            </div>
            <div className="chart-box">
              <h3>Minutos irrigados por dia</h3>
              {irrLabels.length > 0
                ? <Bar data={dataIrrigacao} options={optsBar} />
                : <p className="no-data">Sem execuções no período selecionado</p>}
            </div>
          </div>
        </div>

        {/* ── AGENDAMENTOS ATIVOS ── */}
        <div className="ag-section">
          <div className="ag-header">
            <h3>Agendamentos Ativos</h3>
            <span className="ag-count">{agendamentosComStatus.length}</span>
          </div>
          {agendamentosComStatus.length === 0 ? (
            <p className="no-data">Nenhum agendamento ativo cadastrado</p>
          ) : (
            <div className="ag-list">
              {agendamentosComStatus.map((item) => {
                const st = item.execucao?.status ?? "pendente";
                return (
                  <div key={item.id_agendamento} className="ag-row" onClick={() => setSidebar(item)}>
                    <div className="ag-info">
                      <span className="ag-nome">{item.nome}</span>
                      <span className="ag-hora"><Clock size={12} /> {fmtHora(item.hora_inicio)}</span>
                      <span className="ag-rep">
                        {item.repetir_todos_dias ? "Todos os dias" : (item.dias_semana ?? "—")}
                      </span>
                    </div>
                    <span className={`badge badge--${st}`}>{STATUS_LABEL[st] ?? st}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── HISTÓRICO ── */}
        <div className="exec-section">
          <div className="exec-header">
            <h3>Histórico de execuções</h3>
            <div className="filter-tabs">
              {(["todos", "manual", "agendado"] as const).map((t) => (
                <button key={t} className={`tab ${filtroTipo === t ? "tab--on" : ""}`}
                  onClick={() => setFiltroTipo(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="exec-table-wrap">
            <table className="exec-table">
              <thead>
                <tr>
                  <th>Data / Hora</th><th>Tipo</th><th>Duração</th>
                  <th>Status</th><th>Agendamento</th>
                </tr>
              </thead>
              <tbody>
                {execucoesFiltradas.length === 0 && (
                  <tr><td colSpan={5} className="no-data">Nenhuma execução no período</td></tr>
                )}
                {execucoesFiltradas.map((e) => (
                  <tr key={e.id_execucao}>
                    <td>{fmtDt(e.iniciado_em)}</td>
                    <td><span className={`badge badge--${e.tipo}`}>{e.tipo}</span></td>
                    <td>{e.duracao_minutos} min</td>
                    <td><span className={`badge badge--${e.status}`}>{STATUS_LABEL[e.status] ?? e.status}</span></td>
                    <td>{e.nome_agendamento ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      {sidebar && (
        <>
          <div className="sidebar-backdrop" onClick={() => setSidebar(null)} />
          <aside className="log-sidebar">
            <div className="sidebar-head">
              <h3>{sidebar.nome}</h3>
              <button className="sidebar-close" onClick={() => setSidebar(null)}>
                <X size={18} />
              </button>
            </div>

            <span className={`badge badge--${sidebar.execucao?.status ?? "pendente"} sidebar-badge`}>
              {STATUS_LABEL[sidebar.execucao?.status ?? "pendente"]}
            </span>

            <div className="sidebar-block">
              <p className="sidebar-block-title">Configuração</p>
              <div className="sidebar-rows">
                <span>Horário</span><span>{fmtHora(sidebar.hora_inicio)}</span>
                <span>Duração</span><span>{sidebar.duracao_minutos} min</span>
                <span>Repetição</span>
                <span>{sidebar.repetir_todos_dias ? "Todos os dias" : (sidebar.dias_semana ?? "—")}</span>
              </div>
            </div>

            {sidebar.execucao ? (
              <div className="sidebar-block">
                <p className="sidebar-block-title">Execução de hoje</p>
                <div className="sidebar-rows">
                  <span>Iniciado</span><span>{fmtDt(sidebar.execucao.iniciado_em)}</span>
                  <span>Duração</span><span>{sidebar.execucao.duracao_minutos} min</span>
                  <span>Status</span>
                  <span className={`badge badge--${sidebar.execucao.status}`}>
                    {STATUS_LABEL[sidebar.execucao.status] ?? sidebar.execucao.status}
                  </span>
                </div>
                {sidebar.execucao.descricao && (
                  <div className="sidebar-log">
                    <p className="sidebar-block-title"><RefreshCw size={12} /> Log</p>
                    <pre>{sidebar.execucao.descricao}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="sidebar-block sidebar-pending">
                <Clock size={20} color="#8ab4ae" />
                <p>Aguardando execução agendada</p>
                <span>O scheduler verifica a cada 60 segundos</span>
              </div>
            )}
          </aside>
        </>
      )}
    </div>
  );
}
