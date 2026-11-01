// Variables globales de estado
let firstNumber = "";
let secondNumber = "";
let currentOperator = null;
let shouldResetDisplay = false;

// Elementos del DOM
const display = document.querySelector('#display');
const numbers = document.querySelectorAll('.number');
const operators = document.querySelectorAll('.operator');
const clearBtn = document.querySelector('#clear');
const equalsBtn = document.querySelector('#equals');
const decimalBtn = document.querySelector('#decimal');
const backspaceBtn = document.querySelector('#backspace');

// 1. Operaciones matemáticas básicas
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { 
    if (b === 0) return "ERROR: No puedes dividir entre 0 😠";
    return a / b; 
}

// 2. Función operate (Toma operador y dos números)
function operate(operator, num1, num2) {
    // Redondear decimales largos (Gotcha: overflow)
    const roundResult = (num) => Math.round(num * 1000000) / 1000000;

    switch (operator) {
        case '+': return roundResult(add(num1, num2));
        case '-': return roundResult(subtract(num1, num2));
        case '*': return roundResult(multiply(num1, num2));
        case '/': return roundResult(divide(num1, num2));
        default: return null;
    }
}

// 3. Actualizar pantalla
function updateDisplay(value) {
    display.textContent = value;
}

// 4. Manejar números y decimales
function inputNumber(number) {
    // Si el display muestra un resultado anterior, empezar de cero
    if (display.textContent === "0" || shouldResetDisplay || display.textContent.includes("ERROR")) {
        display.textContent = number;
        shouldResetDisplay = false;
    } else {
        display.textContent += number;
    }
}

// 5. Manejar el punto decimal (Crédito Extra)
function inputDecimal() {
    if (shouldResetDisplay) {
        display.textContent = "0";
        shouldResetDisplay = false;
    }
    // Evitar múltiples puntos decimales
    if (!display.textContent.includes('.')) {
        display.textContent += '.';
    }
}

// 6. Manejar la selección de operadores (Gotchas incluidos)
function handleOperator(operator) {
    const inputValue = parseFloat(display.textContent);

    // Gotcha: Si se presionan operadores consecutivos, solo actualizar el operador
    if (currentOperator && shouldResetDisplay) {
        currentOperator = operator;
        return;
    }

    // Si ya hay un primer número y un operador, calcular el resultado intermedio
    // Esto resuelve el caso 12 + 7 - 1 = 18
    if (firstNumber !== "" && currentOperator !== null) {
        secondNumber = inputValue;
        const result = operate(currentOperator, firstNumber, secondNumber);
        
        if (typeof result === "string") { // Manejar error de división por cero
            updateDisplay(result);
            resetCalculator();
            return;
        }
        
        firstNumber = result;
        updateDisplay(result);
    } else {
        firstNumber = inputValue;
    }

    currentOperator = operator;
    shouldResetDisplay = true;
}

// 7. Manejar el botón igual
function handleEquals() {
    // Gotcha: No hacer nada si faltan datos
    if (firstNumber === "" || currentOperator === null || shouldResetDisplay) return;

    secondNumber = parseFloat(display.textContent);
    const result = operate(currentOperator, firstNumber, secondNumber);

    if (typeof result === "string") {
        updateDisplay(result);
        resetCalculator();
        return;
    }

    updateDisplay(result);
    // Preparar para una nueva operación
    firstNumber = result;
    currentOperator = null;
    shouldResetDisplay = true;
}

// 8. Limpiar calculadora
function resetCalculator() {
    firstNumber = "";
    secondNumber = "";
    currentOperator = null;
    shouldResetDisplay = true;
    updateDisplay("0");
}

// 9. Borrar un solo dígito (Crédito Extra)
function handleBackspace() {
    if (shouldResetDisplay) return;
    let currentText = display.textContent;
    if (currentText.length === 1 || currentText === "ERROR: No puedes dividir entre 0 😠") {
        display.textContent = "0";
    } else {
        display.textContent = currentText.slice(0, -1);
    }
}

// --- EVENT LISTENERS ---

// Botones numéricos
numbers.forEach(btn => {
    btn.addEventListener('click', () => inputNumber(btn.textContent));
});

// Botones de operadores
operators.forEach(btn => {
    btn.addEventListener('click', () => {
        let opSymbol;
        if (btn.id === 'add') opSymbol = '+';
        if (btn.id === 'subtract') opSymbol = '-';
        if (btn.id === 'multiply') opSymbol = '*';
        if (btn.id === 'divide') opSymbol = '/';
        handleOperator(opSymbol);
    });
});

// Otros botones
equalsBtn.addEventListener('click', handleEquals);
clearBtn.addEventListener('click', resetCalculator);
decimalBtn.addEventListener('click', inputDecimal);
backspaceBtn.addEventListener('click', handleBackspace);

// --- SOPORTE DE TECLADO (Crédito Extra) ---
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) inputNumber(e.key);
    if (e.key === '.') inputDecimal();
    if (e.key === '=' || e.key === 'Enter') handleEquals();
    if (e.key === 'Backspace') handleBackspace();
    if (e.key === 'Escape') resetCalculator();
    
    if (e.key === '+') handleOperator('+');
    if (e.key === '-') handleOperator('-');
    if (e.key === '*') handleOperator('*');
    if (e.key === '/') handleOperator('/');
});