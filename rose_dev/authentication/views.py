from django.shortcuts import render
import random
# Create your views here.
from django.shortcuts import render
from rest_framework import generics, status, views, permissions
from .serializers import RegisterSerializer, SetNewPasswordSerializer, ResetPasswordEmailRequestSerializer, EmailVerificationSerializer, LoginSerializer
from rest_framework.response import Response
from .models import User
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.urls import reverse
from django.shortcuts import redirect
from django.http import HttpResponsePermanentRedirect
import os


class CustomRedirect(HttpResponsePermanentRedirect):

    allowed_schemes = ['http', 'https']


class RegisterView(generics.GenericAPIView):

    serializer_class = RegisterSerializer
    #renderer_classes = (UserRenderer,)
    @swagger_auto_schema(operation_description="Register normal email user", operation_id='create_normal_user')
    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = User.objects.get(email=user_data['email'])
        current_site = get_current_site(request).domain
        #relativeLink = reverse('email-verify/'+ str(user.email))
        absurl = 'http://'+current_site+'/auth/email-verify/' + str(user.username)
        email_body = 'Hi '+user.username + \
            ' Use the link below to verify your email \n' + absurl
        data = {'email_body': email_body, 'to_email': user.email,
                'email_subject': 'Verify your email'}

        Util.send_email(data)
        return Response(user_data, status=status.HTTP_201_CREATED)


class VerifyEmail(views.APIView):
    serializer_class = EmailVerificationSerializer
    @swagger_auto_schema(operation_description="Verify mail for normal users", operation_id='auth_verify_mail')
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            if not user.is_verified:
                user.is_verified = True
                user.save()
            return Response({'email': 'Successfully verified'}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)
        

class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    @swagger_auto_schema(operation_description="Log in users, social or normal ones", operation_id='auth_login')
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer
    @swagger_auto_schema(operation_description="Resets password for normal email users", operation_id='reset_user_password')
    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        email = request.data.get('email')

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            current_site = get_current_site(
                request=request).domain
            current_site = get_current_site(request).domain
            absurl = 'http://'+current_site+'/auth/password-reset-complete/' +str(user.username)
            email_body = 'Hello, \n Use link below to reset your password  \n' + \
                absurl
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Reset your passsword'}
            Util.send_email(data)
        return Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)



class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    @swagger_auto_schema(operation_description="Set new password once the link is activated in RequestNewPassword", operation_id='set_newpassword')
    def get(self, request, username):
        user = User.objects.get(username = username)
        new_pass = str(user.username)[0:5] + '.' + str(random.randint(1000, 20000))
        json = {'user': username,'password': new_pass}
        serializer = self.serializer_class(data=json)
        serializer.is_valid(raise_exception=True)
        user.set_password(new_pass)
        user.save()
        email_body = 'Hola, \n Esta es tu nueva contraseña:  \n' + new_pass + '</b>'
        data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Tu nueva contraseña para ROSE'}
        Util.send_email(data)
        return Response({'success': True, 'message': 'Password reset success', 'data': json}, status=status.HTTP_200_OK)



"""
class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
"""