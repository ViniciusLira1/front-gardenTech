import Formulario from "../../components/formulario/formulario";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const campos = [
    { label: "Email", name: "email", type: "email" },
    { label: "Senha", name: "senha", type: "password" }
  ];

  const handleLogin = async (data: Record<string, string>) => {
  console.log("🔥 Dados do formulário:", data);
  console.log("🌐 Base URL:", api.defaults.baseURL);

  try {
    const response = await api.post("/api/v1/users/login", {
      email: data.email,
      senha: data.senha
    });

    console.log("✅ RESPONSE COMPLETA:", response);
    console.log("✅ DATA:", response.data);

    localStorage.setItem("user_id", response.data.user_id);

    navigate("/home");

  } catch (error: any) {
    console.error("❌ ERRO COMPLETO:", error);

    if (error.response) {
      console.error("📡 RESPONSE ERROR:", error.response);
      console.error("📡 DATA:", error.response.data);
      console.error("📡 STATUS:", error.response.status);

      alert(error.response.data.detail);
    } else if (error.request) {
      console.error("📡 REQUEST (sem resposta):", error.request);
      alert("Servidor não respondeu (API offline ou URL errada)");
    } else {
      console.error("⚠️ ERRO DESCONHECIDO:", error.message);
      alert("Erro inesperado");
    }
  }
};

  return (
    <Formulario
      titulo="Login"
      campos={campos}
      botaoTexto="Entrar"
      onSubmit={handleLogin}
      textoRodape="Não tem uma conta?"
      linkRodape="/cadastro"
      linkTexto="Cadastre-se"
    />
  );
}