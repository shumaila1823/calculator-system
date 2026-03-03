let display = document.getElementById('display');
let historyList = document.getElementById('history');
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;
let history = [];

// Append number to display
function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

// Append operator
function appendOperator(op) {
    if (currentInput === '') return;
    
    if (operator !== null && currentInput !== '') {
        calculate();
    }
    
    previousInput = currentInput;
    operator = op;
    currentInput = '';
    shouldResetDisplay = true;
}

// Calculate result
function calculate() {
    if (operator === null || currentInput === '' || previousInput === '') return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch(operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('❌ Error! Division by zero.');
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        case '^':
            result = Math.pow(prev, current);
            break;
        default:
            return;
    }
    
    addToHistory(`${prev} ${getOperatorSymbol(operator)} ${current} = ${result.toFixed(6)}`);
    currentInput = result.toString();
    operator = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

// Get operator symbol for display
function getOperatorSymbol(op) {
    const symbols = {'+': '+', '-': '−', '*': '×', '/': '÷', '%': 'mod', '^': '^'};
    return symbols[op] || op;
}

// Scientific operations
function scientificOp(op) {
    let result;
    const num = parseFloat(currentInput);
    
    if (isNaN(num) && op !== 'pi' && op !== 'e') {
        alert('Please enter a valid number first');
        return;
    }
    
    switch(op) {
        case 'sqrt':
            if (num < 0) {
                alert('❌ Error! Square root of negative number.');
                return;
            }
            result = Math.sqrt(num);
            addToHistory(`√${num} = ${result.toFixed(6)}`);
            break;
        case 'pow':
            const exponent = prompt('Enter exponent:');
            if (exponent === null) return;
            result = Math.pow(num, parseFloat(exponent));
            addToHistory(`${num}^${exponent} = ${result.toFixed(6)}`);
            break;
        case 'mod':
            const modValue = prompt('Enter modulus value:');
            if (modValue === null) return;
            result = num % parseFloat(modValue);
            addToHistory(`${num} mod ${modValue} = ${result.toFixed(6)}`);
            break;
        case 'log':
            if (num <= 0) {
                alert('❌ Error! Logarithm undefined for zero or negative numbers.');
                return;
            }
            result = Math.log10(num);
            addToHistory(`log₁₀(${num}) = ${result.toFixed(6)}`);
            break;
        case 'sin':
            result = Math.sin(num * Math.PI / 180);
            addToHistory(`sin(${num}°) = ${result.toFixed(6)}`);
            break;
        case 'cos':
            result = Math.cos(num * Math.PI / 180);
            addToHistory(`cos(${num}°) = ${result.toFixed(6)}`);
            break;
        case 'tan':
            result = Math.tan(num * Math.PI / 180);
            addToHistory(`tan(${num}°) = ${result.toFixed(6)}`);
            break;
        case 'fact':
            if (num < 0 || !Number.isInteger(num)) {
                alert('❌ Error! Factorial is only defined for non-negative integers.');
                return;
            }
            result = factorial(num);
            addToHistory(`${num}! = ${result}`);
            break;
        case 'pi':
            currentInput = Math.PI.toString();
            addToHistory(`π = ${Math.PI.toFixed(6)}`);
            updateDisplay();
            return;
        case 'e':
            currentInput = Math.E.toString();
            addToHistory(`e = ${Math.E.toFixed(6)}`);
            updateDisplay();
            return;
        case '1/x':
            if (num === 0) {
                alert('❌ Error! Cannot divide by zero.');
                return;
            }
            result = 1 / num;
            addToHistory(`1/${num} = ${result.toFixed(6)}`);
            break;
    }
    
    if (result !== undefined) {
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// Calculate factorial
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Toggle positive/negative
function toggleSign() {
    if (currentInput === '') return;
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
}

// Delete last character
function deleteLast() {
    currentInput = currentInput.toString().slice(0, -1);
    updateDisplay();
}

// Clear display
function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Update display
function updateDisplay() {
    display.value = currentInput || '0';
}

// Add to history
function addToHistory(item) {
    history.unshift(item);
    if (history.length > 10) {
        history.pop();
    }
    renderHistory();
}

// Render history
function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = item;
        historyList.appendChild(historyItem);
    });
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        e.preventDefault();
        appendOperator(e.key);
    }
    if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
    }
    if (e.key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    }
    if (e.key === 'Escape') {
        e.preventDefault();
        clearDisplay();
    }
});

// Initialize display
updateDisplay();