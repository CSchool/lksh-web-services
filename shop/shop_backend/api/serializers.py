from rest_framework import serializers
from django.contrib.auth.models import User, Group
from api.models import Profile, PrizeClass, PrizeItem, TokenTransfer
from dj_rest_auth.serializers import UserDetailsSerializer

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('tokens',)

class UserSerializer(UserDetailsSerializer):
    profile = ProfileSerializer(source="userprofile")

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('profile',)

    def update(self, instance, validated_data):
        profile_serializer = self.fields['profile']
        profile_instance = instance.userprofile
        profile_data = validated_data.pop('userprofile', {})

        # to access the 'company_name' field in here
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
        model = PrizeClass
        fields = ['id', 'name', 'description', 'price', 'count', 'picture']

    # def get_photo_url(self, obj):
    #     request = self.context.get('request')
    #     photo_url = obj.fingerprint.url
    #     return request.build_absolute_uri(photo_url)

class PrizeItemSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    name = serializers.ReadOnlyField(source='info.name')

    class Meta:
        model = PrizeItem
        fields = ['id', 'name', 'date_purchased', 'date_taken', 'price', 'owner']

class TokenTransferSerializer(serializers.ModelSerializer):
    from_user = serializers.ReadOnlyField(source='from_user.username')
    to_user = serializers.ReadOnlyField(source='to_user.username')

    class Meta:
        model = TokenTransfer
        fields = ['id', 'count', 'created', 'from_user', 'to_user']
