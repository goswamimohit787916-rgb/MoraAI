"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [text, setText] = useState("");

  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>

        {/* TOP BAR */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}>
          <div>Credit Limit: 138 / 15000</div>
          <button>Upgrade</button>
        </div>

        {/* MAIN BOX */}
        <div style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px"
        }}>

          {/* TABS */}
          <div style={{ marginBottom: "10px" }}>
            <b>Text</b> | File Upload
          </div>

          {/* TEXT AREA */}
          <textarea
            placeholder="Enter your text..."
            style={{
              width: "100%",
              height: "120px",
              padding: "10px"
            }}
            onChange={(e) => setText(e.target.value)}
          />

          {/* BUTTONS */}
          <div style={{ marginTop: "10px" }}>
            <button>Upload TXT</button>
            <button style={{ marginLeft: "10px" }}>
              Clone Voice
            </button>
          </div>

          {/* CONTROLS */}
          <div style={{ marginTop: "15px" }}>
            <select><option>Default Voice</option></select>
            <select style={{ marginLeft: "10px" }}>
              <option>English</option>
            </select>
            <select style={{ marginLeft: "10px" }}>
              <option>Standard</option>
            </select>

            <button style={{ marginLeft: "10px" }}>
              Generate
            </button>
          </div>

          {/* AUDIO */}
          <div style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ddd"
          }}>
            ▶ Audio will appear here
          </div>

        </div>
      </div>
    </div>
  );
}
