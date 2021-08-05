from django.shortcuts import render
from rest_framework import viewsets, views
from rest_framework.response import Response
from rest_framework import permissions
from .models import User, Group, PrizeClass, PrizeItem, TokenTransfer
from .serializers import UserSerializer, GroupSerializer, \
    PrizeClassSerializer, PrizeItemSerializer, TokenTransferSerializer
from .permissions import IsGetOrIsAdmin

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

# def update_profile(request, user_id):
#     user = User.objects.get(pk=user_id)
#     user.profile.bio = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit...'
#     user.save()

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAdminUser]

class PrizeClassViewSet(viewsets.ModelViewSet):
    queryset = PrizeClass.objects.all().filter(count__gt=0).order_by('-price')
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

class CurrentUserView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        user = UserSerializer(request.user)
        return Response(user.data)
