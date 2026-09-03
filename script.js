let currentValue = "0";
let expression = "";
let justCalculated = false;

const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");

function updateDisplay() {
    display.textContent = currentValue;
    historyDisplay.textContent = expression;
}

// Number
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

// Decimal
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

// Parentheses
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

// Operators
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

// AC
function clearDisplay() {
    currentValue = "0";
    expression = "";
    justCalculated = false;

    updateDisplay();
}

// Delete
function deleteLast() {
    if (justCalculated) {
        clearDisplay();
        return;
    }

    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = "0";
    }

    updateDisplay();
}

// Percentage
function percentage() {
    currentValue = String(parseFloat(currentValue) / 100);
    updateDisplay();
}

// Plus / Minus
function toggleSign() {
    if (currentValue === "0") return;

    if (currentValue.startsWith("-")) {
        currentValue = currentValue.substring(1);
    } else {
        currentValue = "-" + currentValue;
    }

    updateDisplay();
}

// Square
function square() {
    const value = parseFloat(currentValue);

    if (isNaN(value)) return;

    currentValue = String(value * value);
    updateDisplay();
}

// Square Root
function squareRoot() {
    const value = parseFloat(currentValue);

    if (isNaN(value) || value < 0) {
        currentValue = "Error";
        updateDisplay();
        return;
    }

    currentValue = String(Math.sqrt(value));
    updateDisplay();
}

// Pi
function appendConstant(name) {
    if (name === "pi") {
        currentValue = String(Math.PI);
    }

    updateDisplay();
}

// Scientific functions
function scientificFunction(func) {
    const value = parseFloat(currentValue);

    if (isNaN(value)) return;

    let result;

    if (func === "sin") {
        result = Math.sin(value * Math.PI / 180);
    }

    if (func === "cos") {
        result = Math.cos(value * Math.PI / 180);
    }

    if (func === "tan") {
        result = Math.tan(value * Math.PI / 180);
    }

    currentValue = String(result);

    updateDisplay();
}

// Calculate
function calculate() {
    try {
        let fullExpression = expression + currentValue;

        if (!fullExpression) return;

        // × and ÷ support
        fullExpression = fullExpression
            .replace(/×/g, "*")
            .replace(/÷/g, "/");

        const result = Function(
            '"use strict"; return (' + fullExpression + ')'
        )();

        if (!isFinite(result)) {
            currentValue = "Error";
            expression = "";
            updateDisplay();
            return;
        }

        addHistory(expression + currentValue, result);

        currentValue = String(result);
        expression = "";
        justCalculated = true;

        updateDisplay();

    } catch (error) {
        currentValue = "Error";
        expression = "";
        updateDisplay();
    }
}

// History
function addHistory(exp, result) {
    const historyList = document.getElementById("historyList");

    if (!historyList) return;

    const item = document.createElement("div");

    item.className = "history-item";
    item.textContent = exp + " = " + result;

    historyList.prepend(item);
}

// Initial display
updateDisplay();
