import React, {useEffect, useState} from 'react'
import './SampleImages.css'
import {GetSampleImages} from './ComponentFunctions';
import {useSelector} from "react-redux"
import {Icon} from 'react-icons-kit'
import {ic_error_outline_outline} from 'react-icons-kit/md/ic_error_outline_outline'

export default function SampleImages(){
  	
	const [result, setresult]=useState('')
	const [Error, setError]=useState(false)
	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);

	var SampleImages

	useEffect(() => {
		GetSampleImages().then(function(data){
			if(!data){setError(true)}
			else{
				SampleImages=data
				setresult(SampleImages)
			}
			
		})
		
		const interval = setInterval(() => {
			GetSampleImages().then(function(data){
				if(!data){setError(true)}
				else{
					SampleImages=data
					setresult(SampleImages)
				}
			})
	  }, 15000);
	  return () => clearInterval(interval) ;
	}, []);

	return (
		<div className="SampleImagesContainer">
			
			<ul>
                <p className={DarkMode ? "lblSampleImageInstructionDark" : "lblSampleImageInstructionLight"}>&#40;Drag and Drop to view&#41;</p>
                {Error && (
					<>
						<Icon className="iconError" size={60} icon={ic_error_outline_outline} />
						<p className={DarkMode ? "SampleImageErrorDark" : "SampleImageErrorLight"}>Error retrieving sample images</p>
					</>
				)}
				{result && result.map(result=>(
					<li className="liSampleImages" key={result.Position}>
						<p className={DarkMode ? "PlantNameDark" : "PlantNameLight"}>{result.Plantname}</p>
						<img draggable="true" src={require(`../Images/${result.Filename}`)} className="SampleImage" alt="" height="100" width="100"/>
					</li>
				))}
			</ul>
		</div>				
	)
}