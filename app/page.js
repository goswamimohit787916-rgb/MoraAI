"use client";

import { useState, useEffect } from "react";

const API = "https://backend.goswamimohit787916.workers.dev";

export default function Home() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [uid,setUid]=useState("");
  const [voices,setVoices]=useState([]);
  const [text,setText]=useState("");
  const [audio,setAudio]=useState("");
  const [status,setStatus]=useState("");

  // ---------- AUTH ----------
  async function signup(){
    const res = await fetch(API+"/signup",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    const d=await res.json();
    setStatus(d.ok?"Created":d.error);
  }

  async function login(){
    const res = await fetch(API+"/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    const d=await res.json();

    if(d.ok){
      localStorage.setItem("uid",d.uid);
      setUid(d.uid);
      loadVoices(d.uid);
      setStatus("Logged in");
    }else{
      setStatus("Invalid");
    }
  }

  // ---------- LOAD VOICES ----------
  async function loadVoices(id){
    const res=await fetch(API+"/voices?uid="+id);
    const d=await res.json();
    setVoices(d.voices||[]);
  }

  // ---------- UPLOAD VOICE ----------
  function uploadVoice(e){
    const file=e.target.files[0];
    const uid=localStorage.getItem("uid");

    const reader=new FileReader();

    reader.onload=async()=>{
      const base64=reader.result.split(",")[1];

      await fetch(API+"/save-voice",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          uid,
          name:file.name,
          pth:base64
        })
      });

      loadVoices(uid);
    };

    reader.readAsDataURL(file);
  }

  // ---------- GENERATE ----------
  async function generate(){
    const res=await fetch(API+"/generate",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({text})
    });

    const d=await res.json();
    if(d.ok) setAudio(d.audio);
  }

  useEffect(()=>{
    const id=localStorage.getItem("uid");
    if(id){
      setUid(id);
      loadVoices(id);
    }
  },[]);

  return (
    <div style={{display:"flex",fontFamily:"Arial"}}>

      {/* SIDEBAR */}
      <div style={{width:220,background:"#fff",padding:20}}>
        <h2>MoraAI</h2>
        <p>Generate</p>
        <p>Voices</p>
      </div>

      {/* MAIN */}
      <div style={{flex:1,padding:30,background:"#f5f5f5"}}>

        {/* AUTH */}
        <input placeholder="email" onChange={e=>setEmail(e.target.value)} />
        <input placeholder="password" type="password" onChange={e=>setPassword(e.target.value)} />
        <button onClick={signup}>SignUp</button>
        <button onClick={login}>Login</button>
        <p>{status}</p>

        <hr/>

        {/* UPLOAD */}
        <input type="file" onChange={uploadVoice}/>

        {/* VOICES */}
        <ul>
          {voices.map(v=>(
            <li key={v.id}>{v.name}</li>
          ))}
        </ul>

        {/* TEXT */}
        <textarea onChange={e=>setText(e.target.value)} />

        <button onClick={generate}>Generate</button>

        {audio && <audio controls src={audio}></audio>}
      </div>
    </div>
  );
}
