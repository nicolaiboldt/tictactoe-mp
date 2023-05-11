/* eslint-disable padded-blocks */
/* eslint-disable new-cap */
/* eslint-disable max-len */
const express = require("express");
const path = require("path");

const cors = require("cors");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(cors());
app.options("*", cors());

const minSize = 3;
const P1 = "x";
const P2 = "o";

class Game {
    constructor(board, roomId) {
        this.roomId = roomId;
        this.board = board;
        this.players = { [P1]: "", [P2]: "" };
        this.currentTurn = P1;
        this.size = minSize;
        this.gameStarted = false;
        this.reset = { [P1]: false, [P2]: false };
    }

    resetRequest(type) {
        this.reset[type] = true;
    }

    setCurrentTurn(turn) {
        this.currentTurn = turn;
    }

    pushPlayer(name, type) {
        this.players[type] = name;
    }

    getPlayers() {
        return this.players[P1] + ", " + this.players[P2];
    }

    missingPlayer() {
        if (this.players[P1]) return P2;
        else return P1;
    }

    checkWinner() {
        let unentschieden = true;
        let playerWon = 0;

        let winBoxes = [];

        let winBoxesH = { [P1]: [], [P2]: [] };
        let winBoxesV = { [P1]: [], [P2]: [] };

        let winBoxesd = [{ [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }];

        let winBoxesdd = [{ [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }];

        let winBoxesu = [{ [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }];

        let winBoxesuu = [{ [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }, { [P1]: [], [P2]: [] }];

        // playerWon = 0;
        let countsForWin = 4;
        if (this.size == 3) {
            countsForWin = this.size;
        }
        if (this.size >= 6) {
            countsForWin = 5;
        }

        let diaChecks = this.size - countsForWin;

        let horizontal;
        let vertical;

        let currentH;
        let currentV;
        let currentD;
        let currentDD;
        let currentU;
        let currentUU;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                horizontal = (i * this.size) + j;

                currentH = this.board[horizontal];

                if (!currentH) {
                    winBoxesH[P1] = [];
                    winBoxesH[P2] = [];
                    unentschieden = false;
                } else {
                    winBoxesH[currentH].push(horizontal);
                }

                vertical = (j * this.size) + i;

                currentV = this.board[vertical];

                if (!currentV) {
                    winBoxesV[P1] = [];
                    winBoxesV[P2] = [];
                    unentschieden = false;
                } else {
                    winBoxesV[currentV].push(vertical);
                }

                if (winBoxesH[P1].length == countsForWin || winBoxesV[P1].length == countsForWin) {
                    winBoxesH[P1].length == countsForWin ? winBoxes = winBoxesH[P1] : winBoxes = winBoxesV[P1];
                    playerWon = this.players[P1];
                    break;
                } else if (winBoxesH[P2].length == countsForWin || winBoxesV[P2].length == countsForWin) {
                    winBoxesH[P2].length == countsForWin ? winBoxes = winBoxesH[P2] : winBoxes = winBoxesV[P2];
                    playerWon = this.players[P2];

                    break;
                }
            }

            winBoxesH[P1] = [];
            winBoxesH[P2] = [];
            winBoxesV[P1] = [];
            winBoxesV[P2] = [];

            for (let k = 0; k <= diaChecks; k++) {
                let diagonal = k + (i * (parseInt(this.size) + 1));
                currentD = this.board[diagonal];
                let wk = winBoxesd[k];

                if (!currentD) {
                    winBoxesd[P1] = [];
                    winBoxesd[P2] = [];
                    unentschieden = false;
                } else if (diagonal < (this.size * this.size) && (diagonal) < this.size * (this.size - k)) {
                    wk[[currentD]].push(diagonal);
                }

                let dDiagonal = ((k) * (parseInt(this.size))) + (i * (parseInt(this.size) + 1));

                currentDD = this.board[dDiagonal];
                let wkD = winBoxesdd[k];

                if (!currentDD) {
                    winBoxesdd[P1] = [];
                    winBoxesdd[P2] = [];
                    unentschieden = false;
                } else if (dDiagonal < (this.size * this.size) && k != 0) {
                    wkD[[currentDD]].push(dDiagonal);
                }

                // countUX
                let uDiagonal = ((i + 1) * (parseInt(this.size) - 1)) - k;

                currentU = this.board[uDiagonal];
                let wkU = winBoxesu[k];

                if (!currentU) {
                    winBoxesu[P1] = [];
                    winBoxesu[P2] = [];
                    unentschieden = false;
                } else if ((k + (i * (parseInt(this.size) + 1))) <= this.size * (this.size - k)) {
                    wkU[[currentU]].push(uDiagonal);
                }

                let uuDiagonal = ((i + 1) * (parseInt(this.size) - 1)) + (k * parseInt(this.size));

                currentUU = this.board[uuDiagonal];
                let wkUU = winBoxesuu[k];

                if (!currentUU) {
                    winBoxesuu[P1] = [];
                    winBoxesuu[P2] = [];
                    unentschieden = false;
                } else if (((i + 1) * (parseInt(this.size) - 1)) + (k * parseInt(this.size)) < (this.size * this.size) - 1 && k != 0) {
                    wkUU[[currentUU]].push(uuDiagonal);
                }

                if (wk[P1].length == countsForWin) {
                    winBoxes = wk[P1];
                    playerWon = this.players[P1];
                    break;
                } else if (wk[P2].length == countsForWin) {
                    winBoxes = wk[P2];
                    playerWon = this.players[P2];
                    break;
                }

                if (wkD[P1].length == countsForWin) {
                    winBoxes = wkD[P1];
                    playerWon = this.players[P1];
                    break;
                } else if (wkD[P2].length == countsForWin) {
                    winBoxes = wkD[P2];
                    playerWon = this.players[P2];
                    break;
                }

                if (wkU[P1].length == countsForWin) {
                    winBoxes = wkU[P1];
                    playerWon = this.players[P1];
                    break;
                } else if (wkU[P2].length == countsForWin) {
                    winBoxes = wkU[P2];
                    playerWon = this.players[P2];
                    break;
                }

                if (wkUU[P1].length == countsForWin) {
                    winBoxes = wkUU[P1];
                    playerWon = this.players[P1];
                    break;
                } else if (wkUU[P2].length == countsForWin) {
                    winBoxes = wkUU[P2];
                    playerWon = this.players[P2];
                    break;
                }

                winBoxesd[P1] = [];
                winBoxesd[P2] = [];
                winBoxesdd[P1] = [];
                winBoxesdd[P2] = [];
                winBoxesu[P1] = [];
                winBoxesu[P2] = [];
                winBoxesuu[P1] = [];
                winBoxesuu[P2] = [];
            }
        }

        if (playerWon != 0) {
            console.log(playerWon + " wins!");
            let check = [[playerWon], [winBoxes]];
            return check;
        } else if (unentschieden == true) {
            console.log("Unentschieden!");
            let check = ["unentschieden", 0];
            return check;
        }
        return;
    }
}

let roomSaver = [];
let game = new Game();
let gameSaver = [];

app.use(express.static("."));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "game.html"));
});

io.on("connection", (socket) => {


    socket.on("createGame", (data) => {
        let roo = roomSaver.findIndex((val) => val == 0);
        if (roo == -1) {
            roo = roomSaver.length;
        }
        console.log("First available room: " + roo);

        roomSaver[roo] = 1;

        const r = `room-${roo}`;
        // const r = "room-0";
        const room = io.of("/").adapter.rooms.get(r);
        if (!room) {
            socket.join(r);
            game = new Game([0, 0, 0, 0, 0, 0, 0, 0, 0], roo);
            game.pushPlayer(data.name, P1);
            socket.data.type = P1;
            socket.data.room = roo;
            socket.emit("newGame", {
                name: data.name,
                board: game.board,
                room: r });
            saveGame();
            console.log("Game created by " + data.name + " in " + r);
        } else {
            socket.emit("err", { message: "Game exists already, try joining it instead!" });
        }
    });

    socket.on("disconnect", () => {

        socket.broadcast.to(`room-${game.roomId}`).emit("nameUpdate", { name1: game.players[P1],
            name2: game.players[P2], disconnect: true });
        game.players[socket.data.type] = "";
        console.log("players: " + game.players[P1] + ", " + game.players[P2]);
        if (game.players[P1] == "" && game.players[P2] == "") {
            game.gameStarted = false;
            roomSaver[socket.data.room] = 0;
            saveGame();
        }

        console.log(socket.data.type + " disconnected!");
        console.log("Current rooms: " + roomSaver);
    });

    socket.on("joinGame", (data) => {
        const room = io.of("/").adapter.rooms.get(data.room);
        if (room) {
            if (room.size <= 1) {
                socket.join(data.room);
                let rm = ([data.room].toString()).substring(5);
                game = gameSaver[rm];
                const type = game.missingPlayer();
                socket.data.type = type;
                socket.data.room = rm;
                game.pushPlayer(data.name, type);
                if (!game.gameStarted) {
                    socket.broadcast.to(data.room).emit("player1", { name2: data.name });
                    game.gameStarted = true;
                }

                socket.emit("player2", {
                    name1: game.players[P1],
                    name2: game.players[P2],
                    type,
                    board: game.board,
                    size: game.size,
                    turn: (game.currentTurn == type),
                    room: data.room });
                console.log("room stats: " + room.size + ", " + data.room + ", " + game.getPlayers());
                socket.emit("resetUpdate", { request: game.reset });
            } else {
                socket.emit("err", { message: "Sorry, The room is full!" });
            }
        } else {
            socket.emit("err", { message: "Sorry, this room doesn't exist!" });
        }
    });

    socket.on("syncBoard", (data) => {
        game.board = data.board;
    });

    socket.on("updateNames", (data) => {
        socket.broadcast.to(data.room).emit("nameUpdate", {
            name1: game.players[P1],
            name2: game.players[P2],
            disconnect: false
        });
    });

    socket.on("playTurn", (data) => {
        game.board[data.tile] = data.type;
        console.log("received: " + data.tile + ", " + data.type + ", " + data.room);
        game.currentTurn = (data.type == P1 ? P2 : P1);
        socket.broadcast.to(data.room).emit("turnPlayed", {
            tile: data.tile,
            room: data.room
        });

        const check = game.checkWinner();
        if (check) {
            io.in(data.room).emit("announceWinner", { winner: check[0], boxes: check[1] });
        }
        game.reset = { [P1]: false, [P2]: false };
        io.in(data.room).emit("resetUpdate", { request: game.reset });
        saveGame();
    });

    socket.on("sizeChange", (data) => {
        game.board = [];
        game.board = data.board;
        game.size = data.size;
        socket.broadcast.to(data.room).emit("sizeChange", {
            size: data.size
        });
        saveGame();
        console.log("sizeChange received!");
    });

    socket.on("resetRequest", (data) => {
        game.resetRequest(data.type);
        socket.broadcast.to(`room-${game.roomId}`).emit("resetUpdate", { request: game.reset });
        console.log("Reset request: " + data.type);
        if (game.reset[P1] == true && game.reset[P2] == true) {
            console.log("Game reset!");
            resetGame();
        }
    });

    socket.on("resetGame", () => {
        resetGame();
    });

    function resetGame() {
        game.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        game.size = minSize;
        io.in(`room-${game.roomId}`).emit("resetGame", { });
        game.reset = { [P1]: false, [P2]: false };
        io.in(`room-${game.roomId}`).emit("resetUpdate", { request: game.reset });
        saveGame();
    }

    function saveGame() {
        gameSaver[socket.data.room] = game;
    }
});


server.listen(process.env.PORT || 5000);
