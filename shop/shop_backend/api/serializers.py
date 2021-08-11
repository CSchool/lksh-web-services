from rest_framework import serializers
from django.contrib.auth.models import User, Group
from api import models
from dj_rest_auth.serializers import UserDetailsSerializer

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Profile
        fields = ('tokens','picture',)

class UserSerializer(UserDetailsSerializer):
    profile = ProfileSerializer(source="userprofile")
    is_staff = serializers.ReadOnlyField()
    full_name = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        return '{} {}'.format(obj.first_name, obj.last_name)

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('is_staff', 'profile', 'full_name')

    def update(self, instance, validated_data):
        profile_serializer = self.fields['profile']
        profile_instance = instance.userprofile
        profile_data = validated_data.pop('userprofile', {})

        tokens = userprofile_data.get('tokens')

        # update the userprofile fields
        profile_serializer.update(profile_instance, profile_data)

        instance = super().update(instance, validated_data)
        return instance

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class PrizeClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PrizeClass
        fields = ['id', 'name', 'description', 'price', 'count', 'picture']

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

    class Meta:
        model = models.TokenTransfer
        fields = ['id', 'count', 'created', 'from_user', 'to_user']

class PostSerializer(serializers.ModelSerializer):
    owner_first_name = serializers.ReadOnlyField(source='owner.first_name')
    owner_last_name = serializers.ReadOnlyField(source='owner.last_name')
    owner_id = serializers.ReadOnlyField(source='owner.pk')
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = models.Post
        fields = ['id', 'created', 'title', 'body', 'owner_first_name',
                  'owner_last_name', 'owner_id', 'comment_count']

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
