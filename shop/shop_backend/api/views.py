from django.shortcuts import render
from rest_framework import generics, viewsets, views
from rest_framework.response import Response
from rest_framework import permissions
from . import models
from . import serializers
from .permissions import IsGetOrIsAdmin, IsOwnerOrReadOnly

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = serializers.UserSerializer
    queryset = models.User.objects.all()

    def list(self, request):
        queryset = models.User.objects.all()
        group = self.request.query_params.get("group")
        if group:
            queryset = queryset.filter(groups=group)
        queryset.order_by("last_name")
        serializer = serializers.UserSerializer(queryset, context={"request": 
                        request}, many=True)
        return Response(serializer.data)

class GroupListView(generics.ListAPIView):
    queryset = models.Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.AllowAny]


class PrizeClassViewSet(viewsets.ModelViewSet):
    queryset = models.PrizeClass.objects.all().filter(count__gt=0).order_by('-price')
    serializer_class = serializers.PrizeClassSerializer
    permission_classes = [IsGetOrIsAdmin]

    # def get(self, request, format=None):
    #     serializer = PrizeClassSerializer(queryset, context={"request": 
    #                     request}, many=True)
    #     return Response(serializer.data) 

class PrizeItemList(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        if request.user.is_staff:
            queryset = models.PrizeItem.objects.all().filter(date_taken__isnull=True)
            serializer = serializers.PrizeItemSerializer(queryset, context={"request": 
                         request}, many=True)
            return Response(serializer.data)
        elif request.user.is_authenticated:
            queryset = models.PrizeItem.objects.all().filter(owner=request.user)
            serializer = serializers.PrizeItemSerializer(queryset, context={"request": 
                         request}, many=True)
            return Response(serializer.data)
        else:
            return Response({"error":"not authenticated"}, status=status.HTTP_400_BAD_REQUEST)

class TokenTransferViewSet(viewsets.ModelViewSet):
    queryset = models.TokenTransfer.objects.all()
    serializer_class = serializers.TokenTransferSerializer
    permission_classes = [permissions.IsAdminUser]

class CurrentUserView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = serializers.UserSerializer(request.user)
        return Response(user.data)

class PostList(generics.ListCreateAPIView):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Post.objects.all()
    serializer_class = serializers.PostSerializer
    permission_classes = [permissions.IsAdminUser,
                          IsOwnerOrReadOnly]

class CommentList(generics.ListCreateAPIView):
    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.IsAdminUser,
                          IsOwnerOrReadOnly, ]
