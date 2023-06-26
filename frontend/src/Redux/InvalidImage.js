import  {createSlice} from "@reduxjs/toolkit"

const InvalidImageSlice = createSlice({
	name:"InvalidImage",
	initialState:{
		ModalInvalidImageVisible:false,
		InvalidImageMessageBoxTitle:[],
		InvalidImageMessage1:[],
		InvalidImageMessage2:[]
	},
	
	reducers:{
		ShowModalInvalidImage: (state, action)=>{
			state.ModalInvalidImageVisible=action.payload
		},
		SendInvalidImageMessageBoxTitle: (state, action)=>{
			state.InvalidImageMessageBoxTitle=action.payload
		},
		SendMessageInvalidImage1: (state, action)=>{
			state.InvalidImageMessage1=action.payload
		},
		SendMessageInvalidImage2: (state, action)=>{
			state.InvalidImageMessage2=action.payload
		},
		SendMessageBoxTitle: (state, action)=>{
			state.MessageBoxTitle=action.payload
		},
	}
})

export const {
	ShowModalInvalidImage, 
	SendInvalidImageMessageBoxTitle,
	SendMessageInvalidImage1,
	SendMessageInvalidImage2,
	SendMessageBoxTitle
} = InvalidImageSlice.actions

export default InvalidImageSlice.reducer