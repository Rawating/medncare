// Navbar and Popup Logic
const navbarMenu = document.querySelector(".navbar .links");
const hamburgerBtn = document.querySelector(".hamburger-btn");
const hideMenuBtn = navbarMenu.querySelector(".close-btn");
const showPopupBtn = document.querySelector(".login-btn");
const getStartedBtn = document.getElementById("button-home");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = formPopup.querySelector(".close-btn");
const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");

// Show mobile menu
hamburgerBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("show-menu");
});

// Hide mobile menu
hideMenuBtn.addEventListener("click", () => hamburgerBtn.click());

// Toggle popup visibility
function togglePopup() {
  document.body.classList.toggle("show-popup");
}

// Show login popup
showPopupBtn.addEventListener("click", togglePopup);
getStartedBtn.addEventListener("click", togglePopup);

// Hide login popup
hidePopupBtn.addEventListener("click", togglePopup);

// Show or hide signup form
signupLoginLink.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    formPopup.classList[link.id === 'signup-link' ? 'add' : 'remove']("show-signup");
  });
});

// Text Morphing Animation
const elts = {
  text1: document.getElementById("text1"),
  text2: document.getElementById("text2")
};

const texts = [
  " Helper",
  " Reminder",
  " Recorder"
];

const morphTime = 1;
const cooldownTime = 2;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
  morph -= cooldown;
  cooldown = 0;

  let fraction = morph / morphTime;
  if (fraction > 1) {
    cooldown = cooldownTime;
    fraction = 1;
  }

  setMorph(fraction);
}

function setMorph(fraction) {
  elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  elts.text2.style.position = "absolute";

  fraction = 1 - fraction;
  elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
  elts.text1.style.position = "absolute";

  elts.text1.textContent = texts[textIndex % texts.length];
  elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
  morph = 0;

  elts.text2.style.filter = "";
  elts.text2.style.opacity = "100%";

  elts.text1.style.filter = "";
  elts.text1.style.opacity = "0%";
}

function animate() {
  requestAnimationFrame(animate);

  let newTime = new Date();
  let shouldIncrementIndex = cooldown > 0;
  let dt = (newTime - time) / 1000;
  time = newTime;

  cooldown -= dt;

  if (cooldown <= 0) {
    if (shouldIncrementIndex) {
      textIndex++;
    }
    doMorph();
  } else {
    doCooldown();
  }
}

animate();

// Medicine Reminder Timer
let countdownInterval;

function startTimer() {
  const name = document.getElementById('medicineName').value.trim();
  const delay = parseInt(document.getElementById('timeDelay').value) * 60;
  const countdownDiv = document.getElementById('countdown');

  if (!name) {
    alert("Please enter a medicine name.");
    return;
  }

  let remaining = delay;
  clearInterval(countdownInterval);

  countdownDiv.innerHTML = `⏳ Timer started for ${name}. Counting down...`;

  countdownInterval = setInterval(() => {
    remaining--;
    const mins = Math.floor(remaining / 60);
    const secs = String(remaining % 60).padStart(2, '0');
    countdownDiv.innerHTML = `Time left for ${name}: ${mins}m ${secs}s`;

    if (remaining <= 0) {
      clearInterval(countdownInterval);
      countdownDiv.innerHTML = `⏰ Time to take your medicine: ${name}!`;
      alert(`⏰ Reminder: Time to take your medicine: ${name}!`);
    }
  }, 1000);
}