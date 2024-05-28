const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
};

const balanceElement = document.getElementById("balance");
const reelElements = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")];
const messageElement = document.getElementById("message");

let balance = 0;

const updateBalance = (amount) => {
    balance += amount;
    balanceElement.textContent = balance;
};

document.getElementById("deposit-button").addEventListener("click", () => {
    const depositAmount = parseFloat(document.getElementById("deposit-amount").value);
    if (isNaN(depositAmount) || depositAmount <= 0) {
        messageElement.textContent = "Invalid deposit amount, try again.";
    } else {
        updateBalance(depositAmount);
        messageElement.textContent = "Deposit successful!";
    }
});

document.getElementById("spin-button").addEventListener("click", () => {
    const lines = parseFloat(document.getElementById("lines").value);
    const betAmount = parseFloat(document.getElementById("bet-amount").value);

    if (isNaN(lines) || lines <= 0 || lines > 3) {
        messageElement.textContent = "Invalid number of lines, try again.";
        return;
    }

    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance / lines) {
        messageElement.textContent = "Invalid bet, try again.";
        return;
    }

    balance -= betAmount * lines;
    updateBalance(0); // Update balance display

    const reels = spin();
    const rows = transpose(reels);
    displayReels(rows);
    const winnings = getWinnings(rows, betAmount, lines);
    updateBalance(winnings);

    if (winnings > 0) {
        messageElement.textContent = `You won $${winnings}!`;
    } else {
        messageElement.textContent = "No winnings this time.";
    }

    if (balance <= 0) {
        messageElement.textContent = "You ran out of money!";
    }
});

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const displayReels = (rows) => {
    for (let i = 0; i < COLS; i++) {
        reelElements[i].textContent = rows[i].join(" | ");
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};
