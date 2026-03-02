import { useState } from "react";
import "./formulario.css";

type Campo = {
  label: string;
  name: string;
  type: string;
};

type Props = {
  titulo: string;
  campos: Campo[];
  botaoTexto: string;
  onSubmit: (data: Record<string, string>) => void;
  textoRodape: string;
  linkRodape: string;
  linkTexto: string;
};

export default function Formulario({
  titulo,
  campos,
  botaoTexto,
  onSubmit,
  textoRodape,
  linkRodape,
  linkTexto
}: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>{titulo}</h2>

        {campos.map((campo, index) => (
          <div className="input-group" key={index}>
            <label>{campo.label}</label>
            <input
              type={campo.type}
              name={campo.name}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit">{botaoTexto}</button>

        <p className="footer-text">
          {textoRodape}
          <a href={linkRodape}> {linkTexto}</a>
        </p>
      </form>
    </div>
  );
}