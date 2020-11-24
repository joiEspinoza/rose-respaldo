from django.shortcuts import render

# Create your views here.
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from .serializers import GoogleSocialAuthSerializer, MicrosoftSocialAuthSerializer

###
import google.oauth2.credentials
import google_auth_oauthlib.flow

class GoogleSocialAuthView(GenericAPIView):

    serializer_class = GoogleSocialAuthSerializer
    @swagger_auto_schema(operation_description="POST with id_token obtained from Google API, we validate in Google SDK and then register social user")
    def post(self, request):
        """
        POST with "auth_token"
        Send an idtoken as from google to get user information
        """

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = ((serializer.validated_data)['auth_token'])
        return Response(data, status=status.HTTP_200_OK)



class MicrosoftSocialAuthView(GenericAPIView):

    serializer_class = MicrosoftSocialAuthSerializer
    @swagger_auto_schema(operation_description="POST with access_token obtained from microsoft MSAL, we validate with REST API and then register new social user")
    def post(self, request):
        """
        POST with "auth_token"
        Send an idtoken as from google to get user information
        """

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = ((serializer.validated_data)['auth_token'])
        return Response(data, status=status.HTTP_200_OK)

