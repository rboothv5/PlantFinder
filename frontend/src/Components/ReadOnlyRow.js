import React from 'react'
import './ReadOnlyRow.css'
import {useDispatch, useSelector} from "react-redux"
import {ShowModalDeleteRecord} from '../Redux/DeleteRecord'
import {SendDeleteHasRun} from '../Redux/DeleteRecord'
import {SendDeleteSelectedRecords} from '../Redux/DeleteRecord'
import {SendIndividualRecordChecked} from '../Redux/DeleteRecord';
import {SendMessageRecordDelete} from '../Redux/DeleteRecord';
import {SendMessageBoxTitle} from '../Redux/DeleteRecord';
import {Icon} from 'react-icons-kit'
import {ic_delete_twotone} from 'react-icons-kit/md/ic_delete_twotone'
import {ic_edit} from 'react-icons-kit/md/ic_edit'

export default function ReadOnlyRow({Records, Data, HandleEditClick}) {
		
	const dispatch=useDispatch()
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);
	
	var SelectedRecords=[]
	var RecordData={}

	function HandleDeleteClick(){
		RecordData['IdentifiedPlant']=Data.IdentifiedPlant
		RecordData['FileName']=Data.Filename
		SelectedRecords.push("Add")
		SelectedRecords.push(RecordData)
		dispatch(SendDeleteSelectedRecords(SelectedRecords))
		dispatch(SendDeleteHasRun(false))  
		dispatch(ShowModalDeleteRecord(true))
		dispatch(SendMessageBoxTitle('DELETE RECORD'))
		dispatch(SendMessageRecordDelete('Are you sure you want to delete ' + Data.IdentifiedPlant + '?'))
	}
	
	function SelectRecordsToDelete(event, props) {
		
		var selectedFileName = Data.Filename
		var SelectedRecordIndex = Records.findIndex(function(item, i){
			return item.Filename === selectedFileName
		  });
			
		RecordData['IdentifiedPlant']=Data.Identifiedplant
		RecordData['FileName']=Data.Filename
		let checkbox = document.getElementsByClassName('chkSelectSingleRecord');
					
		if (checkbox[SelectedRecordIndex].checked===true) {
			dispatch(SendIndividualRecordChecked(false))
			SelectedRecords.push("Add")
			SelectedRecords.push(RecordData)
			dispatch(SendDeleteSelectedRecords(SelectedRecords)) 
		}
		
		if (checkbox[SelectedRecordIndex].checked===false) {
			dispatch(SendIndividualRecordChecked(true))
			SelectedRecords.push("Remove")
			SelectedRecords.push(RecordData)
			dispatch(SendDeleteSelectedRecords(SelectedRecords))
		}
	}
	
	return (
		<tr className={DarkMode ? "SummaryReportRowDark" : "SummaryReportRowLight"}>
			<td className={DarkMode ? "tdSelectSingleRecordDark" : "tdSelectSingleRecordLight"}><input type="checkbox" className="chkSelectSingleRecord" onChange={SelectRecordsToDelete}/></td>
			<td className={DarkMode ? "tdFirstNameDark" : "tdFirstNameLight"}>{Data.Firstname}</td>
			<td className={DarkMode ? "tdSurnameDark" : "tdSurnameLight"}>{Data.Surname}</td>
			<td className={DarkMode ? "tdDateAddedDark" : "tdDateAddedLight"}>{Data.DateAdded}</td>
			<td className={DarkMode ? "tdIdentifiedPlantDark" : "tdIdentifiedPlantLight"}>{Data.IdentifiedPlant}</td>
			<td className={DarkMode ? "tdScoreDark" : "tdScoreLight"}>{Data.Score}</td>
			<td className={DarkMode ? "tdCommentsDark" : "tdCommentsLight"}><div className={DarkMode ? "CommentsOverflowDark" : "CommentsOverflowLight"}>{Data.Comments}</div></td>
			<td className="tdActionButtons">
				<button className="RecordActionsEdit" type="button" onClick={(event)=>HandleEditClick(event, Data)}><div className={DarkMode ? "iconEditDark" : "iconEditLight"}><Icon size={24} icon={ic_edit} /></div></button> 
			</td>
			<td className="tdActionButtons">
				<button className="RecordActionsDelete" type="button" onClick={()=>HandleDeleteClick()}><div className="iconDelete"><Icon size={28} icon={ic_delete_twotone} /></div></button>
			</td>
		</tr>
	)
}