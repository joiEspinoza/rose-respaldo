from django.urls import path

from .views import GoogleSocialAuthView, MicrosoftSocialAuthView

urlpatterns = [
    path('google/', GoogleSocialAuthView.as_view()),
    path('microsoft/', MicrosoftSocialAuthView.as_view()),
]
