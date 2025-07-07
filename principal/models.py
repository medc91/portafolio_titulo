import os
import magic
from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import (
    FileExtensionValidator,
    MinValueValidator,
    MaxValueValidator,
)
from django.contrib.auth.hashers import make_password


class Alumno(models.Model):
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    rut = models.IntegerField(unique=True)
    dv = models.CharField(max_length=1)
    correo = models.EmailField(max_length=45, unique=True)
    password = models.CharField(max_length=128, verbose_name="Contraseña")
    activo = models.BooleanField(
        default=True, help_text="Indica si la cuenta está habilitada"
    )
    descripcion = models.TextField(blank=True, null=True)
    foto = models.ImageField(upload_to="fotos_alumnos/", null=True, blank=True)

    class Meta:
        db_table = "alumno"
        indexes = [
            models.Index(fields=["rut"], name="idx_rut"),
        ]
        verbose_name = "Alumno"
        verbose_name_plural = "Alumnos"

    def set_password(self, raw_password):
        from django.contrib.auth.hashers import make_password

        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        """Verifica si la contraseña es correcta"""
        from django.contrib.auth.hashers import check_password

        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Pago(models.Model):
    METODO_PAGO = [
        ("EFECTIVO", "Efectivo"),
        ("TRANSFERENCIA", "Transferencia"),
        ("TARJETA", "Tarjeta"),
        ("PAYPAL", "PayPal"),
    ]

    ESTADO_PAGO = [
        ("PENDIENTE", "Pendiente"),
        ("COMPLETADO", "Completado"),
        ("RECHAZADO", "Rechazado"),
    ]

    fecha_pago = models.DateTimeField(auto_now_add=True)
    monto = models.FloatField(validators=[MinValueValidator(0)])
    metodo_pago = models.CharField(max_length=13, choices=METODO_PAGO)
    estado = models.CharField(max_length=10, choices=ESTADO_PAGO, default="PENDIENTE")

    class Meta:
        db_table = "pago"

    def __str__(self):
        return f"Pago {self.id} - {self.monto}"


class Nivel(models.Model):
    nombre_nivel = models.CharField(max_length=45, unique=True)

    class Meta:
        db_table = "nivel"

    def __str__(self):
        return self.nombre_nivel


class Materia(models.Model):
    nombre_materia = models.CharField(max_length=70, unique=True)

    class Meta:
        db_table = "materia"

    def __str__(self):
        return self.nombre_materia


def validate_pdf(file):
    # Verifica que el archivo sea un PDF usando python-magic
    file.seek(0)
    mime_type = magic.from_buffer(file.read(2048), mime=True)
    file.seek(0)

    if mime_type != "application/pdf":
        raise ValidationError("Solo se permiten archivos PDF")


def profesor_titulo_upload_path(instance, filename):
    # Genera la ruta de almacenamiento: media/profesores/titulos/<rut>/<filename>
    return os.path.join("profesores", "titulos", str(instance.rut), filename)


class Profesor(models.Model):
    nombre = models.CharField(max_length=60)
    apellido = models.CharField(max_length=60)
    rut = models.IntegerField(unique=True)
    dv = models.CharField(max_length=1)
    email = models.EmailField(max_length=45, unique=True)
    password = models.CharField(max_length=128, verbose_name="Contraseña")
    titulo = models.FileField(
        upload_to=profesor_titulo_upload_path,
        validators=[FileExtensionValidator(allowed_extensions=["pdf"]), validate_pdf],
        null=True,
        blank=True,
        verbose_name="Título PDF",
    )
    validado = models.BooleanField(
        default=False, help_text="Indica si el título fue validado por el administrador"
    )
    activo = models.BooleanField(
        default=True, help_text="Indica si puede ingresar al sistema"
    )
    descripcion = models.TextField(blank=True, null=True)
    foto = models.ImageField(upload_to="fotos_profesores/", blank=True, null=True)

    class Meta:
        db_table = "profesor"
        indexes = [
            models.Index(fields=["rut"], name="idx_profesor_rut"),
        ]
        verbose_name = "Profesor"
        verbose_name_plural = "Profesores"

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

    def clean(self):
        super().clean()
        if self.titulo:
            # Verifica nuevamente que el archivo sea PDF al validar el modelo
            try:
                validate_pdf(self.titulo)
            except ValidationError as e:
                raise ValidationError({"titulo": e.message})

    def save(self, *args, **kwargs):
        # Asegura la validación antes de guardar
        self.full_clean()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Elimina el archivo físico al eliminar el profesor
        if self.titulo:
            storage, path = self.titulo.storage, self.titulo.path
            super().delete(*args, **kwargs)
            storage.delete(path)
        else:
            super().delete(*args, **kwargs)

    def set_password(self, raw_password):
        from django.contrib.auth.hashers import make_password

        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        """Verifica si la contraseña es correcta"""
        from django.contrib.auth.hashers import check_password

        return check_password(raw_password, self.password)


class ProfesorMateria(models.Model):
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)

    class Meta:
        db_table = "profesor_materia"
        unique_together = ("profesor", "materia")
        verbose_name = "Profesor-Materia"
        verbose_name_plural = "Profesores-Materias"

    def __str__(self):
        return f"{self.profesor} - {self.materia}"


class Clase(models.Model):
    monto = models.FloatField(validators=[MinValueValidator(0)])
    duracion = models.FloatField(help_text="Duración en horas")
    profesor = models.ForeignKey(Profesor, on_delete=models.CASCADE)
    nivel = models.ForeignKey(Nivel, on_delete=models.CASCADE)
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)

    class Meta:
        db_table = "clase"
        indexes = [
            models.Index(fields=["profesor"], name="idx_clase_profesor"),
        ]
        verbose_name = "Clase"
        verbose_name_plural = "Clases"

    def __str__(self):
        return f"{self.materia} - {self.nivel}"


class HoraClase(models.Model):
    fecha = models.DateField()
    inicio = models.DateTimeField()
    fin = models.DateTimeField()
    clase = models.ForeignKey(Clase, on_delete=models.CASCADE)

    class Meta:
        db_table = "hora_clase"
        indexes = [
            models.Index(fields=["fecha", "inicio"], name="idx_fecha_inicio"),
        ]
        verbose_name = "Horario de Clase"
        verbose_name_plural = "Horarios de Clases"

    def __str__(self):
        return f"{self.clase} - {self.inicio}"


class ReservaClase(models.Model):
    pago = models.ForeignKey(Pago, on_delete=models.CASCADE)
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE)
    hora_clase = models.ForeignKey(HoraClase, on_delete=models.CASCADE)
    mensaje_alumno = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "reserva_clase"
        unique_together = ("hora_clase", "alumno")
        indexes = [
            models.Index(fields=["alumno"], name="idx_reserva_alumno"),
        ]
        verbose_name = "Reserva de Clase"
        verbose_name_plural = "Reservas de Clases"

    def __str__(self):
        return f"{self.alumno} - {self.hora_clase}"


class MaterialClase(models.Model):
    reserva = models.ForeignKey(
        ReservaClase,
        on_delete=models.CASCADE,
        related_name="materiales",  # 👈 necesario para el serializer
    )
    archivo = models.FileField(upload_to="materiales/", null=True, blank=True)
    link = models.URLField(null=True, blank=True)
    descripcion = models.TextField(blank=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "material_clase"

    def __str__(self):
        return f"Material para {self.reserva}"


class EvaluacionClase(models.Model):
    reserva = models.ForeignKey("ReservaClase", on_delete=models.CASCADE)
    evaluador = models.CharField(
        max_length=10,
        choices=[("alumno", "Alumno"), ("profesor", "Profesor")],
        default="alumno",
    )
    puntuacion = models.IntegerField()
    comentario = models.TextField(blank=True)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "evaluacion_clase"
        unique_together = ("reserva", "evaluador")  # ✅ Impide duplicados por evaluador


class Administrador(models.Model):
    nombre = models.CharField(max_length=60)
    apellido = models.CharField(max_length=60)
    correo = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

    class Meta:
        db_table = "administrador"
        verbose_name = "Administrador"
        verbose_name_plural = "Administradores"

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

    def set_password(self, raw_password):
        from django.contrib.auth.hashers import make_password

        self.password = make_password(raw_password)
        self.save()

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password

        return check_password(raw_password, self.password)


class CobroProfesor(models.Model):
    profesor = models.ForeignKey(
        Profesor, on_delete=models.CASCADE, related_name="cobros"
    )
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "cobro_profesor"  # ← Nombre fijo de la tabla
        verbose_name = "Cobro de Profesor"
        verbose_name_plural = "Cobros de Profesores"

    def __str__(self):
        return f"Cobro de {self.profesor.nombre} {self.profesor.apellido} - ${self.monto} el {self.fecha.strftime('%Y-%m-%d')}"
