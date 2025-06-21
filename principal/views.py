# en views.py
import requests
import random
from django.db.models import Q
from django.utils.timezone import now, localtime
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from .serializer import (
    AlumnoSerializer,
    ProfesorSerializer,
    NivelSerializer,
    MateriaSerializer,
    AlumnoDetalleSerializer,
    MaterialAlumnoSerializer,
    HistorialClaseSerializer,
    HistorialClaseProfesorSerializer,
    EvaluacionClaseSerializer,
    ReservaClaseAlumnoSerializer,
)
from django.contrib.auth.hashers import check_password
from .models import (
    Alumno,
    Profesor,
    Materia,
    HoraClase,
    Nivel,
    Clase,
    ReservaClase,
    HoraClase,
    Pago,
    MaterialClase,
    EvaluacionClase,
)
from datetime import datetime


# Diccionario temporal en memoria
codigos_verificacion = {}


@api_view(["POST"])
def enviar_codigo_verificacion(request):
    correo = request.data.get("correo")

    # Buscar el usuario por correo (alumno o profesor)
    usuario = (
        Alumno.objects.filter(correo=correo).first()
        or Profesor.objects.filter(email=correo).first()
    )

    if not usuario:
        return JsonResponse({"error": "Correo no encontrado."}, status=404)

    # Generar un código de 6 dígitos
    codigo = f"{random.randint(100000, 999999)}"
    codigos_verificacion[correo] = (
        codigo  # Guardar código en memoria (puedes usar caché más adelante)
    )

    # Enviar el correo
    send_mail(
        subject="Código de verificación",
        message=f"Tu código de verificación es: {codigo}",
        from_email="tucorreo@gmail.com",
        recipient_list=[correo],
        fail_silently=False,
    )

    return JsonResponse({"mensaje": "Código enviado al correo."})


@api_view(["POST"])
def verificar_codigo(request):
    correo = request.data.get("correo")
    codigo_ingresado = request.data.get("codigo")

    if not correo or not codigo_ingresado:
        return Response({"error": "Faltan datos"}, status=status.HTTP_400_BAD_REQUEST)

    codigo_almacenado = codigos_verificacion.get(correo)

    if not codigo_almacenado:
        return Response(
            {"error": "No se encontró ningún código para este correo"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if codigo_ingresado == codigo_almacenado:
        return Response({"mensaje": "Código válido"}, status=status.HTTP_200_OK)
    else:
        return Response(
            {"error": "Código incorrecto"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def cambiar_contraseña(request):
    correo = request.data.get("correo")
    nueva_contraseña = request.data.get("nueva_contraseña")
    codigo = request.data.get("codigo")

    if not correo or not nueva_contraseña or not codigo:
        return Response({"error": "Faltan datos"}, status=status.HTTP_400_BAD_REQUEST)

    codigo_almacenado = codigos_verificacion.get(correo)
    if not codigo_almacenado or codigo_almacenado != codigo:
        return Response(
            {"error": "Código inválido o expirado"}, status=status.HTTP_400_BAD_REQUEST
        )

    # Buscar en ambas tablas
    try:
        usuario = Alumno.objects.get(correo=correo)
    except Alumno.DoesNotExist:
        try:
            usuario = Profesor.objects.get(email=correo)
        except Profesor.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND
            )

    # Cambiar la contraseña
    usuario.set_password(nueva_contraseña)
    usuario.save()
    # Opcional: eliminar el código ya usado
    codigos_verificacion.pop(correo, None)

    return Response(
        {"mensaje": "Contraseña actualizada con éxito"}, status=status.HTTP_200_OK
    )


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
    email = request.data.get("email", "").strip().lower()
    password = request.data.get("password")

    print("Recibido:", email, password)

    # Buscar en profesores
    try:
        profesor = Profesor.objects.get(email=email)
        print("Profesor encontrado:", profesor.email)
        if check_password(password, profesor.password):
            return Response(
                {
                    "tipo_usuario": "profesor",
                    "id": profesor.id,
                    "nombre": profesor.nombre,
                    "email": profesor.email,
                },
                status=status.HTTP_200_OK,
            )
    except Profesor.DoesNotExist:
        print("No se encontró profesor con ese correo")

    # Buscar en alumnos
    try:
        alumno = Alumno.objects.get(correo=email)
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


from .models import Profesor, ProfesorMateria, EvaluacionClase


@api_view(["GET"])
def perfil_profesor(request, profesor_id):
    try:
        profesor = Profesor.objects.get(id=profesor_id)

        # Valoración promedio
        valoraciones = EvaluacionClase.objects.filter(
            reserva__hora_clase__clase__profesor_id=profesor_id, evaluador="alumno"
        ).values_list("puntuacion", flat=True)

        valoracion = sum(valoraciones) / len(valoraciones) if valoraciones else 0

        # Materias desde tabla intermedia
        materias = ProfesorMateria.objects.filter(profesor=profesor).select_related(
            "materia"
        )
        lista_materias = [pm.materia.nombre_materia for pm in materias]

        # Comentarios de alumnos
        comentarios = EvaluacionClase.objects.filter(
            reserva__hora_clase__clase__profesor=profesor, evaluador="alumno"
        ).values("comentario", "puntuacion")

        return Response(
            {
                "nombre": profesor.nombre,
                "apellido": profesor.apellido,
                "correo": profesor.email,
                "valoracion": round(valoracion, 2),
                "materias": lista_materias,
                "comentarios": list(comentarios),
            }
        )

    except Profesor.DoesNotExist:
        return Response({"error": "Profesor no encontrado"}, status=404)


from django.utils.timezone import make_aware


@api_view(["POST"])
def crear_clase(request):
    try:
        print("Datos recibidos en crear_clase:", request.data)

        data = request.data
        profesor = Profesor.objects.get(id=data["profesor_id"])
        materia = Materia.objects.get(id=data["materia_id"])
        nivel = Nivel.objects.get(id=data["nivel_id"])

        clase = Clase.objects.create(
            monto=data["monto"],
            duracion=data["duracion"],
            profesor=profesor,
            nivel=nivel,
            materia=materia,
        )

        # Convertir a timezone-aware
        inicio = make_aware(datetime.fromisoformat(data["inicio"]))
        fin = make_aware(datetime.fromisoformat(data["fin"]))

        HoraClase.objects.create(
            clase=clase, fecha=data["fecha"], inicio=inicio, fin=fin
        )

        return Response(
            {"mensaje": "Clase y horario creados correctamente."}, status=201
        )

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
def clases_disponibles_profesor(request, profesor_id):
    clases = HoraClase.objects.filter(clase__profesor_id=profesor_id).exclude(
        id__in=ReservaClase.objects.values_list("hora_clase_id", flat=True)
    )

    data = [
        {
            "hora_clase_id": hc.id,  # <--- Cambio aquí
            "fecha": hc.fecha,
            "inicio": localtime(hc.inicio),
            "fin": localtime(hc.fin),
            "materia": hc.clase.materia.nombre_materia,
            "nivel": hc.clase.nivel.nombre_nivel,
            "monto": hc.clase.monto,
        }
        for hc in clases
    ]
    return Response(data)


@api_view(["GET"])
def clases_reservadas(request, profesor_id):
    reservas = (
        ReservaClase.objects.filter(hora_clase__clase__profesor_id=profesor_id)
        .select_related(
            "hora_clase__clase__materia",
            "hora_clase__clase__nivel",
            "hora_clase__clase__profesor",
            "alumno",
        )
        .order_by("hora_clase__fecha", "hora_clase__inicio")
    )

    data = []
    for r in reservas:
        data.append(
            {
                "reserva_id": r.id,
                "fecha": r.hora_clase.fecha,
                "inicio": localtime(r.hora_clase.inicio),
                "fin": localtime(r.hora_clase.fin),
                "materia": r.hora_clase.clase.materia.nombre_materia,
                "nivel": r.hora_clase.clase.nivel.nombre_nivel,
                "alumno": f"{r.alumno.nombre} {r.alumno.apellido}",
                "correo_alumno": r.alumno.correo,
                "videollamada_id": r.hora_clase.id,
                "mensaje_alumno": r.mensaje_alumno or "",  # ✅ agregado aquí
            }
        )

    return Response(data)


@api_view(["POST"])
def verificar_conflictos(request):
    try:
        profesor_id = request.data.get("profesor_id")
        bloques = request.data.get("bloques", [])

        if not profesor_id or not bloques:
            return Response(
                {"error": "Datos incompletos"}, status=status.HTTP_400_BAD_REQUEST
            )

        conflictos = []
        for bloque in bloques:
            inicio_str = bloque.get("inicio")
            fin_str = bloque.get("fin")

            if not inicio_str or not fin_str:
                conflictos.append(
                    {"inicio": inicio_str, "fin": fin_str, "conflicto": True}
                )
                continue

            inicio = datetime.fromisoformat(inicio_str)
            fin = datetime.fromisoformat(fin_str)

            existe_conflicto = HoraClase.objects.filter(
                clase__profesor_id=profesor_id, inicio__lt=fin, fin__gt=inicio
            ).exists()

            conflictos.append(
                {"inicio": inicio_str, "fin": fin_str, "conflicto": existe_conflicto}
            )

        return Response({"conflictos": conflictos})

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def verificar_conflicto_horario(request):
    try:
        profesor_id = request.data.get("profesor_id")
        fecha = request.data.get("fecha")
        inicio = request.data.get("inicio")
        fin = request.data.get("fin")

        # Validaciones básicas
        if not all([profesor_id, fecha, inicio, fin]):
            return Response({"error": "Faltan datos"}, status=400)

        profesor = Profesor.objects.get(id=profesor_id)

        fecha_dt = datetime.strptime(fecha, "%Y-%m-%d")
        inicio_dt = datetime.strptime(inicio, "%H:%M").time()
        fin_dt = datetime.strptime(fin, "%H:%M").time()

        inicio_final = datetime.combine(fecha_dt, inicio_dt)
        fin_final = datetime.combine(fecha_dt, fin_dt)

        conflicto = HoraClase.objects.filter(
            clase__profesor=profesor,
            inicio__lt=fin_final,
            fin__gt=inicio_final,
        ).exists()

        return Response({"conflicto": conflicto})

    except Profesor.DoesNotExist:
        return Response({"error": "Profesor no encontrado"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def obtener_niveles(request):
    niveles = Nivel.objects.all()
    serializer = NivelSerializer(niveles, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def obtener_materias(request):
    materias = Materia.objects.all()
    serializer = MateriaSerializer(materias, many=True)
    return Response(serializer.data)


from django.utils.timezone import make_aware


@api_view(["POST"])
def crear_clases_multiples(request):
    try:
        clases = request.data.get("clases", [])
        if not clases:
            return Response({"error": "No se recibieron clases"}, status=400)

        for clase_data in clases:
            profesor = Profesor.objects.get(id=clase_data["profesor_id"])
            materia = Materia.objects.get(id=clase_data["materia_id"])
            nivel = Nivel.objects.get(id=clase_data["nivel_id"])

            inicio_dt = make_aware(
                datetime.strptime(
                    f"{clase_data['fecha']} {clase_data['hora_inicio']}",
                    "%Y-%m-%d %H:%M",
                )
            )
            fin_dt = make_aware(
                datetime.strptime(
                    f"{clase_data['fecha']} {clase_data['hora_fin']}", "%Y-%m-%d %H:%M"
                )
            )

            clase = Clase.objects.create(
                monto=clase_data["monto"],
                duracion=(fin_dt - inicio_dt).seconds // 60,
                profesor=profesor,
                nivel=nivel,
                materia=materia,
            )

            HoraClase.objects.create(
                clase=clase,
                fecha=clase_data["fecha"],
                inicio=inicio_dt,
                fin=fin_dt,
            )

        return Response({"mensaje": "Clases creadas exitosamente"}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
def obtener_alumno(request, alumno_id):
    try:
        alumno = Alumno.objects.get(pk=alumno_id)
        serializer = AlumnoDetalleSerializer(alumno)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Alumno.DoesNotExist:
        return Response(
            {"error": "Alumno no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["GET"])
def clases_disponibles(request):
    nivel = request.GET.get("nivel")
    materia = request.GET.get("materia")
    profesor_nombre = request.GET.get("profesor_nombre", "").lower()

    clases_reservadas = ReservaClase.objects.values_list("hora_clase_id", flat=True)

    horas = HoraClase.objects.exclude(id__in=clases_reservadas).select_related(
        "clase__profesor", "clase__materia", "clase__nivel"
    )

    if nivel:
        horas = horas.filter(clase__nivel__id=nivel)
    if materia:
        horas = horas.filter(clase__materia__id=materia)
    if profesor_nombre:
        horas = horas.filter(
            Q(clase__profesor__nombre__icontains=profesor_nombre)
            | Q(clase__profesor__apellido__icontains=profesor_nombre)
        )

    data = []
    for hc in horas:
        data.append(
            {
                "id": hc.id,
                "fecha": hc.fecha,
                "inicio": localtime(hc.inicio),
                "fin": localtime(hc.fin),
                "materia": hc.clase.materia.nombre_materia,
                "nivel": hc.clase.nivel.nombre_nivel,
                "monto": hc.clase.monto,
                "profesor": f"{hc.clase.profesor.nombre} {hc.clase.profesor.apellido}",
            }
        )

    return Response(data)


@api_view(["GET"])
def listar_profesores(request):
    query = request.GET.get("q", "").lower()

    profesores = Profesor.objects.all()

    if query:
        profesores = profesores.filter(
            Q(nombre__icontains=query) | Q(apellido__icontains=query)
        )

    data = [
        {"id": p.id, "nombre_completo": f"{p.nombre} {p.apellido}"} for p in profesores
    ]
    return Response(data)


@api_view(["POST"])
def reservar_clase(request):
    try:
        alumno_id = request.data.get("alumno_id")
        hora_clase_id = request.data.get("hora_clase_id")
        mensaje_alumno = request.data.get("mensaje_alumno", "")

        alumno = Alumno.objects.get(id=alumno_id)
        hora_clase = HoraClase.objects.select_related("clase", "clase__profesor").get(
            id=hora_clase_id
        )

        # Verificar si ya fue reservada
        if ReservaClase.objects.filter(hora_clase=hora_clase).exists():
            return Response(
                {"error": "La clase ya ha sido reservada."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        pago = Pago.objects.create(
            monto=hora_clase.clase.monto,
            metodo_pago="TRANSFERENCIA",
            estado="COMPLETADO",
            fecha_pago=now(),
        )

        reserva = ReservaClase.objects.create(
            alumno=alumno,
            hora_clase=hora_clase,
            mensaje_alumno=mensaje_alumno,
            pago=pago,
        )

        # --- Envío de correo ----
        send_mail(
            subject="Confirmación de Reserva Aula Global",
            message=f"Hola {alumno.nombre}, has reservado una clase con el profesor {hora_clase.clase.profesor.nombre} el día {hora_clase.fecha} a las {hora_clase.inicio.strftime('%H:%M')}.",
            from_email="portafolio.titulo2025@gmail.com",  # Debe estar configurado en Django settings
            recipient_list=[alumno.correo],
            fail_silently=False,
        )

        return Response(
            {"message": "Clase reservada con éxito."}, status=status.HTTP_201_CREATED
        )

    except Exception as e:
        print("ERROR:", str(e))
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def clases_reservadas_alumno(request, alumno_id):
    ahora_local = localtime(now())  # Convertimos ahora a hora local
    reservas = (
        ReservaClase.objects.filter(alumno_id=alumno_id)
        .select_related(
            "hora_clase__clase__profesor", "hora_clase__clase__materia"
        )  # ✅ importante agregar materia aquí
        .order_by("hora_clase__fecha", "hora_clase__inicio")
    )

    data = []
    for r in reservas:
        inicio_local = localtime(r.hora_clase.inicio)
        if inicio_local > ahora_local:  # Comparación coherente
            data.append(
                {
                    "inicio": inicio_local,
                    "profesor": f"{r.hora_clase.clase.profesor.nombre} {r.hora_clase.clase.profesor.apellido}",
                    "videollamada_id": r.hora_clase.id,
                    "materia": r.hora_clase.clase.materia.nombre_materia,
                    "reserva_id": r.id,  # ✅ necesario para la evaluación
                }
            )

    return Response(data)


@api_view(["POST"])
def subir_material_clase(request):
    try:
        print("DATA:", request.data)
        print("FILES:", request.FILES)

        reserva_id = request.data.get("reserva_id")
        archivo = request.FILES.get("archivo")
        link = request.data.get("link")
        descripcion = request.data.get("descripcion", "")

        if not archivo and not link:
            return Response(
                {"error": "Debes subir un archivo o un enlace."}, status=400
            )

        reserva = ReservaClase.objects.get(id=reserva_id)

        material = MaterialClase.objects.create(
            reserva=reserva,
            archivo=archivo,
            link=link,
            descripcion=descripcion,
        )

        return Response({"mensaje": "Material subido correctamente"}, status=201)
    except Exception as e:
        print("ERROR:", str(e))
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
def materiales_alumno(request, alumno_id):
    try:
        materiales = MaterialClase.objects.filter(
            reserva__alumno_id=alumno_id
        ).select_related(
            "reserva__hora_clase__clase__materia",
            "reserva__hora_clase__clase__profesor",
        )

        serializer = MaterialAlumnoSerializer(materiales, many=True)
        return Response(serializer.data)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
def historial_clases_alumno(request, alumno_id):
    reservas_finalizadas = (
        ReservaClase.objects.filter(alumno_id=alumno_id, hora_clase__inicio__lt=now())
        .select_related("hora_clase__clase__materia", "hora_clase__clase__profesor")
        .prefetch_related("materiales")
        .order_by("-hora_clase__inicio")
    )  # 👈 aquí se ordena por fecha descendente

    serializer = HistorialClaseSerializer(reservas_finalizadas, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def historial_clases_profesor(request, profesor_id):
    reservas_finalizadas = (
        ReservaClase.objects.filter(
            hora_clase__clase__profesor_id=profesor_id, hora_clase__inicio__lt=now()
        )
        .select_related("alumno", "hora_clase__clase__materia")
        .prefetch_related("materiales")
        .order_by("-hora_clase__inicio")
    )

    serializer = HistorialClaseProfesorSerializer(reservas_finalizadas, many=True)
    return Response(serializer.data)


import json


@api_view(["POST"])
def evaluar_clase(request):
    try:
        # ✅ Leer el body primero
        raw_body = request.body.decode("utf-8")
        try:
            json_data = json.loads(raw_body)
        except json.JSONDecodeError:
            return Response({"error": "JSON inválido"}, status=400)

        # 🧪 Imprimir qué llega
        print("🟢 JSON recibido:", json_data)

        # ✅ Preparar serializer
        serializer = EvaluacionClaseSerializer(data=json_data)

        if serializer.is_valid():
            reserva = serializer.validated_data.get("reserva")
            evaluador = serializer.validated_data.get("evaluador")

            if not reserva:
                return Response(
                    {"error": "Reserva no proporcionada o inválida."}, status=400
                )

            if EvaluacionClase.objects.filter(
                reserva_id=reserva.id, evaluador=evaluador
            ).exists():
                return Response({"error": "Esta clase ya fue evaluada."}, status=400)

            serializer.save()
            return Response(
                {"mensaje": "Evaluación guardada correctamente."}, status=201
            )

        print("Errores del serializer:", serializer.errors)
        return Response(serializer.errors, status=400)

    except Exception as e:
        print("❌ Error inesperado:", str(e))
        return Response({"error": "Error interno"}, status=500)


@api_view(["GET"])
def comentarios_alumno(request, alumno_id):
    evaluaciones = EvaluacionClase.objects.filter(
        reserva__alumno_id=alumno_id, evaluador="profesor"
    ).select_related("reserva__hora_clase__clase__profesor")

    data = [
        {
            "comentario": e.comentario,
            "puntuacion": e.puntuacion,
            "profesor": f"{e.reserva.hora_clase.clase.profesor.nombre} {e.reserva.hora_clase.clase.profesor.apellido}",
        }
        for e in evaluaciones
    ]
    return Response(data)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ReservaClase
from django.db.models import Sum
from django.utils.timezone import localtime


@api_view(["GET"])
def pagos_profesor(request, profesor_id):
    reservas = ReservaClase.objects.filter(
        hora_clase__clase__profesor_id=profesor_id, pago__estado="COMPLETADO"
    ).select_related("pago", "alumno", "hora_clase")

    pagos_data = []
    total_mes = 0

    for reserva in reservas:
        pago = reserva.pago
        fecha_pago_local = localtime(pago.fecha_pago)
        pagos_data.append(
            {
                "fecha_pago": fecha_pago_local.strftime("%d/%m/%Y"),
                "alumno": str(reserva.alumno),
                "monto": pago.monto,
            }
        )

        # Suma solo si es del mes actual
        if (
            fecha_pago_local.month == localtime().month
            and fecha_pago_local.year == localtime().year
        ):
            total_mes += pago.monto

    return Response({"pagos": pagos_data, "total_mes": total_mes})
