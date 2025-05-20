from rest_framework import serializers
from .models import Alumno, Profesor
from django.contrib.auth.hashers import make_password


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
