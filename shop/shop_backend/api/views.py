from rest_framework import generics, viewsets, views, status
from rest_framework.response import Response
from rest_framework import permissions
from . import models
from . import serializers
from .permissions import IsGetOrIsAdmin, IsOwnerOrAdminOrReadOnly
from django.contrib.auth.models import User

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsGetOrIsAdmin]
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        return models.User.objects.all()

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            return Response({"error":"can't create many items"}, status=status.HTTP_400_BAD_REQUEST)
        if not request.user.is_staff:
            return Response({"error":"not admin"}, status=status.HTTP_400_BAD_REQUEST)
        if 'username' not in request.data \
            or 'password' not in request.data \
            or 'first_name' not in request.data \
            or 'last_name' not in request.data:
            raise ParseError("Empty content")
        data = request.data
        user = User.objects.create_user(username=data['username'],
                                        password=data['password'],
                                        first_name=data['first_name'],
                                        last_name=data['last_name'])
        return Response({}, status=status.HTTP_201_CREATED)

    # !!! breaks user picture retrieving for some reason
    # def retrieve(self, request, pk=None):
    #     queryset = models.User.objects.all()
    #     user = get_object_or_404(self.queryset, pk=pk)
    #     data = serializers.UserSerializer(user).data
    #     if not request.user.is_staff:
    #         data['profile']['tokens'] = None
    #         data['today_tokens'] = None
    #     return Response(data)

    def list(self, request):
        if not request.user.is_staff:
            return Response({"error":"not admin"}, status=status.HTTP_400_BAD_REQUEST)
        queryset = models.User.objects.all().filter(is_active=True)
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
    serializer_class = serializers.PrizeClassSerializer
    permission_classes = [IsGetOrIsAdmin]
    queryset = models.PrizeClass.objects.all()

    def list(self, request):
        # queryset = models.User.objects.all().filter(is_active=True)
        # group = self.request.query_params.get("group")
        # if group:
        #     queryset = queryset.filter(groups=group)
        # queryset.order_by("last_name")
        # serializer = serializers.UserSerializer(queryset, context={"request": 
        #                 request}, many=True)
        old = self.request.query_params.get("old")
        if old == "true":
            queryset = self.queryset.filter(count=0)
        else:
            queryset = self.queryset.filter(count__gt=0)
        queryset = queryset.order_by('-price')
        serializer = serializers.PrizeClassSerializer(queryset,
                                                      context={'request': request},
                                                      many=True)
        return Response(serializer.data)

    # TODO: can't create prize with count=0
    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):
            return Response({"error":"can't create many items"}, status=status.HTTP_400_BAD_REQUEST)
        if not request.user.is_staff:
            return Response({"error":"not admin"}, status=status.HTTP_400_BAD_REQUEST)
        if 'file' not in request.data:
            raise ParseError("Empty content")
        data = request.data
        data['picture'] = request.data['file']
        f = request.data['file']
        params = {'name': request.data['name'],
                  'description': request.data['description'],
                  'price': request.data['price'],
                  'count': request.data['count'],
                  'auction': request.data['auction'] == 'true'}
        serializer = serializers.PrizeClassSerializer()
        prize = serializer.create(validated_data=params)
        prize.picture.save(f.name, f, save=True)
        prize.save()
        return Response({}, status=status.HTTP_201_CREATED)

    # def get(self, request, format=None):
    #     serializer = PrizeClassSerializer(queryset, context={"request": 
    #                     request}, many=True)
    #     return Response(serializer.data) 

class PrizeItemList(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        if request.user.is_staff:
            owner = self.request.query_params.get("owner")
            taken = self.request.query_params.get("taken")
            if owner:
                queryset = models.PrizeItem.objects.all().filter(owner=owner) \
                    .order_by("-date_taken")
                if taken:
                    queryset = queryset.filter(date_taken__isnull=False)
            elif taken:
                queryset = models.PrizeItem.objects.all() \
                    .filter(date_taken__isnull=False) \
                    .order_by("-date_taken")[:100]
            else:
                queryset = models.PrizeItem.objects.all().filter(date_taken__isnull=True)
            serializer = serializers.PrizeItemSerializer(queryset,
                         context={"request": request}, many=True)
            return Response(serializer.data)
        elif request.user.is_authenticated:
            queryset = models.PrizeItem.objects.all().filter(owner=request.user)
            serializer = serializers.PrizeItemSerializer(queryset,
                         context={"request": request}, many=True)
            return Response(serializer.data)
        else:
            return Response({"error":"not authenticated"}, status=status.HTTP_400_BAD_REQUEST)

class TokenTransferViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.TokenTransferSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return models.TokenTransfer.objects.all()

    def list(self, request):
        queryset = models.TokenTransfer.objects.all()
        to = self.request.query_params.get("to")
        if to:
            queryset = queryset.filter(to_user=to)
        else:
            return Response({"error":"user must be specified"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = serializers.TokenTransferSerializer(self.get_queryset(), context={"request": 
                        request}, many=True)
        return Response(serializer.data)

class AuctionRequestList(generics.ListAPIView):
    queryset = models.AuctionRequest.objects.all()
    serializer_class = serializers.AuctionRequestSerializer
    permission_classes = [permissions.IsAdminUser]

    def list(self, request):
        prize = self.request.query_params.get("prize")
        if not prize:
            return Response({"error":"user must be specified"}, status=status.HTTP_400_BAD_REQUEST)
        queryset = models.AuctionRequest.objects.filter(prize=prize).order_by("-maxprice").all()
        serializer = serializers.AuctionRequestSerializer(queryset, many=True)
        return Response(serializer.data)

class AuctionRequestDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.AuctionRequest.objects.all()
    serializer_class = serializers.AuctionRequestSerializer
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
    permission_classes = [IsOwnerOrAdminOrReadOnly]

class CommentList(generics.ListCreateAPIView):
    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request):
        queryset = models.Comment.objects.all()
        post = self.request.query_params.get("post")
        if post is None:
            post = 0
        queryset = queryset.filter(post=post)
        serializer = serializers.CommentSerializer(queryset, context={"request": 
                        request}, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [IsOwnerOrAdminOrReadOnly]
