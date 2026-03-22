const API = "https://backend.goswamimohit787916.workers.dev/";

let state = {
  uid: localStorage.getItem("uid"),
  credits: 0
};

window.onload = () => render();

// ---------- RENDER ----------
function render(){
  if(!state.uid){
    renderLogin();
  } else {
    renderApp();
    loadUser();
  }
}

// ---------- LOGIN UI ----------
function renderLogin(){
  root.innerHTML = `
    <div class="flex h-screen items-center justify-center">
      <div class="bg-white p-6 rounded-xl shadow w-80">
        <h2 class="text-lg font-semibold mb-4">MoraAI</h2>

        <input id="email" placeholder="Email"
          class="w-full border p-2 mb-2 rounded">

        <input id="password" placeholder="Password"
          class="w-full border p-2 mb-4 rounded">

        <button onclick="login()"
          class="w-full bg-blue-600 text-white p-2 rounded mb-2">
          Login
        </button>

        <button onclick="signup()"
          class="w-full bg-gray-200 p-2 rounded">
          Signup
        </button>
      </div>
    </div>
  `;
}

// ---------- APP UI ----------
function renderApp(){
  root.innerHTML = `
    <div class="flex h-screen">

      <!-- Sidebar -->
      <div class="w-60 bg-white border-r p-4">
        <h2 class="font-bold text-lg mb-4">Generate</h2>
        <div class="text-gray-500">Voices</div>
        <div class="text-gray-500">Projects</div>
        <div class="mt-6 text-sm">Credits: <b id="credits">0</b></div>
      </div>

      <!-- Main -->
      <div class="flex-1 p-6">

        <div class="flex justify-between mb-4">
          <h3 class="font-semibold">Text to Speech</h3>
          <button onclick="upgrade()"
            class="bg-blue-600 text-white px-4 py-2 rounded">
            Upgrade
          </button>
        </div>

        <textarea id="text"
          class="w-full h-40 p-3 border rounded mb-4"
          placeholder="Enter text..."></textarea>

        <button onclick="generate()"
          class="bg-blue-600 text-white px-6 py-2 rounded">
          Generate
        </button>

        <div class="mt-6 bg-white p-4 rounded shadow">
          <audio id="audio" controls class="w-full"></audio>
        </div>

      </div>
    </div>
  `;
}

// ---------- AUTH ----------
async function signup(){
  let r = await fetch(API+"/signup",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      email:email.value,
      password:password.value
    })
  });

  let d = await r.json();
  alert(d.ok ? "Account created" : d.error);
}

async function login(){
  let r = await fetch(API+"/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      email:email.value,
      password:password.value
    })
  });

  let d = await r.json();

  if(d.ok){
    state.uid = d.uid;
    localStorage.setItem("uid", d.uid);
    render();
  } else alert(d.error);
}

// ---------- USER ----------
async function loadUser(){
  let r = await fetch(API+"/user?uid="+state.uid);
  let d = await r.json();
  state.credits = d.user.credits;
  document.getElementById("credits").innerText = state.credits;
}

// ---------- GENERATE ----------
async function generate(){

  let r = await fetch(API+"/generate",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      uid:state.uid,
      text:document.getElementById("text").value
    })
  });

  let d = await r.json();

  if(d.ok){
    document.getElementById("audio").src = d.audio;
    state.credits = d.remaining;
    document.getElementById("credits").innerText = state.credits;
  } else alert(d.error);
}

// ---------- UPGRADE ----------
async function upgrade(){
  await fetch(API+"/upgrade",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ uid:state.uid })
  });

  loadUser();
}
