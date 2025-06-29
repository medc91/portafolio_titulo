# Generated by Django 5.2.1 on 2025-06-21 15:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0007_rename_calificacion_evaluacionclase_puntuacion_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='evaluacionclase',
            name='reserva',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='principal.reservaclase'),
        ),
        migrations.AlterUniqueTogether(
            name='evaluacionclase',
            unique_together={('reserva', 'evaluador')},
        ),
    ]
