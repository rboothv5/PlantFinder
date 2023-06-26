import React from 'react'
import './ApplicationError.css'
import {Icon} from 'react-icons-kit' 
import {warning} from 'react-icons-kit/fa/warning'
import {server} from 'react-icons-kit/oct/server'
import {database} from 'react-icons-kit/icomoon/database'

export default function ApplicationError({ServerOnline, DatabaseOnline}){
  
  return(
    <div className="ServerOfflineContainer">
      <p className="lblServerOfflineHeader">Plant Finder</p>
      <Icon className="iconExclamation" size={140} icon={warning} />
      <p className="lblApplicationError">Application Error</p>
      {!ServerOnline && <><Icon className="iconServer" size={50} icon={server} /><p className="lblServerOffline">Backend server offline</p></>}
      {!DatabaseOnline && <><Icon className={!ServerOnline ? "iconDatabaseServerOffline" : "iconDatabaseServerOnline"} size={45} icon={database} /><p className={!ServerOnline ? "lblDatabaseOfflineServerOffline" : "lblDatabaseOfflineServerOnline"}>Database offline</p></>}
    </div>
  )
}

