import React from 'react'
import 'react-circular-progressbar/dist/styles.css';
import './CircularPercentage.css'
import {useSelector } from 'react-redux';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar';

export default function CircularPercentage(props) {

	const {DarkMode} =useSelector((state)=>state.ApplicationSettings);

	return(
		<div className="CircularPercentage">
			<CircularProgressbar
				value={props.Score}
				strokeWidth={8}
				text={`${props.Score}%`}
				styles={
					DarkMode ? buildStyles({
						rotation: 1,
						strokeLinecap: 'round',
						textSize: '16px',
						pathTransitionDuration: 20,
						pathColor: `rgb(47, 94, 248)`,
						textColor: 'rgb(238,238,238)',
						trailColor: `rgb(123,145,151)`,
					}) :

					buildStyles({
						rotation: 1,
						strokeLinecap: 'round',
						textSize: '14px',
						pathTransitionDuration: 20,
						pathColor: `rgb(2,163,99)`,
						textColor: 'rgb(0,0,0)',
						trailColor: `rgb(145,220,255)`,
					})
				}
			/>
		</div>
  	)
}
