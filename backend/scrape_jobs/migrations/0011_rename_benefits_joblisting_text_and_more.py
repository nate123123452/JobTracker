# Generated by Django 5.1.1 on 2024-10-26 18:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scrape_jobs', '0010_joblisting_keywords_resumelisting'),
    ]

    operations = [
        migrations.RenameField(
            model_name='joblisting',
            old_name='benefits',
            new_name='text',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='attributes',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='company',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='date_posted',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='job_description',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='location',
        ),
        migrations.RemoveField(
            model_name='joblisting',
            name='title',
        ),
        migrations.AddField(
            model_name='joblisting',
            name='job_name',
            field=models.CharField(default='N/A', max_length=255),
        ),
        migrations.AddField(
            model_name='joblisting',
            name='website',
            field=models.URLField(default='N/A'),
        ),
    ]
