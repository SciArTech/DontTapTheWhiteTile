var game = {
    timer: {
        time: 0.00,
        elem: null,

        intervalId: null,
        start: function() {
            this.intervalId = setInterval(function(){
                game.timer.time += 0.01;
                game.timer.elem.firstChild.nodeValue = game.timer.time.toFixed(2) + '"';    
            }, 10);
        },
        stop: function() {
            clearInterval(this.intervalId);
        },
        reset: function() {
            this.time = 0.00;
        }
    },
    board_1: null,
    board_2: null,
    blocks: [], // 二维数组，保存所有方块
    blocksNum: 25, // 总黑块数
    blocksCount: 0, // 记录消掉的黑块

    blocksNumIndex: [25,50,75,100],

    prepareGame: function() {
        // 创建方块
        for (var i = 0; i < 8; i++) {
            game.blocks[i] = [];
            for (var j = 0; j < 4; j++) {
                var elem = document.createElement("div");
                game.blocks[i][j] = elem;

                elem.classList.add("block");
                elem.style.left = j * 25 + "vw";
                if (j === 0) {
                    elem.style.borderLeft = "none";
                }
                if (i < 4) {
                    elem.style.bottom = i * 25 + "vh";
                    game.board_1.appendChild(elem);
                } else {
                    elem.style.bottom = (i - 4) * 25 + "vh";
                    game.board_2.appendChild(elem);
                }
            }
            if (i === 0) {
                for (var a = 0; a < 4; a++) {
                    game.blocks[i][a].classList.add("info-block");
                    game.blocks[i][a].addEventListener("click", function(){
                        game.blocksNum = game.blocksNumIndex[game.blocks[0].indexOf(this)];
                    }, false);

                    var text = document.createTextNode(game.blocksNumIndex[a]);
                    game.blocks[i][a].appendChild(text);
                }
            } else {
                game.addBlackBlock(game.blocks[i]);
            }
        }
        game.addEventListenerForLine(game.blocks[1]);
    },

    clickHandler: function() {
        if (this.classList.contains("blackBlock")) {
            this.classList.remove("blackBlock");
            this.classList.add("clicked");
            // this.style.zIndex = "-9";
            // this.parentNode.style.zIndex = "-10";
            if (!this.parentNode.classList.contains("board")) {
                this.parentNode.parentNode.style.zIndex = "-2";
                this.parentNode.style.zIndex = "0";
            } else {
                this.parentNode.style.zIndex = "-2";
                this.style.zIndex = "0";
            }
            for (var i = 0; i < 4; i++) {
                game.blocks[(game.blocksCount+1) % 8][i].removeEventListener("click", game.clickHandler, false);                        
            }

            game.blocksCount++;

            game.board_1.style.top = parseInt(game.board_1.style.top || 0) + 25 + "vh";
            game.board_2.style.top = parseInt(game.board_2.style.top || -100) + 25 + "vh";
            
            if (game.board_1.style.top === "100vh") {
                setTimeout(function(){
                    game.clearBoard(game.board_1);
                    game.board_1.style.visibility = "hidden";
                    game.board_1.style.top = "-100vh";
                    setTimeout(function(){
                        game.board_1.style.visibility = "visible";                        
                    }, 200);
                    for (var i = 0; i < 4; i++) {
                        game.addBlackBlock(game.blocks[i]);
                    }    
                }, 200);
            }
            if (game.board_2.style.top === "100vh") {
                setTimeout(function(){
                    game.clearBoard(game.board_2);
                    game.board_2.style.visibility = "hidden";                    
                    game.board_2.style.top = "-100vh";
                    setTimeout(function(){
                        game.board_2.style.visibility = "visible";                        
                    }, 200);
                    for (var i = 0; i < 4; i++) {
                        game.addBlackBlock(game.blocks[i+4]);
                    }
                }, 200);
            }            

            game.addEventListenerForLine(game.blocks[(game.blocksCount+1) % 8]);
        }
    },
    // 为一行添加黑块
    addBlackBlock: function(line) {
        line[Math.floor(Math.random() * 4)].classList.add("blackBlock");
    },
    // 为一行添加点击事件
    addEventListenerForLine: function(line) {
        for (var i = 0; i < 4; i++) {
            line[i].addEventListener("click", game.clickHandler, false);
            if (line[i].classList.contains("blackBlock")) {
                line[i].style.zIndex = "1";
                line[i].parentNode.style.zIndex = "-1";
            }
        }
    },

    // 清空面板（board）
    clearBoard: function(board) {
        for (var i = 0; i < board.childNodes.length; i++) {
            board.childNodes[i].classList.remove("blackBlock");
            board.childNodes[i].classList.remove("clicked");
            board.childNodes[i].classList.remove("info-block");
            if (board.childNodes[i].childNodes.length) {
                board.childNodes[i].removeChild(board.childNodes[i].firstChild);
            }
        }
    }
};

window.addEventListener("load", function() {
    game.board_1 = document.getElementById("board-1");
    game.board_2 = document.getElementById("board-2");

    game.timer.elem = document.getElementById("timer");

    game.prepareGame();
}, false);
