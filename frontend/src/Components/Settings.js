import React, {useState} from 'react'
import './Settings.css'
import {useDispatch, useSelector} from "react-redux"
import {SendDarkMode } from '../Redux/ApplicationSettings'
import {Icon} from 'react-icons-kit'
import {ic_toggle_on} from 'react-icons-kit/md/ic_toggle_on'
import {ic_toggle_off} from 'react-icons-kit/md/ic_toggle_off'

export default function Settings(){
	
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);
	const [isDarkMode, setisDarkMode]=useState(false)
	const dispatch=useDispatch()
	const handleToggleClick=()=>{
		setisDarkMode(!isDarkMode)
		dispatch(SendDarkMode(isDarkMode))
	}
	
	return (
		<div className="SettingsContainer">
			<div className="DarkModeToggle">
				<span><p className={DarkMode ? "lblDarkModeDark" : "lblDarkModeLight"}>Dark Mode</p></span>
				<span>
					{DarkMode && <button className="btnDarkModeToggle" type="button" onClick={()=>handleToggleClick()}><div className="iconDarkModeDark"><Icon className="ToggleDark" size={40} icon={ic_toggle_on} /></div></button>} 
					{!DarkMode && <button className="btnDarkModeToggle" type="button" onClick={()=>handleToggleClick()}><div className="iconDarkModeLight"><Icon className="ToggleLight" size={40} icon={ic_toggle_off} /></div></button> }
				</span>
			</div>
		</div>
	)
}

