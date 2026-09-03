let currentValue = "0";
let previousValue = "";
let operator = null;

const display = document.getElementById("display");
const history = document.getElementById("history");

function updateDisplay() {
  display.textContent = currentValue;
}

function appendNumber(number) {
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

function chooseOperator(selectedOperator) {
  if (operator !== null) {
    calculate();
  }

  previousValue = currentValue;
  operator = selectedOperator;
  currentValue = "0";

  history.textContent = previousValue + " " + getOperatorSymbol(selectedOperator);
}

function calculate() {
  if (operator === null || previousValue === "") {
    return;
  }

  const firstNumber = parseFloat(previousValue);
  const secondNumber = parseFloat(currentValue);

  let result;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;

    case "-":
      result = firstNumber - secondNumber;
      break;

    case "*":
      result = firstNumber * secondNumber;
      break;

    case "/":
      if (secondNumber === 0) {
        currentValue = "Error";
        previousValue = "";
        operator = null;
        updateDisplay();
        history.textContent = "Cannot divide by zero";
        return;
      }
      result = firstNumber / secondNumber;
      break;
  }

  history.textContent =
    previousValue +
    " " +
    getOperatorSymbol(operator) +
    " " +
    currentValue +
    " =";

  currentValue = String(
    Number.isInteger(result) ? result : parseFloat(result.toFixed(10))
  );

  previousValue = "";
  operator = null;

  updateDisplay();
}

function clearDisplay() {
  currentValue = "0";
  previousValue = "";
  operator = null;
  history.textContent = "";
  updateDisplay();
}

function deleteLast() {
  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    currentValue = "0";
  }

  updateDisplay();
}

function percentage() {
  const number = parseFloat(currentValue);

  if (isNaN(number)) {
    return;
  }

  currentValue = String(number / 100);
  updateDisplay();
}

function getOperatorSymbol(op) {
  switch (op) {
    case "+":
      return "+";
    case "-":
      return "−";
    case "*":
      return "×";
    case "/":
      return "÷";
    default:
      return "";
  }
}

document.addEventListener("keydown", function(event) {
  const key = event.key;

  if (!isNaN(key) || key === ".") {
    appendNumber(key);
  }

  if (key === "+" || key === "-" || key === "*" || key === "/") {
    chooseOperator(key);
  }

  if (key === "Enter" || key === "=") {
    calculate();
  }

  if (key === "Escape") {
    clearDisplay();
  }

  if (key === "Backspace") {
    deleteLast();
  }

  if (key === "%") {
    percentage();
  }
});

updateDisplay();
