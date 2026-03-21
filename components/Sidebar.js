export default function Sidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#fff",
      borderRight: "1px solid #eee",
      padding: "20px"
    }}>
      <h2>MoraAI</h2>

      <div style={{ marginTop: "30px" }}>
        <p>⚡ Generate</p>
        <p>🎧 Voices</p>
        <p>📁 Projects</p>
        <p>⚙️ Settings</p>
      </div>
    </div>
  );
}
