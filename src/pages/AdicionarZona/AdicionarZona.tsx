import { useState } from "react";
import { api } from "../../services/api";
import "./zona.css";

type CheckboxGroup = Record<string, boolean>;

export const AdicionarZona = () => {
  const [zonaNome, setZonaNome] = useState("");

  const [dispositivos, setDispositivos] = useState<CheckboxGroup>({
    "1": true,   // 🔥 agora IDs reais
    "2": false,
  });

  const [sensores, setSensores] = useState<CheckboxGroup>({
    "1": true,
    "2": false,
  });

  const handleCheckboxChange = (group: "dispositivos" | "sensores", key: string) => {
    if (group === "dispositivos") {
      setDispositivos(prev => ({ ...prev, [key]: !prev[key] }));
    } else {
      setSensores(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dispositivosSelecionados = Object.entries(dispositivos)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    const sensoresSelecionados = Object.entries(sensores)
      .filter(([_, v]) => v)
      .map(([k]) => k);

    console.log("🔥 Dados brutos:", {
      zonaNome,
      dispositivosSelecionados,
      sensoresSelecionados
    });

    if (!zonaNome) {
      alert("Nome da zona é obrigatório");
      return;
    }

    if (dispositivosSelecionados.length === 0 || sensoresSelecionados.length === 0) {
      alert("Selecione pelo menos um dispositivo e um sensor");
      return;
    }

    try {
      const response = await api.post("/api/v1/zonas/", {
        nome_zona: zonaNome,
        id_controlador: Number(dispositivosSelecionados[0]), // 🔥 pega o primeiro
        id_sensor: Number(sensoresSelecionados[0])
      });

      console.log("✅ Zona criada:", response.data);

      alert("Zona criada com sucesso!");

      // reset simples
      setZonaNome("");

    } catch (error: any) {
      console.error("❌ Erro ao criar zona:", error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Erro ao conectar com o servidor");
      }
    }
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
            placeholder="Ex: Área externa"
            required
          />
        </div>

        <div className="section">
          <span className="section-title">Dispositivos</span>
          <div className="checkbox-grid">
            {Object.entries(dispositivos).map(([key, checked]) => (
              <label key={key} className="checkbox-card">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleCheckboxChange("dispositivos", key)}
                />
                Controlador {key}
              </label>
            ))}
          </div>
        </div>

        <div className="section">
          <span className="section-title">Sensores</span>
          <div className="checkbox-grid">
            {Object.entries(sensores).map(([key, checked]) => (
              <label key={key} className="checkbox-card">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleCheckboxChange("sensores", key)}
                />
                Sensor {key}
              </label>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary">Adicionar</button>
          <button type="button" className="btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

