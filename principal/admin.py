from django.contrib import admin
from .models import (
    Alumno,
    Profesor,
    Pago,
    Nivel,
    Materia,
    ProfesorMateria,
    Clase,
    HoraClase,
    ReservaClase,
    MaterialClase,
    EvaluacionClase,
    Administrador,
)

# Registra todos tus modelos aquí
admin.site.register(Alumno)
admin.site.register(Profesor)
admin.site.register(Pago)
admin.site.register(Nivel)
admin.site.register(Materia)
admin.site.register(ProfesorMateria)
admin.site.register(Clase)
admin.site.register(HoraClase)
admin.site.register(ReservaClase)
admin.site.register(MaterialClase)
admin.site.register(EvaluacionClase)
admin.site.register(Administrador)
