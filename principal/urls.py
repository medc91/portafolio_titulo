from django.urls import path
from .views import (
    crear_videollamada,
    RegistroAlumnoAPIView,
    RegistroProfesorAPIView,
    login_usuario,
)

urlpatterns = [
    path("api/crear-videollamada/", crear_videollamada, name="crear_videollamada"),
    path(
        "api/alumnos/registro/", RegistroAlumnoAPIView.as_view(), name="registro-alumno"
    ),
    path(
        "api/profesor/registro",
        RegistroProfesorAPIView.as_view(),
        name="registro-profesor",
    ),
    path("api/login/", login_usuario, name="login_usuario"),
]
