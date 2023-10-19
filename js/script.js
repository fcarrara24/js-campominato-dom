//game btn
const gameBtn = document.getElementById('generate')
const rangeListener = document.getElementById('difficulyRange');
let loadedPage = false

/**
 * label listener for changing difficulty
 */
rangeListener.addEventListener('input', function () {
    let difficultyShow = document.querySelector('#difficultyShow');
    let value = rangeListener.value;
    //ternary operator with simple comparator, so it dowsn't say false being different difficulty levels
    difficultyShow.innerText = (value == 8) ? 'difficle' : (((value == 9) ? 'medio' : 'facile'))
})


gameBtn.addEventListener('click', function newGame() {
    const table = document.getElementById('field');
    // recharge page if clicking twice on the btn
    if (loadedPage) {
        reload();
    }
    //1st execution
    loadedPage = true;
    let width
    width = document.getElementById('difficulyRange').value;
    console.log(width)
    //creating the table

    let firstClick = true;
    let win = false;
    let matrixMines = [];
    let displayed = [];
    let totalMines = 0;
    let totalDisplayed = 0;

    for (let i = 0; i < width; i++) {
        let matrixMinesLine = [];
        let displayedLine = [];
        for (let j = 0; j < width; j++) {

            table.innerHTML += `<div class="square" style="width: ${99 / width}%; height: ${99 / width}%;"></div>`
            let unknown = trueMine();
            totalMines += unknown;
            let disp = false;
            //pushed for html
            displayedLine.push(disp);
            //tracking all mines
            matrixMinesLine.push(unknown);
        }

        displayed.push(displayedLine);
        matrixMines.push(matrixMinesLine);
    }
    console.log(totalMines)
    //getting all the squares

    const printSquare = document.getElementsByClassName('square');

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            //left-click handler
            printSquare[i * width + j].addEventListener('click', (event) => {
                printSquare[i * width + j].classList.remove('circled');
                if (firstClick) {
                    if (matrixMines[i][j]) {
                        totalMines = totalMines - 1;
                    }
                    matrixMines[i][j] = false;
                    firstClick = false;
                }
                if (matrixMines[i][j] && !win) {
                    alert('hai perso');
                    location.reload();

                } else {
                    crash(i, j, true);
                }
            })
            //right-click handler
            printSquare[i * width + j].addEventListener('contextmenu', (event) => {
                if (event.button == 2) {
                    event.preventDefault();
                    console.log('mamma' + printSquare[i * width + j].innerHTML)
                    if (printSquare[i * width + j].innerHTML === '' || printSquare[i * width + j].innerHTML === ' ' || printSquare[i * width + j].innerHTML === '<div class="centered"></div>') {
                        printSquare[i * width + j].classList.toggle('circled');
                    }
                }
            })
        }

    }


    /**
     * recursive function to check adjscent lines, third value is the last iteraction ( so it shows also outer numbers of adjacent files)
     * @param {*} x 
     * @param {*} y 
     * @param {*} notLast 
     * @returns 
     */
    function crash(x, y, notLast) {
        displayed[x][y] = true;

        if (!matrixMines[x][y]) {
            //remove circeld class if previous assigned
            printSquare[x * width + y].classList.remove('circled');

            //displays background color white and inner value
            printSquare[x * width + y].style.backgroundColor = "white";
            printSquare[x * width + y].innerHTML = `<div class="centered">${printPoint(x, y)}</div>`

            //keep track of displayed mines for win-counter
            totalDisplayed = totalDisplayed + 1;
            //win condition
            if (totalMines === (width * width - totalDisplayed)) {
                //toggles off mines
                win = true;
                document.getElementById('win').innerHTML = '<button class="btn btn-primary" onclick="reload()">hai vinto, premi per una nuova partita</button>'

            }
        }
        //if it is the last iteraction it stops
        if (notLast) {

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    // since the interacted part is already displayed, I don't have to put a condition like (i!===0 || j!===0)
                    if (inBounds(x + i, y + j) && !displayed[x + i][y + j]) {
                        //if assoign points is not 0, means that this is the last interaction (else it will reveal mines)
                        crash(x + i, y + j, assignPoints(x + i, y + j) === 0)
                    }

                }
            }


        }
        return;
    }


    /**
     * given the coords, it will display the number of adjacent mines or nothing if there are none
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    function printPoint(x, y) {
        let value = assignPoints(x, y);
        if (value !== 0 && !matrixMines[x][y]) {
            return value
        }
        return '';
    }

    /**
     * assignpoints according to the nearby mines
     * @param {*} x 
     * @param {*} y 
     */
    function assignPoints(x, y) {
        let nearby = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (inBounds(x + i, y + j) && (matrixMines[x + i][y + j])) {
                    nearby++;
                }
            }
        }

        return nearby;
    }

    /**
     * checks it is in the array bounds
     */
    function inBounds(x, y) {
        return (x >= 0 && y >= 0 && x < width && y < width);
    }

    /**
     * function to guess active mine
     * @returns 
     */
    function trueMine() {
        if (rndInt(1, 8) === 1) {
            return true;
        }
        return false;
    }
    /**
     * random integer
     * @param {*} min 
     * @param {*} max 
     * @returns 
     */
    function rndInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function reload() {
        table.innerHTML = ''
    }
});
