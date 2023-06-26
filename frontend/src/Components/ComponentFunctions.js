export const base64ToArrayBuffer=async(base64)=>{
	var binary_string, len, bytes, i
	binary_string = window.atob(base64);
	len = binary_string.length;
	bytes = new Uint8Array(len);
	for (i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}

export const GetAWSDBStatus=async()=>{
	var url
	var result
	var method="GET"

	url=process.env.REACT_APP_AWSHOST + ':8000/api/GetAWSDBStatus/'
		
	try{
		await SendHTTPRequest(url, method).then(function(data){
			result=data
		})
	}
	catch{
		console.log('AWS database offline')
		return false
	}
	return result
}

export const GetServerStatus=async()=>{
	
	var url
	var method="GET"
	var result
	
	if (process.env.REACT_APP_ISLOCAL==='True'){
		url=process.env.REACT_APP_LOCALHOST +':8000/api/HeartBeat/'
	}
	
	if(process.env.REACT_APP_ISAWS==='True') {
		url=process.env.REACT_APP_AWSHOST + ':8000/api/HeartBeat/'
	}
	
	try{
		await SendHTTPRequest(url, method).then(function(data){
			result=data
		})
	}
	catch{
		console.log('Backend server offline')
		return false
	}	
	return result
}

export const GetSearchImageBase64Data=async(SearchImagepresignedURL)=>{
	
	var url
	var result
	var method="GET"

	if (process.env.REACT_APP_ISLOCAL==='True'){
		url=process.env.REACT_APP_LOCALHOST + ':8000/api/GetSearchImageBase64/' + SearchImagepresignedURL
	}
	 
	if(process.env.REACT_APP_ISAWS==='True') {
		url=process.env.REACT_APP_AWSHOST + ':8000/api/GetSearchImageBase64/' + SearchImagepresignedURL
	}

	try{
		await SendHTTPRequest(url, method).then(function(data){
			result=data
		})
	}
	catch{
		console.log('Error retrieving base64 encoded data')
		return false
	}	
	return result
}

 export const GetSampleImages=async() => {
	
	var url
	var result
	var method="POST"
	
	if (process.env.REACT_APP_ISLOCAL==='True'){
		url=process.env.REACT_APP_LOCALHOST +':8000/api/GetSampleImages/'
	}
	
	if(process.env.REACT_APP_ISAWS==='True') {
		url=process.env.REACT_APP_AWSHOST +':8000/api/GetSampleImages/'
	}

	try{
		await SendHTTPRequest(url, method).then(function(data){
			result=data
		})
	}
	catch{
		console.log('Error retrieving sample images')
		return false
	}	
	return result
}

export const DetailReport =async()=>{
	
	var url
	var result
	var method='GET'

	if (process.env.REACT_APP_ISLOCAL==='True'){
		url=process.env.REACT_APP_LOCALHOST + ':8000/api/GetAllIdentifications/'
	}
	 
	if(process.env.REACT_APP_ISAWS==='True') {
		url=process.env.REACT_APP_AWSHOST + ':8000/api/GetAllIdentifications/'
	}

	try{
		await SendHTTPRequest(url, method).then(function(data){
			for(var x=0;x<data.length;x++){
				if(data[x]["dateadded"]){
					data[x]["dateadded"]=data[x]["dateadded"].slice(0, 10); 
				}
				if(data[x]["imagedate"]){
					data[x]["imagedate"]=data[x]["imagedate"].slice(0, 10);
				}
			}
			result=data
		})
	}
	catch{
		console.log('Error retrieving detail report data')
		return false
	}
	return result
}

export const GetPresignedURL=async(FileName)=>{
	
	var result
	var url=process.env.REACT_APP_PRESIGNEDURL + FileName
	
	try{
		await SendHTTPRequest(url).then(function(data){
			result=data[0]["Result"]
		})
	}
	catch{
		console.log('Error retrieving presigned URL')
		return false
	}
	return result
}

export const GetRecentIdentifications=async()=>{
	
	var url
	var result
	var method='GET'

	if (process.env.REACT_APP_ISLOCAL==='True'){
		url=process.env.REACT_APP_LOCALHOST +':8000/api/GetRecentIdentifications/'
	}
	 
	if(process.env.REACT_APP_ISAWS==='True') {
		url=process.env.REACT_APP_AWSHOST +':8000/api/GetRecentIdentifications/'
	}
		
	try{
		await SendHTTPRequest(url, method).then(function(data){
			for(var x=0;x<data.length;x++){
				if(data[x]["dateadded"]){
					data[x]["dateadded"]=data[x]["dateadded"].slice(0, 10); 
				}
			}
			result=data
		})
	}
	catch{
		console.log('Error retrieving recent identifications')
		return false
	}
	return result
}

export const SendHTTPRequest=async(url, method, data)=>{
	
	let response= await fetch(url, {
		method: method,
		body: data
	
	})
	const result = await response.json()
	return result 
}

export const GetIdentifications=async(imgBase64)=>{
	
	var url
	var result
	var index
	var PresignedURL
	var method="POST"
		
	if (process.env.REACT_APP_ISLOCAL==='True'){
		url=process.env.REACT_APP_LOCALHOST +':8000/api/PlantClassifier/'
	}
	
	if(process.env.REACT_APP_ISAWS==='True') {
		url=process.env.REACT_APP_AWSHOST +':8000/api/PlantClassifier/'
	}
	
	try{
		await SendHTTPRequest(url, method, imgBase64).then(function(data){
			if(data[0]["allidentifiedplants"]==='Negative'){
				PresignedURL='/Images/NegativeImage.png'
				for(var i=0; i<data.length;i++){
					data[i]["URL"]=PresignedURL
					data[i]["allidentifiedplants"]="No matches for uploaded image in model"
					data[i]["description"]=""
					data[i]["score"]=0.00
					result=data
				}
				data["ValidSearch"]=0
			}
			else{
				data["ValidSearch"]=1
				index=data.findIndex(item=>item.allidentifiedplants === 'Negative')
				data.splice(index,1) //Remove the negative image record from the dataset
				result=data
			}
		})
	}
	catch{
		console.log('Error retrieving identifications')
		return false
	}
	return result
}

export const SaveIdentifications=async(imgBase64, record, FileName, FormatDateCreated, AddFormData, Latitude, Longtiude)=>{
	
	var url
	var output={}
	var maxScore=0
	var dataToSave
	var method="POST"
	var identifiedplant={}
	const date=new Date(Date.now())
	var dateAdded=date

	if (process.env.REACT_APP_ISLOCAL==='True'){
		url=process.env.REACT_APP_LOCALHOST +':8000/api/SaveIdentification/'+FileName
	}
	 
	if(process.env.REACT_APP_ISAWS==='True') {
		url=process.env.REACT_APP_AWSHOST +':8000/api/SaveIdentification/'+FileName
	}
		
	let recordUpdateable = JSON.parse(JSON.stringify(record)); //Create new json object from original due to the original object which is passed via redux being non extensible
		
	for(var i=0; i<recordUpdateable.length;i++){
		var currentIdentification=recordUpdateable[i]
		if(parseInt(currentIdentification["score"])>parseInt(maxScore)){
			maxScore=currentIdentification["score"]
			identifiedplant=currentIdentification["allidentifiedplants"]
		}
	}
		
	for(var x=0; x<recordUpdateable.length;x++){
		recordUpdateable[x]["filename"]=FileName
		recordUpdateable[x]["imagedate"]=FormatDateCreated
		recordUpdateable[x]["latitude"]=Latitude
		recordUpdateable[x]["longitude"]=Longtiude
		recordUpdateable[x]["dateadded"]=dateAdded
		recordUpdateable[x]["identifiedplant"]=identifiedplant
		recordUpdateable[x]["description"]=record[x]["description"]
		recordUpdateable[x]["firstname"]=AddFormData.Firstname
		recordUpdateable[x]["surname"]=AddFormData.Surname
		recordUpdateable[x]["comments"]=AddFormData.Comments
	}

	recordUpdateable.push({Base64Data:imgBase64})
	dataToSave=JSON.stringify(recordUpdateable)
		
	try{
		await SendHTTPRequest(url, method, dataToSave).then(function(data){
			output['IdentifiedPlant']=recordUpdateable[0]['identifiedplant']
			output['MessageCode']=data['MessageCode']		
		})
	}
	catch{
		console.log('Error saving identifications')
		return false
	}
	return output
}

export const SummaryReport=async()=>{
	
	var url
	var result
	var method='GET'

	if (process.env.REACT_APP_ISLOCAL==='True'){
		url=process.env.REACT_APP_LOCALHOST +':8000/api/GetIdentificationsSummary/'
	}
	
	if(process.env.REACT_APP_ISAWS==='True') {
		url=process.env.REACT_APP_AWSHOST +':8000/api/GetIdentificationsSummary/'
	}
	
	try{
		await SendHTTPRequest(url, method).then(function(data){
			for(var x=0;x<data.length;x++){
				if(data[x]["dateadded"]){
					data[x]["dateadded"]=data[x]["dateadded"].slice(0, 10); 
				}
			}
			result=data
		})
	}
	catch{
		console.log('Error retrieving summary report data')
		return false
	}
	return result
}

export const UpdateData=async(UpdatedData, EditID, Record)=>{
	
	var url
	var result
	var output={}
	var index = -1;
	var method='PUT'
	var val = EditID
	var FilteredRecord={}
		
	if (process.env.REACT_APP_ISLOCAL==='True'){
		url=process.env.REACT_APP_LOCALHOST +':8000/api/UpdateUserInformation/' + EditID
	}
	
	if(process.env.REACT_APP_ISAWS==='True') {
		url=process.env.REACT_APP_AWSHOST +':8000/api/UpdateUserInformation/' + EditID
	}

	index=Record.findIndex(item=>item.Filename === val)
	Record[index]["Firstname"]=UpdatedData.Firstname
	Record[index]["Surname"]=UpdatedData.Surname
	Record[index]["Comments"]=UpdatedData.Comments
	FilteredRecord=Record[index]	
	
	result=JSON.stringify(FilteredRecord)
	
	try{
		await SendHTTPRequest(url, method, result).then(function(data){
			output['IdentifiedPlant']=FilteredRecord['IdentifiedPlant']
			output['MessageCode']=data['MessageCode']		
		})
	}
	catch{
		console.log('Error updating user data')
		return false
	}
	return output
}

export const HandleDeleteIdentification=async(data) => {
	
	var url
	var result={}
	var method="POST"
	var record=JSON.stringify(data)

	if (process.env.REACT_APP_ISLOCAL==='True'){
		url=process.env.REACT_APP_LOCALHOST +':8000/api/DeleteIdentification/'
	}
	
	if(process.env.REACT_APP_ISAWS==='True') {
		url=process.env.REACT_APP_AWSHOST +':8000/api/DeleteIdentification/'
	}

	try{
		await SendHTTPRequest(url, method, record).then(function(data){
			result=data
		})
	}
	catch{
		console.log('Error deleting identifications')
		return false
	}
	return result
}