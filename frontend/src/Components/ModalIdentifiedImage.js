import React from 'react'
import './ModalIdentifiedImage.css'
import Spinner from './Spinner';
import {ShowModalIdentifiedImage } from '../Redux/Reports';
import {useDispatch, useSelector} from "react-redux"

export default function ModalIdentifiedImage() {
	
	const dispatch=useDispatch()
	const ClassName='GetIdentifiedImage'
	const {OperationBusy}=useSelector((state)=>state.OperationRunning);
	const {PreSignedURL}=useSelector((state)=>state.Reports);			
	const {DarkMode}=useSelector((state)=>state.ApplicationSettings);
	const HandleCloseModalIdentifiedImage=()=>{
		dispatch(ShowModalIdentifiedImage(false))
	}

	return (
		<div className="ModalIdentifiedImage-Backdrop">
			<div className={DarkMode ? "IdentifiedImageContainerDark" : "IdentifiedImageContainerLight"}>
				<button className={DarkMode ? "CloseModalIdentifiedImageDark" : "CloseModalIdentifiedImageLight"} onClick={()=>HandleCloseModalIdentifiedImage()}>x</button> 
				<div className={DarkMode ? "IdentifiedImageHeaderDark" : "IdentifiedImageHeaderLight"}>
					<p className={DarkMode ? "IdentifiedImageDark" : "IdentifiedImageLight"}>Plant Image</p>
				</div>
				{OperationBusy &&(<Spinner classname={ClassName}/>)}
				{!OperationBusy &&(
				<div className="IdentifiedImageContainer">
					<img className="IdentifiedImage" src={PreSignedURL}  alt=""/>
				</div>
				)}
			</div>
		</div>
	)
}