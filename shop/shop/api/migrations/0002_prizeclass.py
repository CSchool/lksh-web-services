# Generated by Django 3.2.6 on 2021-08-03 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PrizeClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, verbose_name='name')),
                ('description', models.CharField(max_length=10000, verbose_name='description')),
                ('price', models.IntegerField(verbose_name='price')),
                ('count', models.IntegerField(verbose_name='count')),
            ],
        ),
    ]
