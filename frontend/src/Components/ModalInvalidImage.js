import React from 'react'
import './ModalInvalidImage.css'
import {useDispatch, useSelector} from "react-redux"
import {ShowModalInvalidImage} from '../Redux/InvalidImage';	
import {Icon} from 'react-icons-kit'
import {ic_error_outline_outline} from 'react-icons-kit/md/ic_error_outline_outline'

export default function modalInvalidImage() {
		
	const {MessageBoxTitle} =useSelector((state)=>state.InvalidImage);
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);
	const {InvalidImageMessage1} =useSelector((state)=>state.InvalidImage);
	const {InvalidImageMessage2} =useSelector((state)=>state.InvalidImage);
	const dispatch=useDispatch()
	const HandleCloseInvalidImage=()=>{
		dispatch(ShowModalInvalidImage(false))
	}
	
	return (
		<div>
			<div className="ModalInvalidImage-Backdrop">
				<div className={DarkMode ? "ModalInvalidImageOuterDark" : "ModalInvalidImageOuterLight"}>
					<Icon className="iconExclamationInvalidImage" size={92} icon={ic_error_outline_outline} />
					<p className={DarkMode ? "MessageBoxTitleDark" : "MessageBoxTitleLight"}>{MessageBoxTitle}</p>
					<p className={DarkMode ? "MessageBoxDetail1Dark" : "MessageBoxDetail1Light"}>{InvalidImageMessage1}</p>
					<p className={DarkMode ? "MessageBoxDetail2Dark" : "MessageBoxDetail2Light"}>{InvalidImageMessage2}</p>
					<button className={DarkMode ? "CloseModalInvalidImageDark" : "CloseModalInvalidImageLight"} onClick={()=>HandleCloseInvalidImage()}>OK</button>
				</div>
		  	</div>
	  	</div>	
	)
}