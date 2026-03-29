import { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import icon from "/src/img/rosa.png";



export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="navbar">

      {/* TOPO */}
      <div className="navbar-top">
        <div className="logo-container">
         <img src={icon} className="logo-img" />
          <h2 className="logo-text">GardenTech</h2>
        </div>
        <div
          className={`hamburger ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* MENU LATERAL */}
      <div className={`menu ${open ? "open" : ""}`}>

        <Link to="/home" onClick={() => setOpen(false)}>
          Home
        </Link>

        <Link to="/monitoramento" onClick={() => setOpen(false)}>
          Monitoramento
        </Link>

        <Link to="/gerenciar" onClick={() => setOpen(false)}>
          Controladores
        </Link>

        <Link to="/agendamentos" onClick={() => setOpen(false)}>
          Agendamentos
        </Link>



      </div>
    </div>
  );
}