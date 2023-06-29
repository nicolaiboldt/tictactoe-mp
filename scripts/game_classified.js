/* eslint-disable spaced-comment */
/* eslint-disable one-var */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */

const c = document.querySelector(":root");
const groesse = document.getElementById("groesse");
const labels = document.getElementsByClassName("sliderLabel");
const pointsLabel = document.getElementById("pointsLabel");
let boxes = document.getElementsByClassName("grid-item");
const board = document.getElementById("spiel");

const auswahlX = document.getElementById("auswahlX");
const auswahlO = document.getElementById("auswahlO");

const labelPlayer1 = document.getElementById("player1");
const labelPlayer2 = document.getElementById("player2");

const roomP = document.getElementById("roomP");

const endscreen = document.getElementsByClassName("endscreen")[0];
const endText = document.getElementsByClassName("endText")[0];
const winningIcon = document.getElementsByClassName("winningIcon")[0];

const checkX = document.getElementById("checkX");
const checkO = document.getElementById("checkO");

const P1 = "x";
const P2 = "o";

let moves = 0;
let rangeColumns = groesse.value;
const valueBefore = groesse.value;

let gameStarted = false;
let playerWon = 0;
let resetGame = false;
const numbers = -1;
const audioOn = false;

const iconX = {
    name: "iconX",
    path: "assets/img/x.png"
};

const iconO = {
    name: "iconO",
    path: "assets/img/o.png"
};

const icons = { [P1]: { path: "assets/img/x.png" }, [P2]: { path: "assets/img/o.png" } };

let playerPlayer;
let game;

function groessenChange() {
    if (rangeColumns < document.getElementById("groesse").value || gameStarted == false || resetGame == true) {
        if (resetGame == false && audioOn) {
            playSound(slider);
        }
        rangeColumns = document.getElementById("groesse").value;
        gameStarted = true;

        c.style.setProperty("--columns", rangeColumns);
        let bg = $(window).width() > 600 ? 600 : $(window).width() - 50;
        const boardgroesse = bg;
        const feldgroesse = (boardgroesse / rangeColumns) - 5;
        c.style.setProperty("--feldgroesse", feldgroesse + "px");
        c.style.setProperty("--containerwidth", ((feldgroesse + 2) * rangeColumns) + "px");

        const spiel = document.getElementById("spiel");
        const anzahl = spiel.children.length;
        let columnsBefore = Math.sqrt(spiel.children.length);
        const wunschAnzahl = rangeColumns * rangeColumns;

        // add divs
        if (anzahl < wunschAnzahl) {
            while (columnsBefore < rangeColumns) {
                for (i = 1; i <= columnsBefore; i++) {
                    const div = document.createElement("div");
                    div.className = "grid-item";
                    spiel.append(div);
                }
                for (i = 1; i <= columnsBefore + 1; i++) {
                    const div = document.createElement("div");
                    div.className = "grid-item";
                    spiel.children[(i * columnsBefore) - 2 + (1 * i)].after(div);
                }
                columnsBefore++;
            }
        } else if (anzahl > wunschAnzahl) {
            while (columnsBefore > rangeColumns) {
                for (i = 1; i < columnsBefore; i++) {
                    spiel.children[i * (columnsBefore - 1)].remove();
                }
                for (i = 0; i < columnsBefore; i++) {
                    spiel.removeChild(spiel.lastElementChild);
                }
                columnsBefore--;
            }
        }

        if (rangeColumns <= 4) {
            pointsLabel.textContent = rangeColumns;
        } else if (rangeColumns == 5) {
            pointsLabel.textContent = 4;
        } else if (rangeColumns >= 6) {
            pointsLabel.textContent = 5;
        }
        resetGame = false;
        game.drawBoard();
        game.updatePlayerUI();
        for (const l of labels) {
            if (l.textContent < rangeColumns && !l.classList.contains("disabled")) {
                l.className += " disabled";
            }
        }
        return true;
        // checkWon();
    } else {
        groesse.value = rangeColumns;
        for (const l of labels) {
            if (l.textContent < rangeColumns && !l.classList.contains("disabled")) {
                l.className += " disabled";
            }
        }
        return false;
    }
}

class Player {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.currentTurn = true;
    }

    setCurrentTurn(turn) {
        this.currentTurn = turn;
    }

    getPlayerName() {
        return this.name;
    }

    getPlayerType() {
        return this.type;
    }

    getCurrentTurn() {
        return this.currentTurn;
    }
}

class Game {
    constructor(board, roomId) {
        this.roomId = roomId;
        this.board = board;
        this.rangeColumns = document.getElementById("groesse").value;
        this.moves = 0;
    }

    syncBoard() {
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].classList.length > 1) {
                this.board[i] = boxes[i].classList.contains("x") ? P1 : P2;
            } else {
                this.board[i] = 0;
            }
        }
    }

    displayBoard(message) {
        $(".startscreen").hide();
        $("nav").hide();
        if ($(window).innerWidth() > 780)
            $("#back").show();
        $(".setting").css({ "display": "flex" });
        $(".boardContainer").show();
        $("#userHello").html(message);
        groessenChange();
        console.log("groessenChange");

        for (let i = 0; i < boxes.length; i++) {
            const box = boxes[i];
            if (!box.hasChildNodes()) {
                if (this.board[i] == P1 || this.board[i] == P2) {
                    const icon = document.createElement("img");
                    if (this.board[i] == P1) {
                        icon.src = iconX.path;
                        icon.id = "iconX";
                        box.className += " x";
                    } else {
                        icon.src = iconO.path;
                        icon.id = "iconO";
                        box.className += " o";
                    }
                    icon.className = "icon";
                    box.append(icon);
                }
            }
        }

        if (player.getCurrentTurn()) {
            board.classList.remove("show");
            groesse.disabled = false;
        } else {
            board.className += " show";
            groesse.disabled = true;
        }
    }

    drawBoard() {
        boxes = $(".grid-item");
        for (let i = 0; i < boxes.length; i++) {
            let styleString = "";
            const box = boxes[i];
            if (i < rangeColumns * (rangeColumns - 2)) {
                styleString += "border-bottom: 3px solid black;";
            }
            if (i % rangeColumns < rangeColumns - 1) {
                styleString += "border-right: 3px solid black;";
            }
            if (i >= rangeColumns * (rangeColumns - 1)) {
                styleString += "border-top: 3px solid black;";
            }
            box.style = styleString;

            box.dataset.index = i;


            box.addEventListener("mousedown", () => {
                if (player.getCurrentTurn() == true && box.hasChildNodes() == false) {
                    this.boxClicked(player.getPlayerType(), box.dataset.index);
                    player.setCurrentTurn(false);
                    game.updatePlayerUI();
                    game.playTurn(box.dataset.index);
                }
            });
        };
    }

    boxClicked(type, index) {
        if (playerWon == 0) {
            const target = boxes[index];
            // if (audioOn) {
            //     playSound(plop);
            // }
            const icon = document.createElement("img");
            if (type == P1) {
                icon.src = iconX.path;
                icon.id = "iconX";
                target.className += " x";
            } else {
                icon.src = iconO.path;
                icon.id = "iconO";
                target.className += " o";
            }
            icon.className = "icon";
            target.append(icon);
        }
    }

    updatePlayerUI() {
        board.classList.remove("x");
        board.classList.remove("o");
        if (player.getCurrentTurn()) {
            board.classList.remove("show");
        } else {
            board.className += " show";
        }
        console.log("currentTurn: " + player.getCurrentTurn() + ", PlayerType: " + player.getPlayerType());
        if (player.getCurrentTurn() == 1 && player.getPlayerType() == P2 || player.getCurrentTurn() == 0 && player.getPlayerType() == P1) {
            board.classList.add("x");
            auswahlX.classList.remove("high");
            auswahlO.classList.add("high");
        } else {
            board.classList.add("o");
            auswahlO.classList.remove("high");
            auswahlX.classList.add("high");
        }
    }

    getRoomId() {
        return this.roomId;
    }

    playTurn(tile) {
        const clickedTile = tile;
        socket.emit("playTurn", {
            tile: clickedTile,
            type: player.getPlayerType(),
            room: this.getRoomId()
        });
    }

    announceWinner(winner, highBoxes) {
        if (winner != "unentschieden") {
            const message = `${winner} wins!`;
            let curr = 0;
            for (let i = 0; i < highBoxes[0].length; i++) {
                curr = parseInt(highBoxes[0][i]);
                console.log("curr: " + parseInt(highBoxes[0][i]));
                console.log("box: " + boxes[curr]);
                boxes[curr].className += " high";
            }

            endText.textContent = `${winner} gewinnt!`;
            let nontype = player.type == P1 ? P2 : P1;
            let type = player.name == winner ? player.type : nontype;
            winningIcon.src = icons[type].path;
            winningIcon.className += " show";
        } else {
            endText.textContent = "Unentschieden!";
        }

        endscreen.className += " show";
        board.className += " show";
        groesse.disabled = true;
    }

    reset() {
        if (audioOn) {
            playSound(resetSound);
        }
        for (const box of boxes) {
            box.classList.remove("high");
            if (box.hasChildNodes()) {
                box.removeChild(box.firstChild);
            }
            box.classList.remove("x");
            box.classList.remove("o");
        }

        for (const l of labels) {
            l.classList.remove("disabled");
        }

        endscreen.classList.remove("show");
        board.classList.remove("show");
        winningIcon.classList.remove("show");
        groesse.disabled = false;
        playerWon = 0;

        groesse.value = 3;
        rangeColumns = 3;
        resetGame = true;
        moves = 0;
        this.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        groessenChange();
    }

    displayMessage(message) {
        $("#userHello").html(message);
    }
}

const socket = io.connect("/");
let player = new Player("temp", P2);

$("#new").on("click", () => {
    const name = $("#nameNew").val();
    if (!name) {
        alert("Please enter your name.");
        return;
    }
    socket.emit("createGame", { name });
    player = new Player(name, P1);
});

$("#join").on("click", () => {
    const name = $("#nameJoin").val();
    const roomID = $("#room").val();
    if (!name || !roomID) {
        alert("Please enter your name and game ID.");
        return;
    }
    socket.emit("joinGame", { name, room: roomID });
});

function sliderChange() {
    if (groessenChange()) {
        roomID = game.getRoomId();
        game.syncBoard();
        socket.emit("sizeChange", { size: groesse.value, board: game.board, room: roomID });
        console.log("sizeChange sent!");
    }
}

$("#iconReset").on("click", () => {
    const cb = player.getPlayerType() == P1 ? checkX : checkO;
    if (!cb.classList.contains("checked")) {
        cb.className += " checked";
        socket.emit("resetRequest", { type: player.getPlayerType() });
    }
});

endscreen.addEventListener("click", () => {
    socket.emit("resetGame", { });
});

socket.on("newGame", (data) => {
    const message =
      `Hallo, ${data.name}. Warten auf zweiten Spieler...`;

    roomP.textContent = data.room;
    labelPlayer1.textContent = data.name;
    labelPlayer2.textContent = "";
    game = new Game(data.board, data.room);
    console.log("received board: " + data.board);
    game.displayBoard(message);
});

socket.on("player1", (data) => {
    const message = `Hello, ${player.getPlayerName()}`;
    $("#userHello").html(message);
    labelPlayer1.textContent = player.getPlayerName();
    labelPlayer2.textContent = data.name2;
    player.setCurrentTurn(true);
    game.updatePlayerUI();
});

socket.on("player2", (data) => {
    const name = data.type == P1 ? data.name1 : data.name2;
    const message = `Hallo, ${name}`;

    roomP.textContent = data.room;
    groesse.value = data.size;
    console.log("sizeChange received! Size = " + data.size);
    player = new Player(name, data.type);
    player.setCurrentTurn(data.turn);
    console.log("currentTurn: " + data.turn);
    game = new Game(data.board, data.room);
    game.displayBoard(message);
    labelPlayer1.textContent = data.name1;
    labelPlayer2.textContent = data.name2;
    socket.emit("updateNames", { room: data.room });
});

socket.on("nameUpdate", (data) => {
    const newPlayer = player.getPlayerType() == P2 ? data.name1 : data.name2;
    if (!data.disconnect) {
        game.displayMessage(newPlayer + " ist dem Spiel beigetreten!");
    } else {
        game.displayMessage(newPlayer + " hat das Spiel verlassen!");
        player.getPlayerType() == P2 ? data.name1 = "" : data.name2 = "";
    }
    labelPlayer1.textContent = data.name1;
    labelPlayer2.textContent = data.name2;
});

socket.on("resetUpdate", (data) => {
    const r = data.request;
    if (r[P1]) {
        checkX.className += " checked";
    } else {
        checkX.classList.remove("checked");
    }
    if (r[P2]) {
        checkO.className += " checked";
    } else {
        checkO.classList.remove("checked");
    }
});

socket.on("sizeChange", (data) => {
    groesse.value = data.size;
    groessenChange();
    console.log("sizeChange received! Size = " + data.size);
});

socket.on("turnPlayed", (data) => {
    const opponentType = player.getPlayerType() === P1 ? P2 : P1;
    game.boxClicked(opponentType, data.tile);
    player.setCurrentTurn(true);
    game.updatePlayerUI();
});

socket.on("announceWinner", (data) => {
    console.log("WINNER: " + data.winner);
    game.announceWinner(data.winner, data.boxes);
});

socket.on("resetGame", (data) => {
    game.reset();
});

socket.on("err", (data) => {
    $("#userHello").html(data.message);
});