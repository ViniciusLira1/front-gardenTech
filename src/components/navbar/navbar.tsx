import "./Navbar.css";

interface NavbarProps {
  onLogin?: () => void;
  onRegister?: () => void;
}

export const Navbar = ({ onLogin, onRegister }: NavbarProps) => {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <div className="logo">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">GardenTech</span>
        </div>

        <div className="nav-actions">
          <button className="btn btn-login" onClick={onLogin}>
            Login
          </button>

          <button className="btn btn-register" onClick={onRegister}>
            Criar Conta
          </button>
        </div>

      </div>
    </header>
  );
};