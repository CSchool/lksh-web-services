from django.db import models
from django.contrib.auth.models import User, Group
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, related_name='userprofile', on_delete=models.CASCADE)
    tokens = models.IntegerField(_('tokens'), default=0)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class PrizeClass(models.Model):
    """
    Prizes on the shelf.
    """
    name = models.CharField(
        _('name'),
        max_length=150,
        blank=False,
    )
    description = models.CharField(
        _('description'),
        max_length=10000,
        blank=False,
    )
    price = models.IntegerField(_('price'),)
    count = models.IntegerField(_('count'),)
    picture = models.ImageField(upload_to='images/', null = True)

class PrizeItem(models.Model):
    """
    Prizes that were purchased.
    """
    price = models.IntegerField(_('price'),)
    date_purchased = models.DateTimeField(_('date_purchased'), auto_now_add=True)
    date_taken = models.DateTimeField(_('date_taken'), blank=True, null=True)
    owner = models.ForeignKey(User, related_name='items', on_delete=models.CASCADE, null=False)
    info = models.ForeignKey(PrizeClass, related_name='items', on_delete=models.CASCADE, null=False)

    class Meta:
        ordering = ['date_purchased']

class TokenTransfer(models.Model):
    """
    Token transfer transaction.
    """
    count = models.IntegerField(_('sount'),)
    created = models.DateTimeField(_('created'), auto_now_add=True)
    from_user = models.ForeignKey(User, related_name='tokens_to_users', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='tokens_from_users', on_delete=models.CASCADE)

    class Meta:
        ordering = ['created']
