
import Formulario from "../../components/formulario/formulario";
import { api } from "../../services/api";

export const AdicionarControlador = () => {

  const campos = [
    { label: "Nome do Dispositivo", name: "deviceName", type: "text" },
    { label: "Nome do WIFI", name: "wifiName", type: "text" },
    { label: "Senha WIFI", name: "wifiPassword", type: "password" },
    { label: "Token", name: "token", type: "text" }
  ];

  const handleSubmit = async (data: Record<string, string>) => {
    console.log("🔥 Dados Controlador:", data);

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert("Usuário não autenticado");
      return;
    }

    try {
      // ✅ 1. Criar controlador
      const response = await api.post("/api/v1/controladores/", {
        nome: data.deviceName,
        id_usuario: Number(userId)
      });

      console.log("✅ Controlador criado:", response.data);

      const controladorId = response.data.id_controlador;

      // ✅ 2. Configurar Wi-Fi (opcional)
      if (data.wifiName && data.wifiPassword) {
        await api.post(
          `/api/v1/controladores/${controladorId}/wifi`,
          null,
          {
            params: {
              ssid: data.wifiName,
              senha: data.wifiPassword
            }
          }
        );

        console.log("📡 Wi-Fi configurado");
      }

      alert("Controlador adicionado com sucesso!");

    } catch (error: any) {
      console.error("❌ Erro:", error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Erro ao conectar com o servidor");
      }
    }
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
};
