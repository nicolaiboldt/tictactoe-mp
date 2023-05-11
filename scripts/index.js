let i = 0;
const divs = document.getElementsByClassName("grid");

const arrayH = [0, 5, 10, 15, 20, 4, 9, 14, 19, 24, 11, 12, 13];
const arrayE = [0, 5, 10, 15, 20, 1, 2, 3, 11, 12, 21, 22, 23];
const arrayY = [0, 6, 12, 4, 8, 17, 22];
setTimeout(function() {
    for (let r = 0; r < 4; r++) {
        for (let q = 0; q < 25; q++) {
            let styleString = "";
            if (q < 5 * (5 - 2)) {
                styleString += "border-bottom: 1px solid black;";
            }
            if (q % 5 < 5 - 1) {
                styleString += "border-right: 1px solid black;";
            }
            if (q >= 5 * (5 - 1)) {
                styleString += "border-top: 1px solid black;";
            }
            if (q + (r*25) < 75) {
                divs[q + (r * 25)].style = styleString;
            }
        };
    };
});

i = 0;

setTimeout(function() {
    const id = setInterval(function() {
        if (i == arrayH.length) {
            clearInterval(id);
            return;
        }
        const img = document.createElement("img");
        img.id = "iconX";
        img.className = "iconStart";
        img.src = "assets/img/x.png";
        divs[arrayH[i]].append(img);
        i++;
    }, 50);
}, 100);

let f = 0;

setTimeout(function() {
    const fd = setInterval(function() {
        if (f == arrayE.length) {
            clearInterval(fd);
            return;
        }
        const img = document.createElement("img");
        img.id = "iconO";
        img.className = "iconStart";
        img.src = "assets/img/o.png";
        divs[25 + arrayE[f]].append(img);

        f++;
    }, 50);
}, 800);

let g = 0;

setTimeout(function() {
    const gd = setInterval(function() {
        if (g == arrayY.length) {
            clearInterval(gd);
            return;
        }
        const img = document.createElement("img");
        img.id = "iconX";
        img.className = "iconStart";
        img.src = "assets/img/x.png";
        divs[50 + arrayY[g]].append(img);

        g++;
    }, 50);
}, 1600);