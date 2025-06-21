import { useEffect } from "react";

const OneSignalInitializer = () => {
  useEffect(() => {
    // Evitar múltiples inicializaciones
    if (window.OneSignal) {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal) {
        await OneSignal.init({
          appId: "8a9157b9-a71a-4eab-825e-17245f7fdfa6", // Reemplaza con tu App ID real
          safari_web_id: null,
          notifyButton: {
            enable: true,
          },
          allowLocalhostAsSecureOrigin: true,
        });

        const tipoUsuario = localStorage.getItem("tipo_usuario"); // alumno o profesor
        const idUsuario = localStorage.getItem("id_usuario");

        if (tipoUsuario && idUsuario) {
          const externalId = `${tipoUsuario}_${idUsuario}`;
          await OneSignal.setExternalUserId(externalId);
          console.log("✅ OneSignal external_user_id asignado:", externalId);
        }
      });
    }
  }, []);

  return null; // Este componente no renderiza nada
};

export default OneSignalInitializer;
