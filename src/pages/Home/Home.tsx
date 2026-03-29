
import { FeatureCard } from "../../components/FeatureCard";

import { Cpu, Settings, Wifi } from "lucide-react";

import "./Home.css";

export const Home = () => {
  return (
    <div className="home">
      <section className="hero">

        <h1>
          Irrigação Inteligente <br />
          Automatizada com ESP32
        </h1>

        <div className="features">

          <FeatureCard
            icon={<Cpu />}
            title="ESP32 + Sensores"
            description="Monitoramento em tempo real da umidade do solo"
          />

          <FeatureCard
            icon={<Settings />}
            title="Automação Inteligente"
            description="Você dita as regras. Agende horários e repetições."
          />

          <FeatureCard
            icon={<Wifi />}
            title="Controle Remoto"
            description="Controle de qualquer lugar"
          />

        </div>

      </section>

    </div>
  );
};