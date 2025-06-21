from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path(
        "api/crear-videollamada/", views.crear_videollamada, name="crear_videollamada"
    ),
    path(
        "api/alumnos/registro/",
        views.RegistroAlumnoAPIView.as_view(),
        name="registro-alumno",
    ),
    path(
        "api/profesor/registro",
        views.RegistroProfesorAPIView.as_view(),
        name="registro-profesor",
    ),
    path("api/login/", views.login_usuario, name="login_usuario"),
    path(
        "api/profesor/<int:profesor_id>/", views.perfil_profesor, name="perfil_profesor"
    ),
    # Crear una nueva clase
    path("api/crear-clase/", views.crear_clase, name="crear_clase"),
    # Obtener clases disponibles para un profesor
    path(
        "api/profesor/<int:profesor_id>/clases-disponibles/",
        views.clases_disponibles_profesor,
        name="clases_disponibles_profesor",
    ),
    # Obtener clases reservadas para un profesor
    path(
        "api/profesor/<int:profesor_id>/clases-reservadas/",
        views.clases_reservadas,
        name="clases_reservadas",
    ),
    path(
        "api/verificar-conflictos/",
        views.verificar_conflictos,
        name="verificar_conflictos",
    ),
    path(
        "api/verificar-conflicto-horario/",
        views.verificar_conflicto_horario,
        name="verificar_conflicto_horario",
    ),
    path("api/niveles/", views.obtener_niveles, name="obtener_niveles"),
    path("api/materias/", views.obtener_materias, name="obtener_materias"),
    path("api/crear-clases/", views.crear_clases_multiples, name="crear_clases"),
    path("api/alumno/<int:alumno_id>/", views.obtener_alumno, name="obtener_alumno"),
    path(
        "api/clases-disponibles/", views.clases_disponibles, name="clases_disponibles"
    ),
    path("api/listar-profesores/", views.listar_profesores, name="listar_profesores"),
    path("api/reservar-clase/", views.reservar_clase, name="reservar_clase"),
    path(
        "api/alumno/<int:alumno_id>/clases-reservadas/",
        views.clases_reservadas_alumno,
        name="clases_reservadas_alumno",
    ),
    path("api/enviar-codigo/", views.enviar_codigo_verificacion, name="enviar_codigo"),
    path("api/verificar-codigo/", views.verificar_codigo, name="verificar_codigo"),
    path(
        "api/restablecer-contraseña/",
        views.cambiar_contraseña,
        name="restablecer_contraseña",
    ),
    path(
        "api/material/subir/", views.subir_material_clase, name="subir_material_clase"
    ),
    path(
        "api/alumno/<int:alumno_id>/materiales/",
        views.materiales_alumno,
        name="materiales_alumno",
    ),
    path(
        "api/alumno/<int:alumno_id>/historial-clases/",
        views.historial_clases_alumno,
        name="historial_clases_alumno",
    ),
    path(
        "api/profesor/<int:profesor_id>/historial-clases/",
        views.historial_clases_profesor,
        name="historial_clases_profesor",
    ),
    path("api/evaluar-clase/", views.evaluar_clase, name="evaluar-clase"),
    path(
        "api/alumno/<int:alumno_id>/comentarios-profesores/",
        views.comentarios_alumno,
        name="comentarios_alumno",
    ),
    path(
        "api/profesor/<int:profesor_id>/perfil/",
        views.perfil_profesor,
        name="perfil_profesor",
    ),
    path(
        "api/profesor/<int:profesor_id>/pagos/",
        views.pagos_profesor,
        name="pagos_profesor",
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
