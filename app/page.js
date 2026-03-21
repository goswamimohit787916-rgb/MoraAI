"use client";

import { useState } from "react";

const API = "https://backend.goswamimohit787916.workers.dev";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [audio, setAudio] = useState("");

  async function signup() {
    setStatus("Creating...");

    const res = await fetch(API + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.ok) setStatus("Account created");
    else setStatus(data.error);
  }

  async function login() {
    setStatus("Logging in...");

    const res = await fetch(API + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.ok) {
      localStorage.setItem("uid", data.uid);
      setStatus("Logged in");
    } else {
      setStatus("Invalid login");
    }
  }

  async function generate() {
    const res = await fetch(API + "/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    if (data.ok) setAudio(data.audio);
  }

  return (
    <div style={{ padding: 30 }}>

      <h1>MoraAI</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Login</button>

      <p>{status}</p>

      <hr />

      <textarea
        placeholder="Enter text"
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <button onClick={generate}>Generate</button>

      {audio && <audio controls src={audio}></audio>}

    </div>
  );
      }
