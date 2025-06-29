# Generated by Django 5.2.1 on 2025-06-14 15:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('principal', '0006_evaluacionclase'),
    ]

    operations = [
        migrations.RenameField(
            model_name='evaluacionclase',
            old_name='calificacion',
            new_name='puntuacion',
        ),
        migrations.AddField(
            model_name='evaluacionclase',
            name='evaluador',
            field=models.CharField(choices=[('alumno', 'Alumno'), ('profesor', 'Profesor')], default='alumno', max_length=10),
        ),
        migrations.AlterField(
            model_name='evaluacionclase',
            name='reserva',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='principal.reservaclase'),
        ),
    ]
