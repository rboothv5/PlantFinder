import {configureStore} from "@reduxjs/toolkit";
import ApplicationSettingsReducer from './ApplicationSettings'
import DataOperationsReducer from "./DataOperations";
import DeleteRecordReducer from './DeleteRecord'
import IdentificationOperationsReducer from "./IdentificationOperations";
import IdentifiedImageLocationReducer from "./IdentifiedImageLocation";
import InvalidImageReducer from './InvalidImage'
import OperationRunningReducer from './OperationRunning'
import ReportsReducer from './Reports'
import SaveRecordReducer from './SaveRecord'



const store= configureStore({
	reducer: {
		ApplicationSettings:ApplicationSettingsReducer,
		DataOperations: DataOperationsReducer,
		DeleteRecord:DeleteRecordReducer,
		IdentificationOperations: IdentificationOperationsReducer,
		IdentifiedImageLocation:IdentifiedImageLocationReducer,
		InvalidImage:InvalidImageReducer,
		OperationRunning: OperationRunningReducer,
		Reports: ReportsReducer,
		SaveRecord:SaveRecordReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
		serializableCheck: false,
	})
});

export default store
