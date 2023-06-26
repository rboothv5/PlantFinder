import React from 'react'
import './ModalIdentifiedImageLocation.css'
import GoogleApiWrapper from './MapContainer'
import {ShowModalIdentifiedImageLocation} from '../Redux/IdentifiedImageLocation';
import {useDispatch, useSelector} from "react-redux"

export default function ModalIdentifiedImageLocation() {
	
	const {Latitude}=useSelector((state)=>state.IdentifiedImageLocation);
	const {Longitude}=useSelector((state)=>state.IdentifiedImageLocation);			
	const dispatch=useDispatch()
	const {DarkMode}=useSelector((state)=>state.ApplicationSettings);
	const HandleCloseIdentifiedImageLocation=()=>{
		dispatch(ShowModalIdentifiedImageLocation(false))
	}

	return (
		<div className="ModalIdentifiedImageLocation-Backdrop">
			<div className={DarkMode ? "ModalIdentifiedImageLocationContainerDark" : "ModalIdentifiedImageLocationContainerLight"}>
				<button className={DarkMode ? "CloseModalIdentifiedImageLocationDark" : "CloseModalIdentifiedImageLocationLight"} onClick={()=>HandleCloseIdentifiedImageLocation()}>x</button> 
				<div className={DarkMode ? "ModalIdentifiedImageLocationHeaderDark" : "ModalIdentifiedImageLocationHeaderLight"}>
					<p className={DarkMode ? "IdentifiedImageLocationDark" : "IdentifiedImageLocationLight"}>Plant Location</p>
				</div>
				<div className={DarkMode ? "IdentifiedImageLocationGoogleMapsContainerDark" : "IdentifiedImageLocationGoogleMapsContainerLight"}>
					<GoogleApiWrapper latitude={Latitude} longitude={Longitude}/>
				</div>
			</div>
		</div>
	)
}




