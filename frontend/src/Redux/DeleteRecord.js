import  {createSlice} from "@reduxjs/toolkit"

const DeleteRecordSlice = createSlice({
	name:"DeleteRecord",
	initialState:{
		ModalDeleteRecordVisible:false,
		MessageBoxTitle:[],
		DeleteRecordMessage:[],
		DeleteRecordStatusMessage:[],
		DeleteRecordOperationSuccessful:false,
		RecordData:[],
		DeleteHasRun:false,
		DeleteSelectedRecords:[],
		IndividualRecordChecked:false,
		AllRecordsChecked:false
	},
	
	reducers:{
		ShowModalDeleteRecord: (state, action)=>{
			state.ModalDeleteRecordVisible=action.payload
		},
		SendMessageBoxTitle: (state, action)=>{
			state.MessageBoxTitle=action.payload
		},
		SendMessageRecordDelete: (state, action)=>{
			state.DeleteRecordMessage=action.payload
		},
		SendMessageRecordDeleteStatus: (state, action)=>{
			state.DeleteRecordStatusMessage=action.payload
		},
		SendDeleteRecordOperationSuccessful: (state, action)=>{
			state.DeleteRecordOperationSuccessful=action.payload
		},
		SendRecordToDelete: (state, action)=>{
			state.RecordData=action.payload
		},
		SendDeleteHasRun: (state, action)=>{
			state.DeleteHasRun=action.payload
		},
		SendDeleteSelectedRecords: (state, action)=>{
			
			switch(action.payload[0]){
				case "Add":
					state.DeleteSelectedRecords.push(action.payload[1])
					break;

				case "Remove":
					state.DeleteSelectedRecords.pop(action.payload[1])
					break;

				case "ClearBuffer":
					state.DeleteSelectedRecords=[]
					break;
				default: 
					break;
			}
		},

		SendIndividualRecordChecked: (state, action)=>{
			state.IndividualRecordChecked=action.payload
		},
		SendAllRecordsChecked: (state, action)=>{
			state.AllRecordsChecked=action.payload
		},
	}
})

export const {
	ShowModalDeleteRecord, 
	SendMessageBoxTitle,
	SendMessageRecordDelete,
	SendMessageRecordDeleteStatus,
	SendDeleteRecordOperationSuccessful,
	SendRecordToDelete, 
	SendDeleteHasRun, 
	SendDeleteSelectedRecords, 
	SendIndividualRecordChecked,
	SendAllRecordsChecked } = DeleteRecordSlice.actions

	export default DeleteRecordSlice.reducer