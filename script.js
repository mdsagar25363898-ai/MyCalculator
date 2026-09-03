let currentValue = "0";
let expression = "";
let justCalculated = false;

const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");
const historyList = document.getElementById("historyList");


// =========================
// DISPLAY UPDATE
// =========================

function updateDisplay() {
    if (display) {
        display.textContent = currentValue;
    }

    if (historyDisplay) {
        historyDisplay.textContent = expression;
    }
}


// =========================
// NUMBER
// =========================

function appendNumber(number) {

    if (justCalculated) {
        expression = "";
        currentValue = "0";
        justCalculated = false;
    }

    if (currentValue === "Error") {
        currentValue = "0";
    }

    if (currentValue === "0") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}


// =========================
// DECIMAL
// =========================

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


// =========================
// PARENTHESES
// =========================

function appendParenthesis(type) {

    if (justCalculated) {
        expression = "";
        currentValue = "0";
        justCalculated = false;
    }

    if (type === "(") {

        if (currentValue !== "0") {
            expression += currentValue;
            expression += "*";
        }

        expression += "(";
        currentValue = "0";

    } else {

        if (currentValue !== "0") {
            expression += currentValue;
        }

        expression += ")";
        currentValue = "0";
    }

    updateDisplay();
}


// =========================
// OPERATOR
// =========================

function chooseOperator(operator) {

    if (currentValue === "Error") {
        return;
    }

    if (justCalculated) {
        expression = currentValue;
        justCalculated = false;
    } else {
        if (currentValue !== "0") {
            expression += currentValue;
        }
    }

    // Convert display operators to JavaScript operators
    if (operator === "×") {
        operator = "*";
    }

    if (operator === "÷") {
        operator = "/";
    }

    // Prevent duplicate operators
    if (/[+\-*/]$/.test(expression)) {
        expression = expression.slice(0, -1);
    }

    expression += operator;

    currentValue = "0";

    updateDisplay();
}


// =========================
// CLEAR
// =========================

function clearDisplay() {

    currentValue = "0";
    expression = "";
    justCalculated = false;

    updateDisplay();
}


// =========================
// DELETE
// =========================

function deleteLast() {

    if (justCalculated) {
        currentValue = "0";
        expression = "";
        justCalculated = false;
        updateDisplay();
        return;
    }

    if (currentValue !== "0") {

        currentValue = currentValue.slice(0, -1);

        if (currentValue === "" || currentValue === "-") {
            currentValue = "0";
        }

    } else if (expression.length > 0) {

        expression = expression.slice(0, -1);
    }

    updateDisplay();
}


// =========================
// PERCENTAGE
// =========================

function percentage() {

    if (currentValue === "Error") {
        return;
    }

    let number = parseFloat(currentValue);

    if (!isNaN(number)) {

        number = number / 100;

        currentValue = String(number);
    }

    updateDisplay();
}


// =========================
// SQUARE
// =========================

function square() {

    if (currentValue === "Error") {
        return;
    }

    let number = parseFloat(currentValue);

    if (isNaN(number)) {
        return;
    }

    currentValue = String(number * number);

    justCalculated = true;

    updateDisplay();
}


// =========================
// SQUARE ROOT
// =========================

function squareRoot() {

    if (currentValue === "Error") {
        return;
    }

    let number = parseFloat(currentValue);

    if (isNaN(number)) {
        return;
    }

    if (number < 0) {

        currentValue = "Error";
        expression = "√(" + number + ")";

        updateDisplay();
        return;
    }

    let result = Math.sqrt(number);

    currentValue = formatResult(result);
    justCalculated = true;

    updateDisplay();
}


// =========================
// PLUS / MINUS
// =========================

function toggleSign() {

    if (currentValue === "0" || currentValue === "Error") {
        return;
    }

    if (currentValue.startsWith("-")) {
        currentValue = currentValue.substring(1);
    } else {
        currentValue = "-" + currentValue;
    }

    updateDisplay();
}


// =========================
// PI
// =========================

function appendConstant(constant) {

    if (justCalculated) {
        expression = "";
        currentValue = "0";
        justCalculated = false;
    }

    if (constant === "pi") {

        if (currentValue === "0") {
            currentValue = String(Math.PI);
        } else {
            expression += currentValue;
            expression += "*";
            currentValue = String(Math.PI);
        }
    }

    updateDisplay();
}


// =========================
// SCIENTIFIC FUNCTIONS
// =========================

function scientificFunction(func) {

    if (currentValue === "Error") {
        return;
    }

    let number = parseFloat(currentValue);

    if (isNaN(number)) {
        return;
    }

    let result;

    // Use degrees
    let radians = number * Math.PI / 180;

    if (func === "sin") {
        result = Math.sin(radians);
    }

    else if (func === "cos") {
        result = Math.cos(radians);
    }

    else if (func === "tan") {
        result = Math.tan(radians);
    }

    if (result !== undefined) {

        currentValue = formatResult(result);

        justCalculated = true;

        updateDisplay();
    }
}


// =========================
// CALCULATE
// =========================

function calculate() {

    if (currentValue === "Error") {
        return;
    }

    let fullExpression = expression + currentValue;

    if (fullExpression.trim() === "") {
        return;
    }

    try {

        let jsExpression = fullExpression;

        // Replace percentage
        jsExpression = jsExpression.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        // Calculate
        let result = Function(
            '"use strict"; return (' + jsExpression + ')'
        )();

        if (
            typeof result !== "number" ||
            !isFinite(result)
        ) {
            throw new Error("Invalid calculation");
        }

        result = formatResult(result);

        // Add to history
        addHistory(fullExpression, result);

        currentValue = result;
        expression = fullExpression + " =";
        justCalculated = true;

        updateDisplay();

    } catch (error) {

        currentValue = "Error";
        expression = fullExpression;

        updateDisplay();
    }
}


// =========================
// FORMAT RESULT
// =========================

function formatResult(number) {

    if (!isFinite(number)) {
        return "Error";
    }

    // Remove floating point errors
    number = Number(
        parseFloat(number.toFixed(12))
    );

    return String(number);
}


// =========================
// HISTORY
// =========================

function addHistory(exp, result) {

    if (!historyList) {
        return;
    }

    const item = document.createElement("div");

    item.className = "history-item";

    item.textContent = exp + " = " + result;

    // Newest history first
    historyList.prepend(item);

    // Save history
    saveHistory();
}


// =========================
// SAVE HISTORY
// =========================

function saveHistory() {

    if (!historyList) {
        return;
    }

    const items = [];

    historyList
        .querySelectorAll(".history-item")
        .forEach(function(item) {

            items.push(item.textContent);
        });

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(items)
    );
}


// =========================
// LOAD HISTORY
// =========================

function loadHistory() {

    if (!historyList) {
        return;
    }

    const savedHistory =
        localStorage.getItem("calculatorHistory");

    if (!savedHistory) {
        return;
    }

    try {

        const items =
            JSON.parse(savedHistory);

        items.forEach(function(text) {

            const item =
                document.createElement("div");

            item.className = "history-item";

            item.textContent = text;

            historyList.appendChild(item);
        });

    } catch (error) {

        localStorage.removeItem(
            "calculatorHistory"
        );
    }
}


// =========================
// CLEAR HISTORY
// =========================

function clearHistory() {

    if (!historyList) {
        return;
    }

    historyList.innerHTML = "";

    localStorage.removeItem(
        "calculatorHistory"
    );
}


// =========================
// START
// =========================

loadHistory();
updateDisplay();
