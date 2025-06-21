import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonios = [
  {
    mensaje:
      "Gracias a Aula Global pude preparar mis exámenes con la ayuda de profesores increíbles. ¡Altamente recomendado!",
    autor: "Camila, Alumna",
  },
  {
    mensaje:
      "Después de jubilarme encontré en Aula Global una nueva forma de enseñar y ayudar a otros. Ha sido muy gratificante.",
    autor: "Jorge, Profesor",
  },
  {
    mensaje:
      "Excelente plataforma, fácil de usar y con gran variedad de profesores. Me ayudó a mejorar mis notas rápidamente.",
    autor: "Laura, Alumna",
  },
];

const TestimoniosCarrusel = () => {
  return (
    <section className="p-10 bg-emerald-50">
      <h2 className="text-3xl font-bold text-center text-emerald-600 mb-6">
        Lo que dicen nuestros usuarios
      </h2>
      <div className="max-w-3xl mx-auto">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          loop={true}
        >
          {testimonios.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-700 italic mb-4">“{t.mensaje}”</p>
                <p className="font-semibold text-emerald-700">— {t.autor}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimoniosCarrusel;
