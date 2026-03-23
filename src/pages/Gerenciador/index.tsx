import "./gerenciar.css";

export function GerenciarDispositivos() {
  return (
    <div className="container">

      <div className="wrapper">

        {/* AÇÃO SUPERIOR */}
        <div className="top-action">
          <button className="btn-primary">+ Adicionar Controlador</button>
        </div>

        {/* GRID DE CONTROLADORES */}
        <div className="grid">

          {/* CONTROLADOR 1 */}
          <div className="card">
            <div className="card-header">
              <span>ESP32-001</span>
              <span className="status">ONLINE</span>
            </div>

            <p className="location">Minha Casa</p>

            <div className="sensor-list">
              <p>SENSOR-001, SENSOR-002, SENSOR-003</p>
              <p>🌡 Umidade</p>
              <p>📏 Porcentagem</p>
            </div>

            <button className="btn-secondary">
              + Adicionar Sensor
            </button>
          </div>

          {/* CONTROLADOR 2 */}
          <div className="card">
            <div className="card-header">
              <span>ESP32-002</span>
              <span className="status">ONLINE</span>
            </div>

            <p className="location">Minha Casa</p>

            <div className="sensor-list">
              <p>SENSOR-004, SENSOR-005</p>
              <p>🌡 Umidade</p>
              <p>📏 Porcentagem</p>
            </div>

            <button className="btn-secondary">
              + Adicionar Sensor
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}