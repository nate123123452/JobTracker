# Generated by Django 5.1.1 on 2024-10-27 05:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scrape_jobs', '0011_rename_benefits_joblisting_text_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='joblisting',
            name='keywords',
        ),
        migrations.RemoveField(
            model_name='resumelisting',
            name='keywords',
        ),
        migrations.AddField(
            model_name='joblisting',
            name='keywords',
            field=models.TextField(default=''),
        ),
        migrations.DeleteModel(
            name='Keyword',
        ),
        migrations.AddField(
            model_name='resumelisting',
            name='keywords',
            field=models.TextField(default=''),
        ),
    ]