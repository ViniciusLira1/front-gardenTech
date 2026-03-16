import "./FeatureCard.css";
import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        {icon}
      </div>

      <h3 className="feature-title">{title}</h3>

      <p className="feature-description">
        {description}
      </p>
    </div>
  );
};