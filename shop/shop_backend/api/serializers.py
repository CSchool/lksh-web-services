from rest_framework import serializers
from django.contrib.auth.models import User, Group
from api import models
from dj_rest_auth.serializers import UserDetailsSerializer
from django.db.models import Sum
import datetime

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Profile
        fields = ('tokens','picture',)

class UserSerializer(UserDetailsSerializer):
    profile = ProfileSerializer(source="userprofile")
    is_staff = serializers.ReadOnlyField()
    full_name = serializers.SerializerMethodField()
    today_tokens = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        return '{} {}'.format(obj.first_name, obj.last_name)

    def get_today_tokens(self, obj):
        today = datetime.datetime.now()
        prev_day = today - datetime.timedelta(hours=2)
        return models.TokenTransfer.objects.all() \
                .filter(to_user=obj.id,created__range=[prev_day, today]) \
                .aggregate(sum=Sum('count'))['sum']

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + \
            ('is_staff', 'profile', 'full_name', 'today_tokens')

    def update(self, instance, validated_data):
        profile_serializer = self.fields['profile']
        profile_instance = instance.userprofile
        profile_data = validated_data.pop('userprofile', {})

        # tokens = userprofile_data.get('tokens')

        # update the userprofile fields
        profile_serializer.update(profile_instance, profile_data)

        instance = super().update(instance, validated_data)
        return instance

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class PrizeClassSerializer(serializers.ModelSerializer):
    user_bet = serializers.SerializerMethodField()

    def get_user_bet(self, obj):
        request = self._context.get('request')
        if not request or not request.user.id:
            return 0
        user = request.user
        # don't query bets for admins
        if user.is_staff:
            return 0
        req = models.AuctionRequest.objects. \
            filter(user=user, prize=obj).first()
        if req:
            return req.maxprice
        return 0

    class Meta:
        model = models.PrizeClass
        fields = ['id', 'name', 'description', 'price',
                  'count', 'picture', 'auction', 'user_bet']

    # def get_photo_url(self, obj):
    #     request = self.context.get('request')
    #     photo_url = obj.fingerprint.url
    #     return request.build_absolute_uri(photo_url)

class PrizeItemSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField(source='info.name')
    class_id = serializers.ReadOnlyField(source='info.id')
    picture = serializers.ImageField(source='info.picture', read_only=True)
    full_name = serializers.SerializerMethodField()
    owner_picture = serializers.ImageField(source='owner.userprofile.picture', read_only=True)
    owner_id = serializers.ReadOnlyField(source='owner.pk')

    def get_full_name(self, obj):
        return '{} {}'.format(obj.owner.first_name, obj.owner.last_name)

    class Meta:
        model = models.PrizeItem
        fields = ['id', 'name', 'date_purchased', 'date_taken',
                  'price', 'full_name', 'picture', 'class_id',
                  'owner_picture', 'owner_id']

class TokenTransferSerializer(serializers.ModelSerializer):
    from_user = serializers.ReadOnlyField(source='from_user.username')
    to_user = serializers.ReadOnlyField(source='to_user.username')
    from_user_full_name = serializers.SerializerMethodField()

    def get_from_user_full_name(self, obj):
        return '{} {}'.format(obj.from_user.first_name, obj.from_user.last_name)

    class Meta:
        model = models.TokenTransfer
        fields = ['id', 'count', 'created', 'from_user', 'to_user',
                'from_user_full_name']

class AuctionRequestSerializer(serializers.ModelSerializer):
    user_first_name = serializers.ReadOnlyField(source='user.first_name')
    user_last_name = serializers.ReadOnlyField(source='user.last_name')
    user_id = serializers.ReadOnlyField(source='user.pk')
    prize_id = serializers.ReadOnlyField(source='prize.pk')

    class Meta:
        model = models.AuctionRequest
        fields = ['id', 'maxprice', 'prize_id',
                  'user_first_name', 'user_last_name', 'user_id']

class PostSerializer(serializers.ModelSerializer):
    owner_first_name = serializers.ReadOnlyField(source='owner.first_name')
    owner_last_name = serializers.ReadOnlyField(source='owner.last_name')
    owner_id = serializers.ReadOnlyField(source='owner.pk')
    owner_picture = serializers.ImageField(source='owner.userprofile.picture', read_only=True)
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = models.Post
        fields = ['id', 'created', 'title', 'body', 'owner_first_name',
                  'owner_last_name', 'owner_id', 'comment_count',
                  'owner_picture']

    def get_comment_count(self, obj):
        return obj.comments.count()

class CommentSerializer(serializers.ModelSerializer):
    owner_id = serializers.ReadOnlyField(source='owner.pk')
    owner_first_name = serializers.ReadOnlyField(source='owner.first_name')
    owner_last_name = serializers.ReadOnlyField(source='owner.last_name')
    owner_picture = serializers.ImageField(source='owner.userprofile.picture', read_only=True)

    class Meta:
        model = models.Comment
        fields = ['id', 'body', 'post', 'created', 'owner_id',
                  'owner_first_name', 'owner_last_name', 'owner_picture']
