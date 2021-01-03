from django.shortcuts import render
from django.db import models
from authentication.models import User
# Create your views here.
from django.shortcuts import render
from rest_framework import generics, status, views, permissions
from .serializers import GetEventsSerializer, EventSerializer, WelcomeSerializer, CustomSerializer, IssueSerializer, SelectionSerializer, CandidateSerializer
from rest_framework.response import Response
from .models import Selection, Candidate, Issue, Custom, UserConfig, ChangeItem
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .model_utils import create_candidates
from .mail_utils import get_gmailevents, create_gmail_event, create_outlook_event, create_gmail, send_gmail, send_outlook, get_outlookevents
from django.conf import settings
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.urls import reverse
from django.shortcuts import redirect
from django.http import HttpResponsePermanentRedirect
import os
import json
import shutil

class WelcomeAPIView(generics.GenericAPIView): #validated
    
    serializer_class = WelcomeSerializer

    @swagger_auto_schema(operation_description="Welcome view for specific user", operation_id='user_welcome')
    def get(self, request, mail):
        try:
            user_obj = User.objects.get(email = mail)
            selections = Selection.objects.filter(user = user_obj)
            welcome_text = Custom.objects.get(type = 'welcome_text').value
        except:
            return Response({'error': 'Usuario no está configurado bien, crear incidencia con nombre: USER_WELCOME'}
                            , status=status.HTTP_400_BAD_REQUEST)
        ct_sel = selections.count()
        ct_resumes = 0

        for sel in selections:
            resume = Candidate.objects.filter(selection = sel)
            ct_resumes = 0 if resume.count() == None else resume.count()
            ct_resumes = ct_resumes + ct_resumes
        """
        Estimating time using:
        - 30 seconds of fast-reading
        - 18 hrs of screening (23 hours)
        """
        estimated_time = ct_resumes * 0.5 + ct_sel * 23.5 #minutes

        json = {
            'selections_ct': ct_sel,
            'saved_time_min': estimated_time,
            'resumes_ct': ct_resumes,
            'welcome_message': welcome_text
                }
        serializer = self.serializer_class(data=json)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ListSelectionAPIView(generics.GenericAPIView):  #validated
    serializer_class = SelectionSerializer
    
    @swagger_auto_schema(operation_description="List selections of user", operation_id='list_user_selections')
    def get(self, request, mail):
        
        try:
            user_obj = User.objects.get(email = mail)
            selections = Selection.objects.filter(user =  user_obj)
            if len(selections) == 0:
                return Response({'Respuesta': '¡Agrega una selección o proceso para empezar!'}
                            , status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Usuario no existe'}
                            , status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(selections, many=True)

        return Response({'user': mail,'data': serializer.data}, status=status.HTTP_200_OK)


class SelectionAPIView(generics.GenericAPIView):  #validated
    serializer_class = SelectionSerializer
    queryset= ''
    @swagger_auto_schema(operation_description="Get selection information", operation_id='selection_read')
    def get(self, request, pk):
        
        try:
            selections = Selection.objects.get(pk =  pk)
        except:
            return Response({'error': 'No se encuentra la secuencia, no existe'}
                            , status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(selections)

        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(operation_description="Update columns of selection", operation_id='selection_update')
    def patch(self, request, pk):
        
        try:
            selection = Selection.objects.get(pk =  pk)
        except:
            return Response({'error': 'No se encuentra la secuencia a editar'}
                            , status=status.HTTP_400_BAD_REQUEST)
        print(request.data)
        serializer = self.serializer_class(selection, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'updated_data': serializer.data}, status=status.HTTP_202_ACCEPTED)


class CreateCandidateAPIView(generics.GenericAPIView): #not complete
    serializer_class = CandidateSerializer

    @swagger_auto_schema(operation_description="Creates ranking of candidates from a selection", operation_id='candidate_create')
    def post(self, request):
        """
        after creating selection and aws S3 path we create and rank the candidates
        selection = Selection.objects.get(pk=sel_id)
        user_mail = User.objects.get(pk=selection.user.id).email
        desired = selection.desired
        require = selection.requirements
        R_exp = require.exp
        R_idioms = require.idioms
        R_skills = require.skills
        R_location = require.location
        D_exp = desired.exp
        D_idioms = desired.idioms
        D_skills = desired.skills
        D_location = desired.location
        D_designations = desired.designation
        D_colleges = desired.college
        print(D_exp, D_skills, D_location, D_designations, D_colleges)
        """

        serializer = self.serializer_class(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'created_data': serializer.data}, status=status.HTTP_201_CREATED)



class CreateSelectionAPIView(generics.GenericAPIView): #not complete
    serializer_class = SelectionSerializer

    @swagger_auto_schema(operation_description="Creates new selection and candidates", operation_id='selection_create')
    def post(self, request):
        """
        POST -> code that connects aws, executes algorithm and creates
        data in Candidate model
        IMPORTANT -> front: leaves files in aws first -> then request post
        example: connect aws -> (try)get custom model user
                -> executes rose model -> get results and ranking -> 
                post selection (with kpis and everything) -> post candidates
        use serializer_class2
        """

        serializer = self.serializer_class(data=request.data)
        print(serializer.initial_data)
        user = User.objects.get(email=serializer.initial_data['user'])
        serializer.initial_data['user'] = user.id
        print(serializer.initial_data['user'], 'we successfully changed initial data to int')        
        serializer.is_valid(raise_exception=True)
        sel = serializer.save()
        S3_path = serializer.initial_data['storage_url']
        min_req = serializer.initial_data['requirements']
        desire_req = serializer.initial_data['desired']
        remote_ind = serializer.initial_data['is_remote']
        candidates = create_candidates(S3_path, sel.pk, min_req, desire_req, remote_ind, 'scorer')
        serializer_candidates = CandidateSerializer(data=candidates, many=True)
        serializer_candidates.is_valid(raise_exception=True)
        #serializer_candidates.errors
        serializer_candidates.save()
        selection = Selection.objects.get(pk=sel.pk)
        selection.status = 'Done'
        serializer.save()
        shutil.rmtree(r'selection/tmp/')
        os.mkdir(r'selection/tmp/')
        return Response({'created_data': serializer.data, 'candidates': candidates}, status=status.HTTP_201_CREATED)


class ListSelectionCandidatesAPIView(generics.GenericAPIView): #validated
    serializer_class = CandidateSerializer
    queryset= ''
    @swagger_auto_schema(operation_description="List candidates of specific selection", operation_id='list_selection_candidates')
    def get(self, request, pk):
        
        try:
            sel = Selection.objects.get(pk = pk)
            resumes = Candidate.objects.filter(selection = sel)
            if len(resumes) == 0:
                return Response({'error': '¡Que raro! Selección no cuenta con candidatos y sus CVs, creaste bien la selección?'}
                            , status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'No se encontraron datos para esta secuencia, inicia incidencia con código DATOS_SEL'}
                            , status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(resumes, many=True)

        return Response({'data': serializer.data}, status=status.HTTP_200_OK)

class ListUserCandidatesAPIView(generics.GenericAPIView):  #validated
    serializer_class = CandidateSerializer

    @swagger_auto_schema(operation_description="List candidates of specific user", operation_id='list_user_candidates')  #operation_summary='user_candidates_list')
    def get(self, request, mail):
        
        try:
            user_obj = User.objects.get(email = mail)
            sel = Selection.objects.filter(user = user_obj)
            for row in sel:
                resumes = Candidate.objects.filter(selection = row)
            if len(resumes) == 0:
                return Response({'error': '¡Que raro! Usuario no cuenta con candidatos y sus CVs, creaste alguna selección?'}
                            , status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'No se encontraron datos para este usuario, inicia incidencia con código DATOS_USER_SEL'}
                            , status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(resumes, many=True)

        return Response({'data': serializer.data}, status=status.HTTP_200_OK)



class CandidateAPIView(generics.GenericAPIView):  #validated
    serializer_class = CandidateSerializer
    queryset= ''
    @swagger_auto_schema(operation_description="Get candidate information", operation_id='candidate_read')
    def get(self, request, pk):
        
        try:
            selections = Candidate.objects.get(pk =  pk)
        except:
            return Response({'error': 'No se encuentra candidato, no existe'}
                            , status=status.HTTP_400_BAD_REQUEST)

        queryset = selections
        serializer = self.serializer_class(queryset)

        return Response({'data': serializer.data}, status=status.HTTP_200_OK)


class IssueAPIView(generics.GenericAPIView):  #validated
    serializer_class = IssueSerializer
    queryset= ''
    @swagger_auto_schema(operation_description="Get issue information", operation_id='issue_read')
    def get(self, request, pk):
        
        try:
            selections = Issue.objects.get(pk =  pk)
        except:
            return Response({'error': 'No se encuentra incidencia, no existe'}
                            , status=status.HTTP_400_BAD_REQUEST)

        queryset = selections
        serializer = self.serializer_class(queryset)

        return Response({'data': serializer.data}, status=status.HTTP_200_OK)


class CreateIssueAPIView(generics.GenericAPIView):  #validated
    serializer_class = IssueSerializer

    @swagger_auto_schema(operation_description="Create issue", operation_id='issue_create')
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({'created_data': serializer.data}, status=status.HTTP_201_CREATED)


class ListTutorialsAPIView(generics.GenericAPIView):  #validated
    serializer_class = CustomSerializer

    @swagger_auto_schema(operation_description="List tutorials from youtube videos", operation_id='list_turorials')
    def get(self, request):
        queryset = Custom.objects.filter(type='tutorial')
        serializer = self.serializer_class(queryset, many=True)


        return Response({'data': serializer.data}, status=status.HTTP_200_OK)


class SendMailAPIView(generics.GenericAPIView):
    serializer_class = EventSerializer

    desc = 'Google params -> sender, to, cc, subject, message_text     to and cc with ";"\n Microsoft params -> content, subject, to, cc     to and cc as array [] '

    @swagger_auto_schema(operation_description=desc, operation_id='send_mail_candidate')
    def post(self, request, token):
        """
        args_url: access_token
        args request: mail, sender, to, cc, subject, html message
        """
        serializer = self.serializer_class(data=request.data)
        event = serializer.initial_data
        event_info = event['info']
        user = User.objects.get(pk=event['user'])
        if user.auth_provider == 'google':
            try:
                body = create_gmail(event_info['sender'], event_info['to'], event_info['cc'], event_info['subject'], event_info['content'])
                send = send_gmail(token, user.email, body)
                if send.status_code == 401:
                    return Response({'error': 'Se requiere un nuevo token'}, status=status.HTTP_401_UNAUTHORIZED)
                elif send.status_code == 403:
                    return Response({'error': 'La información de token no corresponde a la del usuario'}, status=status.HTTP_403_FORBIDDEN)
                else:
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    return Response({'created_data': serializer.data}, status=status.HTTP_201_CREATED)
            except:
                return Response({'error': 'No se pudo enviar el mensaje, crear incidencia con código MAIL_VIEW_SEND'}, status=status.HTTP_400_BAD_REQUEST)

        if user.auth_provider == 'microsoft':
            #try:
                send = send_outlook(token, event_info['content'], event_info['subject'], event_info['to'], event_info['cc'])
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response({'created_data': serializer.data}, status=status.HTTP_202_ACCEPTED)
            #except:
            #    return Response({'error': 'No se pudo enviar el mensaje, crear incidencia con código MAIL_VIEW_SEND'}, status=status.HTTP_400_BAD_REQUEST)
        if user.auth_provider == 'email':
            return Response({'error': 'El envío de mails y calendarización es solo con cuentas oficiales de Google y Microsoft, registra un usuario con esas credenciales!'}, status=status.HTTP_428_PRECONDITION_REQUIRED) 



class GetUserEventsAPIView(generics.GenericAPIView):  #validated
    serializer_class = GetEventsSerializer

    @swagger_auto_schema(operation_description="Get user events to check for availability", operation_id='user_events_read')
    def get(self, request, token, mail):
        user_id = User.objects.get(email=mail)
        try:
            user_timezone = UserConfig.objects.get(user=user_id, type="timezone")
        except:
            Response({'error': 'El usuario no tiene configurado una zona horaria'}, status=status.HTTP_428_PRECONDITION_REQUIRED)
        if user_id.auth_provider == 'google':
            #try:
                events = get_gmailevents(token, user_timezone.value)
                data = {'events': events.json()['items']}
                serializer = self.serializer_class(data)
                if events.status_code == 200:
                    return Response({'data': serializer.data}, status=status.HTTP_200_OK)
                elif events.status_code == 401:
                    return Response({'error': 'Se requiere un nuevo token'}, status=status.HTTP_401_UNAUTHORIZED)
                elif events.status_code == 403:
                    return Response({'error': 'La información de token no corresponde a la del usuario'}, status=status.HTTP_403_FORBIDDEN)
            #except:
            #    return Response({'error': 'No se retornar los eventos del usuario, crear incidencia con código CALENDAR_GET_GOOGLE'}, status=status.HTTP_400_BAD_REQUEST)
        if user_id.auth_provider == 'microsoft':
            #try:
                events = get_outlookevents(token, user_timezone.value)
                data = {'events': events.json()['value']}
                serializer = self.serializer_class(data)
                if events.status_code == 200:
                    return Response({'data': serializer.data}, status=status.HTTP_200_OK)
                elif events.status_code == 401:
                    return Response({'error': 'Se requiere un nuevo token'}, status=status.HTTP_401_UNAUTHORIZED)
                elif events.status_code == 403:
                    return Response({'error': 'La información de token no corresponde a la del usuario'}, status=status.HTTP_403_FORBIDDEN)
            #except:
            #    return Response({'error': 'No se retornar los eventos del usuario, crear incidencia con código CALENDAR_GET_MICROSOFT'}, status=status.HTTP_400_BAD_REQUEST)
        if user_id.auth_provider == 'email':
            return Response({'error': 'El envío de mails y calendarización es solo con cuentas oficiales de Google y Microsoft, registra un usuario con esas credenciales!'}, status=status.HTTP_428_PRECONDITION_REQUIRED) 



class CreateEventAPIView(generics.GenericAPIView):  #validated
    serializer_class = EventSerializer

    @swagger_auto_schema(operation_description="post to create events.\n info JSON: subject, content, start, end, attendees \n Datetime format for start and end in post request 2020-12-07T20:00:00\n attendees format ['mail1', 'mail2'] (microsoft and google)", operation_id='user_event_create')
    def post(self, request, token):

        """
        args_url: access_token
        args request: subject, start, end, attendees
        """
        serializer = self.serializer_class(data=request.data)
        event = serializer.initial_data
        event_info = event['info']
        user_id = User.objects.get(pk=event['user'])
        user_timezone = UserConfig.objects.get(user=user_id, type="timezone")
        if user_id.auth_provider == 'microsoft':
            try:
                meeting = create_outlook_event(token, event_info['subject'],event_info['content'],event_info['start'],event_info['end'],event_info['attendees'],user_timezone.value)
                print(meeting.status_code)
                if meeting.status_code == 401:
                    return Response({'error': 'Se requiere un nuevo token'}, status=status.HTTP_401_UNAUTHORIZED)
                elif meeting.status_code == 403:
                    return Response({'error': 'La información de token no corresponde a la del usuario'}, status=status.HTTP_403_FORBIDDEN)
                else:
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    return Response({'created_data': serializer.data}, status=status.HTTP_201_CREATED)
            except:
                return Response({'error': 'No se pudo crear la reunión, crear incidencia con código CALENDAR_GOOGLE_CRATE'}, status=status.HTTP_400_BAD_REQUEST)
        if user_id.auth_provider == 'google':
            try:
                meeting = create_gmail_event(token, event_info['subject'],event_info['content'],event_info['start'],event_info['end'],event_info['attendees'],user_timezone.value)
                print(meeting.status_code)
                if meeting.status_code == 401:
                    return Response({'error': 'Se requiere un nuevo token'}, status=status.HTTP_401_UNAUTHORIZED)
                elif meeting.status_code == 403:
                    return Response({'error': 'La información de token no corresponde a la del usuario'}, status=status.HTTP_403_FORBIDDEN)
                else:
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    return Response({'created_data': serializer.data}, status=status.HTTP_201_CREATED)
            except:
                return Response({'error': 'No se pudo crear la reunión, crear incidencia con código CALENDAR_GOOGLE_CRATE'}, status=status.HTTP_400_BAD_REQUEST)
        if user_id.auth_provider == 'email':
            return Response({'error': 'El envío de mails y calendarización es solo con cuentas oficiales de Google y Microsoft, registra un usuario con esas credenciales!'}, status=status.HTTP_428_PRECONDITION_REQUIRED) 


        

     