import Formulario from "../../components/formulario/formulario";

export default function Cadastro() {
  const campos = [
    { label: "Nome", name: "nome", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Senha", name: "senha", type: "password" },
    { label: "Confirmar Senha", name: "confirmarSenha", type: "password" }
  ];

  const handleCadastro = async (data: Record<string, string>) => {
    console.log("Cadastro:", data);
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