# Generated by Django 3.1.4 on 2021-02-11 07:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('selection', '0010_auto_20201220_0310'),
    ]

    operations = [
        migrations.AlterField(
            model_name='custom',
            name='description',
            field=models.CharField(max_length=800),
        ),
    ]