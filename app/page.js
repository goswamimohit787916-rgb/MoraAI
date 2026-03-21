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

  // ================= AUTH =================
  async function signup(){
    setStatus("Creating...");

    const res = await fetch(API+"/signup",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });

    const d = await res.json();
    setStatus(d.ok ? "Account created" : d.error);
  }

  async function login(){
    setStatus("Logging in...");

    const res = await fetch(API+"/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });

    const d = await res.json();

    if(d.ok){
      localStorage.setItem("uid", d.uid);
      setUid(d.uid);
      loadVoices(d.uid);
      setStatus("Logged in");
    } else {
      setStatus("Invalid login");
    }
  }

  // ================= VOICES =================
  async function loadVoices(id){
    const res = await fetch(API+"/voices?uid="+id);
    const d = await res.json();
    setVoices(d.voices || []);
  }

  function uploadVoice(e){
    const file = e.target.files[0];
    const uid = localStorage.getItem("uid");

    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];

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

  // ================= GENERATE =================
  async function generate(){
    const res = await fetch(API+"/generate",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({text})
    });

    const d = await res.json();
    if(d.ok) setAudio(d.audio);
  }

  useEffect(()=>{
    const id = localStorage.getItem("uid");
    if(id){
      setUid(id);
      loadVoices(id);
    }
  },[]);

  return (
    <div style={{display:"flex",fontFamily:"Arial",background:"#f5f6f8"}}>

      {/* SIDEBAR */}
      <div style={{
        width:220,
        height:"100vh",
        background:"#fff",
        borderRight:"1px solid #eee",
        padding:20
      }}>
        <h2>MoraAI</h2>

        <div style={{marginTop:30,lineHeight:"2"}}>
          <div style={{fontWeight:"bold"}}>Generate</div>
          <div>Voices</div>
          <div>Projects</div>
          <div>Settings</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,padding:30}}>

        {/* TOP BAR */}
        <div style={{
          display:"flex",
          justifyContent:"space-between",
          marginBottom:20
        }}>
          <div>Credit Limit: 15000</div>
          <button style={{
            background:"#4da6ff",
            color:"#fff",
            border:"none",
            padding:"8px 15px",
            borderRadius:6
          }}>
            Upgrade
          </button>
        </div>

        {/* AUTH */}
        <div style={{marginBottom:20}}>
          <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
          <button onClick={signup}>Sign Up</button>
          <button onClick={login}>Login</button>
          <p>{status}</p>
        </div>

        {/* MAIN CARD */}
        <div style={{
          background:"#fff",
          padding:25,
          borderRadius:12
        }}>

          {/* TEXT */}
          <textarea
            placeholder="Enter your text here..."
            style={{width:"100%",height:140,padding:10}}
            onChange={e=>setText(e.target.value)}
          />

          {/* BUTTONS */}
          <div style={{marginTop:10}}>
            <input type="file" onChange={uploadVoice}/>
          </div>

          {/* CONTROLS */}
          <div style={{marginTop:15}}>
            <select>
              <option>Default Voice</option>
            </select>

            <button onClick={generate} style={{marginLeft:10}}>
              Generate
            </button>
          </div>

          {/* VOICES */}
          <div style={{marginTop:20}}>
            <b>Your Voices:</b>
            <ul>
              {voices.map(v=>(
                <li key={v.id}>{v.name}</li>
              ))}
            </ul>
          </div>

          {/* AUDIO */}
          {audio && (
            <div style={{marginTop:20}}>
              <audio controls src={audio}></audio>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
