import React,{useEffect} from 'react'
import './ModalDeleteRecord.css'
import Spinner from './Spinner';
import {useDispatch, useSelector} from "react-redux"
import {UpdateOperationRunning} from '../Redux/OperationRunning'
import {SendRefreshData} from '../Redux/DataOperations'
import {ShowModalDeleteRecord} from '../Redux/DeleteRecord';
import {SendDeleteHasRun} from '../Redux/DeleteRecord';
import {HandleDeleteIdentification} from './ComponentFunctions';
import {SendMessageRecordDeleteStatus} from '../Redux/DeleteRecord';
import {SendDeleteSelectedRecords} from '../Redux/DeleteRecord'
import {SendDeleteRecordOperationSuccessful } from '../Redux/DeleteRecord';
import {SendMessageRecordDelete} from '../Redux/DeleteRecord';
import {Icon} from 'react-icons-kit'
import {ic_check_circle_outline} from 'react-icons-kit/md/ic_check_circle_outline'
import {ic_error_outline_outline} from 'react-icons-kit/md/ic_error_outline_outline'

export default function ModalDeleteRecord() {
	
	const classname="DeleteRecord"
	const {RefreshData} =useSelector((state)=>state.DataOperations);		
	const {OperationBusy}=useSelector((state)=>state.OperationRunning);
	const SelectedRecords=[]
	const {DeleteSelectedRecords}=useSelector((state)=>state.DeleteRecord);
	const {DeleteRecordOperationSuccessful} =useSelector((state)=>state.DeleteRecord);
	const {DeleteHasRun} =useSelector((state)=>state.DeleteRecord);
	const {MessageBoxTitle} =useSelector((state)=>state.DeleteRecord);	
	const {DeleteRecordMessage} =useSelector((state)=>state.DeleteRecord);		
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);
	const dispatch=useDispatch()
	const HandleCloseDeleteRecord=()=>{
		dispatch(UpdateOperationRunning(false))
		dispatch(ShowModalDeleteRecord(false))
	}
		
	const HandleDeleteRecord=()=>{
		
		dispatch(UpdateOperationRunning(true))	
		dispatch(SendMessageRecordDelete('Deleting record/s...'))
		
		HandleDeleteIdentification(DeleteSelectedRecords).then(function(data){
			dispatch(UpdateOperationRunning(false))
			dispatch(SendRefreshData(!RefreshData))
			SelectedRecords.push("ClearBuffer") //If all records have been deleted (All checkbox selected, send a command to the redux to clear the buffer)
			dispatch(SendDeleteSelectedRecords(SelectedRecords))
			
			switch(data['MessageCode']){
				case 4: 
					dispatch(SendDeleteRecordOperationSuccessful(true))
					dispatch(SendMessageRecordDeleteStatus('Success'))	
					dispatch(SendMessageRecordDelete('Record/s deleted successfully'))
					dispatch(SendDeleteHasRun(true))
					break;
				case 5: 
					dispatch(SendDeleteRecordOperationSuccessful(false))	
					dispatch(SendMessageRecordDeleteStatus('Error'))	
					dispatch(SendMessageRecordDelete('Error deleting record/s'))
					break;
			   	default:
				   break;
			}
		})
	}

	const HandleCancelDeleteRecord=()=>{
		dispatch(ShowModalDeleteRecord(false))
	}

	useEffect(() => {
		dispatch(SendDeleteHasRun(false))
		dispatch(SendDeleteRecordOperationSuccessful(false))
	},[]);

	return (
		<div className="ModalDeleteRecord-backdrop">
			<div className={DarkMode ? "modalDeleteRecordDataOuterDark" : "modalDeleteRecordDataOuterLight"}>
			
				{OperationBusy &&(<Spinner classname={classname}/>)}

				{!OperationBusy && (!DeleteRecordOperationSuccessful) && <Icon className="iconExclamationDeleteRecord" size={92} icon={ic_error_outline_outline} />}
				{!OperationBusy && (DeleteRecordOperationSuccessful) && <Icon className="iconSuccessDeleteRecord" size={92} icon={ic_check_circle_outline} />}
							
				<p className={DarkMode ? "MessageBoxTitleDark" : "MessageBoxTitleLight"}>{MessageBoxTitle}</p>
				<p className={DarkMode ? "MessageBoxDetailDark" : "MessageBoxDetailLight"} >{DeleteRecordMessage}</p>
				
				<div className='ButtonAlignment'>
					{(!DeleteHasRun && !DeleteRecordOperationSuccessful ) &&
						<>
							<button className={DarkMode && !OperationBusy  ? "DeleteRecordDarkEnabled" : (DarkMode && OperationBusy) ? "DeleteRecordDarkDisabled"  : 
							(!DarkMode && !OperationBusy) ? "DeleteRecordLightEnabled" : (!DarkMode && OperationBusy) ? "DeleteRecordLightDisabled" : false} disabled={OperationBusy ? true : false} onClick={()=>HandleDeleteRecord()}>Yes</button>
				 			
							 <button className={DarkMode && !(OperationBusy) ? "CancelDeleteRecordDarkEnabled" : DarkMode && (OperationBusy) ? "CancelDeleteRecordDarkDisabled"  : 
							!(OperationBusy) ? "CancelDeleteRecordLightEnabled" : (OperationBusy) ? "CancelDeleteRecordLightDisabled" : false} disabled={OperationBusy ? true : false} onClick={()=>HandleCancelDeleteRecord()}>No</button>
						</>
					}
					{(DeleteHasRun || DeleteRecordOperationSuccessful) && <button className={DarkMode ? "DeleteConfirmationDark" : "DeleteConfirmationLight"} onClick={()=>HandleCloseDeleteRecord()}>OK</button> }
				</div>
			</div>
		</div>
	)
}

