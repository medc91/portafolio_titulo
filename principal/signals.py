from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from .models import HorarioClase, ReservaClase, Alumno, Profesor


# 1. Trigger para evitar superposición de horarios de profesores
@receiver(pre_save, sender=HorarioClase)
def validar_horario_profesor(sender, instance, **kwargs):
    # Verificación mejorada
    if not instance.id:  # Es un nuevo horario
        conflicto = HorarioClase.objects.filter(
            clase__profesor=instance.clase.profesor,
            inicio__lt=instance.fin,
            fin__gt=instance.inicio,
        ).exists()
    else:  # Es una actualización
        conflicto = (
            HorarioClase.objects.filter(
                clase__profesor=instance.clase.profesor,
                inicio__lt=instance.fin,
                fin__gt=instance.inicio,
            )
            .exclude(id=instance.id)
            .exists()
        )

    if conflicto:
        raise ValidationError(
            {
                "inicio": "El profesor ya tiene una clase programada en este horario.",
                "fin": "Conflicto de horario con otra clase del profesor.",
            }
        )


# 2. Trigger para evitar superposición de reservas de alumnos
@receiver(pre_save, sender=ReservaClase)
def validar_horario_alumno(sender, instance, **kwargs):
    # Validación más robusta
    if not hasattr(instance, "horario_clase") or not instance.horario_clase:
        raise ValidationError("Debe especificar un horario de clase válido.")

    if not instance.id:  # Nueva reserva
        conflicto = ReservaClase.objects.filter(
            alumno=instance.alumno,
            horario_clase__inicio__lt=instance.horario_clase.fin,
            horario_clase__fin__gt=instance.horario_clase.inicio,
        ).exists()
    else:  # Actualización de reserva
        conflicto = (
            ReservaClase.objects.filter(
                alumno=instance.alumno,
                horario_clase__inicio__lt=instance.horario_clase.fin,
                horario_clase__fin__gt=instance.horario_clase.inicio,
            )
            .exclude(id=instance.id)
            .exists()
        )

    if conflicto:
        raise ValidationError(
            {
                "alumno": "El alumno ya tiene una reserva activa en este horario.",
                "horario_clase": "Conflicto con horario existente.",
            }
        )


@receiver(pre_save, sender=Alumno)
def validar_correo_alumno(sender, instance, **kwargs):
    if Alumno.objects.filter(correo=instance.correo).exclude(pk=instance.pk).exists():
        raise ValidationError({"correo": "Correo ya registrado como alumno"})


@receiver(pre_save, sender=Profesor)
def validar_email_profesor(sender, instance, **kwargs):
    if Profesor.objects.filter(email=instance.email).exclude(pk=instance.pk).exists():
        raise ValidationError({"email": "Email ya registrado como profesor"})
