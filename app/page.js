"use client";

import { useState } from "react";

const API = "https://mora-api.xxxxx.workers.dev";

export default function Home() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [credits,setCredits]=useState(0);
  const [status,setStatus]=useState("");

  async function signup(){
    setStatus("Creating...");
    await fetch(API+"/signup",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    setStatus("Done");
  }

  async function login(){
    const res = await fetch(API+"/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password}),
      credentials:"include"
    });

    if(res.ok){
      loadUser();
      setStatus("Logged in");
    } else {
      setStatus("Failed");
    }
  }

  async function loadUser(){
    const res = await fetch(API+"/user",{credentials:"include"});
    const data = await res.json();
    setCredits(data.user.credits);
  }

  return (
    <div style={{padding:40}}>
      <h2>MoraAI</h2>

      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} /><br/><br/>
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /><br/><br/>

      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Login</button>

      <p>{status}</p>
      <p>Credits: {credits}</p>
    </div>
  );
}
