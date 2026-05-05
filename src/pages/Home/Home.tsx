import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cpu, Wifi, BarChart2, Clock, Droplets, Smartphone,
  Server, Database, Play, X, ChevronRight, Zap, Shield, Globe,
} from "lucide-react";
import videoSrc from "../../video/garden-tech-video.mp4";
import "./Home.css";

const BENEFICIOS = [
  { icon: <Droplets size={28} />, title: "Economia de Água", desc: "Irrigação precisa baseada na leitura real do solo, eliminando desperdícios." },
  { icon: <Clock size={28} />, title: "Automação Total", desc: "Programe horários, dias da semana e durações. O sistema trabalha sozinho." },
  { icon: <BarChart2 size={28} />, title: "Histórico Completo", desc: "Gráficos de umidade e logs de irrigação com filtros por período." },
  { icon: <Smartphone size={28} />, title: "Acesso Remoto", desc: "Controle e monitore de qualquer dispositivo, em qualquer lugar." },
  { icon: <Zap size={28} />, title: "Resposta em Tempo Real", desc: "Leituras do sensor enviadas via HTTP direto para o dashboard." },
  { icon: <Shield size={28} />, title: "Dados Seguros", desc: "Credenciais WiFi criptografadas com Fernet e senha com hash SHA-256." },
];

const STACK = [
  { label: "ESP32 C++", sub: "Microcontrolador IoT", color: "#f39c12" },
  { label: "FastAPI", sub: "Backend Python", color: "#2CC295" },
  { label: "SQLite", sub: "Banco de dados", color: "#00c8ff" },
  { label: "React + TS", sub: "Interface Web", color: "#a78bfa" },
];

export const Home = () => {
  const navigate = useNavigate();
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className="home">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-badge">Projeto Acadêmico · IoT + Web</div>
        <h1 className="hero-title">
          Irrigação Inteligente<br />
          <span className="hero-accent">Automatizada com ESP32</span>
        </h1>
        <p className="hero-sub">
          Monitore a umidade do solo em tempo real, agende irrigações automáticas
          e controle sua horta de qualquer lugar — tudo integrado em um dashboard.
        </p>
        <div className="hero-ctas">
          <button className="cta-primary" onClick={() => navigate("/monitoramento")}>
            Acessar Dashboard <ChevronRight size={18} />
          </button>
          <button className="cta-secondary" onClick={() => navigate("/docs")}>
            Ver Documentação
          </button>
        </div>

        {/* mini stats */}
        <div className="hero-stats">
          {[
            { val: "ESP32", label: "Microcontrolador" },
            { val: "REST", label: "API FastAPI" },
            { val: "SQLite", label: "Banco local" },
            { val: "React", label: "Dashboard web" },
          ].map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-val">{s.val}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARQUITETURA ──────────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">Como funciona</div>
          <h2 className="section-title">Arquitetura do Sistema</h2>
          <p className="section-desc">
            Quatro camadas integradas que transformam dados do solo em ações de irrigação.
          </p>

          <div className="arch-flow">
            {/* camada IoT */}
            <div className="arch-node arch-node--iot">
              <div className="arch-icon"><Cpu size={32} /></div>
              <strong>ESP32</strong>
              <span>Lê sensor higrômetro e controla relé da bomba d'água</span>
              <div className="arch-chips">
                <span className="chip">C++</span>
                <span className="chip">GPIO</span>
                <span className="chip">WiFi</span>
              </div>
            </div>

            <div className="arch-arrow"><Wifi size={20} /><span>HTTP / JSON</span></div>

            {/* camada Backend */}
            <div className="arch-node arch-node--api">
              <div className="arch-icon"><Server size={32} /></div>
              <strong>FastAPI</strong>
              <span>Recebe leituras, gerencia agendamentos e controla irrigação</span>
              <div className="arch-chips">
                <span className="chip">Python</span>
                <span className="chip">REST API</span>
                <span className="chip">Async</span>
              </div>
            </div>

            <div className="arch-arrow"><Database size={20} /><span>SQLAlchemy</span></div>

            {/* camada Banco */}
            <div className="arch-node arch-node--db">
              <div className="arch-icon"><Database size={32} /></div>
              <strong>SQLite</strong>
              <span>Armazena usuários, sensores, leituras e histórico de irrigações</span>
              <div className="arch-chips">
                <span className="chip">6 tabelas</span>
                <span className="chip">Async I/O</span>
              </div>
            </div>

            <div className="arch-arrow"><Globe size={20} /><span>Axios / REST</span></div>

            {/* camada Frontend */}
            <div className="arch-node arch-node--web">
              <div className="arch-icon"><BarChart2 size={32} /></div>
              <strong>React Dashboard</strong>
              <span>Visualização de dados, agendamentos e controle manual da bomba</span>
              <div className="arch-chips">
                <span className="chip">TypeScript</span>
                <span className="chip">Chart.js</span>
                <span className="chip">Vite</span>
              </div>
            </div>
          </div>

          {/* stack badges */}
          <div className="stack-row">
            {STACK.map((s) => (
              <div key={s.label} className="stack-badge" style={{ borderColor: s.color }}>
                <span className="stack-dot" style={{ background: s.color }} />
                <div>
                  <strong style={{ color: s.color }}>{s.label}</strong>
                  <span>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ───────────────────────────────────── */}
      <section className="section section--alt">
        <div className="section-inner">
          <div className="section-label">Por que usar</div>
          <h2 className="section-title">Benefícios do Projeto</h2>
          <div className="benefits-grid">
            {BENEFICIOS.map((b) => (
              <div key={b.title} className="benefit-card">
                <div className="benefit-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VÍDEO ────────────────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">Demonstração</div>
          <h2 className="section-title">Veja o Protótipo em Ação</h2>
          <p className="section-desc">
            Assista ao ESP32 lendo o sensor e acionando a bomba d'água automaticamente.
          </p>

          <div className="video-thumb" onClick={() => setVideoOpen(true)}>
            <video
              src={videoSrc}
              className="video-preview"
              muted
              playsInline
              preload="metadata"
            />
            <div className="video-overlay-bg" />
            <div className="video-play-btn">
              <Play size={40} fill="white" />
            </div>
            <div className="video-label">
              <span>Protótipo GardenTech</span>
              <span className="video-duration">Clique para assistir</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────── */}
      <section className="section section--alt">
        <div className="section-inner cta-final">
          <h2>Pronto para começar?</h2>
          <p>Acesse o dashboard, cadastre seu ESP32 e comece a monitorar sua horta.</p>
          <div className="hero-ctas">
            <button className="cta-primary" onClick={() => navigate("/monitoramento")}>
              Ir para Dashboard <ChevronRight size={18} />
            </button>
            <button className="cta-secondary" onClick={() => navigate("/docs")}>
              Ver Documentação
            </button>
          </div>
        </div>
      </section>

      {/* ── MODAL VÍDEO ──────────────────────────────────── */}
      {videoOpen && (
        <div className="modal-backdrop" onClick={() => setVideoOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setVideoOpen(false)}>
              <X size={20} />
            </button>
            <div className="modal-video">
              <video
                src={videoSrc}
                controls
                autoPlay
                style={{ width: "100%", height: "100%", display: "block", borderRadius: "0 0 16px 16px" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
