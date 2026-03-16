import { useState } from "react";

type CheckboxGroup = Record<string, boolean>;

export const AdicionarZona = () => {
  const [zonaNome, setZonaNome] = useState("");
  const [dispositivos, setDispositivos] = useState<CheckboxGroup>({
    "ESP32-001": true,
    "ESP32-002": false,
  });
  const [sensores, setSensores] = useState<CheckboxGroup>({
    "SENSOR-001": true,
    "SENSOR-002": false,
  });

  const handleCheckboxChange = (group: "dispositivos" | "sensores", key: string) => {
    if (group === "dispositivos") {
      setDispositivos(prev => ({ ...prev, [key]: !prev[key] }));
    } else {
      setSensores(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      zonaNome,
      dispositivos: Object.entries(dispositivos)
        .filter(([_, v]) => v)
        .map(([k]) => k),
      sensores: Object.entries(sensores)
        .filter(([_, v]) => v)
        .map(([k]) => k),
    };
    console.log("Dados Zona:", data);
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Adicionar Zona</h2>

        <div className="input-group">
          <label>Nome da Zona</label>
          <input
            type="text"
            value={zonaNome}
            onChange={(e) => setZonaNome(e.target.value)}
            required
          />
        </div>

        <div className="checkbox-group">
          <label>Dispositivo</label>
          {Object.entries(dispositivos).map(([key, checked]) => (
            <label key={key} className="checkbox-label">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange("dispositivos", key)}
              />
              {key}
            </label>
          ))}
        </div>

        <div className="checkbox-group">
          <label>Sensor</label>
          {Object.entries(sensores).map(([key, checked]) => (
            <label key={key} className="checkbox-label">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleCheckboxChange("sensores", key)}
              />
              {key}
            </label>
          ))}
        </div>

        <button type="submit">Adicionar</button>
        <button type="button" onClick={() => { /* cancelar, limpar ou voltar */ }}>Cancelar</button>
      </form>
    </div>
  );
}