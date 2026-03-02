import Formulario from "../../components/formulario/formulario";

export default function Login() {
  const campos = [
    { label: "Email", name: "email", type: "email" },
    { label: "Senha", name: "senha", type: "password" }
  ];

  const handleLogin = async (data: Record<string, string>) => {
    console.log("Login:", data);
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