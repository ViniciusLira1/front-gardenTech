import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/login";
import Cadastro from "./pages/cadastro";

const App = () => {
  const path = window.location.pathname;

  if (path === "/cadastro") return <Cadastro />;
  return <Login />;
};

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);