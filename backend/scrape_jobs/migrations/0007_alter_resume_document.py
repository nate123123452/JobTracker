# Generated by Django 5.1.1 on 2024-11-22 05:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scrape_jobs', '0006_alter_resume_document'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resume',
            name='document',
            field=models.FileField(default=1, upload_to='resumes/'),
            preserve_default=False,
        ),
    ]
