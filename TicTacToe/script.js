const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const popup = document.getElementById("popup");

const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const aiWinSound = document.getElementById("aiWinSound");
const drawSound = document.getElementById("drawSound");

const aiBtnSound = document.getElementById("aiBtnSound");
const pvpBtnSound = document.getElementById("pvpBtnSound");
const restartSound = document.getElementById("restartSound");

let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameActive = false;
let mode = "";

/* 🌸 BACKGROUND EMOJIS */
const layer = document.querySelector(".emoji-layer");
for(let i=0;i<25;i++){
  let el=document.createElement("span");
  el.innerText=["😺","🐶","🤖","✨","💖"][Math.floor(Math.random()*5)];
  el.style.left=Math.random()*100+"vw";
  el.style.animationDuration=(6+Math.random()*6)+"s";
  el.style.fontSize=(20+Math.random()*20)+"px";
  layer.appendChild(el);
}

/* 🔊 SOUND */
function playSound(s){
  s.currentTime = 0;
  s.volume = 0.7;
  s.play().catch(()=>{});
}

/* 💥 BUTTON POP */
function btnClick(btn,sound){
  playSound(sound);
  btn.classList.add("pop");
  setTimeout(()=>btn.classList.remove("pop"),200);
}

/* 🎮 MODE */
function setMode(m){
  mode = m;
  restartGame();
  gameActive = true;

  statusText.textContent =
    mode==="ai" ? "😺 Your Turn" : "Player X Turn";
}

/* CLICK */
cells.forEach((cell,i)=>{
  cell.addEventListener("click",()=>{
    if(!gameActive || board[i] !== "") return;

    playSound(moveSound);
    makeMove(i,currentPlayer);

    if(!gameActive) return;

    if(mode==="ai"){
      statusText.textContent="🤖 Thinking...";

      setTimeout(()=>{
        let move = getBestMove();

        playSound(moveSound);
        makeMove(move,"O");

        if(!gameActive) return;

        statusText.textContent="😺 Your Turn";
      },400);

    } else {
      currentPlayer = currentPlayer==="X"?"O":"X";
      statusText.textContent=`Player ${currentPlayer} Turn`;
    }
  });
});

/* MOVE */
function makeMove(i,p){
  if(!gameActive) return;

  board[i] = p;

  cells[i].textContent =
    mode==="ai" ? (p==="X"?"😺":"🤖") : (p==="X"?"😺":"🐶");

  // ⭐ WIN CHECK
  if(checkWinner(p)){
    gameActive = false;

    if(mode==="ai"){
      if(p==="X"){
        playSound(winSound);
        showPopup("🎉 You Win!");
        statusText.textContent = "🎉 You Win!";
        confetti();
      } else {
        playSound(aiWinSound);
        showPopup("🤖 AI Wins!");
        statusText.textContent = "🤖 AI Wins!";
      }
    } else {
      playSound(winSound);
      showPopup(`🎉 Player ${p} Wins`);
      statusText.textContent = `Player ${p} Wins`;
      confetti();
    }
    return;
  }

  // DRAW
  if(!board.includes("")){
    gameActive = false;
    playSound(drawSound);
    showPopup("Draw!");
    statusText.textContent = "Draw!";
  }
}

/* ✅ FULL WIN CONDITIONS */
function checkWinner(p){
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],   // rows
    [0,3,6],[1,4,7],[2,5,8],   // columns
    [0,4,8],[2,4,6]            // diagonals
  ];

  return wins.some(arr=>{
    if(arr.every(i=>board[i]===p)){
      arr.forEach(i=>cells[i].classList.add("win"));
      return true;
    }
  });
}

/* 🤖 AI MOVE */
function getBestMove(){
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

/* 🔄 RESET */
function restartGame(){
  board = ["","","","","","","","",""];
  cells.forEach(c=>{
    c.textContent="";
    c.classList.remove("win");
  });
  gameActive = false;
  statusText.textContent = "Choose a mode 🎮";
}

/* 🎉 POPUP */
function showPopup(msg){
  popup.textContent = msg;
  popup.classList.add("show");
  setTimeout(()=>popup.classList.remove("show"),2000);
}