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
                if prize.auction:
                    maxprice = int(request.data["maxprice"])
                    auction = models.AuctionRequest.objects.filter(prize=prize, user=profile.user).first()
                    if auction:
                        auction.maxprice = maxprice
                        auction.save()
                    else:
                        models.AuctionRequest.objects.create(prize=prize, user=profile.user, maxprice=maxprice)
                else:
                    models.PrizeItem.create(prize, profile)
                    profile.tokens -= prize.price
                    prize.count -= 1
                    profile.save()
                    prize.save()
            return Response({}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error":"not authenticated"}, status=status.HTTP_400_BAD_REQUEST)

class AuctionFinishView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        with transaction.atomic():
            prize = models.PrizeClass.objects. \
                select_for_update().get(pk=request.data["id"])
            if prize.count == 0:
                return Response({"error":"not enough items"}, status=status.HTTP_400_BAD_REQUEST)
            if prize.count != 1:
                return Response({"error":"not implemented"}, status=status.HTTP_400_BAD_REQUEST)
            # select the winner
            requests = prize.auctionrequest_set.order_by("-maxprice")
            for req in requests:
                profile = req.user.userprofile
                if profile.tokens < req.maxprice:
                    continue

                item = models.PrizeItem.create(prize, profile)
                profile.tokens -= req.maxprice
                profile.save()
                prize.count -= 1
                prize.save()
                item.price = req.maxprice
                item.save()
                break

            requests.delete()
            return Response({}, status=status.HTTP_200_OK)

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

class UndoPrizeView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        if request.user.is_staff:
            with transaction.atomic():
                prizeItem = models.PrizeItem.objects. \
                    select_for_update().get(pk=request.data["id"])
                prize = models.PrizeClass.objects. \
                    select_for_update().get(pk=prizeItem.info.id)
                profile = models.Profile.objects.select_for_update(). \
                    get(user=prizeItem.owner)
                if prizeItem.date_taken:
                    return Response({"error":"already taken"}, status=status.HTTP_400_BAD_REQUEST)
                profile.tokens += prizeItem.price
                profile.save()
                prize.count += 1
                prize.save()
                prizeItem.delete()
            return Response({}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error":"not admin"}, status=status.HTTP_400_BAD_REQUEST)

class PayTokensView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        if request.user.is_staff:
            with transaction.atomic():
                tokens = request.data["tokens"]
                alltokens = 0
                for user, tok_ in tokens.items():
                    tok = 0
                    try:
                        tok = int(tok_)
                    except:
                        pass
                    alltokens += tok
                    user_id = int(user)
                    if request.user.pk == user_id:
                        return Response({"error":"can't pay to yourself"}, status=status.HTTP_400_BAD_REQUEST)
                admin = models.Profile.objects.select_for_update(). \
                    get(user=request.user)
                if alltokens > admin.tokens:
                    return Response({"error":"not enough tokens"}, status=status.HTTP_400_BAD_REQUEST)
                for user, tok_ in tokens.items():
                    tok = 0
                    try:
                        tok = int(tok_)
                    except:
                        pass
                    user_profile = models.Profile.objects.select_for_update(). \
                        get(user=user)
                    admin.tokens -= tok
                    user_profile.tokens += tok
                    admin.save()
                    user_profile.save()
                    models.TokenTransfer.create(admin.user, user_profile.user, tok)
            return Response({}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error":"not admin"}, status=status.HTTP_400_BAD_REQUEST)

class UploadUserPhoto(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        if 'file' not in request.data or 'user' not in request.data:
            raise ParseError("Empty content")
        profile = models.Profile.objects.select_for_update().get(user=request.data['user'])
        if profile is None:
            return Response({"error":"can't find user"}, status=status.HTTP_400_BAD_REQUEST)
        f = request.data['file']
        profile.picture.save(f.name, f, save=True)
        profile.save()

        return Response({}, status=status.HTTP_201_CREATED)
