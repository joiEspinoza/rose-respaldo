from django.urls import path
from .views import CreateEventAPIView, GetUserEventsAPIView, CreateCandidateAPIView, WelcomeAPIView, ListTutorialsAPIView, ListUserCandidatesAPIView, ListSelectionAPIView, SelectionAPIView, CreateSelectionAPIView, ListSelectionCandidatesAPIView, CandidateAPIView, CreateIssueAPIView, IssueAPIView, SendMailAPIView
#from .views import CreateEventAPIView, GetUserEventsAPIView, CreateCandidateAPIView, WelcomeAPIView, ListTutorialsAPIView, ListUserCandidatesAPIView, ListSelectionAPIView, SelectionAPIView, CreateSelectionAPIView, ListSelectionCandidatesAPIView, CandidateAPIView, CreateIssueAPIView, IssueAPIView, SendMailAPIView
#from .views import 


urlpatterns = [
    path('home/<str:mail>/', WelcomeAPIView.as_view(), name="home"),
    path('list/<str:mail>/', ListSelectionAPIView.as_view(), name="list selections"),
    path('<int:pk>/', SelectionAPIView.as_view(), name="selection"),
    path('create/', CreateSelectionAPIView.as_view(), name="create selection"),
    path('issues/<int:pk>/', IssueAPIView.as_view(), name="get issue"),
    path('issues/create/', CreateIssueAPIView.as_view(), name="create issue"),
    path('candidate/<int:pk>/', CandidateAPIView.as_view(), name="get candidate"),
    path('create_candidate/', CreateCandidateAPIView.as_view(), name="create candidate"),
    path('tutorials/', ListTutorialsAPIView.as_view(), name="list tutorials"),
    path('<int:pk>/candidates/', ListSelectionCandidatesAPIView.as_view(), name="list selection candidates"),
    path('<str:mail>/candidates/', ListUserCandidatesAPIView.as_view(), name="list user candidates"),
    path('sendmail/<str:token>', SendMailAPIView.as_view(), name="send mail"),
    path('events/<str:username>/<str:token>', GetUserEventsAPIView.as_view(), name="list events"),
    path('create_event/<str:token>', CreateEventAPIView.as_view(), name="create events"),
              ]

"""
    path('login/', LoginAPIView.as_view(), name="login"),
    path('logout/', LogoutAPIView.as_view(), name="logout"),
    path('email-verify/', VerifyEmail.as_view(), name="email-verify"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('request-reset-email/', RequestPasswordResetEmail.as_view(),
         name="request-reset-email"),
    path('password-reset/<uidb64>/<token>/',
         PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('password-reset-complete', SetNewPasswordAPIView.as_view(),
         name='password-reset-complete')
]


"""
