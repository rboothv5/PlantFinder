import React from 'react'
import './SidebarItem.css'
import './Sidebar.css'
import SideBarItem from './SideBarItem'
import {MenuItems} from './SidebarData'
import {useSelector} from "react-redux"

export default function Sidebar() {
	
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);

	return (
		<div className={DarkMode ? "SidebarDark":"SidebarLight"}>
			<img src='/Images/SidebarImage.png' className="CoverImage" alt="" width="100" height="100"/>
			<div className='SideBarMenuItems'>
				{MenuItems.map((MenuItems, key)=> <SideBarItem key={key} MenuItems={MenuItems}/>)} 
			</div>
		</div> 
	)
}


