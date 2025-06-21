import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import TestimoniosCarrusel from "./TestimoniosCarrusel";

import imgAprende from "../assets/images/aprende-a-tu-ritmo.png";
import imgVerificados from "../assets/images/profesores-verificados.png";
import imgRetirados from "../assets/images/profesores-retirados.png";

import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const HomePage = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between p-4 shadow-md bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Aula Global" className="h-10" />
          <span className="text-2xl font-bold text-emerald-600">
            Aula Global
          </span>
        </div>

        <nav className="flex gap-4 relative">
          <div className="relative">
            <button
              onClick={() => setMostrarMenu(!mostrarMenu)}
              className="text-white bg-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-600"
            >
              Crear Perfil
            </button>
            {mostrarMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <button
                  onClick={() => (window.location.href = "/registro-alumno")}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-100"
                >
                  👨‍🎓 Alumno
                </button>
                <button
                  onClick={() => (window.location.href = "/registro-profesor")}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-100"
                >
                  👨‍🏫 Profesor
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => (window.location.href = "/login")}
            className="text-emerald-600 border border-emerald-500 px-4 py-2 rounded-lg hover:bg-emerald-50"
          >
            Iniciar Sesión
          </button>
        </nav>
      </header>

      {/* Carrusel */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="w-full h-[400px] max-w-screen-xl mx-auto"
      >
        {[imgAprende, imgVerificados, imgRetirados].map((img, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-[400px] flex items-center justify-center bg-white">
              <img
                src={img}
                alt={`slide-${i}`}
                className="w-full h-[400px] object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ¿Quiénes somos? */}
      <section className="p-10 bg-white">
        <h2 className="text-3xl font-bold text-center text-emerald-600 mb-6">
          ¿Quiénes somos?
        </h2>
        <p className="text-center max-w-3xl mx-auto text-gray-700">
          Aula Global es una plataforma dedicada a ofrecer clases particulares
          en línea, conectando a estudiantes con profesores altamente
          calificados. Nuestro objetivo es facilitar el aprendizaje
          personalizado desde cualquier lugar.
        </p>
      </section>

      {/* Misión */}
      <section className="p-10 bg-emerald-50">
        <h2 className="text-3xl font-bold text-center text-emerald-600 mb-6">
          Nuestra Misión
        </h2>
        <p className="text-center max-w-3xl mx-auto text-gray-800 text-lg">
          Brindar acceso a educación de calidad, personalizada y flexible a
          estudiantes de todas las edades, mientras empoderamos a profesores con
          vocación para enseñar desde cualquier lugar. En Aula Global, creemos
          que el conocimiento transforma vidas, y nuestra misión es facilitar
          esa transformación.
        </p>
      </section>

      {/* Testimonios */}
      <TestimoniosCarrusel />

      {/* Contáctanos */}
      <section className="p-10 bg-white">
        <h2 className="text-3xl font-bold text-center text-emerald-600 mb-6">
          Contáctanos
        </h2>
        <form className="max-w-xl mx-auto grid gap-4">
          <input
            type="text"
            placeholder="Nombre"
            className="p-3 border rounded"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="p-3 border rounded"
          />
          <textarea
            rows="4"
            placeholder="Mensaje"
            className="p-3 border rounded"
          />
          <button className="bg-emerald-500 text-white py-2 rounded hover:bg-emerald-600">
            Enviar
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-600 text-white py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold mb-2">Aula Global</h3>
          <p className="text-sm mb-4">
            © {new Date().getFullYear()} Todos los derechos reservados
          </p>
          <div className="flex justify-center space-x-4 text-lg">
            <a
              href="#"
              className="hover:text-emerald-300"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="hover:text-emerald-300"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="hover:text-emerald-300"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
