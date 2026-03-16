import Formulario from "../../components/formulario/formulario";

export const AdicionarControlador = () => {
  // seu componente aqui

  const campos = [
    { label: "Nome do Dispositivo", name: "deviceName", type: "text" },
    { label: "Nome do WIFI", name: "wifiName", type: "text" },
    { label: "Senha WIFI", name: "wifiPassword", type: "password" },
    { label: "Token", name: "token", type: "text" }
  ];

  const handleSubmit = (data: Record<string, string>) => {
    console.log("Dados Controlador:", data);
    // Aqui você pode fazer o POST para a API ou outra lógica
  };

  return (
    <Formulario
      titulo="Adicionar Controlador"
      campos={campos}
      botaoTexto="Adicionar"
      onSubmit={handleSubmit}
      textoRodape=""
      linkRodape="#"
      linkTexto=""
    />
  );
}