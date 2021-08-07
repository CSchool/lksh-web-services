from django.utils import timezone
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

class GivePrizeView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        if request.user.is_staff:
            with transaction.atomic():
                prize = models.PrizeItem.objects. \
                    select_for_update().get(pk=request.data["id"])
                if prize.date_taken:
                    return Response({"error":"already taken"}, status=status.HTTP_400_BAD_REQUEST)
                prize.given_by = request.user
                prize.save()
                prize.date_taken = timezone.now()
                prize.save()
            return Response({}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error":"not admin"}, status=status.HTTP_400_BAD_REQUEST)

class PayTokensView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        if request.user.is_staff:
            if request.user.pk == request.data["user"]:
                return Response({"error":"can't pay to yourself"}, status=status.HTTP_400_BAD_REQUEST)
            with transaction.atomic():
                profile = models.Profile.objects.select_for_update(). \
                    get(user=request.user)
                user_profile = models.Profile.objects.select_for_update(). \
                    get(user=request.data["user"])
                tokens = request.data["tokens"]
                if tokens > profile.tokens:
                    return Response({"error":"not enough tokens"}, status=status.HTTP_400_BAD_REQUEST)
                profile.tokens -= tokens
                user_profile.tokens += tokens
                profile.save()
                user_profile.save()
                models.TokenTransfer.create(profile.user, user_profile.user, tokens)
            return Response({}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error":"not admin"}, status=status.HTTP_400_BAD_REQUEST)
