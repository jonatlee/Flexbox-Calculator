var expression = "";
var operands = ['+', '-', '*', '/', '^'];
var currNum = "";
var lastOperator = "";
var evaluated = false;

const SCINOMIN = 1000000;

//Functions on operands
isOperand = (char) => {
    for (var i = 0; i < operands.length; i++) {
        if (char === operands[i]) {
            return true;
        }
    }
    return false;
}

//Functions on limiting number of decimals and digits displayed
numDecimals = () => {
    var decimals = 0;
    for (var i = 0; i < currNum.length; i++) {
        if (currNum.charAt(i) === '.') {
            decimals += 1;
        }
    }
    return decimals;
}

//Truncate values over 10 digits into scientific notation
truncateScientificNotation = (str) => {
    if (str.length >= 10) {
        var decimal = str.slice(0, 5);
        var exponent = str.indexOf("e");
        var exponentStr = str.slice(exponent);
        return decimal + exponentStr;
    } else {
        return exponentialStr;
    }
}

//Cut off length of decimal expression to 10
truncateDecimal = (str) => {
    return str.slice(0, 9);
}

//Logic functions
checkWrapNegative = () => {
    if (currNum !== "") {
        if (currNum.charAt(0) === "-") {
            currNum = "(" + currNum + ")";
        }
    }
}

setValue = (newValue) => {
    if (isOperand(newValue)) {
        checkWrapNegative();
        document.getElementById("display").textContent = newValue;
        lastOperator = newValue;
    } else {
        // Max number of (digits, decimals) = (10, 1)
        var decimalLimitReached = (numDecimals() === 1 && newValue === '.');
        if (!isOperand(lastOperator) && (currNum.length >= 10 || decimalLimitReached)) return;

        // Store currNum into expression when input is a number following an operator
        if (isOperand(lastOperator)) {
            if (evaluated) { 
                currNum = "";
                evaluated = false;
            }
            expression += currNum + lastOperator;
            currNum = "";
            lastOperator = "";
        }

        // Case where you punch in a different number after evaluating
        if (evaluated && newValue !== "flip") {
            evaluated = false;
            expression = "";
            currNum = "";    
        }

        // Takes into account the one non-operand case where we negate the currently displayed number
        if (newValue === "flip") {
            currNum = (Number(currNum) * (-1)).toString();
            if (evaluated) {
                expression = currNum;
            }
        } else {
            if (currNum == "0" && newValue == 0) {
                return;
            } else if (currNum == "0" && newValue != ".") {
                currNum = newValue;
            } else {
                currNum += newValue;
            }
        }

        document.getElementById("display").textContent = currNum;
    }
}

simplifyExpression = (newVal) => {
    if (newVal.toString().length >= 10 && newVal > SCINOMIN) {
        var exponentialValue = newVal.toExponential();
        var exponentialStr = exponentialValue.toString();
        return truncateScientificNotation(exponentialStr);
    } else if (newVal.toString().length >= 10 && newVal < SCINOMIN) {
        return truncateDecimal(newVal.toString());
    } else {
        return newVal;
    }
}

evaluateExpression = () => {
    if (evaluated) { return; }

    checkWrapNegative();
    expression += currNum;   
    var evaluatedValue = "";

    if (expression.includes("/0")) {
        evaluatedValue = "Error: Div By Zero";    
    } else {
        var expressionEvaluated = eval(expression);
        evaluatedValue = simplifyExpression(expressionEvaluated);
    }

    document.getElementById("display").textContent = evaluatedValue;
    expression = evaluatedValue;
    currNum = evaluatedValue.toString();
    evaluated = true;
}

flipSign = () => {
    setValue("flip");
}

clearValue = () => {
    expression = "";
    currNum = "";
    evaluated = false;
    lastOperator = "";
    setValue("");
}