"use client"
import React from 'react'

export default function AudioPlayer(){
  return (
    <div style={{marginTop:18,display:'flex',alignItems:'center',gap:12}}>
      <div style={{width:80,height:80,background:'#0e1a22',borderRadius:8}} />
      <div style={{flex:1}}>
        <div style={{fontWeight:600}}>No song playing</div>
        <div style={{height:6,background:'#052025',borderRadius:4,marginTop:8}} />
      </div>
    </div>
  )
}
