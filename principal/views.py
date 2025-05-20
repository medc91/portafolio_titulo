# en views.py

import requests
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializer import AlumnoSerializer, ProfesorSerializer
from django.contrib.auth.hashers import check_password
from .models import Alumno, Profesor


@api_view(["POST"])
def crear_videollamada(request):
    headers = {
        "Content-Type": "application/json",
        "x-api-key": "miclaveprivada",  # Reemplaza por tu clave real
    }

    try:
        res = requests.post("http://localhost:3001/api/videollamada", headers=headers)
        data = res.json()

        if res.status_code == 200 and data.get("success"):
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Error al crear videollamada"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegistroAlumnoAPIView(APIView):
    def post(self, request):
        serializer = AlumnoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"mensaje": "Alumno registrado exitosamente"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistroProfesorAPIView(APIView):
    def post(self, request):
        serializer = ProfesorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"mensaje": "Profesor registrado exitosamente"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login_usuario(request):
    email = request.data.get("email")
    password = request.data.get("password")

    print("Recibido:", email, password)

    # Buscar en profesores
    try:
        profesor = Profesor.objects.get(email=email)  # <-- corregido
        print("Profesor encontrado:", profesor.correo)
        if check_password(password, profesor.password):
            return Response(
                {
                    "tipo_usuario": "profesor",
                    "id": profesor.id,
                    "nombre": profesor.nombre,
                    "email": profesor.correo,
                },
                status=status.HTTP_200_OK,
            )
    except Profesor.DoesNotExist:
        print("No se encontró profesor con ese correo")

    # Buscar en alumnos
    try:
        alumno = Alumno.objects.get(correo=email)  # <-- corregido
        print("Alumno encontrado:", alumno.correo)
        if check_password(password, alumno.password):
            return Response(
                {
                    "tipo_usuario": "alumno",
                    "id": alumno.id,
                    "nombre": alumno.nombre,
                    "email": alumno.correo,
                },
                status=status.HTTP_200_OK,
            )
    except Alumno.DoesNotExist:
        print("No se encontró alumno con ese correo")

    return Response(
        {"error": "Credenciales inválidas"}, status=status.HTTP_401_UNAUTHORIZED
    )
