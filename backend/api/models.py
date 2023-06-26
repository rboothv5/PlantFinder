from django.db import models
from numpy import datetime_as_string, integer

import json
        
class identificationsModel(models.Model):
	
    identificationsid=models.IntegerField()
    filename=models.CharField(blank=True, null=True,max_length=200)
    identifiedplant=models.CharField(blank=True, null=True,max_length=200)
    description=models.CharField(blank=True, null=True,max_length=1000)
    allidentifiedplants=models.CharField(blank=True, null=True,max_length=200)
    score=models.DecimalField(blank=True, null=True,max_digits=5, decimal_places=2)
      
    class Meta:
        db_table="identifications"   
        
class userinformationModel(models.Model):
	
    identificationsid=models.IntegerField()
    filename=models.CharField(blank=True, null=True,max_length=200)
    firstname=models.CharField(blank=True, null=True,max_length=50)
    surname=models.CharField(blank=True, null=True,max_length=50)
    comments=models.CharField(blank=True, null=True,max_length=500)
    
    class Meta:
        db_table="userinformation"     

class imageinformationModel(models.Model):
	
    identificationsid=models.IntegerField()
    filename=models.CharField(blank=True, null=True,max_length=200)
    imagedate=models.DateTimeField(blank=True, null=True)
    dateadded=models.DateTimeField(blank=True, null=True)
    latitude=models.DecimalField(blank=True, null=True, max_digits = 30, decimal_places = 25)
    longitude=models.DecimalField(blank=True, null=True, max_digits = 30, decimal_places = 25)
     
    class Meta:
        db_table="imageinformation"                
        
