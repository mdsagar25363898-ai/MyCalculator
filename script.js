let currentValue = "0";
let expression = "";
let justCalculated = false;

const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");
const historyList = document.getElementById("historyList");

function updateDisplay() {
  display.textContent = currentValue;
}

function appendNumber(number) {
  if (justCalculated) {
    expression = "";
    currentValue = "0";
    justCalculated = false;
  }

  if (number === "." && currentValue.includes(".")) {
    return;
  }

  if (currentValue === "0" && number !== ".") {
    currentValue = number;
  } else {
    currentValue += number;
  }

  updateDisplay();
}

function appendParenthesis(parenthesis) {
  if (justCalculated) {
    expression = "";
    currentValue = "0";
    justCalculated = false;
  }

  if (parenthesis === "(") {
    if (currentValue !== "0") {
      expression += currentValue + "*";
    }

    expression += "(";
    currentValue = "0";
  } else {
    expression += currentValue;
    expression += ")";
    currentValue = "0";
  }

  historyDisplay.textContent = expression;
  updateDisplay();
}

function chooseOperator(selectedOperator) {
  if (justCalculated) {
    expression = currentValue;
    justCalculated = false;
  } else {
    expression += currentValue;
  }

  expression += selectedOperator;
  currentValue = "0";

  historyDisplay.textContent = expression;
  updateDisplay();
}

function calculate() {
  let finalExpression = expression + currentValue;

  if (!finalExpression) {
    return;
  }

  try {
    let result = evaluateExpression(finalExpression);

    if (!isFinite(result)) {
      throw new Error("Invalid calculation");
    }

    result = Number(result.toFixed(10));

    addHistory(finalExpression, result);

    historyDisplay.textContent = finalExpression + " =";
    currentValue = String(result);
    expression = "";
    justCalculated = true;

    updateDisplay();

  } catch (error) {
    currentValue = "Error";
    historyDisplay.textContent = "Invalid expression";
    expression = "";
    justCalculated = true;

    updateDisplay();
  }
}

function evaluateExpression(exp) {
  let safeExpression = exp
    .replace(/×/g, "*")
    .replace(/÷/g, "/");

  if (!/^[0-9+\-*/().\s]+$/.test(safeExpression)) {
    throw new Error("Invalid characters");
  }

  return Function('"use strict"; return (' + safeExpression + ')')();
}

function clearDisplay() {
  currentValue = "0";
  expression = "";
  justCalculated = false;

  historyDisplay.textContent = "";

  updateDisplay();
}

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

function percentage() {
  let number = parseFloat(currentValue);

  if (isNaN(number)) {
    return;
  }

  currentValue = String(number / 100);
  updateDisplay();
}

function squareRoot() {
  let number = parseFloat(currentValue);

  if (isNaN(number) || number < 0) {
    currentValue = "Error";
    updateDisplay();
    return;
  }

  let result = Math.sqrt(number);

  addHistory("√" + number, result);

  historyDisplay.textContent = "√" + number + " =";
  currentValue = String(Number(result.toFixed(10)));
  justCalculated = true;

  updateDisplay();
}

function square() {
  let number = parseFloat(currentValue);

  if (isNaN(number)) {
    return;
  }

  let result = number * number;

  addHistory(number + "²", result);

  historyDisplay.textContent = number + "² =";
  currentValue = String(Number(result.toFixed(10)));
  justCalculated = true;

  updateDisplay();
}

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

function appendConstant(constant) {
  if (constant === "pi") {
    if (justCalculated) {
      expression = "";
      justCalculated = false;
    }

    currentValue = String(Number(Math.PI.toFixed(10)));
    updateDisplay();
  }
}

function scientificFunction(functionName) {
  let number = parseFloat(currentValue);

  if (isNaN(number)) {
    return;
  }

  let radians = number * Math.PI / 180;
  let result;

  switch (functionName) {
    case "sin":
      result = Math.sin(radians);
      break;

    case "cos":
      result = Math.cos(radians);
      break;

    case "tan":
      result = Math.tan(radians);
      break;

    default:
      return;
  }

  result = Number(result.toFixed(10));

  addHistory(functionName + "(" + number + "°)", result);

  historyDisplay.textContent =
    functionName + "(" + number + "°) =";

  currentValue = String(result);
  justCalculated = true;

  updateDisplay();
}

function addHistory(calculation, result) {
  if (!historyList) {
    return;
  }

  const empty = historyList.querySelector(".empty-history");

  if (empty) {
    empty.remove();
  }

  const item = document.createElement("div");
  item.className = "history-item";

  item.textContent = calculation + " = " + result;

  historyList.prepend(item);
}

function clearHistory() {
  if (!historyList) {
    return;
  }

  historyList.innerHTML =
    '<p class="empty-history">No calculations yet</p>';
}

document.addEventListener("keydown", function(event) {
  const key = event.key;

  if (!isNaN(key) || key === ".") {
    appendNumber(key);
    return;
  }

  if (key === "+" || key === "-" || key === "*" || key === "/") {
    chooseOperator(key);
    return;
  }

  if (key === "(" || key === ")") {
    appendParenthesis(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
    return;
  }

  if (key === "Backspace") {
    deleteLast();
    return;
  }

  if (key === "Escape") {
    clearDisplay();
    return;
  }

  if (key === "%") {
    percentage();
  }
});

updateDisplay();
