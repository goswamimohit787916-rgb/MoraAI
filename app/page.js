"use client";

import { useState } from "react";

const API = "https://backend.goswamimohit787916.workers.dev";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credits, setCredits] = useState(0);
  const [status, setStatus] = useState("");

  // ================= SIGNUP =================
  async function signup() {
    setStatus("Creating...");

    try {
      const res = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const text = await res.text();
      console.log("Signup response:", text);

      const data = JSON.parse(text);

      if (data.ok) {
        setStatus("Account created");
      } else {
        setStatus("Signup error");
      }

    } catch (e) {
      console.log(e);
      setStatus("Network error");
    }
  }

  // ================= LOGIN =================
  async function login() {
    setStatus("Logging in...");

    try {
      const res = await fetch(API + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await res.json();

      if (data.ok) {
        localStorage.setItem("uid", data.uid);
        setStatus("Logged in");
        loadUser();
      } else {
        setStatus("Invalid login");
      }

    } catch (e) {
      setStatus("Network error");
    }
  }

  // ================= LOAD USER =================
  async function loadUser() {
    const uid = localStorage.getItem("uid");

    try {
      const res = await fetch(API + "/user?uid=" + uid);
      const data = await res.json();

      if (data.user) {
        setCredits(data.user.credits);
      }

    } catch (e) {
      console.log("User fetch failed");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>MoraAI</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Login</button>

      <p>{status}</p>
      <p>Credits: {credits}</p>
    </div>
  );
}
