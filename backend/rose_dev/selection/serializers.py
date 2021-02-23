from rest_framework import serializers
from .models import *
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode


class WelcomeSerializer(serializers.Serializer):

    selections_ct = serializers.IntegerField()
    saved_time_min = serializers.DecimalField(max_digits=10, decimal_places=2)
    resumes_ct = serializers.IntegerField()
    welcome_message = serializers.CharField()


class SelectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Selection
        fields = '__all__'


class CandidateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Candidate
        fields = '__all__'


class IssueSerializer(serializers.ModelSerializer):

    class Meta:
        model = Issue
        fields = '__all__'


class CustomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Custom
        fields = ['name', 'description', 'value']

class ConfigSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserConfig
        fields = '__all__'

class ConfigColorsSerializer(serializers.Serializer):
    primary_color = serializers.CharField()
    secondary_color = serializers.CharField()
    user_mail = serializers.CharField()

class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserEvent
        fields = '__all__'


class GetEventsSerializer(serializers.Serializer):
    events = serializers.JSONField()


class CreateExcelSerializer(serializers.Serializer):
    user = serializers.CharField()
    type_id = serializers.IntegerField()