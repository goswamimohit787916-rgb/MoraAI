"use client";

import { useState } from "react";

const API = "https://goswamimohit787916.cloudflareaccess.com/cdn-cgi/access/login/moraaii.goswamimohit787916.workers.dev?kid=c3afa178053d3ce6c98c682a876615909b75773ff4f90054b6d2a94c824f1cd8&meta=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjdmMmFhNGQ1MWZkNjU1MTZmNzE1MjEzMzQwYmE1MzFiMmUwZWUyMDJmYjJiZDM3MmUxYTUwNDc2YWQ0NWJkOTcifQ.eyJ0eXBlIjoibWV0YSIsImF1ZCI6ImMzYWZhMTc4MDUzZDNjZTZjOThjNjgyYTg3NjYxNTkwOWI3NTc3M2ZmNGY5MDA1NGI2ZDJhOTRjODI0ZjFjZDgiLCJob3N0bmFtZSI6Im1vcmFhaWkuZ29zd2FtaW1vaGl0Nzg3OTE2LndvcmtlcnMuZGV2IiwicmVkaXJlY3RfdXJsIjoiLyIsInNlcnZpY2VfdG9rZW5fc3RhdHVzIjpmYWxzZSwiaXNfd2FycCI6ZmFsc2UsImlzX2dhdGV3YXkiOmZhbHNlLCJleHAiOjE3NzQxMDM0MTYsIm5iZiI6MTc3NDEwMzExNiwiaWF0IjoxNzc0MTAzMTE2LCJhdXRoX3N0YXR1cyI6Ik5PTkUiLCJtdGxzX2F1dGgiOnsiY2VydF9pc3N1ZXJfZG4iOiIiLCJjZXJ0X3NlcmlhbCI6IiIsImNlcnRfaXNzdWVyX3NraSI6IiIsImNlcnRfcHJlc2VudGVkIjpmYWxzZSwiY29tbW9uX25hbWUiOiIiLCJhdXRoX3N0YXR1cyI6Ik5PTkUifSwicmVhbF9jb3VudHJ5IjoiSU4iLCJhcHBfc2Vzc2lvbl9oYXNoIjoiYWNmMzAzODJjMTI3ZTUxZGY3N2QyNjlkYTkyMjFiNzlhZDI5YTRmNjZjZTNlNDAyNmYxZmE4MDMyMjQwMjVkYiJ9.jYMUSjbLcGKyBJ1_8vxTR0wwFOeAkdeUROapHeHci0NIpTOECtqdQWHu4vHlDOt_PQanMnHaET7c7FDv5c0o4_lN66aJtQsmC8ozk2YZEmNOv_O1G7UFJi1N7lYg3EWAUTkIxtgc8hUWwoTphcX-zDnTUMG20QD46oubBlPbVwWhv38W5p_hWqmWp4GfcfOq-6GtS88zxMzg883yUm_VyZ6MkCbFIlCVwa5syVnpb709ztEfjqJtEkqHjiQBsDM9yUyw5QU7Qxfn6plIQ-a00tIDXkoPJ_ARvOqaDiuUb-S3pzIC55L5AfF3jUf9OvDx5KQUCxb-PaKo5ejAIAfIwg&redirect_url=%2F&nonce=hDoG3d6SjdPlxnVVOeXPHAh22c4rMTc3NDEwMzEyNw";

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
