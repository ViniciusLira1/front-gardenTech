import { useState } from "react";
import "./sensor.css";

export const AdicionarSensor = () => {
  const [sensorId, setSensorId] = useState("");
  const [tipoSensor, setTipoSensor] = useState("Umidade");
  const [tipoMedida, setTipoMedida] = useState("Porcentagem");

  const [dispositivos, setDispositivos] = useState({
    "ESP32-001": true,
    "ESP32-002": false,
  });

  const handleCheckboxChange = (key) => {
    setDispositivos((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      sensorId,
      tipoSensor,
      tipoMedida,
      dispositivos: Object.entries(dispositivos)
        .filter(([_, v]) => v)
        .map(([k]) => k),
    };

    console.log("Sensor:", data);
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Adicionar Sensor</h2>

        <div className="input-group">
          <label>ID SENSOR</label>
          <input
            type="text"
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
            placeholder="Ex: SENSOR-003"
            required
          />
        </div>

        <div className="input-group">
          <label>Tipo de Sensor</label>
          <select value={tipoSensor} onChange={(e) => setTipoSensor(e.target.value)}>
            <option>Umidade</option>
            <option>Temperatura</option>
            <option>Luminosidade</option>
          </select>
        </div>

        <div className="input-group">
          <label>Tipo de Medida</label>
          <select value={tipoMedida} onChange={(e) => setTipoMedida(e.target.value)}>
            <option>Porcentagem</option>
            <option>Celsius</option>
            <option>Lux</option>
          </select>
        </div>

        <div className="section">
          <span className="section-title">Dispositivo</span>
          <div className="checkbox-grid">
            {Object.entries(dispositivos).map(([key, checked]) => (
              <label key={key} className="checkbox-card">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleCheckboxChange(key)}
                />
                {key}
              </label>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">
            Adicionar
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setSensorId("");
              setTipoSensor("Umidade");
              setTipoMedida("Porcentagem");
              setDispositivos({
                "ESP32-001": true,
                "ESP32-002": false,
              });
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};