import  {createSlice} from "@reduxjs/toolkit"

const SaveRecordSlice = createSlice({
	name:"SaveRecord",
	initialState:{
		ModalSaveRecordVisible:false,
		MessageBoxTitle:[],
		SaveRecordMessage:[],
		SaveRecordStatusMessage:[],
		AddFormData:[],
		EditFileName:[],
		UpdateRecordMessage:[],
		Records:true
	},
	
	reducers:{
		ShowModalSaveRecord: (state, action)=>{
			state.ModalSaveRecordVisible=action.payload
		},
		SendMessageBoxTitle: (state, action)=>{
			state.MessageBoxTitle=action.payload
		},
		SendMessageRecordSave: (state, action)=>{
			state.SaveRecordMessage=action.payload
		},
		SendMessageRecordSaveStatus: (state, action)=>{
			state.SaveRecordStatusMessage=action.payload
		},
		SendFormData: (state, action)=>{
			state.AddFormData=action.payload
		},
		SendMessageEditRecord: (state, action)=>{
			state.EditFileName=action.payload
		},
		SendMessageRecordUpdate: (state, action)=>{
			state.UpdateRecordMessage=action.payload
		},
		SetRecordsAvailable: (state, action)=>{
			state.UpdateRecordMessage=action.payload
		},
	}
})

export const {
	ShowModalSaveRecord, 
	SendMessageBoxTitle,
	SendMessageRecordSave, 
	SendMessageRecordSaveStatus,
	SendFormData, 
	SendMessageEditRecord, 
	SendMessageRecordUpdate,
	SetRecordsAvailable} = SaveRecordSlice.actions

export default SaveRecordSlice.reducer