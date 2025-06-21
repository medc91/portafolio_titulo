// src/components/PreguntasFrecuentes.jsx
import React from "react";

const PreguntasFrecuentes = () => {
  return (
    <section className="bg-emerald-50 py-10 px-6 sm:px-10" data-aos="fade-up">
      <h2 className="text-3xl font-bold text-center text-emerald-600 mb-8">
        Preguntas Frecuentes
      </h2>
      <div className="max-w-4xl mx-auto space-y-6">
        <details className="bg-white p-4 rounded shadow cursor-pointer">
          <summary className="font-semibold text-emerald-700 cursor-pointer">
            ¿Cómo me registro como alumno o profesor?
          </summary>
          <p className="text-gray-700 mt-2">
            Haz clic en "Crear Perfil" en el menú superior y elige la opción
            correspondiente. Luego completa el formulario de registro.
          </p>
        </details>
        <details className="bg-white p-4 rounded shadow cursor-pointer">
          <summary className="font-semibold text-emerald-700 cursor-pointer">
            ¿Qué métodos de pago se aceptan?
          </summary>
          <p className="text-gray-700 mt-2">
            Actualmente aceptamos pagos con tarjetas de crédito, débito, WebPay
            y próximamente PayPal.
          </p>
        </details>
        <details className="bg-white p-4 rounded shadow cursor-pointer">
          <summary className="font-semibold text-emerald-700 cursor-pointer">
            ¿Puedo cancelar o reagendar una clase?
          </summary>
          <p className="text-gray-700 mt-2">
            Sí, puedes cancelar o reprogramar una clase desde tu perfil hasta 12
            horas antes del inicio.
          </p>
        </details>
      </div>
    </section>
  );
};

export default PreguntasFrecuentes;
