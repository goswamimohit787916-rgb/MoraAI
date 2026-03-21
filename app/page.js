"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://backend.goswamimohit787916.workers.dev";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");
  const [audio, setAudio] = useState("");
  const [credits, setCredits] = useState(0);
  const [status, setStatus] = useState("");

  // ================= AUTH =================
  async function signup() {
    setStatus("Creating...");

    try {
      const res = await axios.post(API + "/signup", {
        email,
        password
      });

      if (res.data.ok) {
        setStatus("Account created");
      } else {
        setStatus(res.data.error);
      }
    } catch {
      setStatus("Error");
    }
  }

  async function login() {
    setStatus("Logging in...");

    try {
      const res = await axios.post(API + "/login", {
        email,
        password
      });

      if (res.data.ok) {
        localStorage.setItem("uid", res.data.uid);
        setStatus("Logged in");
        loadUser();
      } else {
        setStatus("Invalid login");
      }
    } catch {
      setStatus("Error");
    }
  }

  // ================= USER =================
  async function loadUser() {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    const res = await axios.get(API + "/user?uid=" + uid);
    setCredits(res.data.user?.credits || 0);
  }

  // ================= GENERATE =================
  async function generate() {
    if (!text) {
      alert("Enter text");
      return;
    }

    const res = await axios.post(API + "/generate", {
      text,
      voice: "default"
    });

    if (res.data.ok) {
      setAudio(res.data.audio);
    } else {
      alert("Error");
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div style={{ display: "flex", fontFamily: "Arial" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "240px",
        height: "100vh",
        background: "#fff",
        borderRight: "1px solid #eee",
        padding: "20px"
      }}>
        <h2 style={{ fontSize: "22px" }}>MoraAI</h2>

        <div style={{ marginTop: "30px", lineHeight: "2" }}>
          <div><b>Generate</b></div>
          <div>Voices</div>
          <div>Projects</div>
          <div>Settings</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "30px", background: "#f7f7f7" }}>

        {/* AUTH */}
        <div style={{ marginBottom: "20px" }}>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginLeft: "10px" }}
          />

          <button onClick={signup} style={{ marginLeft: "10px" }}>
            Sign Up
          </button>

          <button onClick={login} style={{ marginLeft: "10px" }}>
            Login
          </button>

          <p>{status}</p>
        </div>

        {/* TOP BAR */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}>
          <div>Credits: {credits}</div>
          <button>Upgrade</button>
        </div>

        {/* MAIN CARD */}
        <div style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px"
        }}>

          {/* TEXT */}
          <textarea
            placeholder="Enter text..."
            style={{
              width: "100%",
              height: "120px",
              padding: "10px"
            }}
            onChange={(e) => setText(e.target.value)}
          />

          {/* CONTROLS */}
          <div style={{ marginTop: "15px" }}>
            <button onClick={generate}>
              Generate
            </button>
          </div>

          {/* AUDIO */}
          {audio && (
            <div style={{ marginTop: "20px" }}>
              <audio controls src={audio}></audio>
            </div>
          )}

        </div>
      </div>
    </div>
  );
          }
