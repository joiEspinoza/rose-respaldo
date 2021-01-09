from django.urls import path
from .views import RegisterView, SetNewPasswordAPIView, VerifyEmail, LoginAPIView, RequestPasswordResetEmail


urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', LoginAPIView.as_view(), name="login"),
    path('email-verify/<str:username>/', VerifyEmail.as_view(), name="email-verify"),
    path('request-reset-email/', RequestPasswordResetEmail.as_view(),
         name="request-reset-email"),
    path('password-reset-complete/<str:username>', SetNewPasswordAPIView.as_view(),
         name='password-reset-complete')
]
