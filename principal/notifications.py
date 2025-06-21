import requests
from django.conf import settings


def enviar_notificacion_push(titulo, mensaje, user_ids):
    headers = {
        "Authorization": f"Bearer {settings.ONESIGNAL_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "app_id": settings.ONESIGNAL_APP_ID,
        "include_external_user_ids": user_ids,
        "headings": {"en": titulo},
        "contents": {"en": mensaje},
    }

    response = requests.post(
        "https://onesignal.com/api/v1/notifications", json=payload, headers=headers
    )
    return response.json()
