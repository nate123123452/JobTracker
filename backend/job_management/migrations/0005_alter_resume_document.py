# Generated by Django 5.1.1 on 2024-11-21 06:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job_management', '0004_job_user_resume_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resume',
            name='document',
            field=models.FileField(null=True, upload_to='resumes'),
        ),
    ]
