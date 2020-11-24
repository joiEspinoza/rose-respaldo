import argparse
import requests
import base64
from pprint import pformat
from pprint import pprint
import os
import ast
import json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

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
    print(sender + ', ' + to + ', ' + subject + ', ' + message_text)
    message = MIMEText(message_text, 'html')
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    message['cc'] = cc
    pprint(message)
    return {'raw': base64.urlsafe_b64encode(message.as_string().encode('utf-8')).decode('utf-8')}

def send_gmail(access_token, user_id, message_in):
    """Send an email message.

    Args:
    acces_token: Authorized Gmail API access_token with react.
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
    print(send.status_code)
    print(send.text)
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
    print(json.dumps(body))
    send = requests.post(endpoint,headers=headers, data=json.dumps(body))
    return send