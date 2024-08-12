from django.contrib import admin
from . import models

admin.site.register(models.Profile)
admin.site.register(models.PrizeClass)
admin.site.register(models.PrizeItem)
admin.site.register(models.TokenTransfer)
admin.site.register(models.Post)
admin.site.register(models.Comment)
admin.site.register(models.AuctionRequest)
