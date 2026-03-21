"use client";

import { useState, useEffect } from "react";

const API = "https://backend.goswamimohit787916.workers.dev";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credits, setCredits] = useState(0);
  const [status, setStatus] = useState("");
  const [voices, setVoices] = useState([]);

  // ========= SIGNUP =========
  async function signup() {
    setStatus("Creating...");

    const res = await fetch(API + "/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.ok) setStatus("Account created");
    else setStatus("Error");
  }

  // ========= LOGIN =========
  async function login() {
    setStatus("Logging in...");

    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.ok) {
      localStorage.setItem("uid", data.uid);
      setStatus("Logged in");
      loadUser();
      loadVoices();
    } else {
      setStatus("Invalid login");
    }
  }

  // ========= LOAD USER =========
  async function loadUser() {
    const uid = localStorage.getItem("uid");

    const res = await fetch(API + "/user?uid=" + uid);
    const data = await res.json();

    setCredits(data.user?.credits || 0);
  }

  // ========= LOAD VOICES =========
  async function loadVoices() {
    const uid = localStorage.getItem("uid");

    const res = await fetch(API + "/voices?uid=" + uid);
    const data = await res.json();

    setVoices(data.voices.results || []);
  }

  // ========= UPLOAD VOICE =========
  async function uploadVoice(e) {
    const file = e.target.files[0];
    const uid = localStorage.getItem("uid");

    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];

      await fetch(API + "/save-voice", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          uid,
          name: file.name,
          pth: base64
        })
      });

      alert("Voice uploaded");
      loadVoices();
    };

    reader.readAsDataURL(file);
  }

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      loadUser();
      loadVoices();
    }
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>MoraAI</h1>

      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <br/><br/>

      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <br/><br/>

      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Login</button>

      <p>{status}</p>
      <p>Credits: {credits}</p>

      <hr/>

      <h3>Upload Voice (.pth)</h3>
      <input type="file" onChange={uploadVoice} />

      <h3>Your Voices</h3>
      <ul>
        {voices.map(v => (
          <li key={v.id}>{v.name}</li>
        ))}
      </ul>
    </div>
  );
}
