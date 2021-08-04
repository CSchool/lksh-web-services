from django.contrib import admin
from . import models

admin.site.register(models.User)
admin.site.register(models.PrizeClass)
admin.site.register(models.PrizeItem)
admin.site.register(models.TokenTransfer)
