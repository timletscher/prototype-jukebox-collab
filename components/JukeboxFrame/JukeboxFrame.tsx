"use client"
import React from 'react'
import UsernameEntry from '../UsernameEntry/UsernameEntry'
import AudioPlayer from '../AudioPlayer/AudioPlayer'

export default function JukeboxFrame(){
  return (
    <div className="jukebox-frame">
      <h1 className="page-title">Team Jukebox (Phase 0)</h1>
      <UsernameEntry />
      <AudioPlayer />
    </div>
  )
}
