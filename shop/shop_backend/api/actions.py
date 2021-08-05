from django.shortcuts import render
from django.db import transaction
from rest_framework import views
from rest_framework import status
from rest_framework.response import Response
from rest_framework import permissions
from . import models
from . import serializers

class BuyPrizeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        if request.user.is_authenticated:
            with transaction.atomic():
                prize = models.PrizeClass.objects. \
                    select_for_update().get(pk=request.data["id"])
                profile = models.Profile.objects.select_for_update(). \
                    get(user=request.user)
                if profile.tokens < prize.price:
                    return Response({"error":"not enough tokens"}, status=status.HTTP_400_BAD_REQUEST)
                if prize.count == 0:
                    return Response({"error":"not enough items"}, status=status.HTTP_400_BAD_REQUEST)
                models.PrizeItem.create(prize, profile)
                profile.tokens -= prize.price
                prize.count -= 1
                profile.save()
                prize.save()
            return Response({}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error":"not authenticated"}, status=status.HTTP_400_BAD_REQUEST)
