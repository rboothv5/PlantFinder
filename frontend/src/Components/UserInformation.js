import React from 'react'
import './UserInformation.css';
import {useSelector} from "react-redux"

export default function UserInformation({handleAddFormChange, AddFormData}){
	
	const {OperationBusy}=useSelector((state)=>state.OperationRunning);
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);

	return(
		<div className={DarkMode ? "AddUserInformationContainerDark" : "AddUserInformationContainerLight" }>
			<p className={DarkMode ? "lblUserInformationDark" : "lblUserInformationLight"}>User Information</p>
			<div className={DarkMode ? "AddUserInformationDetailDark" : "AddUserInformationDetailLight"}>
				<div className={DarkMode ? "lblFirstnameDark" : "lblFirstnameLight"}>
					<label htmlFor="txtFirstName">Firstname</label>
				</div>
				<div className={DarkMode ? "dataFirstnameDark" : "dataFirstnameDark"}>
					<input type="text" id='txtFirstname' className={DarkMode ? "inputFirstnameDark" : "inputFirstnameLight"} disabled={OperationBusy ? true:false} 
					name="Firstname" value={AddFormData.Firstname} required="required" onChange={handleAddFormChange}/>
				</div>
				
				<div className={DarkMode ? "lblSurnameDark" : "lblSurnameLight"}>
					<label htmlFor="txtSurname">Surname</label>
				</div>
				<div className={DarkMode ? "dataSurnameDark" : "dataSurnameDark"}>
					<input type="text" id='txtSurname' className={DarkMode ? "inputSurnameDark" : "inputSurnameLight"}  disabled={OperationBusy ? true:false} 
					name="Surname" value={AddFormData.Surname} required="required" onChange={handleAddFormChange}/>
				</div>
			
				<div className={DarkMode ? "lblCommentsDark" : "lblCommentsLight"}>
					<label htmlFor="txtComments">Comments</label>
				</div>
				<div className={DarkMode ? "dataCommentsDark" : "dataCommentsDark"}>
					<textarea id='txtComments' className={DarkMode ? "inputCommentsDark" : "inputCommentsLight"} disabled={OperationBusy ? true:false} 
					name="Comments" value={AddFormData.Comments} required="required" onChange={handleAddFormChange}/>
				</div>
			</div>
		</div> 
	)
}
	
