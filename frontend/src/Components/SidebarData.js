import React from 'react'
import SampleImages from './SampleImages'
import Settings from './Settings'
export const MenuItems=[
	{
		"Title":"Reports",
		"Icon":"bi-chevron-down toggle-btn",
		"Submenu": [
			{
				"id":0,
				"Title":"Identifications Summary",
				"Link":"ModalSummaryReport"
			},
			{
				"id":1,
				"Title":"Identifications Detail",
				"Link":"ModalDetailReport"
			}
		]
	},
	{
		"Title":"Sample Images",
		"Icon":"images",
		"Link":<SampleImages/>
	},
	{
		"Title":"Settings",
		"Icon":"cog",
		"Link":<Settings/>
	},
]
	
	
	
	
	
	
	
	
	