import  {createSlice} from "@reduxjs/toolkit"

const OperationRunningSlice = createSlice({
	name:"OperationRunning",
	initialState:{
		OperationBusy:false,
		OperationBusyRecentSearches:false,
	},
	
	reducers:{
		UpdateOperationRunning: (state, action)=>{
			state.OperationBusy=action.payload
		},
		UpdateOperationRunningRecentSearches: (state, action)=>{
			state.OperationBusyRecentSearches=action.payload
		}
	}
})

export const {UpdateOperationRunning, UpdateOperationRunningRecentSearches} = OperationRunningSlice.actions
export default OperationRunningSlice.reducer