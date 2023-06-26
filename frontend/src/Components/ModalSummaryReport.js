import React,{useEffect, useState} from 'react'
import './ModalSummaryReport.css'
import SummaryReportData from './SummaryReportData'
import ModalDeleteRecord from './ModalDeleteRecord';
import ModalSaveRecord from './ModalSaveRecord';
import {SummaryReport} from './ComponentFunctions';
import {useDispatch, useSelector} from "react-redux"
import {UpdateOperationRunning} from '../Redux/OperationRunning'
import {SendRefreshData, UpdateDataReady} from '../Redux/DataOperations'
import {ShowModalSummaryReport} from '../Redux/Reports';
import {Icon} from 'react-icons-kit'
import {ic_error_outline_outline} from 'react-icons-kit/md/ic_error_outline_outline'

export default function ModalSummaryReport(){

	const [Records, setRecords]=useState(false)
	const [Error, setError]=useState(false)
	const dispatch=useDispatch()
	const {DataReady} =useSelector((state)=>state.DataOperations);
	const {RefreshData} =useSelector((state)=>state.DataOperations);
	const {ModalSaveRecordVisible} =useSelector((state)=>state.SaveRecord);
	const {ModalDeleteRecordVisible} =useSelector((state)=>state.DeleteRecord);	
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);
	const HandleCloseSummaryReport=()=>{
		dispatch(ShowModalSummaryReport(false))
		dispatch(UpdateDataReady(false))
		dispatch(UpdateOperationRunning(false))
	}

	useEffect(() => {
		dispatch(SendRefreshData(false))
		SummaryReport().then(function(data){
			if(!data){
				setError(true)
			}	
			else{		
				setRecords(data)
				dispatch(UpdateOperationRunning(false))
				dispatch(UpdateDataReady(true))
			}
		})
		   
	},[RefreshData]);

	return (
		<div>
			<div className="ModalSummaryReport-Backdrop">
			{ModalDeleteRecordVisible &&(<ModalDeleteRecord/>)}
			{ModalSaveRecordVisible &&(<ModalSaveRecord/>)}
				<div className={DarkMode ? "ModalSummaryReportOuterDark" : "ModalSummaryReportOuterLight"}>
					<button className={DarkMode ? "btnCloseModalSummaryReportDark" : "btnCloseModalSummaryReportLight"} onClick={()=>HandleCloseSummaryReport()}>x</button> 
					<div className={DarkMode ? "SummaryReportHeaderContainerDark" : "SummaryReportHeaderContainerLight"}>
						<p className={DarkMode ? "lblSummaryReportHeaderDark" : "lblSummaryReportHeaderLight"}>Identified Plants Summary</p>
					</div>
					<div className="ModalSummaryReport">
						{Error &&(
							<>
								<Icon className="iconSummaryReportError" size={80} icon={ic_error_outline_outline} />
								<p className={DarkMode ? "lblSummaryReportErrorDark" : "lblSummaryReportErrorLight"}>Error retrieving summary report data</p>
							</>
						)}
						{!Error && DataReady && (<SummaryReportData Records={Records} />)}
					</div>
		  	  	</div>
		  	</div>
	  	</div>	
	)
}