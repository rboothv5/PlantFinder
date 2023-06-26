import  {createSlice} from "@reduxjs/toolkit"

const ReportsSlice = createSlice({
	name:"Reports",
	initialState:{
		SummaryReportVisible: false,
		DetailReportVisible:false,
		IdentifiedImageVisible:false,
		PreSignedURL:''
	},
	
	reducers:{
		ShowModalSummaryReport: (state, action)=>{
			state.SummaryReportVisible=action.payload
		},
		ShowModalDetailReport: (state, action)=>{
			state.DetailReportVisible=action.payload
		},
		ShowModalIdentifiedImage: (state, action)=>{
			state.IdentifiedImageVisible=action.payload
		},
		SendPresignedURL: (state, action)=>{
			state.PreSignedURL=action.payload
		}
	}
})

export const {ShowModalSummaryReport, ShowModalDetailReport, ShowModalIdentifiedImage, SendPresignedURL} = ReportsSlice.actions
export default ReportsSlice.reducer