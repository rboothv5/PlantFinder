import React,{useEffect, useState} from 'react'
import './ModalDetailReport.css'
import ModalIdentifiedImage from './ModalIdentifiedImage';
import ModalIdentifiedImageLocation from './ModalIdentifiedImageLocation';
import DetailReportData from './DetailReportData'
import {useDispatch, useSelector} from "react-redux"
import {UpdateOperationRunning} from '../Redux/OperationRunning'
import {UpdateDataReady} from '../Redux/DataOperations'
import {ShowModalDetailReport} from '../Redux/Reports';
import {DetailReport} from './ComponentFunctions';
import {Icon} from 'react-icons-kit'
import {ic_error_outline_outline} from 'react-icons-kit/md/ic_error_outline_outline'

export default function ModalDetailReport(){
	
	const [Records, setRecords]=useState(false)
	const [Error, setError]=useState(false)
	const dispatch=useDispatch()
	const {IdentifiedImageVisible} =useSelector((state)=>state.Reports);
	const {IdentifiedImageLocationVisible} =useSelector((state)=>state.IdentifiedImageLocation);
	const {DarkMode}=useSelector((state)=>state.ApplicationSettings);
	
	const HandleCloseDetailReport=()=>{
		dispatch(ShowModalDetailReport(false))
		dispatch(UpdateDataReady(false))
		dispatch(UpdateOperationRunning(false))
	}
	
	useEffect(() => {
		dispatch(UpdateDataReady(false))
		dispatch(UpdateOperationRunning(true))			
		DetailReport().then(function(data){
			if(!data){setError(true)}	
			else{			
				dispatch(UpdateOperationRunning(false))
				setRecords(data)
				dispatch(UpdateDataReady(true))
			}
		})
	},[])

  	return (
		<div className="ModalDetailReport-backdrop">
			<div className={DarkMode ? "modalDetailReportOuterDark" : "modalDetailReportOuterLight"}>
				<button className={DarkMode ? "closeModalDetailReportDark" : "closeModalDetailReportLight"} onClick={()=>HandleCloseDetailReport()}>x</button> 
				<div className={DarkMode ? "DetailReportHeaderContainerDark" : "DetailReportHeaderContainerLight"}>
					<p className={DarkMode ? "lblDetailReportHeaderDark" : "lblDetailReportHeaderLight"}>Identified Plant Details</p>
				</div>
								
				{Error && (
					<>
						<Icon className="iconDetailReportError" size={80} icon={ic_error_outline_outline} />
						<p className={DarkMode ? "lblDetailReportErrorDark" : "lblDetailReportErrorLight"}>Error retrieving detail report data</p>
					</>
				)}
			
				{!Error && !Records.length>0 && (<p className={DarkMode ? "lblNoRecordsFoundDark" : "lblNoRecordsFoundLight"}>No Records Found</p>)}
				{!Error && Records.length>0 && (						
				<div className="ModalDetailReport">
					<div className="DetailReportTableContainer">
						<table className="DetailReport">
							<thead>
								<tr className={DarkMode ? "DetailReportHeaderDark" : "DetailReportHeaderLight"}>
									<th className={DarkMode ? "DetailReportTableHeaderPlantDark" : "DetailReportTableHeaderPlantLight"}>Plant name</th> 
									<th className={DarkMode ? "DetailReportTableHeaderDescriptionDark" : "DetailReportTableHeaderDescriptionLight"}>Description</th>
									<th className={DarkMode ? "DetailReportTableHeaderCompareDark" : "DetailReportTableHeaderCompareLight"}>Compared to</th>
									<th className={DarkMode ? "DetailReportTableHeaderScoreDark" : "DetailReportTableHeaderScoreLight"}>Score (%)</th>
									<th className={DarkMode ? "DetailReportTableHeaderImageDateDark" : "DetailReportTableHeaderImageDateLight"}>Image date</th> 
									<th className={DarkMode ? "DetailReportTableHeaderLatitudeDark" : "DetailReportTableHeaderLatitudeLight"}>Latitude</th> 
									<th className={DarkMode ? "DetailReportTableHeaderLongitudeDark" : "DetailReportTableHeaderLongitudeLight"}>Longitude</th> 
									<th className={DarkMode ? "DetailReportTableHeaderDateAddedDark" : "DetailReportTableHeaderDateAddedLight"}>Date added</th>
									<th className={DarkMode ? "DetailReportTableHeaderImageDark" : "DetailReportTableHeaderImageLight"}>Image</th>
									<th className={DarkMode ? "DetailReportTableHeaderLocationDark" : "DetailReportTableHeaderLocationLight"}>Location</th>
								</tr>
							</thead>
							<tbody>
								<DetailReportData Records={Records} />
							</tbody>
						</table>
					</div>
				</div>
			)}
			{IdentifiedImageVisible &&( <ModalIdentifiedImage />)} 
			{IdentifiedImageLocationVisible &&( <ModalIdentifiedImageLocation />)}
			</div>
		</div>
	 )
}


					