import React, {useEffect} from 'react'
import './EditableRow.css'
import {UpdateData} from './ComponentFunctions'
import {useDispatch, useSelector} from "react-redux"
import {UpdateDataReady} from '../Redux/DataOperations'
import {UpdateOperationRunning} from '../Redux/OperationRunning'
import {SendIndividualRecordChecked, SendDeleteSelectedRecords} from '../Redux/DeleteRecord';
import {SendOperationType} from '../Redux/DataOperations';
import {SendMessageRecordSave, SendMessageRecordSaveStatus, ShowModalSaveRecord, SendMessageBoxTitle } from '../Redux/SaveRecord'
import {Icon} from 'react-icons-kit'
import {ic_save} from 'react-icons-kit/md/ic_save'

export default function EditableRow({EditFormData, HandleEditFormChange, EditID, Records}){
	
	const dispatch=useDispatch()
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);
	
	var SelectedRecords=[]
	var SelectedRecordIndex
	
	function SelectRecordsToDelete(event, props) {
		SelectedRecordIndex = Records.findIndex(function(item, i){
			return item.Filename === EditID
		});

		let SelectSingleRecord = document.getElementsByClassName('chkSelectSingleRecord');
								
		if (SelectSingleRecord[SelectedRecordIndex].checked===true) {
			dispatch(SendIndividualRecordChecked(true))
			SelectedRecords.push("Add")
			SelectedRecords.push(EditID)
			dispatch(SendDeleteSelectedRecords(SelectedRecords)) //Using redux to maintain state as the selectedRecords array is cleared each time the checkbox is clicked
		}
			
		if (SelectSingleRecord[SelectedRecordIndex].checked===false) {
			dispatch(SendIndividualRecordChecked(false))
			SelectedRecords.push("Remove")
			SelectedRecords.push(EditID)
			dispatch(SendDeleteSelectedRecords(SelectedRecords))
			}
		}

		function HandleUpdateClick(){
			
			dispatch(ShowModalSaveRecord(true))
			dispatch(SendOperationType('SaveEdit'))
			dispatch(SendMessageBoxTitle('UPDATE RECORD'))
			dispatch(SendMessageRecordSave('Updating record...'))
			dispatch(UpdateDataReady(false))
			dispatch(UpdateOperationRunning(true))
			dispatch(SendIndividualRecordChecked(false)) //Set this back to false incase the user had it checked before editing the record and saving
		
			UpdateData(EditFormData, EditID, Records).then(function(data){
				dispatch(UpdateDataReady(true))
				dispatch(UpdateOperationRunning(false))
				
				switch(data['MessageCode']){
					case 0: 
						dispatch(SendMessageRecordSave('User data for ' + data['IdentifiedPlant'] + ' saved successfully' ))
						dispatch(SendMessageRecordSaveStatus('Information'))
						break;
					case 2: 
						dispatch(SendMessageRecordSave('There was an error updating the user data for ' + data['IdentifiedPlant']))
						dispatch(SendMessageRecordSaveStatus('Error'))
						break;
					default:
						break;
				}
			})
		}
		useEffect(() => {
		
			dispatch(SendMessageRecordSave(''))
		
		},[])


	return (
		<tr className={DarkMode ? "SummaryReportRowDark" : "SummaryReportRowLight"}>
			<td className={DarkMode ? "tdSelectSingleRecordEditDark" : "tdSelectSingleRecordEditLight"}>
				<input type="checkbox" className="chkSelectSingleRecord" onChange={SelectRecordsToDelete}/>
			</td>
			<td>
				<input 	className={DarkMode ? "inputBoxNamesDark" : "inputBoxNamesLight"} type="text" placeholder="Enter First Name" name="Firstname" value={EditFormData.Firstname} onChange={HandleEditFormChange}></input>	
			</td>
			<td>
				<input 	className={DarkMode ? "inputBoxNamesDark" : "inputBoxNamesLight"} type="text" placeholder="Enter Surname" name="Surname" value={EditFormData.Surname} onChange={HandleEditFormChange}></input>	
			</td>
			<td>
				{EditFormData.DateAdded} 	
			</td>
			<td>
				{EditFormData.IdentifiedPlant}	
			</td>
			<td>
				{EditFormData.Score}
			</td>
			<td>
				<input 	className={DarkMode ? "inputBoxCommentsDark" : "inputBoxCommentsLight"} type="text" placeholder="Enter Comments" name="Comments" value={EditFormData.Comments} onChange={HandleEditFormChange}></input>	
			</td>
			<td className="tdSave">
				<button className="RecordActions" type="button" onClick={()=>HandleUpdateClick()}><div className={DarkMode ? "iconSaveDark" : "iconSaveLight"}><Icon size={24} icon={ic_save} /></div></button>
			</td>
			<td className="DataActionButtons">
				
			</td>
		</tr>
	)
}