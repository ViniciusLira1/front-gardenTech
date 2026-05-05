import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { Pencil, Trash2, X, MapPin, Clock } from "lucide-react";
import "./index.css";

type Agendamento = {
  id_agendamento: number;
  nome: string;
  hora_inicio: string;
  duracao_minutos: number;
  dias_semana: string | null;
  repetir_todos_dias: boolean;
  intervalo_dias: number | null;
  ativo: boolean;
  id_zona_sensor: number;
};

type Zona = { id_zona_sensor: number; nome_zona: string };

type EditForm = {
  nome: string;
  hora_inicio: string;
  duracao_minutos: number;
  id_zona_sensor: number | "";
  repetir_todos_dias: boolean;
  dias: Record<string, boolean>;
  ativo: boolean;
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

const DIAS_VAZIO: Record<string, boolean> = {
  dom: false, seg: false, ter: false, qua: false,
  qui: false, sex: false, sab: false,
};

function parseDias(csv: string | null): Record<string, boolean> {
  const result = { ...DIAS_VAZIO };
  if (csv) csv.split(",").forEach((d) => { if (d.trim() in result) result[d.trim()] = true; });
  return result;
}

export function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [editModal, setEditModal] = useState<Agendamento | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [confirmDel, setConfirmDel] = useState<Agendamento | null>(null);
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/agendamento/"),
      api.get("/api/v1/zonas/"),
    ])
      .then(([agRes, zonaRes]) => {
        setAgendamentos(agRes.data);
        setZonas(zonaRes.data);
      })
      .catch((err) => console.error("Erro ao buscar dados:", err));
  }, []);

  const nomeZona = (id: number) =>
    zonas.find((z) => z.id_zona_sensor === id)?.nome_zona ?? `Zona #${id}`;

  const toggleAtivo = async (ag: Agendamento) => {
    try {
      await api.put(`/api/v1/agendamento/${ag.id_agendamento}`, {
        nome: ag.nome,
        hora_inicio: ag.hora_inicio,
        duracao_minutos: ag.duracao_minutos,
        id_zona_sensor: ag.id_zona_sensor,
        repetir_todos_dias: ag.repetir_todos_dias,
        dias_semana: ag.dias_semana,
        ativo: !ag.ativo,
      });
      setAgendamentos((prev) =>
        prev.map((a) =>
          a.id_agendamento === ag.id_agendamento ? { ...a, ativo: !a.ativo } : a
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar agendamento:", err);
    }
  };

  const abrirEdicao = (ag: Agendamento) => {
    setEditModal(ag);
    setEditForm({
      nome: ag.nome,
      hora_inicio: ag.hora_inicio.slice(0, 5),
      duracao_minutos: ag.duracao_minutos,
      id_zona_sensor: ag.id_zona_sensor,
      repetir_todos_dias: ag.repetir_todos_dias,
      dias: parseDias(ag.dias_semana),
      ativo: ag.ativo,
    });
  };

  const salvarEdicao = async () => {
    if (!editModal || !editForm || !editForm.id_zona_sensor) return;
    setSalvando(true);
    try {
      const diasCsv = editForm.repetir_todos_dias
        ? null
        : Object.entries(editForm.dias)
            .filter(([, v]) => v)
            .map(([k]) => k)
            .join(",") || null;

      const payload = {
        nome: editForm.nome,
        hora_inicio: editForm.hora_inicio,
        duracao_minutos: editForm.duracao_minutos,
        id_zona_sensor: editForm.id_zona_sensor,
        repetir_todos_dias: editForm.repetir_todos_dias,
        dias_semana: diasCsv,
        ativo: editForm.ativo,
      };

      await api.put(`/api/v1/agendamento/${editModal.id_agendamento}`, payload);
      setAgendamentos((prev) =>
        prev.map((a) =>
          a.id_agendamento === editModal.id_agendamento
            ? { ...a, ...payload }
            : a
        )
      );
      setEditModal(null);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    if (!confirmDel) return;
    setSalvando(true);
    try {
      await api.delete(`/api/v1/agendamento/${confirmDel.id_agendamento}`);
      setAgendamentos((prev) =>
        prev.filter((a) => a.id_agendamento !== confirmDel.id_agendamento)
      );
      setConfirmDel(null);
    } catch (err) {
      console.error("Erro ao excluir:", err);
    } finally {
      setSalvando(false);
    }
  };

  const formataDias = (ag: Agendamento) => {
    if (ag.repetir_todos_dias) return "Todos os dias";
    if (ag.dias_semana) return ag.dias_semana.toUpperCase().replace(/,/g, " · ");
    return "Sem recorrência";
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">

        <div className="ag-header">
          <div>
            <h1>Agendamentos</h1>
            <p>Regras automáticas de irrigação — configure horários, dias e duração.</p>
          </div>
          <button className="btn-new" onClick={() => navigate("/adicionar-agendamento")}>
            + Nova Regra
          </button>
        </div>

        <div className="cards-container">
          <div className="cards-grid">
            {agendamentos.length === 0 && (
              <p className="ag-empty">Nenhum agendamento cadastrado ainda.</p>
            )}

            {agendamentos.map((ag) => (
              <div key={ag.id_agendamento} className={`card ${ag.ativo ? "active" : ""}`}>
                <div className="card-header">
                  <h3>{ag.nome}</h3>
                  <div className="card-header-right">
                    <span className={`status ${ag.ativo ? "on" : "off"}`}>
                      {ag.ativo ? "Ativa" : "Inativa"}
                    </span>
                    <button className="card-icon-btn card-icon-btn--edit" title="Editar" onClick={() => abrirEdicao(ag)}>
                      <Pencil size={18} />
                    </button>
                    <button className="card-icon-btn card-icon-btn--del" title="Excluir" onClick={() => setConfirmDel(ag)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="time">
                  <Clock size={13} /> {ag.hora_inicio.slice(0, 5)} · {ag.duracao_minutos} min
                </p>

                <div className="card-zona">
                  <MapPin size={12} />
                  {nomeZona(ag.id_zona_sensor)}
                </div>

                <span className="device">{formataDias(ag)}</span>

                <div className="card-actions">
                  {ag.ativo ? (
                    <button className="btn-danger" onClick={() => toggleAtivo(ag)}>Pausar</button>
                  ) : (
                    <button className="btn-primary" onClick={() => toggleAtivo(ag)}>Ativar</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODAL EDITAR ── */}
      {editModal && editForm && (
        <div className="ag-modal-backdrop" onClick={() => setEditModal(null)}>
          <div className="ag-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-head">
              <h3>Editar Agendamento</h3>
              <button className="ag-modal-close" onClick={() => setEditModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="ag-modal-body">
              <div className="ag-field">
                <label>Nome</label>
                <input
                  value={editForm.nome}
                  onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })}
                />
              </div>

              <div className="ag-field">
                <label>Zona de Irrigação</label>
                <select
                  value={editForm.id_zona_sensor}
                  onChange={(e) => setEditForm({ ...editForm, id_zona_sensor: Number(e.target.value) })}
                >
                  <option value="">Selecione uma zona</option>
                  {zonas.map((z) => (
                    <option key={z.id_zona_sensor} value={z.id_zona_sensor}>{z.nome_zona}</option>
                  ))}
                </select>
              </div>

              <div className="ag-field-row">
                <div className="ag-field">
                  <label>Hora de início</label>
                  <input
                    type="time"
                    value={editForm.hora_inicio}
                    onChange={(e) => setEditForm({ ...editForm, hora_inicio: e.target.value })}
                  />
                </div>
                <div className="ag-field">
                  <label>Duração (min)</label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.duracao_minutos}
                    onChange={(e) => setEditForm({ ...editForm, duracao_minutos: Number(e.target.value) })}
                  />
                </div>
              </div>

              <label className="ag-toggle">
                <input
                  type="checkbox"
                  checked={editForm.repetir_todos_dias}
                  onChange={(e) => setEditForm({ ...editForm, repetir_todos_dias: e.target.checked })}
                />
                <span>Repetir todos os dias</span>
              </label>

              {!editForm.repetir_todos_dias && (
                <div className="ag-dias">
                  {DIAS.map(({ key, label }) => (
                    <label
                      key={key}
                      className={`ag-dia-chip ${editForm.dias[key] ? "ag-dia-chip--on" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={editForm.dias[key]}
                        onChange={() =>
                          setEditForm({
                            ...editForm,
                            dias: { ...editForm.dias, [key]: !editForm.dias[key] },
                          })
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}

              <label className="ag-toggle">
                <input
                  type="checkbox"
                  checked={editForm.ativo}
                  onChange={(e) => setEditForm({ ...editForm, ativo: e.target.checked })}
                />
                <span>Agendamento ativo</span>
              </label>
            </div>

            <div className="ag-modal-actions">
              <button className="ag-btn ag-btn--outline" onClick={() => setEditModal(null)}>
                Cancelar
              </button>
              <button
                className="ag-btn ag-btn--primary"
                onClick={salvarEdicao}
                disabled={salvando || !editForm.nome.trim() || !editForm.id_zona_sensor}
              >
                {salvando ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONFIRMAR EXCLUSÃO ── */}
      {confirmDel && (
        <div className="ag-modal-backdrop" onClick={() => setConfirmDel(null)}>
          <div className="ag-modal ag-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-del-icon">
              <Trash2 size={24} />
            </div>
            <h3>Confirmar exclusão</h3>
            <p>
              Tem certeza que deseja excluir o agendamento{" "}
              <strong>"{confirmDel.nome}"</strong>?
              <br />
              <span className="ag-warn">Esta ação não pode ser desfeita.</span>
            </p>
            <div className="ag-modal-actions">
              <button className="ag-btn ag-btn--outline" onClick={() => setConfirmDel(null)}>
                Cancelar
              </button>
              <button className="ag-btn ag-btn--danger" onClick={confirmarExclusao} disabled={salvando}>
                {salvando ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
