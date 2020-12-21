from rest_framework import serializers
from . import google, microsoft#, facebook, twitterhelper
import os
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from authentication.models import User
import random

### environment variables from social auth and apps
os.environ['SOCIAL_SECRET'] = 'XM2RZ9r9bRr34uq8'
os.environ['GOOGLE_CLIENT_ID'] = '374514394577-gn2bvmp9cjnsjn53aq0p575mdidpot47.apps.googleusercontent.com'
os.environ['GOOGLE_SECRET'] = 'cf3NcMsZkPJvKWicKfZo8sub'

def generate_username(name):

    username = "".join(name.split(' ')).lower()
    if not User.objects.filter(username=username).exists():
        return username
    else:
        random_username = username + str(random.randint(0, 1000))
        return generate_username(random_username)


def register_social_user(provider, user_id, email, name):
    filtered_user_by_email = User.objects.filter(email=email)

    if filtered_user_by_email.exists():

        if provider == filtered_user_by_email[0].auth_provider:

            registered_user = authenticate(
                email=email, password=os.environ.get('SOCIAL_SECRET'))

            return {
                'username': registered_user.username,
                'email': registered_user.email}

        else:
            raise AuthenticationFailed(
                detail='Please continue your login using ' + filtered_user_by_email[0].auth_provider)

    else:
        user = {
            'username': generate_username(name), 'email': email,
            'password': os.environ.get('SOCIAL_SECRET')}
        user = User.objects.create_user(**user)
        user.is_verified = True
        user.auth_provider = provider
        user.save()

        new_user = authenticate(
            email=email, password=os.environ.get('SOCIAL_SECRET'))
        return {
            'email': new_user.email,
            'username': new_user.username
        }


class GoogleSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = google.Google.validate(auth_token)
        try:
            user_data['sub']
        except:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please login again.'
            )

        if user_data['aud'] != os.environ.get('GOOGLE_CLIENT_ID'):

            raise AuthenticationFailed('oops, who are you?')

        user_id = user_data['sub']
        email = user_data['email']
        name = user_data['name']
        provider = 'google'

        return register_social_user(
            provider=provider, user_id=user_id, email=email, name=name)


class MicrosoftSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = microsoft.Microsoft.validate(auth_token)
        try:
            user_data['id']
        except:
            raise serializers.ValidationError(
                'The token is invalid or expired. Please login again.'
            )


        user_id = user_data['id']
        email = user_data['mail']
        name = user_data['displayName']
        provider = 'microsoft'

        return register_social_user(
            provider=provider, user_id=user_id, email=email, name=name)
