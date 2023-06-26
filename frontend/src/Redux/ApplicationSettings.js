import  {createSlice} from "@reduxjs/toolkit"

const ApplicationSettingsSlice = createSlice({
	name:"ApplicationSettings",
	initialState:{
		DarkMode:true
	},
	
	reducers:{
		SendDarkMode: (state, action)=>{
			state.DarkMode=action.payload
		}
	}
})

export const {SendDarkMode} = ApplicationSettingsSlice.actions
export default ApplicationSettingsSlice.reducer