const API = "https://backend.goswamimohit787916.workers.dev/";

let uid = localStorage.getItem("uid");
let audio = document.getElementById("audio");
let isPlaying = false;

// INIT
if(uid){
  showApp();
  loadUser();
  loadVoices();
}

// UI
function showApp(){
  loginPage.style.display="none";
  app.style.display="flex";
}

// AUTH
async function login(){
  let r = await fetch(API+"/login",{method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email:email.value,password:password.value})
  });

  let d = await r.json();

  if(d.ok){
    uid = d.uid;
    localStorage.setItem("uid",uid);
    showApp();
    loadUser();
  } else alert(d.error);
}

async function signup(){
  let r = await fetch(API+"/signup",{method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email:email.value,password:password.value})
  });

  let d = await r.json();
  alert(d.ok ? "Created" : d.error);
}

// USER
async function loadUser(){
  let r = await fetch(API+"/user?uid="+uid);
  let d = await r.json();
  credits.innerText = d.user.credits;
}

// GENERATE
async function generate(){

  if(!uid) return alert("Login required");

  let r = await fetch(API+"/generate",{method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({uid,text:text.value})
  });

  let d = await r.json();

  if(d.ok){
    audio.src = d.audio;
    audio.play();
    createWave();
    credits.innerText = d.remaining;
  }
}

// WAVEFORM
function createWave(){
  let wave = document.getElementById("wave");
  wave.innerHTML="";
  for(let i=0;i<40;i++){
    let bar = document.createElement("div");
    bar.style.width="4px";
    bar.style.background="#6366f1";
    bar.style.height=(Math.random()*50+10)+"px";
    wave.appendChild(bar);
  }
}

// PLAY
function togglePlay(){
  if(isPlaying){
    audio.pause();
  } else {
    audio.play();
  }
  isPlaying = !isPlaying;
}

// VOICES UI
function loadVoices(){
  let container = document.getElementById("voices");
  container.innerHTML="";

  for(let i=1;i<=3;i++){
    let card = document.createElement("div");
    card.className="bg-[#111827] p-4 rounded cursor-pointer";
    card.innerText="Voice "+i;
    container.appendChild(card);
  }
}

// CLONE
function openClone(){
  cloneModal.style.display="flex";
}

function closeClone(){
  cloneModal.style.display="none";
}

// DRAG DROP
let drop = document.getElementById("drop");

drop.ondragover = e => e.preventDefault();

drop.ondrop = e => {
  e.preventDefault();
  alert("Audio selected");
};

// PAYMENT
function pay(){
  alert("UPI → yourupi@upi");
}
