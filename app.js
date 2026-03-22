const API = "https://backend.goswamimohit787916.workers.dev/";

let uid = localStorage.getItem("uid");

if (uid) {
  showApp();
  loadUser();
}

// UI
function showApp(){
  loginPage.style.display = "none";
  app.style.display = "flex";
}

// AUTH
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
    uid = d.uid;
    localStorage.setItem("uid",uid);
    showApp();
    loadUser();
  } else alert(d.error);
}

// USER
async function loadUser(){
  let r = await fetch(API+"/user?uid="+uid);
  let d = await r.json();
  credits.innerText = d.user.credits;
}

// GENERATE
async function generate(){

  if(!uid){
    alert("Login required");
    return;
  }

  if(!text.value.trim()){
    alert("Enter text");
    return;
  }

  let r = await fetch(API+"/generate",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      uid:uid,
      text:text.value
    })
  });

  let d = await r.json();

  if(d.ok){
    audio.src = d.audio;
    credits.innerText = d.remaining;
  } else alert(d.error);
}

// PAYMENT
function pay(){
  alert("Pay to UPI: yourupi@upi");
  verify();
}

async function verify(){
  await fetch(API+"/verify-payment",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({uid})
  });

  loadUser();
}
