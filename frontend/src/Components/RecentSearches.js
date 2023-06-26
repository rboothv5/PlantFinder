import React, {useEffect, useState} from 'react'
import './RecentSearches.css'
import Spinner from './Spinner';
import {UpdateOperationRunningRecentSearches} from '../Redux/OperationRunning';
import {GetRecentIdentifications} from './ComponentFunctions'
import {useDispatch, useSelector} from "react-redux"
import {Icon} from 'react-icons-kit'
import {ic_history_twotone} from 'react-icons-kit/md/ic_history_twotone'
import {ic_error_outline_outline} from 'react-icons-kit/md/ic_error_outline_outline'

export default function RecentSearches() {
	
	const dispatch=useDispatch()
	const [Error, setError]=useState(false)
	const {RefreshData}=useSelector((state)=>state.DataOperations);
	const [RecentSearches,setRecentSearches]=useState('')
	const ClassName="GetRecentIdentifications"
	const {OperationBusyRecentSearches}=useSelector((state)=>state.OperationRunning);
	const {DarkMode}=useSelector((state)=>state.ApplicationSettings);

	const RecentSearchesListItems=[{Item:1},{Item:2},{Item:3}]

	useEffect(() => {
		dispatch(UpdateOperationRunningRecentSearches(true))
		GetRecentIdentifications().then(function(data){
			if(!data){setError(true)}
			else{
				setRecentSearches(data)
				dispatch(UpdateOperationRunningRecentSearches(false))
			}
		})
	},[RefreshData])

	return (
		<div className={DarkMode ? "RecentSearchesImagesContainerDark" : "RecentSearchesImagesContainerLight"}>
			<span><div className={DarkMode ? "iconHistoryDark" : "iconHistoryLight"}><Icon size={48} icon={ic_history_twotone} /></div></span>
			<span><p className={DarkMode ? "RecentSearchesHeadingDark" : "RecentSearchesHeadingLight"}>Recent Searches</p></span>
			<div className={DarkMode ? "hdrUnderlineDark" : "hdrUnderlineLight"}></div>
			
			{Error &&(
				<>
					<Icon className="iconRecentSearchesError" size={80} icon={ic_error_outline_outline} />
					<p className={DarkMode ? "lblRecentSearchesErrorDark" : "lblRecentSearchesErrorLight"}>Error retrieving recent searches</p>
				</>
			)}

			{!Error && (<ul className="RecentSearches">
				{RecentSearchesListItems && RecentSearchesListItems.map(data=>(
					<li className={DarkMode ? "RecentSearchesListItemPlaceHolderDark" : "RecentSearchesListItemPlaceHolderLight"} key={data.Item}>
						{OperationBusyRecentSearches && (<Spinner classname={ClassName}/>)}	
						{!OperationBusyRecentSearches && <p className={DarkMode ? "lblNoSearchDataDark" : "lblNoSearchDataLight"}>No Search Data</p>}
					</li>
				))}
			</ul>
			)}
			
			{!Error && !OperationBusyRecentSearches && (
				<ul className="RecentSearches">
					{RecentSearches && RecentSearches.map(RecentSearches=>(
						<li className={DarkMode ? "RecentSearchesListItemDark" : "RecentSearchesListItemLight"} key={RecentSearches.Filename}>
							<p className={DarkMode ? "lblRecentSearchesPlantDark" : "lblRecentSearchesPlantLight"}>Identified Plant</p>
							<p className={DarkMode ? "RecentSearchesPlantDark" : "RecentSearchesPlantLight"}>{RecentSearches.IdentifiedPlant}</p>
							<p className={DarkMode ? "lblRecentSearchesScoreDark" : "lblRecentSearchesScoreLight"}>Score</p>
							<p className={DarkMode ? "RecentSearchesScoreDark" : "RecentSearchesScoreLight"}>{RecentSearches.Score} %</p>
							<p className={DarkMode ? "lblRecentSearchesDateDark" : "lblRecentSearchesDateLight"}>Date Added</p>
							<p className={DarkMode ? "RecentSearchesDateDark" : "RecentSearchesDateLight"}>{RecentSearches.DateAdded}</p>
							<img className="RecentSearchesImage" src={RecentSearches.url} alt="" /> 
						</li>
					))}
				</ul>
			)}
		</div>
  	)	
}


