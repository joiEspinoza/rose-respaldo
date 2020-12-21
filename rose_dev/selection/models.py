from django.db import models

from authentication.models import User

# Create your models here.
"""
Some models are not going to be created inmediately but the structure
is pretty clear already:
1- Customizable: Custom objects, text and tutorials mostly. Changeitem from JIRA logic
    #type of custom: text, url, other
    #value
    #description
2- Candidate: Candidate information

3- Selection: List of process 

4- Issues: Issues recorded in ROSE v0 per client

5- Config: Limitations of each user, licence information, etc
    - MAYBE** -> having different models for each client
"""


class Timestamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Selection(Timestamp):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100) #front validates
    description = models.CharField(max_length=300) #front validates
    area = models.CharField(max_length=100)
    subarea = models.CharField(max_length=100)
    industry = models.CharField(max_length=100)
    is_remote = models.BooleanField(default=False)
    status = models.CharField(max_length=100)
    vacant = models.IntegerField(blank=True, null=True)
    requirements = models.JSONField(blank=True, null=True)
    desired = models.JSONField(blank=True, null=True)
    kpis = models.JSONField(blank=True, null=True)
    storage_url = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.name



class Candidate(Timestamp):
    id = models.AutoField(primary_key=True)
    selection = models.ForeignKey(Selection, on_delete=models.CASCADE)
    name = models.CharField(max_length=100) #front validates
    mail = models.CharField(max_length=100, blank=True, null=True) #front validates
    info = models.JSONField(null=True)

    def __str__(self):
        return self.name



class Issue(Timestamp):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100) #front validates
    summary = models.CharField(max_length=100) #front validates
    module = models.CharField(max_length=50)
    code = models.CharField(max_length=10)

    def __str__(self):
        return '%s %s' % (self.code, self.name)


class Custom(Timestamp):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=100) 
    value = models.CharField(max_length=5000)

    def __str__(self):
        return self.name


class UserConfig(Timestamp):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    license_type = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    value = models.CharField(max_length=100)

    def __str__(self):
        return 'Licence and user: %s / %s' % (self.license_type, self.user)

class ChangeItem(models.Model):
    id = models.AutoField(primary_key=True)
    #config = models.ManyToManyField(UserConfig) DEPRECATED
    field = models.CharField(max_length=100)
    value_from = models.CharField(max_length=100)
    value_to = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Changed from: %s to %s' % (self.value_from, self.value_to)


class UserEvent(Timestamp):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    info = models.JSONField(null=True)

    def __str__(self):
        return self.info['subject']


