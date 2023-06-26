import React from 'react'
import './Spinner.css'

export default function Spinner({children, classname}) {
  return (
	<div className={classname}>
		{children}
	</div>
  )
}