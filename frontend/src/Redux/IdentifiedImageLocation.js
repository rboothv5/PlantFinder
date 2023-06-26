import  {createSlice} from "@reduxjs/toolkit"

const IdentifiedImageLocationSlice = createSlice({
	name:"IdentifiedImageLocation",
	initialState:{
		IdentifiedImageLocationVisible:false,
		Latitude:[],
		Longitude:[]
	},
	
	reducers:{
		ShowModalIdentifiedImageLocation: (state, action)=>{
			state.IdentifiedImageLocationVisible=action.payload
		},
		SendLatitude: (state, action)=>{
			state.Latitude=action.payload
		},
		SendLongitude: (state, action)=>{
			state.Longitude=action.payload
		}
	}
})

export const {ShowModalIdentifiedImageLocation, SendLatitude, SendLongitude} = IdentifiedImageLocationSlice.actions
export default IdentifiedImageLocationSlice.reducer