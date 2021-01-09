from django.contrib import admin

# Register your models here.
from .models import Selection, UserEvent, Candidate, Issue, Custom, UserConfig, ChangeItem

admin.site.register(Selection)
admin.site.register(Candidate)
admin.site.register(Custom)
admin.site.register(UserConfig)
admin.site.register(ChangeItem)
admin.site.register(Issue)
admin.site.register(UserEvent)