import Formulario from "../../components/formulario/formulario";
import { api } from "../../services/api";

export default function Cadastro() {
  const campos = [
    { label: "Nome", name: "nome", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Senha", name: "senha", type: "password" },
    { label: "Confirmar Senha", name: "confirmarSenha", type: "password" }
  ];

  const handleCadastro = async (data: Record<string, string>) => {
    console.log("🔥 Dados cadastro:", data);

    // ✅ validação de senha
    if (data.senha !== data.confirmarSenha) {
      alert("As senhas não coincidem");
      return;
    }

    try {
      const response = await api.post("/api/v1/users/", {
        nome: data.nome,
        email: data.email,
        senha: data.senha
      });

      console.log("✅ Cadastro realizado:", response.data);

      alert("Conta criada com sucesso! Faça login.");

      // 🔥 redireciona para login
      window.location.href = "/";

    } catch (error: any) {
      console.error("❌ Erro cadastro:", error);

      if (error.response) {
        alert(error.response.data.detail);
      } else if (error.request) {
        alert("Servidor não respondeu. Verifique se a API está rodando.");
      } else {
        alert("Erro inesperado ao cadastrar.");
      }
    }
  };

  return (
    <Formulario
      titulo="Novo por aqui?"
      campos={campos}
      botaoTexto="Criar Conta"
      onSubmit={handleCadastro}
      textoRodape="Já tem uma conta?"
      linkRodape="/"
      linkTexto="Faça Login"
    />
  );
}

