import { useState } from "react";
import { Server, Cpu, Globe, Database, Wifi, Key, Code2, BookOpen } from "lucide-react";
import "./index.css";

type Section = "overview" | "backend" | "frontend" | "iot";

const ENDPOINTS = [
  { method: "POST",   path: "/api/v1/users/login",               desc: "Autenticar usuário" },
  { method: "POST",   path: "/api/v1/users/",                    desc: "Cadastrar novo usuário" },
  { method: "GET",    path: "/api/v1/controladores/",            desc: "Listar controladores ESP32" },
  { method: "POST",   path: "/api/v1/controladores/",            desc: "Registrar novo controlador" },
  { method: "PUT",    path: "/api/v1/controladores/{id}",        desc: "Renomear controlador" },
  { method: "DELETE", path: "/api/v1/controladores/{id}",        desc: "Excluir controlador (cascade sensores + leituras)" },
  { method: "POST",   path: "/api/v1/controladores/{id}/wifi",   desc: "Configurar WiFi do controlador" },
  { method: "GET",    path: "/api/v1/sensores/",                 desc: "Listar sensores cadastrados" },
  { method: "POST",   path: "/api/v1/sensores/",                 desc: "Adicionar sensor a um controlador" },
  { method: "DELETE", path: "/api/v1/sensores/{id}",             desc: "Excluir sensor (cascade leituras)" },
  { method: "GET",    path: "/api/v1/zonas/",                    desc: "Listar zonas de irrigação" },
  { method: "POST",   path: "/api/v1/zonas/",                    desc: "Criar zona (controlador + sensor)" },
  { method: "PUT",    path: "/api/v1/zonas/{id}",                desc: "Renomear zona" },
  { method: "DELETE", path: "/api/v1/zonas/{id}",                desc: "Excluir zona (cascade execuções; bloqueia se há agendamentos)" },
  { method: "POST",   path: "/api/v1/leitura/",                  desc: "Enviar leitura do sensor (ESP32 usa este)" },
  { method: "GET",    path: "/api/v1/leitura/sensor/{id}",       desc: "Histórico de leituras com filtro de período" },
  { method: "GET",    path: "/api/v1/leitura/sensor/{id}/latest",desc: "Última leitura do sensor" },
  { method: "GET",    path: "/api/v1/agendamento/",              desc: "Listar agendamentos" },
  { method: "POST",   path: "/api/v1/agendamento/",              desc: "Criar agendamento de irrigação" },
  { method: "PUT",    path: "/api/v1/agendamento/{id}",          desc: "Atualizar agendamento" },
  { method: "DELETE", path: "/api/v1/agendamento/{id}",          desc: "Excluir agendamento (desassocia execuções)" },
  { method: "POST",   path: "/api/v1/agendamento/{id}/executar", desc: "Executar irrigação manualmente via agendamento" },
  { method: "POST",   path: "/api/v1/bomba/ligar",               desc: "Ligar bomba manualmente (cria execução)" },
  { method: "POST",   path: "/api/v1/bomba/desligar",            desc: "Desligar bomba" },
  { method: "GET",    path: "/api/v1/bomba/status",              desc: "Estado atual da bomba (ESP32 consulta)" },
  { method: "GET",    path: "/api/v1/execucoes/",                desc: "Histórico unificado de irrigações" },
];

const TABELAS = [
  { nome: "usuarios",            cols: "id_usuario, nome, email, senha_hash" },
  { nome: "controladores",       cols: "id_controlador, nome, id_usuario, ssid_criptografado, senha_wifi_criptografada, token_vinculacao" },
  { nome: "sensores",            cols: "id_sensor, tipo_sensor, unidade_medida, id_controlador" },
  { nome: "zonas_sensores",      cols: "id_zona_sensor, nome_zona, id_controlador, id_sensor" },
  { nome: "leituras_sensores",   cols: "id_leitura, id_sensor, valor (float), data_hora" },
  { nome: "agendamentos",        cols: "id_agendamento, id_zona_sensor, nome, hora_inicio, duracao_minutos, repetir_todos_dias, dias_semana, intervalo_dias, ativo, ultima_execucao" },
  { nome: "execucoes_irrigacao", cols: "id_execucao, id_zona_sensor, id_agendamento (nullable), tipo, iniciado_em, duracao_minutos, status" },
];

const PAGES = [
  { rota: "/",                       comp: "Login",               desc: "Autenticação com email e senha" },
  { rota: "/cadastro",               comp: "Cadastro",            desc: "Criação de conta de usuário" },
  { rota: "/home",                   comp: "Home",                desc: "Landing page com arquitetura e benefícios" },
  { rota: "/gerenciar",              comp: "GerenciarDispositivos", desc: "Visualização e gerenciamento de ESP32 e sensores" },
  { rota: "/adicionar-controlador",  comp: "AdicionarControlador", desc: "Formulário de registro de novo ESP32" },
  { rota: "/adicionar-sensor",       comp: "Sensor",              desc: "Vinculação de sensor a um controlador" },
  { rota: "/adicionar-zona",         comp: "AdicionarZona",       desc: "Criação de zona (área de irrigação)" },
  { rota: "/agendamentos",           comp: "Agendamentos",        desc: "Lista e controle de regras de irrigação" },
  { rota: "/adicionar-agendamento",  comp: "NovoAgendamento",     desc: "Formulário de criação de agendamento" },
  { rota: "/monitoramento",          comp: "Monitoramento",       desc: "Dashboard com gráficos e controle da bomba" },
  { rota: "/docs",                   comp: "Documentação",        desc: "Esta página" },
];

export function Documentacao() {
  const [active, setActive] = useState<Section>("overview");

  const NAV: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: "overview",  label: "Visão Geral",  icon: <BookOpen size={16} /> },
    { key: "backend",   label: "Back-end",     icon: <Server size={16} /> },
    { key: "frontend",  label: "Front-end",    icon: <Globe size={16} /> },
    { key: "iot",       label: "IoT / ESP32",  icon: <Cpu size={16} /> },
  ];

  const methodColor: Record<string, string> = {
    GET: "#2CC295", POST: "#00c8ff", PUT: "#f1c40f", DELETE: "#e74c3c",
  };

  return (
    <div className="docs-page">
      <div className="docs-wrap">

        {/* ── SIDEBAR ── */}
        <aside className="docs-sidebar">
          <div className="docs-logo"><Code2 size={20} color="#2CC295" /> Documentação</div>
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`docs-nav-btn ${active === n.key ? "docs-nav-btn--on" : ""}`}
              onClick={() => setActive(n.key)}
            >
              {n.icon} {n.label}
            </button>
          ))}

          <div className="docs-meta">
            <span>Versão 1.0</span>
            <span>FastAPI 0.116</span>
            <span>React 19</span>
          </div>
        </aside>

        {/* ── CONTEÚDO ── */}
        <main className="docs-content">

          {/* VISÃO GERAL */}
          {active === "overview" && (
            <div className="docs-section">
              <h1>GardenTech — Sistema de Irrigação IoT</h1>
              <p className="docs-lead">
                Projeto acadêmico que integra hardware (ESP32), uma API REST (FastAPI) e um
                dashboard web (React) para automatizar e monitorar a irrigação do solo.
              </p>

              <h2>Arquitetura</h2>
              <div className="arch-diagram">
                <div className="arch-box arch-box--iot">
                  <Cpu size={22} /><strong>ESP32 (C++)</strong>
                  <span>Sensor de umidade + relé da bomba</span>
                </div>
                <div className="arch-conn">HTTP/JSON →</div>
                <div className="arch-box arch-box--api">
                  <Server size={22} /><strong>FastAPI (Python)</strong>
                  <span>API REST assíncrona em :8000</span>
                </div>
                <div className="arch-conn">SQLAlchemy →</div>
                <div className="arch-box arch-box--db">
                  <Database size={22} /><strong>SQLite</strong>
                  <span>Banco local (meubanco.db)</span>
                </div>
                <div className="arch-conn">← Axios</div>
                <div className="arch-box arch-box--web">
                  <Globe size={22} /><strong>React Dashboard</strong>
                  <span>Interface web em :5173</span>
                </div>
              </div>

              <h2>Fluxo de dados</h2>
              <ol className="docs-list">
                <li>Usuário cadastra conta e faz login → recebe <code>user_id</code> no localStorage.</li>
                <li>Registra controlador ESP32 → sistema gera <code>token_vinculacao</code>.</li>
                <li>Configura WiFi do controlador remotamente (armazenado criptografado).</li>
                <li>Adiciona sensor higrômetro e cria uma zona de irrigação.</li>
                <li>ESP32 envia leituras de umidade periodicamente via <code>POST /leitura/</code>.</li>
                <li>Dashboard exibe gráficos e estatísticas em tempo real.</li>
                <li>Usuário agenda irrigações automáticas ou aciona manualmente via dashboard.</li>
                <li>ESP32 consulta <code>GET /bomba/status</code> e aciona o relé conforme o estado.</li>
              </ol>

              <h2>Stack tecnológica</h2>
              <div className="stack-table">
                {[
                  ["Camada", "Tecnologia", "Versão"],
                  ["Microcontrolador", "ESP32 C++", "Arduino Core"],
                  ["Backend", "FastAPI + Python", "0.116"],
                  ["ORM", "SQLAlchemy (async)", "2.0"],
                  ["Banco de dados", "SQLite + aiosqlite", "—"],
                  ["Frontend", "React + TypeScript", "19 / 5.9"],
                  ["Build tool", "Vite", "7.x"],
                  ["Gráficos", "Chart.js + react-chartjs-2", "4.x"],
                ].map((row, i) => (
                  <div key={i} className={`stack-row-doc ${i === 0 ? "stack-row-doc--head" : ""}`}>
                    {row.map((cell, j) => <span key={j}>{cell}</span>)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BACKEND */}
          {active === "backend" && (
            <div className="docs-section">
              <h1>Back-end (FastAPI)</h1>
              <p className="docs-lead">
                API REST assíncrona hospedada no <strong>Render.com</strong> em{" "}
                <code>https://horta-back.onrender.com</code>.
                Todos os endpoints ficam sob o prefixo <code>/api/v1/</code>.
              </p>

              <h2>Banco de dados — tabelas</h2>
              <div className="table-doc">
                {TABELAS.map((t) => (
                  <div key={t.nome} className="table-doc-row">
                    <span className="table-doc-name">{t.nome}</span>
                    <span className="table-doc-cols">{t.cols}</span>
                  </div>
                ))}
              </div>

              <h2>Endpoints da API</h2>
              <div className="endpoint-list">
                {ENDPOINTS.map((e, i) => (
                  <div key={i} className="endpoint-row">
                    <span className="ep-method" style={{ color: methodColor[e.method] ?? "#ccc" }}>
                      {e.method}
                    </span>
                    <code className="ep-path">{e.path}</code>
                    <span className="ep-desc">{e.desc}</span>
                  </div>
                ))}
              </div>

              <h2>Segurança</h2>
              <ul className="docs-list">
                <li>Senhas armazenadas com <strong>SHA-256 + salt</strong> via passlib.</li>
                <li>Credenciais WiFi criptografadas com <strong>Fernet</strong> (chave em <code>settings.FERNET_KEY</code>).</li>
                <li>Cada ESP32 tem um <strong>token de vinculação</strong> único (256 bits via <code>secrets.token_urlsafe</code>).</li>
                <li>CORS liberado para <code>*</code> — aceita requisições de qualquer origem.</li>
              </ul>

              <h2>Hospedagem (Render.com)</h2>
              <ul className="docs-list">
                <li>Deploy automático via <strong>GitHub</strong> — cada push na branch principal faz redeploy.</li>
                <li>A URL pública é <code>https://horta-back.onrender.com</code>.</li>
                <li>No plano gratuito o serviço <strong>dorme após 15 min</strong> sem requisições — a primeira chamada pode demorar ~30s para acordar.</li>
                <li>Para testar se está no ar: <code>GET /ping</code> deve retornar <code>{`{"msg":"pong!"}`}</code>.</li>
              </ul>

              <h2>Como rodar localmente</h2>
              <pre className="code-block">{`cd horta-back
python -m venv venv
venv\\Scripts\\activate     # Windows
pip install -r requirements.txt
python main.py               # inicia em http://localhost:8000`}</pre>
            </div>
          )}

          {/* FRONTEND */}
          {active === "frontend" && (
            <div className="docs-section">
              <h1>Front-end (React + TypeScript)</h1>
              <p className="docs-lead">
                Dashboard web rodando em <code>http://localhost:5173</code>.
                Consome a API FastAPI via Axios (<code>/src/services/api.tsx</code>).
              </p>

              <h2>Páginas e rotas</h2>
              <div className="table-doc">
                <div className="table-doc-row table-doc-row--head">
                  <span>Rota</span><span>Componente</span><span>Descrição</span>
                </div>
                {PAGES.map((p) => (
                  <div key={p.rota} className="table-doc-row table-doc-row--3col">
                    <code>{p.rota}</code>
                    <span className="table-doc-name">{p.comp}</span>
                    <span className="table-doc-cols">{p.desc}</span>
                  </div>
                ))}
              </div>

              <h2>Componentes compartilhados</h2>
              <ul className="docs-list">
                <li><code>Navbar</code> — barra de navegação horizontal (sticky); oculta em <code>/</code> e <code>/cadastro</code>.</li>
                <li><code>Formulario</code> — formulário genérico com suporte a botão "Cancelar".</li>
                <li><code>FeatureCard</code> — card de destaque com ícone, título e descrição.</li>
              </ul>

              <h2>Como rodar</h2>
              <pre className="code-block">{`cd front-gardenTech
npm install
npm run dev     # inicia em http://localhost:5173`}</pre>

              <h2>Variáveis de ambiente</h2>
              <p>A base URL da API é configurada em <code>src/services/api.tsx</code>:</p>
              <pre className="code-block">{`// src/services/api.tsx
import axios from "axios";
export const api = axios.create({
  baseURL: "https://horta-back.onrender.com",
  headers: { "Content-Type": "application/json" },
});`}</pre>
            </div>
          )}

          {/* IoT */}
          {active === "iot" && (
            <div className="docs-section">
              <h1>IoT — ESP32 + Arduino (C++)</h1>
              <p className="docs-lead">
                O ESP32 lê o sensor higrômetro via ADC e envia os dados ao backend via WiFi.
                Como o ESP32 não possui saída 5 V, ele sinaliza o Arduino via GPIO, e o Arduino
                aciona o módulo relé que liga a bomba d'água.
              </p>

              <h2>Hardware necessário</h2>
              <ul className="docs-list">
                <li>ESP32 (qualquer modelo com WiFi)</li>
                <li>Sensor higrômetro de solo com saída analógica (AO)</li>
                <li>Arduino Uno / Nano (para acionar o relé com 5 V)</li>
                <li>Módulo relé 5 V (ativo em LOW)</li>
                <li>Bomba d'água submersível 5 V / 12 V</li>
              </ul>

              <h2>Ligações físicas</h2>
              <div className="table-doc">
                <div className="table-doc-row table-doc-row--head">
                  <span>De</span><span>Para</span><span>Observação</span>
                </div>
                {[
                  ["Higrômetro AO", "ESP32 GPIO34", "Saída analógica do sensor"],
                  ["Higrômetro VCC", "ESP32 3V3", "Alimentação do sensor"],
                  ["Higrômetro GND", "ESP32 GND", "—"],
                  ["ESP32 GPIO25", "Arduino Pino 7", "Sinal de ligar/desligar bomba"],
                  ["ESP32 GND", "Arduino GND", "GND comum obrigatório"],
                  ["Arduino Pino 8", "Relé IN", "Sinal de controle do relé"],
                  ["Arduino 5V", "Relé VCC", "Alimentação do relé"],
                  ["Arduino GND", "Relé GND", "—"],
                  ["Relé COM + NA", "Bomba d'água", "NA = Normalmente Aberto"],
                ].map((row, i) => (
                  <div key={i} className="table-doc-row table-doc-row--3col">
                    <code>{row[0]}</code><code>{row[1]}</code><span className="table-doc-cols">{row[2]}</span>
                  </div>
                ))}
              </div>

              <h2>Código ESP32</h2>
              <pre className="code-block">{`#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ═══════════════════════════════════════════════════
//  CONFIGURAÇÕES — edite antes de gravar
// ═══════════════════════════════════════════════════
const char* SSID     = "SEU_WIFI";
const char* PASSWORD = "SUA_SENHA";
const char* SERVER   = "http://192.168.x.x:8000"; // IP do backend

const int ID_SENSOR = 1;  // ID do sensor no banco
const int ID_ZONA   = 1;  // ID da zona  no banco

// ═══════════════════════════════════════════════════
//  PINOS
// ═══════════════════════════════════════════════════
const int PINO_SENSOR  = 34; // GPIO34 — saída analógica do higrômetro (AO)
const int PINO_ARDUINO = 25; // GPIO25 — sinal digital enviado ao Arduino

// ═══════════════════════════════════════════════════
//  INTERVALOS
// ═══════════════════════════════════════════════════
const unsigned long INTERVALO_LEITURA = 10UL * 60 * 1000; // 10 minutos
const unsigned long INTERVALO_BOMBA   = 30UL * 1000;      // 30 segundos

unsigned long tsLeitura = 0;
unsigned long tsBomba   = 0;

// ───────────────────────────────────────────────────
void conectarWiFi() {
  Serial.print("Conectando ao WiFi");
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi conectado! IP: " + WiFi.localIP().toString());
}

// ───────────────────────────────────────────────────
float lerUmidade() {
  // ADC do ESP32: 0–4095
  // Higrômetro: solo SECO  → ADC alto (~3200+)
  //             solo ÚMIDO → ADC baixo (~800-)
  int raw = analogRead(PINO_SENSOR);
  float pct = map(raw, 3200, 800, 0, 100);
  return constrain(pct, 0.0f, 100.0f);
}

// ───────────────────────────────────────────────────
void enviarLeitura() {
  if (WiFi.status() != WL_CONNECTED) return;

  float umidade = lerUmidade();

  HTTPClient http;
  http.begin(String(SERVER) + "/api/v1/leitura/");
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<128> doc;
  doc["id_sensor"] = ID_SENSOR;
  doc["valor"]     = umidade;
  String body;
  serializeJson(doc, body);

  int code = http.POST(body);
  Serial.printf("[Leitura] %.1f%%  →  HTTP %d\\n", umidade, code);
  http.end();
}

// ───────────────────────────────────────────────────
void verificarBomba() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(String(SERVER) + "/api/v1/bomba/status");
  int code = http.GET();

  if (code == 200) {
    StaticJsonDocument<128> doc;
    deserializeJson(doc, http.getString());
    bool ligar = doc["ligada"] | false;
    digitalWrite(PINO_ARDUINO, ligar ? HIGH : LOW);
    Serial.printf("[Bomba] %s\\n", ligar ? "LIGADA" : "DESLIGADA");
  } else {
    Serial.printf("[Bomba] Falha HTTP %d — mantém estado atual\\n", code);
  }
  http.end();
}

// ═══════════════════════════════════════════════════
void setup() {
  Serial.begin(115200);
  pinMode(PINO_ARDUINO, OUTPUT);
  digitalWrite(PINO_ARDUINO, LOW); // garante bomba desligada ao iniciar

  conectarWiFi();

  // Primeira leitura e verificação imediatas
  enviarLeitura();
  verificarBomba();
  tsLeitura = millis();
  tsBomba   = millis();
}

// ═══════════════════════════════════════════════════
void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Reconectando...");
    conectarWiFi();
  }

  unsigned long agora = millis();

  if (agora - tsLeitura >= INTERVALO_LEITURA) {
    enviarLeitura();
    tsLeitura = agora;
  }

  if (agora - tsBomba >= INTERVALO_BOMBA) {
    verificarBomba();
    tsBomba = agora;
  }

  delay(100);
}`}</pre>

              <h2>Código Arduino</h2>
              <pre className="code-block">{`// ═══════════════════════════════════════════════════
//  CONFIGURAÇÕES
// ═══════════════════════════════════════════════════
#define PINO_ESP32       7    // Recebe sinal do ESP32 (GPIO25)
#define PINO_RELE        8    // Controla o módulo relé
#define RELE_ATIVO_BAIXO true // true = relé liga com LOW (padrão dos módulos comuns)

bool estadoAnterior = false;

// ───────────────────────────────────────────────────
void ligarRele()    { digitalWrite(PINO_RELE, RELE_ATIVO_BAIXO ? LOW  : HIGH); }
void desligarRele() { digitalWrite(PINO_RELE, RELE_ATIVO_BAIXO ? HIGH : LOW);  }

// ═══════════════════════════════════════════════════
void setup() {
  Serial.begin(9600);
  pinMode(PINO_ESP32, INPUT);
  pinMode(PINO_RELE, OUTPUT);
  desligarRele(); // estado seguro ao iniciar
  Serial.println("[Arduino] Iniciado — rele desligado");
}

// ═══════════════════════════════════════════════════
void loop() {
  bool ligar = digitalRead(PINO_ESP32) == HIGH;

  if (ligar != estadoAnterior) {
    if (ligar) {
      ligarRele();
      Serial.println("[Rele] LIGADO");
    } else {
      desligarRele();
      Serial.println("[Rele] DESLIGADO");
    }
    estadoAnterior = ligar;
  }

  delay(200);
}`}</pre>

              <div className="docs-callout">
                <Key size={16} />
                <span>
                  Altere <code>SSID</code>, <code>PASSWORD</code> e <code>SERVER</code> no código
                  do ESP32 antes de gravar. O <code>SERVER</code> deve ser o IP da máquina rodando
                  o backend na mesma rede WiFi (ex: <code>http://192.168.1.10:8000</code>).
                </span>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
