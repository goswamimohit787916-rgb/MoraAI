"use client";

import { useState, useEffect } from "react";

const API = "https://backend.goswamimohit787916.workers.dev";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credits, setCredits] = useState(0);
  const [status, setStatus] = useState("");
  const [voices, setVoices] = useState([]);

  // ================= SIGNUP =================
  async function signup() {
    console.log("Sending:", email, password);

    if (!email || !password) {
      setStatus("Enter email & password");
      return;
    }

    setStatus("Creating...");

    try {
      const res = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: String(email),
          password: String(password)
        })
      });

      const data = await res.json();
      console.log("Signup response:", data);

      if (data.ok) {
        setStatus("Account created");
      } else {
        setStatus(data.error || "Signup error");
      }

    } catch (e) {
      console.log(e);
      setStatus("Network error");
    }
  }

  // ================= LOGIN =================
  async function login() {
    console.log("Login:", email, password);

    if (!email || !password) {
      setStatus("Enter email & password");
      return;
    }

    setStatus("Logging in...");

    try {
      const res = await fetch(API + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: String(email),
          password: String(password)
        })
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (data.ok) {
        localStorage.setItem("uid", data.uid);
        setStatus("Logged in");
        loadUser();
        loadVoices();
      } else {
        setStatus("Invalid login");
      }

    } catch (e) {
      console.log(e);
      setStatus("Network error");
    }
  }

  // ================= LOAD USER =================
  async function loadUser() {
    const uid = localStorage.getItem("uid");

    if (!uid) return;

    try {
      const res = await fetch(API + "/user?uid=" + uid);
      const data = await res.json();

      setCredits(data.user?.credits || 0);

    } catch (e) {
      console.log("User load failed");
    }
  }

  // ================= LOAD VOICES =================
  async function loadVoices() {
    const uid = localStorage.getItem("uid");

    if (!uid) return;

    try {
      const res = await fetch(API + "/voices?uid=" + uid);
      const data = await res.json();

      setVoices(data.voices || []);

    } catch (e) {
      console.log("Voice load failed");
    }
  }

  // ================= UPLOAD VOICE =================
  function uploadVoice(e) {
    const file = e.target.files[0];
    const uid = localStorage.getItem("uid");

    if (!file || !uid) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];

      await fetch(API + "/save-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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

  // ================= AUTO LOAD =================
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      loadUser();
      loadVoices();
    }
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>MoraAI</h1>

      {/* EMAIL */}
      <input
        value={email}
        onChange={(e) => {
          console.log("Email:", e.target.value);
          setEmail(e.target.value);
        }}
        placeholder="Email"
      />
      <br /><br />

      {/* PASSWORD */}
      <input
        type="password"
        value={password}
        onChange={(e) => {
          console.log("Password:", e.target.value);
          setPassword(e.target.value);
        }}
        placeholder="Password"
      />
      <br /><br />

      {/* BUTTONS */}
      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Login</button>

      <p>{status}</p>
      <p>Credits: {credits}</p>

      <hr />

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
