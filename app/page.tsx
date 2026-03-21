"use client";

import { useState } from "react";

const API = "https://backend.goswamimohit787916.workers.dev/";

export default function Home() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [credits,setCredits]=useState(0);
  const [status,setStatus]=useState("");

  async function signup(){
    setStatus("Signing up...");
    await fetch(API+"/signup",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    setStatus("Signup done");
  }

  async function login(){
    setStatus("Logging in...");
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
      setStatus("Login failed");
    }
  }

  async function loadUser(){
    const res = await fetch(API+"/user",{credentials:"include"});
    const data = await res.json();
    setCredits(data.user.credits);
  }

  return (
    <div style={{display:"flex",height:"100vh"}}>

      <div style={{width:220,background:"#fff",padding:20}}>
        <h2>MoraAI</h2>
      </div>

      <div style={{flex:1,padding:30,background:"#f7f8fa"}}>

        <div style={{marginBottom:20}}>
          Credits: {credits}
        </div>

        <div style={{
          background:"#fff",
          padding:20,
          borderRadius:12
        }}>

          <input placeholder="Email"
            onChange={e=>setEmail(e.target.value)} /><br/><br/>

          <input placeholder="Password" type="password"
            onChange={e=>setPassword(e.target.value)} /><br/><br/>

          <button onClick={signup}>Sign Up</button>
          <button onClick={login}>Login</button>

          <p>{status}</p>

        </div>

      </div>

    </div>
  );
}
