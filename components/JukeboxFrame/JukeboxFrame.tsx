"use client"
import React from 'react'
import UsernameEntry from '../UsernameEntry/UsernameEntry'
import AudioPlayer from '../AudioPlayer/AudioPlayer'

export default function JukeboxFrame(){
  return (
    <div style={{width:960,maxWidth:'95%',background:'#071019',padding:20,borderRadius:12,boxShadow:'0 10px 30px rgba(0,0,0,0.6)'}}>
      <h1 style={{margin:0,padding:0}}>Team Jukebox (Phase 0)</h1>
      <UsernameEntry />
      <AudioPlayer />
    </div>
  )
}
