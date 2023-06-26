import  {createSlice} from "@reduxjs/toolkit"

const IdentificationsOperationsSlice = createSlice({
	name:"IdentificationOperations",
	initialState:{
		ShowModalIdentifications:false,
		AddFormData:[],
		FileName:[],
		FormatDateCreated:[],
		ImgBase64:[],
		Latitude:[],
		Longitude:[],
		isValidSearch:0
	},
	
	reducers:{
		SendShowModalIdentifications: (state, action)=>{
			state.ShowModalIdentifications=action.payload
		},
		SendAddFormData: (state, action)=>{
			state.AddFormData=action.payload
		},
		SendFileName: (state, action)=>{
			state.FileName=action.payload
		},
		SendFormatDateCreated: (state, action)=>{
			state.FormatDateCreated=action.payload
		},
		SendimgBase64: (state, action)=>{
			state.ImgBase64=action.payload
		},
		SendLatitude: (state, action)=>{
			state.Latitude=action.payload
		},
		SendLongitude: (state, action)=>{
			state.Longitude=action.payload
		},
		SendisValidSearch: (state, action)=>{
			state.isValidSearch=action.payload
		},
	}
})

export const {
	SendShowModalIdentifications, 
	SendAddFormData, 
	SendFileName, 
	SendFormatDateCreated, 
	SendimgBase64, 
	SendLatitude, 
	SendLongitude, 
	SendisValidSearch} = IdentificationsOperationsSlice.actions

	export default IdentificationsOperationsSlice.reducer

