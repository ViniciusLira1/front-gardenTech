import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import icon from "/src/img/rosa.png";

const LINKS = [
  { to: "/home", label: "Home" },
  { to: "/monitoramento", label: "Monitoramento" },
  { to: "/gerenciar", label: "Controladores" },
  { to: "/agendamentos", label: "Agendamentos" },
  { to: "/docs", label: "Docs" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const hidden = ["/", "/cadastro"].includes(location.pathname);
  if (hidden) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* LOGO */}
        <Link to="/home" className="logo" onClick={() => setOpen(false)}>
          <img src={icon} className="logo-img" alt="GardenTech" />
          <span className="logo-text">GardenTech</span>
        </Link>

        {/* LINKS desktop */}
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${location.pathname === l.to ? "nav-link--active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* HAMBURGER mobile */}
        <button
          className={`hamburger ${open ? "hamburger--open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* MENU MOBILE */}
      <div className={`mobile-menu ${open ? "mobile-menu--open" : ""}`}>
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`mobile-link ${location.pathname === l.to ? "mobile-link--active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
