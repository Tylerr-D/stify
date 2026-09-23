const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
let drawing = false
let lastX = 0
let lastY = 0
erasing = false;

function pos(e){
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left) * canvas.width / r.width,
            (e.clientY - r.top) * canvas.height / r.height
    ];
}

function start(e) {
    drawing = true;
    [lastX, lastY] = pos(e);
}

// uhh got some help from docs

function move(e){
    if(!drawing) return;
    const [x, y] = pos(e);
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.lineWidth = size.value;
    ctx.strokeStyle = color.value;
    ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

function end(){
    drawing = false;
    ctx.globalCompositeOperation = "source-over";
}

canvas.addEventListener("pointerdown", start);
canvas.addEventListener("pointermove", move);
window.addEventListener("pointerup", end);

eraser.onclick = () => erasing = !erasing;
clear.onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

