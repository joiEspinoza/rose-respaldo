import argparse
import requests
import base64
from pprint import pformat
from pprint import pprint
import os
import ast
import json
import datetime
import pytz
from pytz import timezone
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
utc = pytz.utc
#access_token='ya29.a0AfH6SMDP9o4QNRuXgFnfVjBD29vnK7algvunXYo_4A_MFoVQU0BPRsJoGmgRzEmHqk_LWEd3rbhzWdDzld2iisecy2K01VWtyg3P00cZ-B1w_qPK-_-a-7zSawpAuf2H9F1XKzJV_tGr7qmTyMNKIQXYJCMPjT7Y5ia6hmdGuLMY'


def create_gmail(sender, to, cc, subject, message_text):
    """Create a message for an email.

    Args:
    sender: Email address of the sender.
    to: Email address of the receiver.
    subject: The subject of the email message.
    message_text: The text of the email message.

    Returns:
    An object containing a base64url encoded email object.
    """
    #print(sender + ', ' + to + ', ' + subject + ', ' + message_text)
    message = MIMEText(message_text, 'html')
    message['to'] = ';'.join(to)
    message['from'] = sender
    message['subject'] = subject
    message['cc'] = ';'.join(cc)
    return {'raw': base64.urlsafe_b64encode(message.as_string().encode('utf-8')).decode('utf-8')}

def send_gmail(access_token, user_id, message_in):
    """Send an email message.

    Args:
    access_token: Authorized Gmail API access_token with react.
    user_id: User's email address. The special value "me"
    can be used to indicate the authenticated user.
    message: Message to be sent.

    Returns:
    Sent Message.
    """
    headers={"Authorization": "Bearer "+ access_token, "content-type": "application/json"}
    endpoint = 'https://gmail.googleapis.com/gmail/v1/users/' + user_id + '/messages/send'
    send = requests.post(endpoint, headers=headers, data=json.dumps(message_in))
    #pprint(message_in)
    #message = (service.users().messages().send(userId=user_id, body=message_in).execute())
    #print ('Message Id: %s' % message['id'])
    return send


#message = '<p><b>This is a bold paragraph</b></p> <p>And this is a <a href="https://myfuture.ai"> link </a></p>'
#body = create_message('señorBGG','bgonzalez@myfuture.ai','bengonzalez1995@gmail.com','Testing REST + SDK',message)
#send_message(access_token, 'bengonzalez1995@gmail.com', body)

def send_outlook(access_token, content, subject, to, cc):
    """
    args:
    access_token from oauth2
    content in html (body)
    subject of mail
    to recipients in area array -> ['mail1@gmail.com','mail2@gmail.com']
    cc recipients in area array -> ['mail1@gmail.com','mail2@gmail.com']
    """
    endpoint = 'https://graph.microsoft.com/v1.0/me/sendMail'
    to_json = []
    cc_json = []
    for rec in to:
        transform = rec.replace(rec,'{"emailAddress":{"address":"' + rec + '"}}')
        to_json.append(transform)
    for rec in cc:
        transform = rec.replace(rec,'{"emailAddress":{"address":"' + rec + '"}}')
        cc_json.append(transform)
    headers = {"Authorization": "Bearer "+ access_token, "content-type": "application/json"}
    body = {
            "message":
                {
                "subject": subject,
                "body": {"contentType":"HTML","content": content},
                "toRecipients": [ast.literal_eval(s) for s in to_json],
                "ccRecipients": [ast.literal_eval(s) for s in cc_json],
                }
            }
    #print(json.dumps(body))
    send = requests.post(endpoint,headers=headers, data=json.dumps(body))
    return send

def get_outlookevents(access_token, tz):
    """
    args:
    access_token from oauth2
    """
    endpoint = 'https://graph.microsoft.com/v1.0/me/events?$select=subject,attendees,start,end,location'
    my_tz = 'outlook.timezone="' + tz + '"'
    headers = {"Authorization": "Bearer "+ access_token, "content-type": "application/json", "Prefer": my_tz}
    #print(json.dumps(body))
    get_events = requests.get(endpoint,headers=headers)
    #print(get_events.json()['value'])
    return get_events
#access_token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IjN6cDdMTEhyRElHSmllNzFxY1o5UlhabkVzVjhmanhtZVJmNU40YmpoclUiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kODE1YmI0OC1jY2U4LTRhNzktODcxZS0zNzdlN2U4Yjk1YjkvIiwiaWF0IjoxNjA3MjIyMDYxLCJuYmYiOjE2MDcyMjIwNjEsImV4cCI6MTYwNzIyNTk2MSwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiRTJSZ1lPRE9MbTBKQ0hWWHZOZjBYSHp0TXJXNXo4SzljbGxZT3o0MWk3Mlk5RVQ5b2hnQSIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggZXhwbG9yZXIgKG9mZmljaWFsIHNpdGUpIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkdvbnrDoWxleiIsImdpdmVuX25hbWUiOiJCZW5qYW1pbiIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjIwMC44Ni4yNDcuMjEiLCJuYW1lIjoiQmVuamFtaW4gR29uesOhbGV6Iiwib2lkIjoiMjQ0ODk5NWQtNDc1MC00MGU4LTllMGItYTEwNmIxZGZhMTJjIiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAwNERDQzE3QkYiLCJyaCI6IjAuQUFBQVNMc1YyT2pNZVVxSEhqZC1mb3VWdWJYSWk5NzUyYkZJcUsyM1NOcHlVR1EwQU5RLiIsInNjcCI6IkFjY2Vzc1Jldmlldy5SZWFkLkFsbCBBY2Nlc3NSZXZpZXcuUmVhZFdyaXRlLkFsbCBBZ3JlZW1lbnQuUmVhZC5BbGwgQWdyZWVtZW50LlJlYWRXcml0ZS5BbGwgQWdyZWVtZW50QWNjZXB0YW5jZS5SZWFkIEFncmVlbWVudEFjY2VwdGFuY2UuUmVhZC5BbGwgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDb250YWN0cy5SZWFkV3JpdGUgRmlsZXMuUmVhZFdyaXRlLkFsbCBNYWlsLlJlYWRXcml0ZSBNYWlsLlNlbmQgTm90ZXMuUmVhZFdyaXRlLkFsbCBvcGVuaWQgUGVvcGxlLlJlYWQgcHJvZmlsZSBTaXRlcy5SZWFkV3JpdGUuQWxsIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiI1OERHaDNOQ0FNRWRLRzMyYkp2TDhUbVUtVDJFRk9VdGlaTjBad0RacnZnIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IlNBIiwidGlkIjoiZDgxNWJiNDgtY2NlOC00YTc5LTg3MWUtMzc3ZTdlOGI5NWI5IiwidW5pcXVlX25hbWUiOiJiZ29uemFsZXpAbXlmdXR1cmUuYWkiLCJ1cG4iOiJiZ29uemFsZXpAbXlmdXR1cmUuYWkiLCJ1dGkiOiJKVEl4dWlSckxVcUdWUUpsS3NDbkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6IklDenV5QXQ1TVR0blZaaEJfVjV2TWhXNER2ZWNsSkRsOFFYams2Vy1FdWcifSwieG1zX3RjZHQiOjE1NjEwNDM5MDd9.NrJEVTCR8eRhPdf1kcQUoKArH_RRe9xiBtpAqUu-tWyCz1bgQno80YNPjFQEuHykuFXtZPPJUNozIX0k3Eo-tuew87zUUF7iJS5DH7rT2K4HLPvua4rSAYMhy950NvTXh3E2VTi10ep0APUORGTnIZwT8ru2dtrCBv7WlqyRDS-umjbwGK4YpPypzP1yihV20WqjE-QyF7EEt5XgLKNkV7OfwqRnJYzRVm8c7lzs3OTJBMjDoJt8frrB0JSRlWNo_Eb101IxRGp6sbTwAyJEo6VVrtYKGEFFjfIHOMwH7DVo9_Rg1TI-FexLRU_ubJ1eX1A-q7roGFZLY4rIzmZqaA'
#get_outlookevents(access_token)
 

def create_outlook_event(access_token, subject, content, start, end, attendees, timezone):
    """
    args:
    access_token from oauth2
    subject, theme of meeting
    start of meeting, format 2020-12-07T20:00:00
    end of meeting
    to recipients in area array -> ['mail1@gmail.com','mail2@gmail.com']
    """
    endpoint = 'https://graph.microsoft.com/v1.0/me/events'
    attendees_json = []
    for attendee in attendees:
        transform = attendee.replace(attendee,'{"emailAddress":{"address":"' + attendee + '"},"type":"required"}')
        attendees_json.append(transform)
    headers = {"Authorization": "Bearer "+ access_token, "content-type": "application/json"}
    body = {
            "subject": subject,
            "body": {
                "contentType": "HTML",
                "content": content
                    },
            "originalStartTimeZone": timezone,
            "start": {"dateTime": start, "timeZone":timezone},
            "end": {"dateTime": end, "timeZone":timezone},
            "attendees": [ast.literal_eval(s) for s in attendees_json]
            }

    #print(json.dumps(body))
    send = requests.post(endpoint,headers=headers, data=json.dumps(body))
    return send
#access_token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IlJJZVB2eVh3V1FIZ1J6c2Jubk5tZ2tsLU5ZMVJpWmw4Q19XZjZTN3BPOWMiLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kODE1YmI0OC1jY2U4LTRhNzktODcxZS0zNzdlN2U4Yjk1YjkvIiwiaWF0IjoxNjA3MjI1NjY0LCJuYmYiOjE2MDcyMjU2NjQsImV4cCI6MTYwNzIyOTU2NCwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiRTJSZ1lKaTlUMlpUUUtlVHdSdlBmcXZDeXpmTFpnZHZtQi8yM1VLbDBOL0dNcVRZZHo4QSIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggZXhwbG9yZXIgKG9mZmljaWFsIHNpdGUpIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IkdvbnrDoWxleiIsImdpdmVuX25hbWUiOiJCZW5qYW1pbiIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjIwMC44Ni4yNDcuMjEiLCJuYW1lIjoiQmVuamFtaW4gR29uesOhbGV6Iiwib2lkIjoiMjQ0ODk5NWQtNDc1MC00MGU4LTllMGItYTEwNmIxZGZhMTJjIiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAwNERDQzE3QkYiLCJyaCI6IjAuQUFBQVNMc1YyT2pNZVVxSEhqZC1mb3VWdWJYSWk5NzUyYkZJcUsyM1NOcHlVR1EwQU5RLiIsInNjcCI6IkFjY2Vzc1Jldmlldy5SZWFkLkFsbCBBY2Nlc3NSZXZpZXcuUmVhZFdyaXRlLkFsbCBBZ3JlZW1lbnQuUmVhZC5BbGwgQWdyZWVtZW50LlJlYWRXcml0ZS5BbGwgQWdyZWVtZW50QWNjZXB0YW5jZS5SZWFkIEFncmVlbWVudEFjY2VwdGFuY2UuUmVhZC5BbGwgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDb250YWN0cy5SZWFkV3JpdGUgRmlsZXMuUmVhZFdyaXRlLkFsbCBNYWlsLlJlYWRXcml0ZSBNYWlsLlNlbmQgTm90ZXMuUmVhZFdyaXRlLkFsbCBvcGVuaWQgUGVvcGxlLlJlYWQgcHJvZmlsZSBTaXRlcy5SZWFkV3JpdGUuQWxsIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiI1OERHaDNOQ0FNRWRLRzMyYkp2TDhUbVUtVDJFRk9VdGlaTjBad0RacnZnIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IlNBIiwidGlkIjoiZDgxNWJiNDgtY2NlOC00YTc5LTg3MWUtMzc3ZTdlOGI5NWI5IiwidW5pcXVlX25hbWUiOiJiZ29uemFsZXpAbXlmdXR1cmUuYWkiLCJ1cG4iOiJiZ29uemFsZXpAbXlmdXR1cmUuYWkiLCJ1dGkiOiJQN0dncjE5STdFbTNSdmJJN2tyTkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiLCJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6IklDenV5QXQ1TVR0blZaaEJfVjV2TWhXNER2ZWNsSkRsOFFYams2Vy1FdWcifSwieG1zX3RjZHQiOjE1NjEwNDM5MDd9.ELIuesWPDSk5A0XJwihEwnpVKRQtEC-mfIrMp4nTKpmFM-mm4pAu0Tp3iDLreGgos2UUETo246esP4a8Xben4nG1saTnodj5MoZXufwymA-QIzzZs_xsj3UJGI-JaKdh5UJhMoN2zUbn6_bDw-TsxAJRnm9oV2iW599JjwIVFGm4ylYgKe-X6on142bPZo3TTVPhPreFlJRAgzg1vWKIM8mSsicuaR5UWP9Tf6FKbrZzWkTTBBAL1YheISJ1b8k6IalEtkRyck01DwvY9zJf5HlPQIEv4zkkWlidwDyPvxQVcSH6oMFL7Vx2DvucyCF8tozhJs0mhd4csGLk6pRxtA'
#subject = 'Testing view directly'
#start = '2020-12-07T21:00:00'
#end = '2020-12-07T22:00:00'
#at = ['bengonzalez1995@gmail.com','benja.gonzalezguerrero@gmail.com']
#t="Pacific SA Standard Time"
#send = create_outlook_event(access_token, subject, start, end, at)
#print(send.text)

def get_gmailevents(access_token, tz):
    """Send an email message.

    Args:
    acces_token: Authorized Gmail API access_token with react.
    tz: timezone of the user, from UserConfig, automatic param
    message: Message to be sent.

    Returns:
    Sent Message.
    """
    headers={"Authorization": "Bearer "+ access_token, "content-type": "application/json"}
    endpoint = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
    my_tz = timezone(tz)
    now = datetime.now()
    my_time = now.astimezone(my_tz)
    fmt = '%Y-%m-%dT%H:%M:%SZ'
    params = {"timeMin": my_time.strftime(fmt)}
    getcalendars = requests.get(endpoint, headers=headers, params=params)
    #pprint(message_in)
    #message = (service.users().messages().send(userId=user_id, body=message_in).execute())
    #print(getcalendars.status_code)
    #print(getcalendars.text)
    #print ('Message Id: %s' % message['id'])
    return getcalendars

token = 'ya29.a0AfH6SMB8q1hyZ6iu9ClPBecSZ-ELV3G3Z95ozTMR1HpXbZ48VHE3TkfOurjbsOrhQDhs61khYyYf5fhPQe7BljVgF1Qe8_YZcJG7bW9yEH8Nl4Gv9PN4rcDn6aPf-mu0Zm-U-wkuZ_5zTdUhBu87y1pa37vhEpX5cZkCc5goudk'
#results = get_gmailevents(token, 'America/Santiago')
#print(results)


def create_gmail_event(access_token, subject, content, start, end, attendees, timezone):
    """
    args:
    access_token from oauth2
    subject, theme of meeting
    start of meeting, format 2020-12-07T20:00:00
    end of meeting
    to recipients in area array -> ['mail1@gmail.com','mail2@gmail.com']
    """
    endpoint = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
    attendees_json = []
    for attendee in attendees:
        transform = attendee.replace(attendee,'{"email":"' + attendee + '"}')
        attendees_json.append(transform)
    headers = {"Authorization": "Bearer "+ access_token, "content-type": "application/json"}
    body = {
            "end": {"dateTime": end, "timeZone": timezone},
            "start": {"dateTime": start, "timeZone": timezone},
            "summary": subject,
            "description": content,
            "attendees": [ast.literal_eval(s) for s in attendees_json]
            }
    params = {"sendUpdates": "all"}
    #print(json.dumps(body))
    send = requests.post(endpoint,headers=headers, data=json.dumps(body), params=params)
    return send


#subject = 'Testing view directly2222222'
#desc = 'descripción de prueba para el evento de la API'
#start = '2020-12-07T21:00:00'
#end = '2020-12-07T22:00:00'
#at = ['bgonzalez@myfuture.ai','benja.gonzalezguerrero@gmail.com']
#t='America/Santiago'
#results = create_gmail_event(token, subject, desc, start, end, at, t)
#print(results)
