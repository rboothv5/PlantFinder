import React from 'react'
import './DetailReportData.css';
import {useDispatch, useSelector} from "react-redux"
import {UpdateOperationRunning} from '../Redux/OperationRunning';
import {GetPresignedURL} from './ComponentFunctions';
import {SendPresignedURL,ShowModalIdentifiedImage} from '../Redux/Reports'
import {SendLatitude,SendLongitude, ShowModalIdentifiedImageLocation } from '../Redux/IdentifiedImageLocation'
import {Icon} from 'react-icons-kit'
import {camera} from 'react-icons-kit/entypo/camera'
import {ic_location_on_outline} from 'react-icons-kit/md/ic_location_on_outline'

export default function DetailReportData({Records}) {
  	
	const dispatch=useDispatch()
	const {DarkMode}=useSelector((state)=>state.ApplicationSettings);
	
	function HandleIdentifiedImage(filename){
		dispatch(ShowModalIdentifiedImage(true))
		dispatch(UpdateOperationRunning(true))
		GetPresignedURL(filename).then(function(data){
			dispatch(SendPresignedURL(data))
			dispatch(UpdateOperationRunning(false))
		})
	}
	
	function HandleIdentifiedImageLocation(latitude, longitude){
		dispatch(ShowModalIdentifiedImageLocation(true))
		dispatch(SendLatitude(latitude))
		dispatch(SendLongitude(longitude))
	}

	var body=Records && Records.map((value, i) => {
		var Display
		if(i%10===0){
			Display=true
		}
		
		return(
			<>
				<tr className={DarkMode ? "DetailReportDark" : "DetailReportLight"}>
					{Display && <td rowSpan="10">{value.IdentifiedPlant}</td>}
					{Display && <td rowSpan="10" className={DarkMode ? "tdDescriptionDark": "tdDescriptionLight"} >{value.Description} </td>}
					<td>{value.AllIdentifiedPlants} </td>
					<td > {value.Score}</td>
					{Display && <td rowSpan="10">{value.ImageDate}</td>}
					{Display && <td rowSpan="10">{value.Latitude}</td>}
					{Display && <td rowSpan="10">{value.Longitude}</td>}
					{Display && <td rowSpan="10">{value.DateAdded}</td>}
					{Display && <td className={DarkMode ? "tdIdentifiedImageDark": "tdIdentifiedImageLight"} rowSpan="10"><button className={DarkMode ? "IdentifiedImageDark": "IdentifiedImageLight"} onClick={()=>HandleIdentifiedImage(value.Filename)}><div><Icon className={DarkMode ? "iconIdentifiedImageDark" : "iconIdentifiedImageLight"} size={28} icon={camera} /></div></button></td>}
					{Display && <td className={DarkMode ? "tdIdentifiedImageLocationDark": "tdIdentifiedImageLocationLight"} rowSpan="10">{value.Latitude && value.Longitude ? 
					<button className={DarkMode ? "IdentifiedImageLocationDark" : "IdentifiedImageLocationLight"} onClick={()=>HandleIdentifiedImageLocation(value.Latitude,value.Longitude)}><div className={DarkMode ? "iconIdentifiedImageLocationDark" : "iconIdentifiedImageLocationLight"}><Icon size={32} icon={ic_location_on_outline} /></div></button> : false}</td>}
				</tr>
			</>
		)
	})
	return body
}
	


