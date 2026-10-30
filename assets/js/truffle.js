(function () {
  var d = document;
  var CA = "J5jKhqgbReuEwUkmXsF3pwLtXHXwAqWaUNo5iHwEpump";

  var toast = d.getElementById("t-toast");
  var tTimer = null;
  function notify(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { toast.classList.remove("show"); }, 2500);
  }

  d.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-copy") || CA;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(v);
      }
      notify("CELLAR RESERVE CA COPIED: " + v.slice(0, 6) + "..." + v.slice(-6));
      var orig = b.textContent;
      b.textContent = "COPIED ✓";
      setTimeout(function () { b.textContent = orig; }, 1600);
    });
  });

  // Hero Arch Switcher
  var aImg = d.getElementById("t-arch-img");
  var aSeal = d.getElementById("t-arch-seal");
  var pills = d.querySelectorAll("[data-t-img]");
  pills.forEach(function (p) {
    p.addEventListener("click", function () {
      if (aImg) aImg.setAttribute("src", p.getAttribute("data-t-img"));
      if (aSeal) aSeal.textContent = p.getAttribute("data-t-label");
      pills.forEach(function (x) { x.classList.toggle("active", x === p); });
    });
  });

  // White Truffle Brass Scale
  var GRADES = [
    { min: 0, max: 24, w: "50g", grade: "FOREST FORAGER", mult: "3 HOUNDS ON THE TRAIL", img: "assets/media/reference_lean.png" },
    { min: 25, max: 49, w: "250g", grade: "MICHELIN 3-STAR", mult: "SOMMELIER SHADES", img: "assets/media/shades.png" },
    { min: 50, max: 74, w: "1,000g", grade: "CROWN BULLION", mult: "24K $ALDOTRUF MEDALLION", img: "assets/media/coin.png" },
    { min: 75, max: 89, w: "5,000g", grade: "SYNDICATE LASER", mult: "AUCTION RECORD BROKEN", img: "assets/media/laser.png" },
    { min: 90, max: 100, w: "10,000g", grade: "LUNAR WHITE GOLD", mult: "ORBITAL HARVEST", img: "assets/media/moon.png" }
  ];
  var sRange = d.getElementById("t-scale-range");
  var sWeight = d.getElementById("t-stat-w");
  var sGrade = d.getElementById("t-stat-g");
  var sMult = d.getElementById("t-stat-m");
  var sImg = d.getElementById("t-scale-img");

  if (sRange) {
    var upd = function () {
      var v = parseInt(sRange.value, 10) || 0;
      var g = GRADES[0];
      for (var i = 0; i < GRADES.length; i++) {
        if (v >= GRADES[i].min && v <= GRADES[i].max) { g = GRADES[i]; break; }
      }
      if (sWeight) sWeight.textContent = g.w;
      if (sGrade) sGrade.textContent = g.grade;
      if (sMult) sMult.textContent = g.mult;
      if (sImg && sImg.getAttribute("src") !== g.img) sImg.setAttribute("src", g.img);
    };
    sRange.addEventListener("input", upd);
    upd();
  }

  // Before/After Slider
  d.querySelectorAll(".t-ba").forEach(function (ba) {
    var r = ba.querySelector(".t-ba-range");
    if (!r) return;
    var up = function () { ba.style.setProperty("--pos", r.value + "%"); };
    r.addEventListener("input", up);
    up();
  });

  fetch("https://api.dexscreener.com/latest/dex/tokens/" + CA)
    .then(function (r) { return r.json(); })
    .then(function (j) {
      var p = (j && j.pairs && j.pairs[0]) || null;
      if (!p) return;
      var pr = d.getElementById("t-price");
      var mc = d.getElementById("t-mcap");
      if (pr && p.priceUsd) pr.textContent = "$" + p.priceUsd;
      if (mc && (p.marketCap || p.fdv)) mc.textContent = "$" + Number(p.marketCap || p.fdv).toLocaleString("en-US", { maximumFractionDigits: 0 });
    })
    .catch(function () {});
})();
