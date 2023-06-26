from rest_framework import serializers
from api.models import identificationsModel
from api.models import imageinformationModel
from api.models import userinformationModel

class identificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model=identificationsModel
        fields=['identificationsid', 'filename', 'identifiedplant', 'description','allidentifiedplants', 'score']
        
class imageinformationSerializer(serializers.ModelSerializer):
    class Meta:
        model=imageinformationModel
        fields=['identificationsid', 'filename', 'imagedate', 'dateadded', 'latitude', 'longitude']
        
class userinformationSerializer(serializers.ModelSerializer):
    class Meta:
        model=userinformationModel
        fields=['identificationsid', 'filename', 'firstname', 'surname', 'comments']                
        
           
        
 


