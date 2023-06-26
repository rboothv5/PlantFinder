import React, {useState} from 'react'
import './SidebarItem.css';
import {ShowModalSummaryReport} from '../Redux/Reports'
import {ShowModalDetailReport} from '../Redux/Reports'
import {useDispatch, useSelector} from "react-redux"
import {cog} from 'react-icons-kit/fa/cog'
import {Icon} from 'react-icons-kit'
import {images} from 'react-icons-kit/ionicons/images'
import {documentText} from 'react-icons-kit/typicons/documentText'

export default function SideBarItem({MenuItems, Key}){
	const [isOpen, setisOpen]=useState(false)
	const dispatch=useDispatch()
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);
	
	function HandleClick(MenuItems){
		switch(MenuItems.Link){
			case 'ModalSummaryReport':
				dispatch(ShowModalSummaryReport(true))
				break;
			case 'ModalDetailReport':
				dispatch(ShowModalDetailReport(true))
				break;
			default:
				break;
		}
	}
	
	if(MenuItems.Submenu){
		return(
			<div className={DarkMode ? isOpen ? "SidebarItemDark Open": "SidebarItemDark" : isOpen ? "SidebarItemLight Open": "SidebarItemLight"}>
				<div className={DarkMode ? "SidebarTitleDark" : "SidebarTitleLight"}>
					<span>
						<Icon size={24} icon={documentText} />
						{MenuItems.Title}
					</span>
					<i className={MenuItems.Icon} onClick={()=>setisOpen(!isOpen)}></i>
				</div>
				<div className={DarkMode ? "SidebarContentDark" : "SidebarContentLight"}>
					{isOpen && MenuItems.Submenu.map((MenuItems)=>{
						return(
							<ul key={MenuItems.id}>
								<li className={DarkMode ? "liReportsDark" : "liReportsLight"} onClick={()=>HandleClick(MenuItems)}>{MenuItems.Title}</li>
							</ul>			
						)})
					}
				</div>
			</div>
		)
	}
			
	if(!MenuItems.Submenu){ 
		return(
			<div className={DarkMode ? isOpen ? "SidebarItemDark Open": "SidebarItemDark" : isOpen ? "SidebarItemLight Open": "SidebarItemLight"}>
				<div className={DarkMode ? "SidebarTitleDark" : "SidebarTitleLight"} onClick={()=>setisOpen(!isOpen)}>
					<span>
						<Icon size={25} icon={MenuItems.Title==="Sample Images" ? images : MenuItems.Title==="Settings" ? cog : false} />
						{MenuItems.Title}
					</span>
					<i className="bi-chevron-down toggle-btn" onClick={()=>setisOpen(!isOpen)}></i>
				</div>
				<div className={DarkMode ? "SidebarContentDark" : "SidebarContentLight"}>
					{isOpen &&(
						<div>{MenuItems.Link}</div>
					)}
				</div>
			</div>
		)
	}
}