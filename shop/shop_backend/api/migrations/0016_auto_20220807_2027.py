# Generated by Django 3.2.6 on 2022-08-07 20:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_auto_20210811_0500'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='body',
            field=models.TextField(default='xxx'),
        ),
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(default='xxx', max_length=256),
        ),
    ]
