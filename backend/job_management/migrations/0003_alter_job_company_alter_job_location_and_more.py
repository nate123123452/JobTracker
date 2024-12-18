# Generated by Django 5.1.1 on 2024-11-13 23:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job_management', '0002_alter_job_company_alter_job_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='company',
            field=models.CharField(blank=True, default='N/A', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='location',
            field=models.CharField(choices=[('Remote', 'Remote'), ('Hybrid', 'Hybrid'), ('In Person', 'In Person')], default='In Person', max_length=50),
        ),
        migrations.AlterField(
            model_name='job',
            name='status',
            field=models.CharField(choices=[('Applied', 'Applied'), ('In Progress', 'In Progress'), ('Offered', 'Offered'), ('Rejected', 'Rejected')], default='In Progress', max_length=50),
        ),
        migrations.AlterField(
            model_name='job',
            name='title',
            field=models.CharField(blank=True, default='N/A', max_length=255, null=True),
        ),
    ]
