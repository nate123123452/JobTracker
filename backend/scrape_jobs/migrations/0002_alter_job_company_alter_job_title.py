# Generated by Django 5.1.1 on 2024-11-13 22:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scrape_jobs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='company',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='job',
            name='title',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]