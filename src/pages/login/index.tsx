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
    try {
      const response = await api.post("/api/v1/users/login", {
        email: data.email,
        senha: data.senha
      });

      console.log("LOGIN OK:", response.data);

      // 🔥 salva usuário
      localStorage.setItem("user_id", response.data.user_id);

      // 🔥 redireciona
      navigate("/");

    } catch (error: any) {
      console.error("ERRO:", error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Erro ao conectar com o servidor");
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