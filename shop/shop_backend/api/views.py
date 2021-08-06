from django.shortcuts import render
from rest_framework import generics, viewsets, views
from rest_framework.response import Response
from rest_framework import permissions
from .models import User, Group, PrizeClass, PrizeItem, TokenTransfer
from .serializers import UserSerializer, GroupSerializer, \
    PrizeClassSerializer, PrizeItemSerializer, TokenTransferSerializer
from .permissions import IsGetOrIsAdmin

class UserListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()
        group = self.request.query_params.get("group")
        if group:
            queryset = queryset.filter(groups=group)
        queryset.order_by("last_name")
        return queryset

class GroupListView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.AllowAny]


class PrizeClassViewSet(viewsets.ModelViewSet):
    queryset = PrizeClass.objects.all().filter(count__gt=0).order_by('-price')
    serializer_class = PrizeClassSerializer
    permission_classes = [IsGetOrIsAdmin]

    # def get(self, request, format=None):
    #     serializer = PrizeClassSerializer(queryset, context={"request": 
    #                     request}, many=True)
    #     return Response(serializer.data) 

class PrizeItemList(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        if request.user.is_staff:
            queryset = PrizeItem.objects.all().filter(date_taken__isnull=True)
            serializer = PrizeItemSerializer(queryset, context={"request": 
                         request}, many=True)
            return Response(serializer.data)
        elif request.user.is_authenticated:
            queryset = PrizeItem.objects.all().filter(owner=request.user)
            serializer = PrizeItemSerializer(queryset, context={"request": 
                         request}, many=True)
            return Response(serializer.data)
        else:
            return Response({"error":"not authenticated"}, status=status.HTTP_400_BAD_REQUEST)

class TokenTransferViewSet(viewsets.ModelViewSet):
    queryset = TokenTransfer.objects.all()
    serializer_class = TokenTransferSerializer
    permission_classes = [permissions.IsAdminUser]

class CurrentUserView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        user = UserSerializer(request.user)
        return Response(user.data)
