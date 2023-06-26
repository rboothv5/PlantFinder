import  {createSlice} from "@reduxjs/toolkit"

const DataOperationsSlice = createSlice({
	name:"DataOperations",
	initialState:{
		DataReady:false,
		RefreshData:false,
		OperationType: []
	},
	
	reducers:{
		SendRefreshData: (state, action)=>{
			state.RefreshData=action.payload
		},
		UpdateDataReady: (state, action)=>{
			state.DataReady=action.payload
		},
		SendOperationType: (state, action)=>{
			state.OperationType=action.payload
		},
	}
})

export const {SendRefreshData, UpdateDataReady, SendOperationType} = DataOperationsSlice.actions
export default DataOperationsSlice.reducer

