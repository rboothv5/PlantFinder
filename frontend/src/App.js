
import React, {useEffect, Fragment} from 'react';
import useState from 'react-usestateref';
import exifr from 'exifr'
import './App.css';
import ModalGetPredictions from './Components/ModalGetIdentifications';
import ModalDetailReport from './Components/ModalDetailReport';
import ModalSummaryReport from './Components/ModalSummaryReport';
import ModalInvalidImage from './Components/ModalInvalidImage'
import SideBar from './Components/Sidebar'
import RecentSearchesImages from './Components/RecentSearches';
import GoogleApiWrapper from './Components/MapContainer'
import ApplicationError from './Components/ApplicationError'
import {useDispatch, useSelector} from "react-redux"
import {GetSearchImageBase64Data} from './Components/ComponentFunctions';
import {SendShowModalIdentifications, SendFileName, SendimgBase64, SendFormatDateCreated, SendLatitude, SendLongitude} from './Redux/IdentificationOperations'
import {Icon} from 'react-icons-kit'
import {ic_location_off_outline} from 'react-icons-kit/md/ic_location_off_outline'
import {ic_image_not_supported_outline} from 'react-icons-kit/md/ic_image_not_supported_outline'
import {ShowModalInvalidImage} from './Redux/InvalidImage';	
import {SendMessageBoxTitle } from './Redux/InvalidImage';	
import {SendMessageInvalidImage1} from './Redux/InvalidImage';
import {SendMessageInvalidImage2} from './Redux/InvalidImage';
import {GetServerStatus } from './Components/ComponentFunctions';
import {GetAWSDBStatus} from './Components/ComponentFunctions';

export default function App() {
	
	const [FileName, setFileName] = useState(null);
	const [ImagePreview, setImagePreview]=useState(null)
  	const [imgBase64, setimgBase64]=useState(false)
  	const [isPending, setisPending]=useState(false)
	const [FormatDateCreated, setFormatDateCreated]=useState(null)
	const [Latitude, setLatitude]=useState('Not available')
	const [Longitude, setLongitude]=useState(null)
	const [UserImageLoaded, setUserImageLoaded]=useState(false)
	const [dragActive, setDragActive]=useState(false)
	const [ImageLoaded, setImageLoaded]=useState(false)
	const [GPSDataValid, setGPSDataValid]=useState(false)
	const {SummaryReportVisible} =useSelector((state)=>state.Reports);
	const {DetailReportVisible} =useSelector((state)=>state.Reports);
	const {ShowModalIdentifications} =useSelector((state)=>state.IdentificationOperations);
	const {ModalInvalidImageVisible} =useSelector((state)=>state.InvalidImage);
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);
	const [ServerOnline, SetServerOnline]=useState(true)
	const [DatabaseOnline, SetDatabaseOnline]=useState(true)
	const [isAWS, SetisAWS]=useState(false)
	const dispatch=useDispatch()
	const MaxImageSize=5000000
	const MegaByte=1000000

	function base64ToArrayBuffer(base64) {
		var binary_string, len, bytes, i
		binary_string = window.atob(base64);
		len = binary_string.length;
		bytes = new Uint8Array(len);
		for (i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}

	function getImageMetaData(Base64Data){
		var x=base64ToArrayBuffer(Base64Data)
	    exifr.parse(x,true).then(function(output){
			if(output){
				var DateCreated_Format
				var latitude  = (typeof output.latitude === 'undefined') ? 0 : output.latitude;
				var longitude  = (typeof output.longitude === 'undefined') ? 0 : output.longitude;
				var DateCreated  = (typeof output.DateTimeOriginal === 'undefined') ? 'Error' : output.DateTimeOriginal;
							
				if(latitude !==0 && longitude !==0 && DateCreated_Format!=='Error'){
					DateCreated_Format=new Date(DateCreated)
					setGPSDataValid(true)
					setLatitude(latitude)	   
					setLongitude(longitude)
					setFormatDateCreated(DateCreated_Format)
				}
				else{
					setGPSDataValid(false)
					setLatitude(null)	   
					setLongitude(null)
					setFormatDateCreated(null)
				}
			}
		})
	}

	async function processFile(file){
		var fileReader, FileName, base64Data				
		setisPending(true)
		setUserImageLoaded(false)
		
		if(!file.size>0){
			FileName=file.substring(42,56)
			await GetSearchImageBase64Data(file.substring(42,56)).then(function(data){
				base64Data='data:image/jpeg;base64,' + data
				return base64Data
			})
			
			setImagePreview(base64Data)
			setimgBase64(base64Data.substring(23))
			getImageMetaData(base64Data.substring(23))
			setisPending(false)
			setUserImageLoaded(true)
			setImageLoaded(true)
		}
		else{
			setisPending(true)
			setUserImageLoaded(false)
						
			FileName=file.name
							
			fileReader = new FileReader();
			fileReader.onload = function(e){
				base64Data=fileReader.result 
				setImagePreview(base64Data)
				setimgBase64(base64Data.substring(23))
				getImageMetaData(base64Data.substring(23))
				setisPending(false)
				setUserImageLoaded(true)
				setImageLoaded(true)
			};
		}		
		setFileName(FileName)		
		
		if(file.size>0){
	  	 fileReader.readAsDataURL(file);
		}
	}

	function CheckValidImage(file, OperationHandler){
		switch(OperationHandler){
			case changeHandler:
				file = file.target.files[0];
			break;
			case dropHandler:
				file=file.dataTransfer.files[0]
			break;
			default:
			break;	
		}
				
		if(file.type!=='image/jpeg'){
			dispatch(ShowModalInvalidImage(true))
			dispatch(SendMessageBoxTitle('INVALID IMAGE TYPE'))
			dispatch(SendMessageInvalidImage1('Valid image type is:'))
			dispatch(SendMessageInvalidImage2('image/jpeg'))
		}

		else if(file.size>MaxImageSize){
			dispatch(ShowModalInvalidImage(true))
			dispatch(SendMessageBoxTitle('INVALID FILE SIZE'))
			dispatch(SendMessageInvalidImage1('File size: ' + file.size/MegaByte + 'MB'))
			dispatch(SendMessageInvalidImage2('Maximum file size < 5MB'))
		}
        else{
            processFile(file)
        }
	}

	const changeHandler = function(e){
		if(e.target.files.length>0){
			var file = e.target.files[0];
			CheckValidImage(file, 'changeHandler')
		}	
	}
			
	const dropHandler = function(e) {
		e.preventDefault();
		setDragActive(false)
		var file=e.dataTransfer.files[0]
		CheckValidImage(file, 'dropHandler')
	}
		
	const handleDrag=function(e){
		e.preventDefault();
		e.stopPropagation();
		
		if(e.type==="dragenter" || e.type==="dragover"){
			setDragActive(true)
		} 
		else if(e.type==="dragleave"){
			setDragActive(false)
		}
	}

	async function HandleGetIdentifications(){
		dispatch(SendShowModalIdentifications(true))
		dispatch(SendFileName(FileName))
		dispatch(SendFormatDateCreated(FormatDateCreated))
		dispatch(SendimgBase64(imgBase64))
		dispatch(SendLatitude(Latitude))
		dispatch(SendLongitude(Longitude))
	}

	useEffect(() => {
		const interval = setInterval(() => {
			GetServerStatus().then(function(data){
				if(data["BackendApplicationStatusCode"]===10){
					SetServerOnline(true)
				}
				else{
					SetServerOnline(false)
				}
			})

			if(process.env.REACT_APP_ISAWS==='True'){
				SetisAWS(true)
				GetAWSDBStatus().then(function(AWSdata){
					if(AWSdata["AWSDBStatusCode"]===11){
						SetDatabaseOnline(true)
					}
					else{
						SetDatabaseOnline(false)
					}
				})
			}
		}, 1000);
		return () => clearInterval(interval);
	},[]);
	
	return (
				
		<div className={DarkMode ? "SiteContainerDark": "SiteContainerLight"}>
			{(!ServerOnline || (isAWS && !DatabaseOnline)) && ( <ApplicationError ServerOnline={ServerOnline} DatabaseOnline={DatabaseOnline}></ApplicationError>)}
			{(ServerOnline && ((isAWS ? DatabaseOnline : true))) && (
				<div className="MainContent">
					<div className="MainHeader">
						<p className={DarkMode ? "lblHeaderTitleDark" : "lblHeaderTitleLight"}>Plant Finder</p>
					</div>
					<SideBar/>
					{ModalInvalidImageVisible &&(<ModalInvalidImage></ModalInvalidImage>)}
					<div className="fileUploadContainer" onDragEnter={handleDrag} >
						<input type="file" id="inputFileUpload" onChange={changeHandler} />
						<label id={DarkMode ? "fileUploadLabelDark" : "fileUploadLabelLight"} className={dragActive ? "drag-active" : "" }>
							{!isPending &&(
								<Fragment>
									<p className={DarkMode ? "cloudImageDark" : "cloudImageLight"}><i className="bi bi-cloud-arrow-up"></i></p>
									<p className={DarkMode ? "UploadInstructions1Dark" :"UploadInstructions1Light" }>Drag and drop to upload image</p>
									<p className={DarkMode ? "UploadInstructions2Dark" :"UploadInstructions2Light" }>OR</p>
									<label htmlFor="inputFileUpload" className={DarkMode ? "BrowseFileDark" : "BrowseFileLight"} value="UploadInput">Browse</label>
								</Fragment>
							)}
						</label>
						{dragActive && <div className="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={dropHandler}></div>}
					</div>
					<button className={
						DarkMode && !ImageLoaded ? "getIdentificationsDarkDisabled" : DarkMode && ImageLoaded ? "getIdentificationsDarkEnabled"  : 
						!ImageLoaded ? "getIdentificationsLightDisabled" : ImageLoaded ? "getIdentificationsLightEnabled" : false} 
						disabled= {ImageLoaded ? false:true} onClick={()=>HandleGetIdentifications(imgBase64, FileName)}>Search Plants</button>
					
					<RecentSearchesImages/>
					
					{ShowModalIdentifications && (<ModalGetPredictions/>)}
					{DetailReportVisible && (<ModalDetailReport/>)}
					{SummaryReportVisible && (<ModalSummaryReport/>)}
				
					<p className={DarkMode ? "lblImagePreviewDark" : "lblImagePreviewLight"}>Preview</p>
					<div className={DarkMode ? "imagePreviewDark" : "imagePreviewLight"}>
						{(!UserImageLoaded && <div className={DarkMode ? "iconImagePreviewDark" : "iconImagePreviewLight"}><Icon size={42} icon={ic_image_not_supported_outline} /></div>)}
						{(UserImageLoaded && <img src={ImagePreview} className="imgPreview" alt="" width="100%" height="100%"/>	)}
					</div>
				    
                    <p className={DarkMode ? "lblGPSLocationDark" : "lblGPSLocationLight"}>Location</p>
					<div className={DarkMode ? "GoogleMapsContainerDark" : "GoogleMapsContainerLight"}>
						{(!UserImageLoaded && !GPSDataValid && <div className={DarkMode ? "iconGPSDataDark" : "iconGPSDataLight"}><Icon size={42} icon={ic_location_off_outline} /></div>)}
						{(UserImageLoaded && !GPSDataValid && <div className={DarkMode ? "iconGPSDataDark" : "iconGPSDataLight"}><Icon size={42} icon={ic_location_off_outline} /></div>)}
						{(UserImageLoaded && GPSDataValid) && <GoogleApiWrapper latitude={Latitude} longitude={Longitude} />}
					</div>
				</div>
			)}
		</div>
	);
}