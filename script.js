const IMAGES = [
  "ichiran.jpg",
  "1.jpg",
  "2.jpg",
  "3.jpg",
];

const ZONES = [
 { page: 0, cx: 0.33, cy: 0.58, r: 80, to: 1 }, // ①
  { page: 0, cx: 0.60, cy: 0.85, r: 80, to: 2 }, // ②
  { page: 0, cx: 0.82, cy: 0.52, r: 80, to: 3 }, // ③

  { page: 1, cx: 0.87, cy: 0.12, r: 50, to: 0 },
  { page: 2, cx: 0.87, cy: 0.12, r: 50, to: 0 },
  { page: 3, cx: 0.87, cy: 0.12, r: 50, to: 0 },
  
];

let currentPage = 0;

const imgA       = document.getElementById("imgA");
const imgB       = document.getElementById("imgB");
const stage      = document.getElementById("stage");
const mapPopup   = document.getElementById("map-popup");
const mapFrame   = document.getElementById("map-frame");
const mapClose   = document.getElementById("map-close");
const mapOverlay = document.getElementById("map-overlay");

ZONES.forEach((z, i) => {
  const el = document.createElement("div");
  el.className = "zone";
  el.dataset.index = i;
  el.style.display = "none";
  stage.appendChild(el);
  z.el = el;
});

function updateZones() {
  const W = window.innerWidth;
  const H = window.innerHeight;
  ZONES.forEach(z => {
    if (z.page === currentPage) {
      const px = z.cx * W;
      const py = z.cy * H;
      z.el.style.display = "block";
      z.el.style.left   = (px - z.r) + "px";
      z.el.style.top    = (py - z.r) + "px";
      z.el.style.width  = (z.r * 2) + "px";
      z.el.style.height = (z.r * 2) + "px";
    } else {
      z.el.style.display = "none";
    }
  });
}

function goTo(pageIndex) {
  if (pageIndex === currentPage) return;
  const toSrc = IMAGES[pageIndex];

  imgB.src = toSrc;
  imgB.style.transition = "none";
  imgB.style.opacity = "0";

  imgB.onload = () => {
    requestAnimationFrame(() => {
      imgB.style.transition = "opacity 0.4s ease";
      imgB.style.opacity = "1";
    });
    setTimeout(() => {
      imgA.src = toSrc;
      imgA.style.transition = "none";
      imgA.style.opacity = "1";
      imgB.style.opacity = "0";
    }, 450);
  };

  currentPage = pageIndex;
  updateZones();
}



function closeMap() {
  mapPopup.style.display = "none";
  mapFrame.innerHTML = "";
}

mapClose.addEventListener("click", closeMap);
mapClose.addEventListener("touchend", e => { e.stopPropagation(); closeMap(); });
mapOverlay.addEventListener("click", closeMap);
mapOverlay.addEventListener("touchend", e => { e.stopPropagation(); closeMap(); });

function handleInput(clientX, clientY) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  for (const z of ZONES) {
    if (z.page !== currentPage) continue;
    const dist = Math.sqrt((clientX - z.cx * W) ** 2 + (clientY - z.cy * H) ** 2);
    if (dist < z.r) {
      z.to === "map" ? openMap(z.lat, z.lng) : goTo(z.to);
      return;
    }
  }
}

stage.addEventListener("touchstart", e => {
  e.preventDefault();
  const t = e.changedTouches[0];
  handleInput(t.clientX, t.clientY);
}, { passive: false });

stage.addEventListener("click", e => handleInput(e.clientX, e.clientY));

window.addEventListener("resize", updateZones);
imgA.src = IMAGES[0];
updateZones();