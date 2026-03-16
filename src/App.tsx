import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Cadastro from "./pages/cadastro";
import { Home } from "./pages/Home/Home";
import {AdicionarControlador} from "./pages/AdicionarControlador/AdicionarControlador"
import {AdicionarZona} from "./pages/AdicionarZona/AdicionarZona"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/adicionar-controlador" element={<AdicionarControlador />} />
        <Route path="/adicionar-zona" element={<AdicionarZona />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;