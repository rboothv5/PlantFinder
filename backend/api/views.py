from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from api.models import identificationsModel, imageinformationModel, userinformationModel
from rest_framework.parsers import JSONParser
from api.serializers import identificationsSerializer,imageinformationSerializer,userinformationSerializer
from django.db import connection
import operator
import urllib
import base64
import requests
import cv2
import base64
import numpy as np
import onnx
import onnxruntime as ort
import requests as requests
import os
import copy
import psycopg2
from psycopg2 import OperationalError
from enum import Enum
from django.db import transaction
import boto3

is_AWS=os.environ.get('IS_AWS')
is_Docker=os.environ.get('IS_DOCKER')
is_Local=os.environ.get('IS_LOCAL')

database=os.environ.get('NAME')
password=os.environ.get('PASSWORD')
port=os.environ.get('PORT')

aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID')
aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')

bucket_name=os.environ.get('BUCKET_NAME')
presigned_url=os.environ.get('PRESIGNED_URL')
region_name=os.environ.get('REGION_NAME')

if is_Local=='True':
    user=os.environ.get('USER_LOCAL')
    host=os.environ.get('HOST_LOCAL')
 
if is_Docker=='True':
    user=os.environ.get('USER_DOCKER')
    host=os.environ.get('HOST_DOCKER')

if is_AWS=='True':
    user=os.environ.get('USER_AWS')
    host=os.environ.get('HOST_AWS')

def ConnectToDatabase():
    try:
        connection = psycopg2.connect(
        database=database,
        user=user,
        password=password,
        host=host,
        port=port
    )
    except (Exception) as error:
        print("Error while connecting to PostgreSQL", error)
        return
    
    return connection

class StatusMessageCodes(Enum):
    SaveRecordSuccessful=0
    RecordExists=1
    SaveRecordError=2 
    NoMatchingImage=3
    DeleteRecordSuccessful=4
    DeleteRecordError=5
    HeartBeatReceived=10
    AWSDBAAvailable=11
    AWSDBAUnavailable=12

class SaveRecordException(Exception):
    pass

@csrf_exempt
def GetAWSDBStatus(request):

    rds = boto3.client('rds',aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key,region_name=region_name)

    db_instances = rds.describe_db_instances()
    AWSDBStatus=db_instances['DBInstances'][0]['DBInstanceStatus']
    if AWSDBStatus=='available':
        return JsonResponse({'AWSDBStatusCode': StatusMessageCodes.AWSDBAAvailable.value})
    else: 
        return JsonResponse({'AWSDBStatusCode': StatusMessageCodes.AWSDBAUnavailable.value})


@csrf_exempt
def HeartBeat(request):
    
    return JsonResponse({'BackendApplicationStatusCode': StatusMessageCodes.HeartBeatReceived.value})

@csrf_exempt
def SaveIdentification(request, filename):
 
    NegativeImagePath='/Images/NegativeImage.png'           
    identificationDetail=identificationsModel.objects.filter(filename=filename)  
      
    if identificationDetail:
        for item in identificationDetail:
            if item.filename==filename:
                return JsonResponse({'MessageCode':StatusMessageCodes.RecordExists.value})
    else:
        try:
            with transaction.atomic():
                dataToSave=JSONParser().parse(request)  
                if dataToSave[0]["URL"]==NegativeImagePath:
                    return JsonResponse({'MessageCode':StatusMessageCodes.NoMatchingImage.value})
                else:
                    for i in range(0, len(dataToSave)):
                        if i<len(dataToSave)-1:
                            identificationDataSerializer=identificationsSerializer(data=dataToSave[i])  
                            imageinformationDataSerializer=imageinformationSerializer(data=dataToSave[i]) 
                            userinformationDataSerializer=userinformationSerializer(data=dataToSave[i]) 
                            
                            if identificationDataSerializer.is_valid() and imageinformationDataSerializer.is_valid() and userinformationDataSerializer.is_valid():
                                identificationDataSerializer.save()
                                imageinformationDataSerializer.save()
                                userinformationDataSerializer.save()
                            else:
                                raise SaveRecordException
                        else:
                            data=dataToSave[i]
                            ImageBase64Data=data['Base64Data']
                            response=requests.post(
                                presigned_url,
                                json={
                                    'BucketName':bucket_name,
                                    'ObjectName': filename,
                                    'ImageBase64': ImageBase64Data
                                })
        except SaveRecordException:
            return JsonResponse({'MessageCode':StatusMessageCodes.SaveRecordError.value})
    
    return JsonResponse({'MessageCode':StatusMessageCodes.SaveRecordSuccessful.value})

@csrf_exempt
def UpdateUserInformation(request, filename):
    
    try:
        if request.method=="PUT":
            summaryData=JSONParser().parse(request)    
            firstname=summaryData["Firstname"]
            surname=summaryData["Surname"]
            comments=summaryData["Comments"]
            filename=summaryData["Filename"] 
            summaryDetail=userinformationModel.objects.filter(filename=filename).update(firstname=firstname, surname=surname, comments=comments)  #Get the data from the database using the model for the id sent in the request
    except:
        return JsonResponse({'MessageCode':StatusMessageCodes.SaveRecordError.value})
    
    return JsonResponse({'MessageCode': StatusMessageCodes.SaveRecordSuccessful.value})

@csrf_exempt
def GetAllIdentifications(request):
    
    result={}
    detailData=[]
    with ConnectToDatabase() as DBConnection:
        with DBConnection.cursor() as cursor:
            cursor.execute('SELECT IdentifiedPlant, Description, AllIdentifiedPlants, Score, Imagedate, Latitude, Longitude, DateAdded, Filename FROM GetAllIdentifications()')
            for row in cursor:
                result["IdentifiedPlant"]=row[0]
                result["Description"]=row[1]
                result["AllIdentifiedPlants"]=row[2]
                result["Score"]=row[3]
                ImageDate=row[4]
                if(ImageDate):
                    ImageDateFormatted=ImageDate.strftime("%Y-%m-%d")
                else:
                    ImageDateFormatted=''
                result["ImageDate"]=ImageDateFormatted
                result["Latitude"]=row[5]
                result["Longitude"]=row[6]
                DateAdded=row[7]
                DateAddedFormatted=DateAdded.strftime("%Y-%m-%d")
                result["DateAdded"]=DateAddedFormatted
                result["Filename"]=row[8]
                list_temp=copy.copy(result)
                detailData.append(list_temp)
    return JsonResponse(detailData, safe=False) 

@csrf_exempt
def GetSampleImages(request):
    
    sampleimages=[]
    result={}
    with ConnectToDatabase() as DBConnection:
        with DBConnection.cursor() as cursor:
            cursor.execute('SELECT IndexPosition, Filename,Plantname FROM SampleImageList()')
            for row in cursor:
                result["Position"]=row[0]
                result["Filename"]=row[1]
                result["Plantname"]=row[2]
                list_temp=copy.copy(result)
                sampleimages.append(list_temp)
    return JsonResponse(sampleimages, safe=False) 

def GetSearchImageBase64(imageName):
    
    url=presigned_url + imageName
    response=requests.get(url).json()
    url=response[0]["Result"]
    with urllib.request.urlopen(url) as url:
        imageBase64 = base64.b64encode(url.read()).decode("ascii")
    return JsonResponse(imageBase64, safe=False)

@csrf_exempt
def GetRecentSearchesImagesURLs(filename):
    
    url=presigned_url + filename
    response=requests.get(url).json()
    return response[0]["Result"]
     
def GetRefImagePresignedURL(PlantName):
    
    url=presigned_url + PlantName + '_S3_Reference.jpg'
    return requests.get(url)

@csrf_exempt
def GetIdentificationsSummary(request):
    
    result={}
    summaryData=[]
    with ConnectToDatabase() as DBConnection:
        with DBConnection.cursor() as cursor:
            cursor.execute('SELECT Firstname, Surname, Filename, IdentifiedPlant, Score, DateAdded, Comments FROM GetIdentificationsSummary()')
            for row in cursor:
                result["Firstname"]=row[0]
                result["Surname"]=row[1]
                result["Filename"]=row[2]
                result["IdentifiedPlant"]=row[3]
                result["Score"]=row[4]
                DateAdded=row[5]
                DateAddedFormatted=DateAdded.strftime("%Y-%m-%d")
                result["DateAdded"]=DateAddedFormatted
                result["Comments"]=row[6]
                list_temp=copy.copy(result)
                summaryData.append(list_temp)
    return JsonResponse(summaryData, safe=False) 
 
@csrf_exempt
def GetRecentIdentifications(request):
    i=0
    result={}
    recentSearches=[]
    with ConnectToDatabase() as DBConnection:
        with DBConnection.cursor() as cursor:
            cursor.execute('SELECT IdentifiedPlant, Filename, Score, DateAdded FROM GetRecentIdentifications()')
            for row in cursor:
                result["IdentifiedPlant"]=row[0]
                result["Filename"]=row[1]
                result["Score"]=row[2]
                DateAdded=row[3]
                DateAddedFormatted=DateAdded.strftime("%Y-%m-%d")
                result["DateAdded"]=DateAddedFormatted
                list_temp=copy.copy(result)
                recentSearches.append(list_temp)
                url= GetRecentSearchesImagesURLs(result["Filename"]) #Get the presigned URL and add it to the JSON object being sent back
                recentSearches[i]['url']=url
                i+=1
    return JsonResponse(recentSearches, safe=False) 

@csrf_exempt
def DeleteIdentification(request):
    
    try:
        result=[]
        if request.method == 'POST':
            summaryData=JSONParser().parse(request)   
            for item in summaryData:
                filename=item['FileName']
                
                identificationData=identificationsModel.objects.filter(filename=item['FileName'])  
                imageinformationData=imageinformationModel.objects.filter(filename=item['FileName'])  
                userinformationData=userinformationModel.objects.filter(filename=item['FileName'])  
        
                imageinformationData.delete()  
                identificationData.delete()
                userinformationData.delete()
                
                response=requests.delete(presigned_url + filename)
    except:
        return JsonResponse({'MessageCode':StatusMessageCodes.DeleteRecordError.value})   
    
    return JsonResponse({'MessageCode':StatusMessageCodes.DeleteRecordSuccessful.value})
   
@csrf_exempt
def PlantClassifier(request):
	
        if is_Local=='True':
            model_path = './backend/model.onnx'
            labels_path = './backend/labels.txt'
        elif (is_Docker=='True' or is_AWS=='True'):
            model_path = './model.onnx'
            labels_path = './labels.txt'
       
        runTimeProvider = ['CPUExecutionProvider']
        imgReceived = GetImage(request)
        session, input_name, output_name, input_shape, input_type, is_bgr, is_range255 = GetSessionModelData(model_path, runTimeProvider)
        image = np.frombuffer(base64.b64decode(imgReceived), np.uint8)
        image_PreProcessed = PreProcessImage(image, input_shape, input_type, is_bgr, is_range255)
        outputs = RunInference(session, input_name, output_name, image_PreProcessed)
        
        result=responseObject(outputs, labels_path)
       
        return JsonResponse(result, safe=False)

def GetImage(request):
    
    images = request.body
    return images

def GetSessionModelData(model_path, EP_List):

    is_bgr = False
    is_range255 = False
    onnx_model = onnx.load(model_path)
    for metadata in onnx_model.metadata_props:
        if metadata.key == 'Image.BitmapPixelFormat' and metadata.value == 'Bgr8':
            is_bgr = True
        elif metadata.key == 'Image.NominalPixelRange' and metadata.value == 'NominalRange_0_255':
            is_range255 = True
    session = ort.InferenceSession(model_path, providers=EP_List)
    assert len(session.get_inputs()) == 1
    input_name = session.get_inputs()[0].name
    output_name = session.get_outputs()[0].name
    input_shape = session.get_inputs()[0].shape[2:]
    input_type = {'tensor(float)': np.float32, 'tensor(float16)': np.float16}[session.get_inputs()[0].type]
  
    return session, input_name, output_name, input_shape, input_type, is_bgr, is_range255

def PreProcessImage(imgReceived, input_shape, input_type, is_bgr, is_range255):
       
    if is_bgr:
        input_array = input_array[:, (2, 1, 0), :, :]
    if not is_range255:
        input_array = input_array / 255
    image_decode = cv2.imdecode(imgReceived, cv2.IMREAD_COLOR)
    image_array = np.array(image_decode, dtype=input_type)
    img_Resize = cv2.resize(image_array, (input_shape))
    image_Transposed = img_Resize.transpose((2, 0, 1))
    image_PreProcessed = image_Transposed.reshape(1, 3, input_shape[0], input_shape[1])
    return image_PreProcessed

def RunInference(session, input_name, output_name, img_PreProcessed):
    
    outputs = session.run(None, {input_name: img_PreProcessed})
    probabilities = np.array(outputs)
    return probabilities

def load_labels(labelFile):
    
    labels = []
    with open(labelFile, 'r') as f:
        for line in f:
            labels.append(line.strip())
    return labels
    
def responseObject(outputs, labels_path):
      
    list = {}
    result=[]
    labels = load_labels(labels_path)
    for i in range(0, len(labels)-11):
       list["identificationsid"]=i
       for x in outputs:
            PresignedURLResponse=GetRefImagePresignedURL(labels[i]).json()
            list["URL"]=PresignedURLResponse[0]["Result"]
            list["allidentifiedplants"]=labels[i]    
            list["description"]=labels[i+11]    
            score=x[0][i]
            score=score*100
            list["score"]=float('{:.2f}'.format(score))
            list_temp=copy.copy(list)
            result.append(list_temp)
    
    result.sort(key=operator.itemgetter('score'), reverse=True)
    
    return result