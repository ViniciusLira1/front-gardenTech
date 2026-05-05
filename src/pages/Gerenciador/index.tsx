import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Cpu, Radio, PlusCircle, Layers, Trash2, Pencil, X, MapPin } from "lucide-react";
import "./gerenciar.css";

type Controlador = { id_controlador: number; nome: string };
type Sensor = {
  id_sensor: number;
  tipo_sensor: string;
  unidade_medida: string;
  id_controlador: number;
};
type Zona = {
  id_zona_sensor: number;
  nome_zona: string;
  id_controlador: number;
  id_sensor: number;
};
type ConfirmModal = {
  type: "sensor" | "zona" | "controlador";
  id: number;
  nome: string;
};
type EditTarget = { type: "zona" | "controlador"; id: number; nome: string };

export function GerenciarDispositivos() {
  const [controladores, setControladores] = useState<Controlador[]>([]);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editNome, setEditNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroExclusao, setErroExclusao] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/controladores/"),
      api.get("/api/v1/sensores/"),
      api.get("/api/v1/zonas/"),
    ])
      .then(([ctrlRes, sensorRes, zonaRes]) => {
        setControladores(ctrlRes.data);
        setSensores(sensorRes.data);
        setZonas(zonaRes.data);
      })
      .catch((err) => console.error("Erro ao buscar dados:", err));
  }, []);

  const pedirConfirmacao = (type: ConfirmModal["type"], id: number, nome: string) => {
    setErroExclusao(null);
    setConfirmModal({ type, id, nome });
  };

  const fecharConfirm = () => { setConfirmModal(null); setErroExclusao(null); };

  const confirmarExclusao = async () => {
    if (!confirmModal) return;
    setSalvando(true);
    setErroExclusao(null);
    try {
      if (confirmModal.type === "sensor") {
        await api.delete(`/api/v1/sensores/${confirmModal.id}`);
        setSensores((prev) => prev.filter((s) => s.id_sensor !== confirmModal.id));
      } else if (confirmModal.type === "zona") {
        await api.delete(`/api/v1/zonas/${confirmModal.id}`);
        setZonas((prev) => prev.filter((z) => z.id_zona_sensor !== confirmModal.id));
      } else {
        await api.delete(`/api/v1/controladores/${confirmModal.id}`);
        setControladores((prev) => prev.filter((c) => c.id_controlador !== confirmModal.id));
        setSensores((prev) => prev.filter((s) => s.id_controlador !== confirmModal.id));
      }
      setConfirmModal(null);
    } catch (err: any) {
      const msg = err?.response?.data?.detail ?? "Erro ao excluir. Tente novamente.";
      setErroExclusao(msg);
    } finally {
      setSalvando(false);
    }
  };

  const abrirEditar = (type: "zona" | "controlador", id: number, nome: string) => {
    setEditTarget({ type, id, nome });
    setEditNome(nome);
  };

  const salvarEdicao = async () => {
    if (!editTarget || !editNome.trim()) return;
    setSalvando(true);
    try {
      if (editTarget.type === "zona") {
        const zona = zonas.find((z) => z.id_zona_sensor === editTarget.id)!;
        await api.put(`/api/v1/zonas/${editTarget.id}`, {
          nome_zona: editNome.trim(),
          id_controlador: zona.id_controlador,
          id_sensor: zona.id_sensor,
        });
        setZonas((prev) =>
          prev.map((z) => z.id_zona_sensor === editTarget.id ? { ...z, nome_zona: editNome.trim() } : z)
        );
      } else {
        await api.put(`/api/v1/controladores/${editTarget.id}`, { nome: editNome.trim() });
        setControladores((prev) =>
          prev.map((c) => c.id_controlador === editTarget.id ? { ...c, nome: editNome.trim() } : c)
        );
      }
      setEditTarget(null);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSalvando(false);
    }
  };

  const labelTipo = (type: ConfirmModal["type"]) =>
    type === "sensor" ? "o sensor" : type === "zona" ? "a zona" : "o controlador";

  return (
    <div className="gd-page">
      <div className="gd-wrap">

        {/* ── HEADER ── */}
        <div className="gd-header">
          <div className="gd-header-text">
            <h1>Gerenciar Dispositivos</h1>
            <p>
              Cadastre e visualize seus controladores ESP32 e os sensores associados.
              Cada controlador recebe um <strong>token único</strong> para autenticação
              com o hardware e pode ter seu WiFi configurado remotamente.
            </p>
          </div>
          <div className="gd-header-actions">
            <button className="gd-btn gd-btn--primary" onClick={() => navigate("/adicionar-controlador")}>
              <PlusCircle size={16} /> Novo Controlador
            </button>
            <button className="gd-btn gd-btn--secondary" onClick={() => navigate("/adicionar-sensor")}>
              <Radio size={16} /> Novo Sensor
            </button>
            <button className="gd-btn gd-btn--outline" onClick={() => navigate("/adicionar-zona")}>
              <Layers size={16} /> Nova Zona
            </button>
          </div>
        </div>

        {/* ── RESUMO ── */}
        <div className="gd-summary">
          <div className="gd-stat">
            <Cpu size={20} color="#2CC295" />
            <span className="gd-stat-val">{controladores.length}</span>
            <span className="gd-stat-label">Controladores</span>
          </div>
          <div className="gd-stat">
            <Radio size={20} color="#00c8ff" />
            <span className="gd-stat-val">{sensores.length}</span>
            <span className="gd-stat-label">Sensores</span>
          </div>
          <div className="gd-stat">
            <MapPin size={20} color="#a78bfa" />
            <span className="gd-stat-val">{zonas.length}</span>
            <span className="gd-stat-label">Zonas</span>
          </div>
        </div>

        {/* ── GRID CONTROLADORES ── */}
        {controladores.length === 0 ? (
          <div className="gd-empty">
            <Cpu size={48} color="#2CC295" opacity={0.4} />
            <p>Nenhum controlador cadastrado ainda.</p>
            <button className="gd-btn gd-btn--primary" onClick={() => navigate("/adicionar-controlador")}>
              Adicionar primeiro controlador
            </button>
          </div>
        ) : (
          <div className="gd-grid">
            {controladores.map((ctrl) => {
              const sensoresCtrl = sensores.filter((s) => s.id_controlador === ctrl.id_controlador);
              return (
                <div key={ctrl.id_controlador} className="gd-card">
                  <div className="gd-card-top">
                    <div className="gd-card-icon"><Cpu size={22} /></div>
                    <div className="gd-card-info">
                      <h3>{ctrl.nome}</h3>
                      <span className="gd-card-id">ID #{ctrl.id_controlador}</span>
                    </div>
                    <div className="gd-card-actions-top">
                      <button
                        className="gd-icon-btn gd-icon-btn--edit"
                        title="Renomear controlador"
                        onClick={() => abrirEditar("controlador", ctrl.id_controlador, ctrl.nome)}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className="gd-icon-btn gd-icon-btn--del"
                        title="Excluir controlador"
                        onClick={() => pedirConfirmacao("controlador", ctrl.id_controlador, ctrl.nome)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="gd-divider" />

                  <div className="gd-sensor-section">
                    <span className="gd-sensor-title">
                      <Radio size={13} /> Sensores ({sensoresCtrl.length})
                    </span>
                    {sensoresCtrl.length === 0 ? (
                      <p className="gd-no-sensor">Nenhum sensor vinculado</p>
                    ) : (
                      <div className="gd-sensor-list">
                        {sensoresCtrl.map((s) => (
                          <div key={s.id_sensor} className="gd-sensor-chip">
                            <span className="gd-sensor-dot" />
                            <span>{s.tipo_sensor}</span>
                            <span className="gd-sensor-unit">{s.unidade_medida}</span>
                            <button
                              className="gd-sensor-del"
                              title="Excluir sensor"
                              onClick={() => pedirConfirmacao("sensor", s.id_sensor, s.tipo_sensor)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button className="gd-btn gd-btn--card" onClick={() => navigate("/adicionar-sensor")}>
                    <PlusCircle size={14} /> Adicionar Sensor
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ZONAS ── */}
        <div className="gd-section">
          <div className="gd-section-header">
            <div className="gd-section-title">
              <MapPin size={17} color="#a78bfa" />
              <h2>Zonas de Irrigação</h2>
              <span className="gd-section-count">{zonas.length}</span>
            </div>
            <button className="gd-btn gd-btn--outline" onClick={() => navigate("/adicionar-zona")}>
              <PlusCircle size={14} /> Nova Zona
            </button>
          </div>

          {zonas.length === 0 ? (
            <p className="gd-no-zona">Nenhuma zona cadastrada</p>
          ) : (
            <div className="gd-zona-list">
              {zonas.map((z) => {
                const ctrl = controladores.find((c) => c.id_controlador === z.id_controlador);
                const sensor = sensores.find((s) => s.id_sensor === z.id_sensor);
                return (
                  <div key={z.id_zona_sensor} className="gd-zona-row">
                    <div className="gd-zona-icon"><MapPin size={16} /></div>
                    <div className="gd-zona-info">
                      <span className="gd-zona-nome">{z.nome_zona}</span>
                      <span className="gd-zona-meta">
                        {ctrl?.nome ?? `Controlador #${z.id_controlador}`}
                        {sensor && ` · ${sensor.tipo_sensor} (${sensor.unidade_medida})`}
                      </span>
                    </div>
                    <span className="gd-zona-id">ID #{z.id_zona_sensor}</span>
                    <div className="gd-zona-actions">
                      <button
                        className="gd-icon-btn gd-icon-btn--edit"
                        title="Editar zona"
                        onClick={() => abrirEditar("zona", z.id_zona_sensor, z.nome_zona)}
                      >
                        <Pencil size={22} />
                      </button>
                      <button
                        className="gd-icon-btn gd-icon-btn--del"
                        title="Excluir zona"
                        onClick={() => pedirConfirmacao("zona", z.id_zona_sensor, z.nome_zona)}
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL DE CONFIRMAÇÃO ── */}
      {confirmModal && (
        <div className="gd-modal-backdrop" onClick={fecharConfirm}>
          <div className="gd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gd-modal-icon gd-modal-icon--danger">
              <Trash2 size={24} />
            </div>
            <h3>Confirmar exclusão</h3>
            <p>
              Tem certeza que deseja excluir {labelTipo(confirmModal.type)}{" "}
              <strong>"{confirmModal.nome}"</strong>?
              {confirmModal.type === "controlador" && (
                <><br /><span style={{ fontSize: 12, color: "#8ab4ae" }}>Os sensores vinculados também serão excluídos.</span></>
              )}
              <br />
              <span className="gd-modal-warn">Esta ação não pode ser desfeita.</span>
            </p>
            {erroExclusao && <div className="gd-modal-error">{erroExclusao}</div>}
            <div className="gd-modal-actions">
              <button className="gd-btn gd-btn--outline" onClick={fecharConfirm}>Cancelar</button>
              <button className="gd-btn gd-btn--danger" onClick={confirmarExclusao} disabled={salvando}>
                {salvando ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL EDITAR ── */}
      {editTarget && (
        <div className="gd-modal-backdrop" onClick={() => setEditTarget(null)}>
          <div className="gd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gd-modal-head">
              <h3>{editTarget.type === "zona" ? "Editar Zona" : "Renomear Controlador"}</h3>
              <button className="gd-modal-close" onClick={() => setEditTarget(null)}>
                <X size={18} />
              </button>
            </div>
            <label className="gd-modal-label">Nome</label>
            <input
              className="gd-modal-input"
              value={editNome}
              onChange={(e) => setEditNome(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && salvarEdicao()}
              autoFocus
            />
            <div className="gd-modal-actions">
              <button className="gd-btn gd-btn--outline" onClick={() => setEditTarget(null)}>Cancelar</button>
              <button
                className="gd-btn gd-btn--primary"
                onClick={salvarEdicao}
                disabled={salvando || !editNome.trim()}
              >
                {salvando ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
