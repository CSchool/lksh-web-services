from rest_framework import serializers
from api.models import User, Group, PrizeClass, PrizeItem, TokenTransfer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'tokens', 'groups']

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
