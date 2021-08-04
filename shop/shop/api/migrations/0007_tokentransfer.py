# Generated by Django 3.2.6 on 2021-08-04 06:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_user_tokens'),
    ]

    operations = [
        migrations.CreateModel(
            name='TokenTransfer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField(verbose_name='sount')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('from_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tokens_to_users', to='api.user')),
                ('to_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tokens_from_users', to='api.user')),
            ],
            options={
                'ordering': ['created'],
            },
        ),
    ]
