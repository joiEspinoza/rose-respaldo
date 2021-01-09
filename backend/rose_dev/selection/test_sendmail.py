#import msal
import requests
import json 
import os
import codecs
import ast


#os.getcwd()
#access_token = 'ya29.a0AfH6SMAmBGlI-0qst81lGBB12-2aqttlZ4f1gq09MPHp-KMYlZ1JqfHpS4fOK4OaFfLcf-vnAGkFdfxJ1sBLeYgIDWaK-NPHo8OvLqQ2AvAYgcAlC4TO6Wy04RooJJjjVWSClMgmesE2k441pqQaiapUYxLjGXjqkRyzSVf3qEyc'
#your_client_id= '374514394577-gn2bvmp9cjnsjn53aq0p575mdidpot47.apps.googleusercontent.com'
#your_client_secret = 'cf3NcMsZkPJvKWicKfZo8sub'
#url = 'https://gmail.googleapis.com/gmail/v1/users/bengonzalez1995@gmail.com/messages/send'




def send_mail():
    """
    validate method Queries the facebook GraphAPI to fetch the user info
    """
    content = "VG86IDxiZW5nb256YWxlejE5OTVAZ21haWwuY29tPgpTdWJqZWN0OiBUZXN0aW5nIEVtYWlsIEFQSQoKVGVzdCBoZWxvb29vb28="
    headers={"Authorization": "Bearer "+ access_token, "content-type": "application/json"}
    data = {
        "raw": content
         }
    try:
        q = requests.post(url,headers=headers, data=data)
        result = q
        print(result.text)
        if q.status_code == 200:
            print(result)
            return result
        else:
            return "The token is invalid or expired."
        #graph = facebook.GraphAPI(access_token=auth_token)
        #profile = graph.request('/me?fields=name,email')
        
    except:
        return "The token is invalid or expired."


def auth(auth_code):
    
    #print(json.loads(f.read())['web']['redirect_uris'][1])
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
    SCOPES = ['https://www.googleapis.com/auth/gmail.send']
    auth_code = '4/0AY0e-g55vP3zo_Yx8uZQQc-Ekcl115Pm27Yva9gc6ODNSa0EtWXfE1O56qPDl_ScoCguPg'
    your_client_id= '374514394577-folqu39v76n3195s70eq2npf6bt4hr2r.apps.googleusercontent.com'
    your_client_secret = 'TB40gmhn2EaRODb9TUlxjozZ'
    url = 'https://accounts.google.com/o/oauth2/token'
    
    flow = flow_from_clientsecrets(client_secrets, ' '.join(SCOPES))

    #flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
    #    client_secrets,
    #    scopes=SCOPES)
    f = codecs.open(client_secrets, 'r')
    redirect = json.loads(f.read())['web']['redirect_uris'][0]
    redirect = 'http://localhost:3000'
    flow.redirect_uri = redirect
    ### not 'http://localhost' 
    ###or 'http://localhost:8000/' or 'http://localhost/' 
    #or'http://localhost:8000', somethings up
    credentials = flow.step2_exchange(auth_code)
    #creds = flow.run_local_server(port=0)
    #a = flow.fetch_token(code=auth_code)
    print(credentials)

    #4/0AY0e-g6EDMyhyaitaGeAP_aCG_nI4a_uVUwKkXJzGt5KGWMJm-wPeOKvdhnKNTIn7WskNQ
    #get_tokens(auth_code)

#send_mail()


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


access_token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IjNRb2JiSDhWYzI0YVRfYWJKbzJPNld4UzhfQzF1Mm1yeXE1U3ZrTG96aU0iLCJhbGciOiJSUzI1NiIsIng1dCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCIsImtpZCI6ImtnMkxZczJUMENUaklmajRydDZKSXluZW4zOCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9kODE1YmI0OC1jY2U4LTRhNzktODcxZS0zNzdlN2U4Yjk1YjkvIiwiaWF0IjoxNjA2MTgzMTE5LCJuYmYiOjE2MDYxODMxMTksImV4cCI6MTYwNjE4NzAxOSwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiQVNRQTIvOFJBQUFBMkdIM2Y4ci9iM3hra3RVWjJhYlZoNnl4aGFDVUZQN3l4SUhzYjAzbTl6WT0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIChvZmZpY2lhbCBzaXRlKSIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJHb256w6FsZXoiLCJnaXZlbl9uYW1lIjoiQmVuamFtaW4iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIyMDAuODYuMjQ3LjIxIiwibmFtZSI6IkJlbmphbWluIEdvbnrDoWxleiIsIm9pZCI6IjI0NDg5OTVkLTQ3NTAtNDBlOC05ZTBiLWExMDZiMWRmYTEyYyIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMDREQ0MxN0JGIiwicmgiOiIwLkFBQUFTTHNWMk9qTWVVcUhIamQtZm91VnViWElpOTc1MmJGSXFLMjNTTnB5VUdRMEFOUS4iLCJzY3AiOiJBY2Nlc3NSZXZpZXcuUmVhZC5BbGwgQWNjZXNzUmV2aWV3LlJlYWRXcml0ZS5BbGwgQWdyZWVtZW50LlJlYWQuQWxsIEFncmVlbWVudC5SZWFkV3JpdGUuQWxsIEFncmVlbWVudEFjY2VwdGFuY2UuUmVhZCBBZ3JlZW1lbnRBY2NlcHRhbmNlLlJlYWQuQWxsIENhbGVuZGFycy5SZWFkV3JpdGUgQ29udGFjdHMuUmVhZFdyaXRlIEZpbGVzLlJlYWRXcml0ZS5BbGwgTWFpbC5SZWFkV3JpdGUgTWFpbC5TZW5kIE5vdGVzLlJlYWRXcml0ZS5BbGwgb3BlbmlkIFBlb3BsZS5SZWFkIHByb2ZpbGUgU2l0ZXMuUmVhZFdyaXRlLkFsbCBUYXNrcy5SZWFkV3JpdGUgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwgVXNlci5SZWFkQmFzaWMuQWxsIFVzZXIuUmVhZFdyaXRlIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiNThER2gzTkNBTUVkS0czMmJKdkw4VG1VLVQyRUZPVXRpWk4wWndEWnJ2ZyIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJTQSIsInRpZCI6ImQ4MTViYjQ4LWNjZTgtNGE3OS04NzFlLTM3N2U3ZThiOTViOSIsInVuaXF1ZV9uYW1lIjoiYmdvbnphbGV6QG15ZnV0dXJlLmFpIiwidXBuIjoiYmdvbnphbGV6QG15ZnV0dXJlLmFpIiwidXRpIjoiSzBQQnc1T1RrVWFyQWhPS0l2aUhBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19zdCI6eyJzdWIiOiJJQ3p1eUF0NU1UdG5WWmhCX1Y1dk1oVzREdmVjbEpEbDhRWGprNlctRXVnIn0sInhtc190Y2R0IjoxNTYxMDQzOTA3fQ.AHO1_mNKD2l4wBPReOlGf-oZPerUhuegUNuTZReg12gfrwZD0K4xot-APgdrV0Y6OgYskqyXb0gZcKkldziSLDr_sZ5tVW1ZGN2glpxeU97RkUhj0n3fUDQRZPjDi5QNw86bRYm0EnkxxtrHtF-0Ks7o6E8P7O5g--7EyyL6rGxQqGsNbxopikCmPebQMJSJ270s0eNcz76XFJW-PNiGOTmXy1SrSa1sBTYHwuyhDL_U4tSD9yCnKixNwqURXenzdlkWJMCZ5F_2_qI8yvf6kAx5q9TxVkip4LgI7OL2-Ye6zs9NspRrA3eEdKYbst0_9lC-ea0GADB-dt9ZCK3RWQ'
to_test = ['catamunoz@myfuture.ai','bgonzalez@fractal-bi.com']
cc_test = ['bengonzalez1995@gmail.com','benja.gonzalezguerrero@gmail.com']
subject = 'I like to move it move it'
content = '<p><b>This is a bold paragraph</b></p> <p>And this is a <a href="https://myfuture.ai"> link </a></p> <ul><li>Coffee</li><li>Tea</li><li>Milk</li></ul>'

test = send_outlook(access_token, content, subject, to_test, cc_test)
print(test.status_code)


