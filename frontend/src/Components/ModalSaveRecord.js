import React from 'react'
import './ModalSaveRecord.css'
import Spinner from './Spinner';
import {useDispatch, useSelector} from "react-redux"
import {ShowModalSaveRecord} from '../Redux/SaveRecord';
import {Icon} from 'react-icons-kit' 
import {ic_check_circle_outline} from 'react-icons-kit/md/ic_check_circle_outline'
import {ic_error_outline_outline} from 'react-icons-kit/md/ic_error_outline_outline'
import {ic_info_outline} from 'react-icons-kit/md/ic_info_outline'

export default function ModalSaveRecord() {

	const {OperationBusy}=useSelector((state)=>state.OperationRunning);
	const {MessageBoxTitle}=useSelector((state)=>state.SaveRecord);		
	const {OperationType}=useSelector((state)=>state.DataOperations);		
	const {SaveRecordMessage} =useSelector((state)=>state.SaveRecord);		
	const {SaveRecordStatusMessage} =useSelector((state)=>state.SaveRecord);	
	const {DarkMode}=useSelector((state)=>state.ApplicationSettings);
	const ClassName="SaveRecord"
	const dispatch=useDispatch()
	const HandleCloseSaveRecord=()=>{
		dispatch(ShowModalSaveRecord(false))
	}
	
	return (
		<div>
			<div className={OperationType==='Save' ? "ModalSaveRecord-Backdrop" : OperationType==='SaveEdit' ? "ModalSaveEditRecord-Backdrop" : false}>
				<div className={DarkMode ? "ModalSaveRecordOuterDark" : "ModalSaveRecordOuterLight"}>
					{OperationBusy &&(<Spinner classname={ClassName}/>)}				
					{!OperationBusy && (SaveRecordStatusMessage==='Success' ? <Icon className="iconSuccess" size={92} icon={ic_check_circle_outline} />:
						SaveRecordStatusMessage==='Information' ? <Icon className="iconInformation" size={92} icon={ic_info_outline} /> :
						<Icon className="iconExclamation" size={92} icon={ic_error_outline_outline} />)}
					<p className={DarkMode ? "MessageBoxTitleDark" : "MessageBoxTitleLight"}>{MessageBoxTitle}</p>
					<p className={DarkMode ? "MessageBoxDetailDark" : "MessageBoxDetailLight"}>{SaveRecordMessage}</p>
					{!OperationBusy && (<button className={DarkMode ? "ModalCloseRecordOuterDark" : "ModalCloseRecordOuterLight"} onClick={()=>HandleCloseSaveRecord()}>OK</button>)}
				</div>
		  	</div>
	  	</div>	
	)
}