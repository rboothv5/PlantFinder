import React, {useState, Fragment, useEffect} from 'react'
import './SummaryReportData.css';
import ReadOnlyRow from './ReadOnlyRow';
import EditableRow from './EditableRow'
import {UpdateData} from './ComponentFunctions'
import {useDispatch, useSelector} from "react-redux"
import {SendDeleteSelectedRecords} from '../Redux/DeleteRecord'
import {SendIndividualRecordChecked} from '../Redux/DeleteRecord';
import {SendAllRecordsChecked} from '../Redux/DeleteRecord';
import {SendMessageRecordDelete} from '../Redux/DeleteRecord';
import {SendMessageBoxTitle} from '../Redux/DeleteRecord';
import {SendDeleteHasRun} from '../Redux/DeleteRecord';
import {SetRecordsAvailable} from '../Redux/SaveRecord';
import {SendRecordToDelete} from '../Redux/DeleteRecord';
import {ShowModalDeleteRecord} from '../Redux/DeleteRecord';
import {Icon} from 'react-icons-kit'
import {ic_delete_twotone} from 'react-icons-kit/md/ic_delete_twotone'

export default function ViewSummary({Records}) {
	
	var x
	var SelectedRecords=[]
	var RecordData={}
	const dispatch=useDispatch()
	const {DeleteSelectedRecords} =useSelector((state)=>state.DeleteRecord);
	const {DeleteHasRun} =useSelector((state)=>state.DeleteRecord);
	const [EditID, setEditID]=useState(null)
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);
	const [EditFormData, setEditFormData]=useState({
		Firstname:'',
		Durname:'',
		ImageDate:'',
		PredicatedPlant:'',
		Score:'',
		Comments: ''
	})
	
	const HandleEditFormChange=(event)=>{
		event.preventDefault()
		const fieldName=event.target.getAttribute("name")
		const fieldValue=event.target.value
		const newFormData={...EditFormData}
		newFormData[fieldName]=fieldValue
		setEditFormData(newFormData)
	}

	const HandleEditClick=(event, data)=>{
		event.preventDefault()
		setEditID(data.Filename) 
		const formValues={
			Firstname:data.Firstname,
			Surname:data.Surname,
			DateAdded:data.DateAdded,
			IdentifiedPlant:data.IdentifiedPlant,
			Score:data.Score,
			Comments:data.Comments
		}
		setEditFormData(formValues)
	}
	
	let chkSelectAllRecords = document.getElementsByClassName('chkSelectAllRecords');
	let chkSelectSingleRecord = document.getElementsByClassName('chkSelectSingleRecord');
	
	function SelectRecordsToDelete(event, props) {
		var SelectedRecordIndex = -1;
		var val = Records.Filename
		Records.find(function(item, i){
		  if(item.Filename === val){
			SelectedRecordIndex = i;
		}
		return SelectedRecordIndex
	});
				
		if (chkSelectAllRecords[0].checked===true) {
			dispatch(SendAllRecordsChecked(true))
			dispatch(SetRecordsAvailable(false)) 
			for(x=0;x<Records.length;x++){
				dispatch(SendIndividualRecordChecked(true))
				chkSelectSingleRecord[x].checked=true
				RecordData['FileName']=Records[x]['Filename']
				RecordData['IdentifiedPlant']=Records[x]['IdentifiedPlant']
				SelectedRecords.push("Add")
				SelectedRecords.push(RecordData)
				dispatch(SendDeleteSelectedRecords(SelectedRecords)) 
				SelectedRecords=[] 
				RecordData={} 
			}
		}

		if (chkSelectAllRecords[0].checked===false) {
			dispatch(SendAllRecordsChecked(false))
		
			for(x=0;x<Records.length;x++){
				dispatch(SendIndividualRecordChecked(true))
				chkSelectSingleRecord[x].checked=false
				chkSelectSingleRecord[x].setAttribute("checked", "false");
				RecordData['FileName']=Records[x]['filename']
				RecordData['IdentifiedPlant']=Records[x]['identifiedplant']
				SelectedRecords.push("Remove")
				SelectedRecords.push(RecordData)
				dispatch(SendDeleteSelectedRecords(SelectedRecords)) 
				SelectedRecords=[] 
			}
		}
	}

	const HandleDeleteRecords=()=>{
		dispatch(ShowModalDeleteRecord(true))
		dispatch(SendMessageBoxTitle('DELETE RECORD'))
		dispatch(SendMessageRecordDelete('Are you sure you want to delete the selected record/s?'))
		dispatch(SendRecordToDelete(DeleteSelectedRecords))
	}

	useEffect(() => {
		dispatch(SendDeleteHasRun(false))
		if(Records.length>0){
			chkSelectAllRecords[0].checked=false
			for(var x=0;x<Records.length;x++){
				chkSelectSingleRecord[x].checked=false
		}}
    },[DeleteHasRun])

	return (
		<div className="SummaryContainer">
			{!Records.length>0 && (<p className={DarkMode ? "lblNoRecordsFoundDark" : "lblNoRecordsFoundLight"}>No Records Found</p>)}
			{Records.length>0 && (
				<table className="SummaryReport">
					<thead>
						<tr className={DarkMode ? "SummaryReportHeaderDark" : "SummaryReportHeaderLight"}>
							<th className="HeaderSelectAllRecords">
								<input type="checkbox" className="chkSelectAllRecords" onChange={SelectRecordsToDelete}/>
								<button className="DeleteAllRows" type="button" disabled= {DeleteSelectedRecords.length>0 ? false: true} onClick={HandleDeleteRecords}><div className="iconDeleteAll"><Icon size={28} icon={ic_delete_twotone} /></div></button>
							</th>
							<th className={DarkMode ? "HeaderFirstNameDark" : "HeaderFirstNameLight"}>Firstname</th>
							<th className={DarkMode ? "HeaderSurnameDark" : "HeaderSurnameLight"}>Surname</th>
							<th className={DarkMode ? "HeaderDateAddedDark" : "HeaderDateAddedLight"}>Date</th>
							<th className={DarkMode ? "HeaderIdentifiedPlantDark" : "HeaderIdentifiedPlantLight"}>Plant</th>
							<th className={DarkMode ? "HeaderScoreDark" : "HeaderScoreLight"}>Score (%)</th>
							<th className={DarkMode ? "HeaderCommentsDark" : "HeaderCommentsLight"}>Comments</th>
							<th colSpan="2" className={DarkMode ? "HeaderActionsDark" : "HeaderActionsLight"}>Actions</th>
						</tr>
					</thead>	
					<tbody>
						{Records && Records.map((Data, i) => (
							<Fragment>
								{EditID===Data.Filename ? 
								<EditableRow
									EditFormData={EditFormData} 
									HandleEditFormChange={HandleEditFormChange} 
									Records={Records} 
									EditID={EditID} 
									UpdateData={UpdateData}/> : 
								<ReadOnlyRow Records={Records} Data={Data} HandleEditClick={HandleEditClick} ></ReadOnlyRow>}
							</Fragment>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}	

