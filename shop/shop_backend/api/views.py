from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from .models import User, Group, PrizeClass, PrizeItem, TokenTransfer
from .serializers import UserSerializer, GroupSerializer, \
    PrizeClassSerializer, PrizeItemSerializer, TokenTransferSerializer
from .permissions import IsGetOrIsAdmin

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAdminUser]

class PrizeClassViewSet(viewsets.ModelViewSet):
    queryset = PrizeClass.objects.all()
    serializer_class = PrizeClassSerializer
    permission_classes = [IsGetOrIsAdmin]

    # def get(self, request, format=None):
    #     serializer = PrizeClassSerializer(queryset, context={"request": 
    #                     request}, many=True)
    #     return Response(serializer.data) 

class PrizeItemViewSet(viewsets.ModelViewSet):
    queryset = PrizeItem.objects.all()
    serializer_class = PrizeItemSerializer
    permission_classes = [permissions.IsAdminUser]

class TokenTransferViewSet(viewsets.ModelViewSet):
    queryset = TokenTransfer.objects.all()
    serializer_class = TokenTransferSerializer
    permission_classes = [permissions.IsAdminUser]
