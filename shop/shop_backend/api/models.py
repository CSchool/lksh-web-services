from django.db import models
from django.contrib.auth.models import User, Group
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, related_name='userprofile', on_delete=models.CASCADE)
    tokens = models.IntegerField(_('tokens'), default=0)
    picture = models.ImageField(upload_to='images/', null = True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()


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
    given_by = models.ForeignKey(User, related_name='given', on_delete=models.CASCADE, null=True)
    info = models.ForeignKey(PrizeClass, related_name='items', on_delete=models.CASCADE, null=False)

    class Meta:
        ordering = ['date_purchased']

    @classmethod
    def create(cls, prize, profile):
        item = cls()
        item.owner = profile.user
        item.info = prize
        item.price = prize.price
        item.save()
        return item

class TokenTransfer(models.Model):
    """
    Token transfer transaction.
    """
    count = models.IntegerField(_('count'),)
    created = models.DateTimeField(_('created'), auto_now_add=True)
    from_user = models.ForeignKey(User, related_name='tokens_to_users', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='tokens_from_users', on_delete=models.CASCADE)

    class Meta:
        ordering = ['created']

    @classmethod
    def create(cls, from_user, to_user, tokens):
        item = cls()
        item.count = tokens
        item.from_user = from_user
        item.to_user = to_user
        item.save()
        return item
