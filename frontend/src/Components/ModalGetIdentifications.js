import React,{useState, useEffect} from 'react'
import './ModalGetIdentifications.css'
import Spinner from './Spinner';
import CircularPercentage from './CircularPercentage'
import AddUserInformation from './UserInformation'
import ModalSaveRecord from './ModalSaveRecord';
import {GetIdentifications, SaveIdentifications} from './ComponentFunctions'
import {useDispatch, useSelector } from 'react-redux';
import {ShowModalSaveRecord, SendMessageRecordSave, SendMessageRecordSaveStatus, SendMessageBoxTitle, SetRecordsAvailable } from '../Redux/SaveRecord';
import {SendRefreshData} from '../Redux/DataOperations';
import {SendOperationType} from '../Redux/DataOperations';
import {SendShowModalIdentifications} from '../Redux/IdentificationOperations';
import {UpdateOperationRunning} from '../Redux/OperationRunning'
import {Icon} from 'react-icons-kit'
import {ic_error_outline_outline} from 'react-icons-kit/md/ic_error_outline_outline'

export default function ModalGetPredictions() {
	
	const {ModalSaveRecordVisible} =useSelector((state)=>state.SaveRecord);
	const {OperationBusy}=useSelector((state)=>state.OperationRunning);
	const {FileName, ImgBase64, FormatDateCreated, Latitude, Longitude}=useSelector((state)=>state.IdentificationOperations);	
	const {RefreshData} =useSelector((state)=>state.DataOperations);
	const [ComponentMounted, setComponentMounted]=useState(false)
	const [DataReady, setDataReady] =useState(false)
	const [isValidSearch, setisValidSearch] =useState(true)
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);
	const [Error, setError]=useState(false)
	const [Identifications, setIdentifications]=useState(false)
	const [AddFormData, setAddFormData]=useState({
		Firstname:'Default User',
		Surname:'Default Surname',
		Comments:'Default Comment'
	})

	const classname="GetIdentifications"
	const dispatch=useDispatch()
	const HandleAddFormChange=(event)=>{
		event.preventDefault()
		var UserInfo={}
		const fieldname=event.target.getAttribute('name');
		const fieldvalue=event.target.value
		const newFormData={...AddFormData}
		newFormData[fieldname]=fieldvalue
		setAddFormData(newFormData)
		UserInfo[fieldname]=fieldvalue
	}

	function HandleCloseGetIdentifications(){
		dispatch(ShowModalSaveRecord(false))
		dispatch(SendShowModalIdentifications(false))
	}

	async function HandleSaveIdentifications(){
			
		dispatch(ShowModalSaveRecord(true))
		dispatch(SendOperationType('Save'))
		dispatch(UpdateOperationRunning(true))
		dispatch(SendMessageBoxTitle('SAVE RECORD'))
		dispatch(SendMessageRecordSave('')) 
		dispatch(SendMessageRecordSave('Saving record...'))
		if(!AddFormData.Firstname || !AddFormData.Surname || !AddFormData.Comments){
			dispatch(ShowModalSaveRecord(true))
			dispatch(SendMessageRecordSaveStatus('Error'))
			dispatch(SendMessageRecordSave('Enter Required Fields'))
		}
		else{
			SaveIdentifications(ImgBase64, Identifications, FileName, FormatDateCreated, AddFormData, Latitude, Longitude).then(function(data){
				switch(data['MessageCode']){
			 		case 0: 
						dispatch(SendMessageRecordSaveStatus('Success'))	
						dispatch(SendMessageRecordSave('Record for '+ data['IdentifiedPlant'] +' saved successfully'))
						SetRecordsAvailable(true)
						break;
					case 1: 
						dispatch(SendMessageRecordSaveStatus('Information'))		
						dispatch(SendMessageRecordSave('Record for '+ data['IdentifiedPlant'] +' already exists'))
						break;
					case 2: 
						dispatch(SendMessageRecordSaveStatus('Error'))	
						dispatch(SendMessageRecordSave('There was an error saving the record for ' + data['IdentifiedPlant']))
					break;
					case 3: 
						dispatch(SendMessageRecordSaveStatus('Error'))	
						dispatch(SendMessageRecordSave('Image has no match compared to existing samples.'))
					break;
					default:
						break;
			 	}
				dispatch(UpdateOperationRunning(false))
				dispatch(SendRefreshData(!RefreshData))
			})
		}
	}

	useEffect(() => {
		
		document.getElementsByClassName('Description').disabled=true
		if(!ComponentMounted){
			dispatch(UpdateOperationRunning(true))
		}
		else{
			dispatch(UpdateOperationRunning(false))
		}
		
		GetIdentifications(ImgBase64).then(function(data){
			if(!data){setError(true)}
			else{
				if(data["ValidSearch"]===0){
					setisValidSearch(false)
				}
				setIdentifications(data)
				setComponentMounted(true)
				setDataReady(true)
			}
		})
	},[ComponentMounted]);
	
	return(
		<div className="modal-backdrop">
			{ModalSaveRecordVisible && (<ModalSaveRecord/>)}
			<div className={DarkMode ? "modalOuterDark" : "modalOuterLight"}>
				<button className={DarkMode ? "closeModalDark" : "closeModalLight"} onClick={()=>HandleCloseGetIdentifications()}>x</button> 
				<div className={DarkMode ? "modalGetPredictionsHeaderDark" : "modalGetPredictionsHeaderLight"}>
					<p className={DarkMode ? "lblHeadingDark" : "lblHeadingLight"}>Identified Plants</p>
				</div>
				<div className={DarkMode ? "modalDataDark" : "modalDataLight"}>
				{Error && (
					<>
						<Icon className="iconGetIdentificationsError" size={80} icon={ic_error_outline_outline} />
						<p className={DarkMode ? "lblGetIdentificationsErrorDark" : "lblGetIdentificationsErrorLight"}>Error retrieving identifications</p>
					</>
				)}	
					{!Error && OperationBusy &&(<Spinner classname={classname}/>)}
					{!Error && DataReady &&  (
						<div className="IdentificationsContainer">
							<ul className="Identifications">
								{Identifications.map(data=>(
									<li className={DarkMode ? "IdentificationListOuterDark":"IdentificationListOuterLight"} key={data.identificationsid}>
										<CircularPercentage className="Score" Score={data.score}></CircularPercentage>
										<p className={DarkMode ? "lblReferencePlantNameDark" : "lblReferencePlantNameLight"}>Plant Name</p> 
										<p className={DarkMode ? "ReferencePlantNameDark" : "ReferencePlantNameLight"}>{data.allidentifiedplants}</p> 
										<p className={DarkMode ? "lblDescriptionDark" : "lblDescriptionLight"}>Description</p> 
										<p className={DarkMode ? "DescriptionDark" : "DescriptionLight"} >{data.description}</p>
										<img className="ThumbnailPlantImage" src={data.URL} alt="" width="100" height="100"/> 
									</li>
									)
								)}
							</ul>
						</div>
					)}
				</div> 
				<AddUserInformation 
					handleAddFormChange={HandleAddFormChange} 
					AddFormData={AddFormData}
				/>
				
				<button className={DarkMode && !(DataReady && isValidSearch) ? "saveIdentificationsDarkDisabled" : DarkMode && (DataReady && isValidSearch) ? "saveIdentificationsDarkEnabled"  : 
				!(DataReady && isValidSearch) ? "saveIdentificationsLightDisabled" : (DataReady && isValidSearch) ? "saveIdentificationsLightEnabled" : false}	 disabled={(DataReady && isValidSearch) ? false:true}  onClick={()=>HandleSaveIdentifications()}>Save</button>
				<button className={DarkMode ? "closeIdentificationsDark" : "closeIdentificationsLight"}  onClick={()=>HandleCloseGetIdentifications()}>Close</button>
			</div>
		</div>
	)
}