import "./index.css";

export function Agendamentos() {
return (
    <div className="dashboard-page">
      <div className="dashboard-content">

        {/* CONTAINER DOS CARDS */}
        <div className="cards-container">

          <div className="cards-grid">

            {/* CARD 1 */}
            <div className="card active">
              <div className="card-header">
                <h3>Irrigação matinal</h3>
                <span className="status on">Ativa</span>
              </div>

              <p className="time">
                Todos os dias às 6:00 por 15 min
              </p>

              <span className="device">ESP32-001</span>

              <div className="card-actions">
                <button className="btn-edit">Editar</button>
                <button className="btn-danger">Pausar</button>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="card">
              <div className="card-header">
                <h3>Irrigação noturna</h3>
                <span className="status on">Inativa</span>
              </div>

              <p className="time">
                Todos os dias às 20:00 por 10 min
              </p>

              <span className="device">ESP32-001</span>

              <div className="card-actions">
                <button className="btn-edit">Editar</button>
                <button className="btn-primary">Ativar</button>
              </div>
            </div>

          </div>

          {/* BOTÃO EMBAIXO */}
          <div className="bottom-action">
            <button className="btn-new">+ Nova Regra</button>
          </div>

        </div>

      </div>
    </div>
  );
}
