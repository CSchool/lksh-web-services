# Generated by Django 3.2.6 on 2021-08-11 05:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_comment_post'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comment',
            options={'ordering': ['-created']},
        ),
        migrations.AlterModelOptions(
            name='post',
            options={'ordering': ['-created']},
        ),
    ]