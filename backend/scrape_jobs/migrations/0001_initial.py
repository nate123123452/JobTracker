# Generated by Django 5.1.1 on 2024-11-11 18:19

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company', models.CharField(max_length=255)),
                ('title', models.CharField(max_length=255)),
                ('status', models.CharField(choices=[('Applied', 'Applied'), ('In Progress', 'In Progress'), ('Offered', 'Offered'), ('Rejected', 'Rejected')], max_length=50)),
                ('site', models.URLField(blank=True, null=True)),
                ('applied_date', models.DateField(blank=True, null=True)),
                ('location', models.CharField(choices=[('Remote', 'Remote'), ('Hybrid', 'Hybrid'), ('In Person', 'In Person')], max_length=50)),
                ('notes', models.TextField(blank=True, null=True)),
                ('interview_dates', models.JSONField(default=list, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Resume',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(default='N/A', max_length=255)),
                ('upload_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('description', models.TextField(blank=True, default='N/A', null=True)),
                ('document', models.FileField(null=True, upload_to='resumes/')),
            ],
        ),
    ]