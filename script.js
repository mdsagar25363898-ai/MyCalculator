let currentValue = "0";
let expression = "";
let justCalculated = false;


/* Elements */

const display =
    document.getElementById("display");

const historyDisplay =
    document.getElementById("history");

const historyList =
    document.getElementById("historyList");


/* Display */

function updateDisplay() {

    display.textContent = currentValue;

    historyDisplay.textContent = expression;
}


/* Numbers */

function appendNumber(number) {

    if (justCalculated) {

        expression = "";
        currentValue = "0";

        justCalculated = false;
    }

    if (currentValue === "0") {

        currentValue = number;

    } else {

        currentValue += number;
    }

    updateDisplay();
}


/* Decimal */

function appendDecimal() {

    if (justCalculated) {

        expression = "";
        currentValue = "0";

        justCalculated = false;
    }

    if (!currentValue.includes(".")) {

        currentValue += ".";
    }

    updateDisplay();
}


/* Parentheses */

function appendParenthesis(type) {

    if (justCalculated) {

        expression = "";
        currentValue = "0";

        justCalculated = false;
    }

    if (type === "(") {

        if (currentValue !== "0") {

            expression += currentValue;
        }

        expression += "(";

        currentValue = "0";

    } else {

        expression += currentValue;

        expression += ")";

        currentValue = "0";
    }

    updateDisplay();
}


/* Operators */

function chooseOperator(operator) {

    if (justCalculated) {

        expression = currentValue;

        justCalculated = false;

    } else {

        expression += currentValue;
    }

    expression += operator;

    currentValue = "0";

    updateDisplay();
}


/* AC */

function clearDisplay() {

    currentValue = "0";

    expression = "";

    justCalculated = false;

    updateDisplay();
}


/* Delete */

function deleteLast() {

    if (justCalculated) {

        clearDisplay();

        return;
    }

    if (currentValue.length > 1) {

        currentValue =
            currentValue.slice(0, -1);

    } else {

        currentValue = "0";
    }

    updateDisplay();
}


/* Percentage */

function percentage() {

    const value =
        parseFloat(currentValue);

    if (isNaN(value)) return;

    currentValue =
        String(value / 100);

    updateDisplay();
}


/* Plus / Minus */

function toggleSign() {

    if (currentValue === "0") return;

    if (currentValue.startsWith("-")) {

        currentValue =
            currentValue.substring(1);

    } else {

        currentValue =
            "-" + currentValue;
    }

    updateDisplay();
}


/* Square */

function square() {

    const value =
        parseFloat(currentValue);

    if (isNaN(value)) return;

    currentValue =
        String(value * value);

    updateDisplay();
}


/* Square Root */

function squareRoot() {

    const value =
        parseFloat(currentValue);

    if (isNaN(value) || value < 0) {

        currentValue = "Error";

        updateDisplay();

        return;
    }

    currentValue =
        String(Math.sqrt(value));

    updateDisplay();
}


/* Pi */

function appendConstant(name) {

    if (name === "pi") {

        currentValue =
            String(Math.PI);
    }

    updateDisplay();
}


/* Scientific Functions */

function scientificFunction(func) {

    const value =
        parseFloat(currentValue);

    if (isNaN(value)) return;

    let result;

    if (func === "sin") {

        result =
            Math.sin(
                value * Math.PI / 180
            );
    }

    else if (func === "cos") {

        result =
            Math.cos(
                value * Math.PI / 180
            );
    }

    else if (func === "tan") {

        result =
            Math.tan(
                value * Math.PI / 180
            );
    }

    else if (func === "log") {

        if (value <= 0) {

            currentValue = "Error";

            updateDisplay();

            return;
        }

        result =
            Math.log10(value);
    }

    else if (func === "ln") {

        if (value <= 0) {

            currentValue = "Error";

            updateDisplay();

            return;
        }

        result =
            Math.log(value);
    }

    currentValue =
        formatNumber(result);

    updateDisplay();
}


/* Factorial */

function factorial() {

    const value =
        parseInt(currentValue);

    if (
        isNaN(value) ||
        value < 0 ||
        value > 170 ||
        value !== parseFloat(currentValue)
    ) {

        currentValue = "Error";

        updateDisplay();

        return;
    }

    let result = 1;

    for (let i = 2; i <= value; i++) {

        result *= i;
    }

    currentValue =
        String(result);

    updateDisplay();
}


/* Calculate */

function calculate() {

    try {

        let fullExpression =
            expression + currentValue;

        if (!fullExpression) return;


        /* Convert symbols */

        fullExpression =
            fullExpression
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/−/g, "-")
                .replace(/\^/g, "**");


        /* Check brackets */

        const open =
            (fullExpression.match(/\(/g) || []).length;

        const close =
            (fullExpression.match(/\)/g) || []).length;

        if (open > close) {

            fullExpression +=
                ")".repeat(open - close);
        }


        const result =
            Function(
                '"use strict"; return (' +
                fullExpression +
                ')'
            )();


        if (!isFinite(result)) {

            currentValue = "Error";

            expression = "";

            updateDisplay();

            return;
        }


        const formatted =
            formatNumber(result);


        /* Save History */

        addHistory(
            expression + currentValue,
            formatted
        );


        currentValue = formatted;

        expression = "";

        justCalculated = true;

        updateDisplay();

    }

    catch (error) {

        currentValue = "Error";

        expression = "";

        updateDisplay();
    }
}


/* Number Formatting */

function formatNumber(number) {

    if (!isFinite(number)) {

        return "Error";
    }

    if (
        Math.abs(number) >= 1e12 ||
        (
            Math.abs(number) > 0 &&
            Math.abs(number) < 1e-10
        )
    ) {

        return number.toExponential(8);
    }

    return Number(
        number.toFixed(12)
    ).toString();
}


/* =========================
   HISTORY
========================= */


/* Load saved history */

let savedHistory =
    JSON.parse(
        localStorage.getItem(
            "calculatorHistory"
        ) || "[]"
    );


function saveHistory() {

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(savedHistory)
    );
}


/* Add History */

function addHistory(exp, result) {

    savedHistory.unshift({

        expression: exp,

        result: result

    });


    /* Maximum 30 items */

    if (savedHistory.length > 30) {

        savedHistory =
            savedHistory.slice(0, 30);
    }


    saveHistory();

    renderHistory();
}


/* Show History */

function renderHistory() {

    historyList.innerHTML = "";


    if (savedHistory.length === 0) {

        historyList.innerHTML =
            '<div class="history-item">' +
            'No history yet' +
            '</div>';

        return;
    }


    savedHistory.forEach(
        function(item) {

            const div =
                document.createElement("div");

            div.className =
                "history-item";


            div.textContent =
                item.expression +
                " = " +
                item.result;


            /* Click history */

            div.onclick = function() {

                currentValue =
                    item.result;

                expression = "";

                justCalculated = true;

                updateDisplay();
            };


            historyList.appendChild(div);
        }
    );
}


/* Clear History */

function clearHistory() {

    savedHistory = [];

    localStorage.removeItem(
        "calculatorHistory"
    );

    renderHistory();
}


/* =========================
   DARK / LIGHT MODE
========================= */

function toggleTheme() {

    document.body.classList.toggle("light");


    const isLight =
        document.body.classList.contains(
            "light"
        );


    localStorage.setItem(
        "calculatorTheme",
        isLight ? "light" : "dark"
    );


    const button =
        document.querySelector(
            ".theme-btn"
        );


    button.textContent =
        isLight ? "☀️" : "🌙";
}


/* Load Theme */

function loadTheme() {

    const theme =
        localStorage.getItem(
            "calculatorTheme"
        );


    const button =
        document.querySelector(
            ".theme-btn"
        );


    if (theme === "light") {

        document.body.classList.add("light");

        button.textContent = "☀️";

    } else {

        button.textContent = "🌙";
    }
}


/* Start */

renderHistory();

loadTheme();

updateDisplay();
