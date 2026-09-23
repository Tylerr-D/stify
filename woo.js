const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
let drawing = false
let lastX = 0
let lastY = 0
let erasing = false;

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

eraser.onclick = () => { 
    erasing = !erasing;
    eraser.classList.toggle("on", erasing);  
};

clear.onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

function makeSticker() {

    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let minX = canvas.width, minY = canvas.height, maxX = -1, maxY = -1;

    for (let y = 0; y < canvas.height; y++)
            for (let x = 0; x < canvas.width; x++)
      if (img.data[(y * canvas.width + x) * 4 + 3] > 10) {
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }


if (maxX < 0) 
    return alert("draw something first!");

const pad = 40, cropW = maxX - minX + 1, cropH = maxY - minY + 1;

const crop = document.createElement("canvas");
crop.width = cropW; crop.height = cropH;
crop.getContext("2d").drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

const sil = document.createElement("canvas");
sil.width = cropW; sil.height = cropH;
const sctx = sil.getContext("2d");
sctx.drawImage(crop, 0, 0);
sctx.globalCompositeOperation = "source-in";
sctx.fillStyle = "#fff";
sctx.fillRect(0, 0, cropW, cropH);

const out = document.createElement("canvas");
out.width = cropW + pad * 2;
out.height = cropH + pad * 2;

const octx = out.getContext("2d");

// umm yea not entirely mine lol
  for (let a = 0; a < Math.PI * 2; a += 0.15)
octx.drawImage(sil, pad + Math.cos(a) * 14, pad + Math.sin(a) * 14);
octx.drawImage(sil, pad, pad);
octx.drawImage(crop, pad, pad);

const a = document.createElement("a");
a.href = out.toDataURL("image/png");
a.download = "cool-sticker.png";
a.click();
}

go.onclick = makeSticker;