#import msal
import requests
import json 

class Microsoft:

    @staticmethod
    def validate(auth_token):
        """
        validate method Queries the facebook GraphAPI to fetch the user info
        """
        headers = {"Authorization": 'Bearer ' + auth_token}
        try:
            q = requests.get('https://graph.microsoft.com/v1.0/me/', headers = headers)
            result = q.json()
            if q.status_code == 200:
                return result
            else:
                return "The token is invalid or expired."
            #graph = facebook.GraphAPI(access_token=auth_token)
            #profile = graph.request('/me?fields=name,email')
        
        except:
            return "The token is invalid or expired."

