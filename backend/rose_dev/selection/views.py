from django.shortcuts import render
from django.db import models
from authentication.models import User
# Create your views here.
from django.shortcuts import render
from rest_framework import generics, status, views, permissions
from .serializers import CreateExcelSerializer, ConfigColorsSerializer, ConfigSerializer, GetEventsSerializer, EventSerializer, WelcomeSerializer, CustomSerializer, IssueSerializer, SelectionSerializer, CandidateSerializer
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
from django.http import HttpResponsePermanentRedirect, HttpResponse
import os
import json
import shutil
import pandas as pd
from io import BytesIO
import xlsxwriter


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
            ct_r = 0 if resume.count() == None else resume.count()
            ct_resumes = ct_resumes + ct_r
        """
        Estimating time using:
        - 15 seconds of fast-reading
        - 23 hrs of screening (23 hours)
        """
        estimated_time = ct_resumes * (15/3600) + ct_sel * 23 #hours

        json = {
            'selections_ct': ct_sel,
            'saved_time_min': round(estimated_time,2),
            'resumes_ct': ct_resumes,
            'welcome_message': welcome_text
                }
        serializer = self.serializer_class(data=json)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)



class UserConfigsAPIView(generics.GenericAPIView): #validated
    
    serializer_class = ConfigSerializer

    @swagger_auto_schema(operation_description="Important variables for user (ex: selection limit)", operation_id='user_configs')
    def get(self, request, mail):
        try:
            user_obj = User.objects.get(email = mail)
            configs = UserConfig.objects.filter(user =  user_obj)
            if len(configs) == 0:
                return Response({'Respuesta': 'No existen configuraciones'}
                            , status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'Usuario no existe, probablemente el mail este incorrecto'}
                            , status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(configs, many=True)
        output = {}
        for config in serializer.data:
            output.update({config['type']: config['value']})

        return Response(output, status=status.HTTP_200_OK)


class CreateConfigColors(generics.GenericAPIView):
    serializer_class = ConfigColorsSerializer

    @swagger_auto_schema(operation_description="posting color for personalization", operation_id='user_colors')
    def post(self, request):
        """
        Just available for posting colors configurations
        """
        serializer = self.serializer_class(data=request.data)
        try:
            user_obj = User.objects.get(email = serializer.initial_data['user_mail'])
            primary = UserConfig.objects.get(user=user_obj, type='primary_color')
            secondary = UserConfig.objects.get(user=user_obj, type='secondary_color')
        except:
            return Response({'error': 'Usuario no existe, probablemente el mail este incorrecto'}
                            , status=status.HTTP_400_BAD_REQUEST)

        json_1 = {
                "user": user_obj.id,
                "license_type": "rosev0",
                "type": "primary_color",
                "value": serializer.initial_data['primary_color']
                }
        json_2 = {
                "user": user_obj.id,
                "license_type": "rosev0",
                "type": "secondary_color",
                "value": serializer.initial_data['secondary_color']
                }

        colors = []
        colors.append(json_1)
        colors.append(json_2)

        if len(primary) and len(secondary) > 0:
            primary.value = serializer.initial_data['primary_color']
            secondary.value = serializer.initial_data['secondary_color']
            primary.save()
            secondary.save()
        else:
            serializer_colors = ConfigSerializer(data=colors, many=True)
            serializer_colors.is_valid(raise_exception=True)
            serializer_colors.save()

        return Response({'colors': colors}, status=status.HTTP_201_CREATED)


class ListSelectionAPIView(generics.GenericAPIView):  #validated
    serializer_class = SelectionSerializer
    
    @swagger_auto_schema(operation_description="List selections of user", operation_id='list_user_selections')
    def get(self, request, mail):
        
        try:
            user_obj = User.objects.get(email = mail)
            selections = Selection.objects.filter(user =  user_obj).order_by('-created_at')
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
        user = User.objects.get(email=serializer.initial_data['user'])
        serializer.initial_data['user'] = user.id
        serializer.is_valid(raise_exception=True)
        sel = serializer.save()
        S3_path = serializer.initial_data['storage_url']
        min_req = serializer.initial_data['requirements']
        desire_req = serializer.initial_data['desired']
        remote_ind = serializer.initial_data['is_remote']
        candidates, high, low, med = create_candidates(S3_path, sel.pk, min_req, desire_req, remote_ind, 'scorer', 'whole')
        serializer_candidates = CandidateSerializer(data=candidates, many=True)
        serializer_candidates.is_valid(raise_exception=True)
        #serializer_candidates.errors
        serializer_candidates.save()
        selection = Selection.objects.get(pk=sel.pk)
        selection.status = 'Done'
        selection.kpis = {"high": high, "medium": med, "low": low}
        serializer.initial_data['kpis'] = {"high": high, "medium": med, "low": low}
        selection.save()
        shutil.rmtree('selection/tmp/')
        os.mkdir('selection/tmp/')
        return Response(serializer.initial_data, status=status.HTTP_201_CREATED)


class ListSelectionCandidatesAPIView(generics.GenericAPIView): #validated
    serializer_class = CandidateSerializer
    queryset= ''
    @swagger_auto_schema(operation_description="List candidates of specific selection", operation_id='list_selection_candidates')
    def get(self, request, pk):      
        try:
            sel = Selection.objects.get(pk = pk)
            resumes = Candidate.objects.filter(selection = sel).order_by("-info__rank")
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
            list = []
            for row in sel:
                resumes = Candidate.objects.filter(selection = row)
                for cand in resumes:
                    list.append(cand)
            if len(resumes) == 0:
                return Response({'error': '¡Que raro! Usuario no cuenta con candidatos y sus CVs, creaste alguna selección?'}
                            , status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({'error': 'No se encontraron datos para este usuario, inicia incidencia con código DATOS_USER_SEL'}
                            , status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(list, many=True)

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
        user = User.objects.get(email=serializer.initial_data['user'])
        serializer.initial_data['user'] = user.id
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

    desc = 'url_arg: token \n params -> content, subject, to, cc     to and cc as array [] \ntype: mail'

    @swagger_auto_schema(operation_description=desc, operation_id='send_mail_candidate')
    def post(self, request, token):
        """
        args_url: access_token
        args request: mail, sender, to, cc, subject, html message
        """
        serializer = self.serializer_class(data=request.data)
        user = User.objects.get(email=serializer.initial_data['user'])
        serializer.initial_data['user'] = user.id
        event = serializer.initial_data
        event_info = event['info']
        if user.auth_provider == 'google':

                body = create_gmail(user.email, event_info['to'], event_info['cc'], event_info['subject'], event_info['content'])
                send = send_gmail(token, user.email, body)
                if send.status_code == 401:
                    return Response({'error': 'Se requiere un nuevo token'}, status=status.HTTP_401_UNAUTHORIZED)
                elif send.status_code == 403:
                    return Response({'error': 'La información de token no corresponde a la del usuario'}, status=status.HTTP_403_FORBIDDEN)
                else:
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    return Response({'created_data': serializer.data}, status=status.HTTP_201_CREATED)
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

    @swagger_auto_schema(operation_description="post to create events.\n info JSON: subject, content, start, end, attendees \n Datetime format for start and end in post request 2020-12-07T20:00:00\n attendees format ['mail1', 'mail2'] (microsoft and google)\n type: mail or meeting", operation_id='user_event_create')
    def post(self, request, token):

        """
        args_url: access_token
        args request: subject, start, end, attendees
        """
        serializer = self.serializer_class(data=request.data)
        user_id = User.objects.get(email=serializer.initial_data['user'])
        serializer.initial_data['user'] = user_id.id
        event = serializer.initial_data
        event_info = event['info']
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


        
class CreateExcelAPIView(generics.GenericAPIView):  #validated
    serializer_class = CreateExcelSerializer

    @swagger_auto_schema(operation_description="post to create excel files, the possible types for agr in url are: selection, historic, candidate \n the payload is user (string_mail) and type_id (selection_id for candidates)", operation_id='create_excel')
    def get(self, request, type, id, mail):

        """
        args_url: type: selection, historic or candidate
        args payload: null
        """
        user_id = User.objects.get(email=mail)
        if type != 'candidate': #for selections and historic
            if type == 'historic':
                filename = 'Historico'
                df_excel= pd.DataFrame(columns=['Nombre', 'Mail', 'Celular', 'Ubicación', 'Universidad', 'Título', 'Año egreso', 'Idiomas', 'Skills', 'Empresas pasadas', 'Cargos', 'Certificaciones'])

                sel = Selection.objects.filter(user = user_id)
                tmp_list = []
                for row in sel:
                    candidate = Candidate.objects.filter(selection = row)
                    for cand in candidate:
                        info = cand.info['data']
                        tmp_list.append([cand.name, cand.mail, info['phone'], info['location'], info['college'], info['degree'], info['graduation'], info['idioms'], info['skills'], info['companies'], info['designation'], info['certifications']])
                df_excel = df_excel.append(pd.DataFrame(tmp_list, columns = df_excel.columns))

            elif type == 'selection':
                filename = 'Selecciones'
                df_excel = pd.DataFrame(columns=['Nombre', 'Descripción', 'Area', 'Vacantes', 'Mínimo', 'Requerido', 'Outstanding', 'Normal', 'Low'])

                sel = Selection.objects.filter(user = user_id)
                tmp_list = []
                for row in sel:
                    min = '{} - {} - {} - {}'.format(row.requirements['exp'], row.requirements['idioms'], row.requirements['skills'], row.requirements['location'])
                    des = '{} - {} - {} - {} - {} - {}'.format(row.desired['exp'], row.desired['idioms'], row.desired['skills'], row.desired['degree'], row.desired['designation'], row.desired['college'])
                    tmp_list.append([row.name, row.description, row.area, row.vacant, min, des, row.kpis['high'], row.kpis['medium'], row.kpis['low']])
                df_excel = df_excel.append(pd.DataFrame(tmp_list, columns = df_excel.columns))
                
         
        else: # for selection candidates
            filename = 'Candidatos'
            df_excel= pd.DataFrame(columns=['Nombre', 'Mail', 'Celular', 'Ubicación', 'Universidad', 'Título', 'Año egreso', 'Idiomas', 'Skills', 'Empresas pasadas', 'Cargos', 'Certificaciones'])
            try:
                sel = Selection.objects.get(id = id)
                tmp_list = []
                candidate = Candidate.objects.filter(selection = sel)
                for cand in candidate:
                    info = cand.info['data']
                    tmp_list.append([cand.name, cand.mail, info['phone'], info['location'], info['college'], info['degree'], info['graduation'], info['idioms'], info['skills'], info['companies'], info['designation'], info['certifications']])
                df_excel = df_excel.append(pd.DataFrame(tmp_list, columns = df_excel.columns))
            except:
                return Response({'error': 'Seleccion no se pudo encontrar o candidatos tienen error'}, status=status.HTTP_400_BAD_REQUEST)
        
        excel_file = BytesIO()
        xlwriter = pd.ExcelWriter(excel_file, engine='xlsxwriter')
        df_excel.to_excel(xlwriter, 'Datos')
        xlwriter.save()
        xlwriter.close()
        # important step, rewind the buffer or when it is read() you'll get nothing
        # but an error message when you try to open your zero length file in Excel
        excel_file.seek(0)
        # set the mime type so that the browser knows what to do with the file
        response = HttpResponse(excel_file.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        # set the file name in the Content-Disposition header
        header = 'attachment; filename={}.xlsx'.format(filename)
        response['Content-Disposition'] = header
        return response
