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
    is_staff = serializers.ReadOnlyField()

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('is_staff', 'profile', )

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
        model = PrizeClass
        fields = ['id', 'name', 'description', 'price', 'count', 'picture']

    # def get_photo_url(self, obj):
    #     request = self.context.get('request')
    #     photo_url = obj.fingerprint.url
    #     return request.build_absolute_uri(photo_url)

class PrizeItemSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField(source='info.name')
    picture = serializers.ImageField(source='info.picture')
    full_name = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        return '{} {}'.format(obj.owner.first_name, obj.owner.last_name)

    class Meta:
        model = PrizeItem
        fields = ['id', 'name', 'date_purchased', 'date_taken',
                  'price', 'full_name', 'picture']

class TokenTransferSerializer(serializers.ModelSerializer):
    from_user = serializers.ReadOnlyField(source='from_user.username')
    to_user = serializers.ReadOnlyField(source='to_user.username')

    class Meta:
        model = TokenTransfer
        fields = ['id', 'count', 'created', 'from_user', 'to_user']
