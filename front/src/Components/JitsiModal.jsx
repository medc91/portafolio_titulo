import React, { useEffect, useRef } from "react";

const JitsiModal = ({ roomName, userDisplayName, onClose }) => {
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      alert("No se pudo cargar Jitsi Meet.");
      return;
    }

    jitsiContainerRef.current.innerHTML = "";

    const domain = "meet.jit.si";
    const options = {
      roomName: roomName,
      parentNode: jitsiContainerRef.current,
      width: "100%",
      height: 600,
      configOverwrite: {
        prejoinPageEnabled: false,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      },
      userInfo: {
        displayName: userDisplayName,
      },
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    api.addListener("readyToClose", () => {
      api.dispose();
      onClose();
    });

    return () => {
      api.dispose();
    };
  }, [roomName, userDisplayName, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-5xl">
        <div ref={jitsiContainerRef} className="w-full h-[600px]" />
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default JitsiModal;
