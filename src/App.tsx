import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/navbar"
import Login from "./pages/login"
import Cadastro from "./pages/cadastro"
import { Home } from "./pages/Home/Home"
import {AdicionarControlador} from "./pages/AdicionarControlador/AdicionarControlador"
import {AdicionarZona} from "./pages/AdicionarZona/AdicionarZona"
import {Sensor} from "./pages/Sensor/index"
import {GerenciarDispositivos} from "./pages/Gerenciador/index"
import {Agendamentos} from "./pages/Agendamento/index"
import {Monitoramento} from "./pages/Monitoramento/index"


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/adicionar-controlador" element={<AdicionarControlador />} />
        <Route path="/adicionar-zona" element={<AdicionarZona />} />
        <Route path="/adicionar-sensor" element={<Sensor />}   />
        <Route path="/gerenciar" element={<GerenciarDispositivos />}/>
        <Route path="/agendamentos" element={<Agendamentos/>} />
        <Route path="/monitoramento" element={<Monitoramento/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;