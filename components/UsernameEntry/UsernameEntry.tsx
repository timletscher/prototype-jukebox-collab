"use client"
import React from 'react'

export default function UsernameEntry(){
  return (
    <div style={{marginTop:12}}>
      <label style={{display:'block',fontSize:12,color:'#9fb4c8'}}>Enter a display name</label>
      <input placeholder="your name" style={{padding:8,borderRadius:6,border:'1px solid #19323d',background:'#041018',color:'#e6eef8'}} />
    </div>
  )
}
