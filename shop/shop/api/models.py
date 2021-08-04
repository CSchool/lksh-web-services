from django.db import models
from django.contrib.auth.models import User as StdUser, Group as StdGroup
from django.utils.translation import gettext_lazy as _

class User(StdUser):
    """
    Custom user of the shop.
    """
    tokens = models.IntegerField(_('tokens'), default=0)

class Group(StdGroup):
    """
    Custom group of the shop users.
    """

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
