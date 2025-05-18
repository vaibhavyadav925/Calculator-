document.addEventListener('DOMContentLoaded', () => {
    const result = document.getElementById('result');
    const history = document.getElementById('history');
    const buttons = document.querySelectorAll('.btn');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let shouldResetScreen = false;
    
    // Add button press animation
    buttons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.classList.add('btn-active');
        });
        
        button.addEventListener('mouseup', () => {
            button.classList.remove('btn-active');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('btn-active');
        });
    });
    
    // Add click event for all buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Number buttons
            if (button.classList.contains('number')) {
                inputNumber(button.dataset.num);
                updateDisplay();
            }
            
            // Operator buttons
            if (button.classList.contains('operator')) {
                const action = button.dataset.action;
                
                if (action === 'clear') {
                    clearAll();
                    updateDisplay();
                }
                
                if (action === 'delete') {
                    deleteNumber();
                    updateDisplay();
                }
                
                if (action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide') {
                    handleOperator(action);
                    updateDisplay();
                }
                
                if (action === 'percent') {
                    handlePercent();
                    updateDisplay();
                }
                
                if (action === 'sqrt') {
                    handleSquareRoot();
                    updateDisplay();
                }
            }
            
            // Equals button
            if (button.classList.contains('equals')) {
                calculate();
                updateDisplay();
            }
        });
    });
    
    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9' || event.key === '.') {
            inputNumber(event.key);
            updateDisplay();
        }
        
        if (event.key === '+') {
            handleOperator('add');
            updateDisplay();
        }
        
        if (event.key === '-') {
            handleOperator('subtract');
            updateDisplay();
        }
        
        if (event.key === '*') {
            handleOperator('multiply');
            updateDisplay();
        }
        
        if (event.key === '/') {
            event.preventDefault();
            handleOperator('divide');
            updateDisplay();
        }
        
        if (event.key === '%') {
            handlePercent();
            updateDisplay();
        }
        
        if (event.key === 'Enter' || event.key === '=') {
            calculate();
            updateDisplay();
        }
        
        if (event.key === 'Backspace') {
            deleteNumber();
            updateDisplay();
        }
        
        if (event.key === 'Escape') {
            clearAll();
            updateDisplay();
        }
    });
    
    function inputNumber(number) {
        if (shouldResetScreen) {
            currentInput = '';
            shouldResetScreen = false;
        }
        
        // Handle decimal point
        if (number === '.' && currentInput.includes('.')) return;
        
        // Replace initial 0 unless it's a decimal point
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }
    
    function handleOperator(op) {
        if (operation !== null) calculate();
        
        previousInput = currentInput;
        operation = op;
        shouldResetScreen = true;
        
        // Update history display
        const operatorSymbol = getOperatorSymbol(op);
        history.textContent = `${previousInput} ${operatorSymbol}`;
    }
    
    function calculate() {
        if (operation === null || shouldResetScreen) return;
        
        let computation;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("Cannot divide by zero");
                    clearAll();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Update history display
        const operatorSymbol = getOperatorSymbol(operation);
        history.textContent = `${previousInput} ${operatorSymbol} ${currentInput} =`;
        
        // Format the result
        currentInput = formatResult(computation);
        operation = null;
    }
    
    function handlePercent() {
        currentInput = (parseFloat(currentInput) / 100).toString();
    }
    
    function handleSquareRoot() {
        const num = parseFloat(currentInput);
        if (num < 0) {
            alert("Cannot calculate square root of a negative number");
            return;
        }
        currentInput = formatResult(Math.sqrt(num));
        history.textContent = `√(${num})`;
    }
    
    function deleteNumber() {
        if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
            currentInput = '0';
        } else {
            currentInput = currentInput.slice(0, -1);
        }
    }
    
    function clearAll() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        history.textContent = '';
    }
    
    function updateDisplay() {
        // Format large numbers with commas
        result.textContent = formatDisplayNumber(currentInput);
        
        // Adjust font size for long numbers
        if (result.textContent.length > 10) {
            result.style.fontSize = '32px';
        } else if (result.textContent.length > 8) {
            result.style.fontSize = '36px';
        } else {
            result.style.fontSize = '42px';
        }
    }
    
    function formatResult(number) {
        // Handle potential floating point issues
        return Math.round(number * 1000000) / 1000000;
    }
    
    function formatDisplayNumber(number) {
        const stringNumber = number.toString();
        
        // If it's a decimal number
        if (stringNumber.includes('.')) {
            const parts = stringNumber.split('.');
            const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return `${integerPart}.${parts[1]}`;
        }
        
        // If it's an integer
        return stringNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    function getOperatorSymbol(op) {
        switch (op) {
            case 'add': return '+';
            case 'subtract': return '−';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }
});
