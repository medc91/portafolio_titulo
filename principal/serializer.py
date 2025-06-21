from rest_framework import serializers
from .models import (
    Alumno,
    Profesor,
    HoraClase,
    MaterialClase,
    ReservaClase,
    EvaluacionClase,
)
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# serializers.py


class MaterialAlumnoSerializer(serializers.ModelSerializer):
    materia = serializers.SerializerMethodField()
    profesor = serializers.SerializerMethodField()
    fecha = serializers.SerializerMethodField()
    tipo = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    clase_id = serializers.SerializerMethodField()
    descripcion = serializers.CharField()  # ← agregar esto

    class Meta:
        model = MaterialClase
        fields = [
            "materia",
            "profesor",
            "fecha",
            "tipo",
            "url",
            "clase_id",
            "descripcion",
        ]

    def get_materia(self, obj):
        return obj.reserva.hora_clase.clase.materia.nombre_materia

    def get_profesor(self, obj):
        p = obj.reserva.hora_clase.clase.profesor
        return f"{p.nombre} {p.apellido}"

    def get_fecha(self, obj):
        return obj.reserva.hora_clase.fecha.strftime("%Y-%m-%d")

    def get_tipo(self, obj):
        return "PDF" if obj.archivo else "LINK"

    def get_url(self, obj):
        return obj.archivo.url if obj.archivo else obj.link

    def get_clase_id(self, obj):  # ← nuevo método
        return obj.reserva.hora_clase.id


class HoraClaseSerializer(serializers.ModelSerializer):
    clase_id = serializers.IntegerField(source="clase.id")
    profesor = serializers.SerializerMethodField()
    materia = serializers.CharField(source="clase.materia.nombre_materia")
    nivel = serializers.CharField(source="clase.nivel.nombre_nivel")
    monto = serializers.FloatField(source="clase.monto")

    class Meta:
        model = HoraClase
        fields = [
            "id",
            "fecha",
            "inicio",
            "fin",
            "clase_id",
            "profesor",
            "materia",
            "nivel",
            "monto",
        ]

    def get_profesor(self, obj):
        return f"{obj.clase.profesor.nombre} {obj.clase.profesor.apellido}"


class AlumnoDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumno
        fields = ["id", "nombre", "apellido", "correo", "rut", "dv"]


class AlumnoSerializer(serializers.ModelSerializer):
    confirmar_password = serializers.CharField(write_only=True)

    class Meta:
        model = Alumno
        fields = [
            "nombre",
            "apellido",
            "rut",
            "dv",
            "correo",
            "password",
            "confirmar_password",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate(self, data):
        if data["password"] != data["confirmar_password"]:
            raise serializers.ValidationError(
                {"confirmar_password": "Las contraseñas no coinciden."}
            )
        return data

    def create(self, validated_data):
        validated_data.pop("confirmar_password")  # ya se validó
        password = validated_data.pop("password")
        alumno = Alumno(**validated_data)
        alumno.set_password(password)
        return alumno


class ProfesorSerializer(serializers.ModelSerializer):
    confirmar_password = serializers.CharField(write_only=True)

    class Meta:
        model = Profesor
        fields = [
            "nombre",
            "apellido",
            "rut",
            "dv",
            "email",
            "password",
            "titulo",
            "confirmar_password",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        if data["password"] != data["confirmar_password"]:
            raise serializers.ValidationError(
                {"confirmar_password": "Las contraseñas no coinciden."}
            )
        return data

    def create(self, validated_data):
        validated_data.pop("confirmar_password")  # No se guarda en la BD
        raw_password = validated_data.pop("password")
        profesor = Profesor(**validated_data)
        profesor.set_password(raw_password)
        return profesor


from rest_framework import serializers
from .models import Nivel, Materia


class NivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nivel
        fields = ["id", "nombre_nivel"]


class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = ["id", "nombre_materia"]


class HistorialClaseSerializer(serializers.ModelSerializer):
    materia = serializers.CharField(source="hora_clase.clase.materia.nombre_materia")
    profesor = serializers.SerializerMethodField()
    inicio = serializers.DateTimeField(source="hora_clase.inicio")
    fin = serializers.DateTimeField(source="hora_clase.fin")
    materiales = serializers.SerializerMethodField()

    class Meta:
        model = ReservaClase
        fields = ["materia", "profesor", "inicio", "fin", "materiales"]

    def get_profesor(self, obj):
        p = obj.hora_clase.clase.profesor
        return f"{p.nombre} {p.apellido}"

    def get_materiales(self, obj):
        materiales = obj.materiales.all()
        return [
            {
                "tipo": "PDF" if m.archivo else "LINK",
                "url": m.archivo.url if m.archivo else m.link,
                "descripcion": m.descripcion,  # 👈 nueva propiedad
            }
            for m in materiales
        ]


class HistorialClaseProfesorSerializer(serializers.ModelSerializer):
    materia = serializers.CharField(source="hora_clase.clase.materia.nombre_materia")
    alumno = serializers.SerializerMethodField()
    inicio = serializers.DateTimeField(source="hora_clase.inicio")
    fin = serializers.DateTimeField(source="hora_clase.fin")
    materiales = serializers.SerializerMethodField()

    class Meta:
        model = ReservaClase
        fields = ["materia", "alumno", "inicio", "fin", "materiales"]

    def get_alumno(self, obj):
        a = obj.alumno
        return f"{a.nombre} {a.apellido}"

    def get_materiales(self, obj):
        materiales = obj.materiales.all()
        return [
            {
                "tipo": "PDF" if m.archivo else "LINK",
                "url": m.archivo.url if m.archivo else m.link,
                "descripcion": m.descripcion,
            }
            for m in materiales
        ]


class EvaluacionClaseSerializer(serializers.ModelSerializer):
    reserva = serializers.PrimaryKeyRelatedField(queryset=ReservaClase.objects.all())

    class Meta:
        model = EvaluacionClase
        fields = "__all__"

    def validate_evaluador(self, value):
        if value not in ["alumno", "profesor"]:
            raise serializers.ValidationError("Evaluador inválido.")
        return value


class ReservaClaseAlumnoSerializer(serializers.ModelSerializer):
    fecha = serializers.DateField(source="hora_clase.fecha")
    inicio = serializers.TimeField(source="hora_clase.inicio")
    fin = serializers.TimeField(source="hora_clase.fin")
    profesor = serializers.SerializerMethodField()
    materia = serializers.CharField(source="hora_clase.clase.materia.nombre_materia")

    class Meta:
        model = ReservaClase
        fields = ["id", "fecha", "inicio", "fin", "profesor", "materia"]

    def get_profesor(self, obj):
        p = obj.hora_clase.clase.profesor
        return f"{p.nombre} {p.apellido}"
