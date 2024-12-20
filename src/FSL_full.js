const splitters = {
    splitLogic(input) {
        const result = [];
        let buffer = '';
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let inBrackets = 0;
        let inBraces = 0;
        let inParens = 0;
        let escape = false;  // To track if we are escaping a character
    
        const logicalOperatorsRegex = /(\|\||&&)/;
    
        // Match logical operators
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
    
            // Handle escape sequences
            if (escape) {
                buffer += char;
                escape = false;
                continue;
            }
    
            // Check for escape character
            if (char === '\\') {
                escape = true;
                buffer += char;
                continue;
            }
    
            // Toggle flags for quotes (but skip if the quote is escaped)
            if (char === "'" && !inDoubleQuote && !escape) {
                inSingleQuote = !inSingleQuote;
            } else if (char === '"' && !inSingleQuote && !escape) {
                inDoubleQuote = !inDoubleQuote;
            }
    
            // Track brackets, braces, and parentheses nesting
            if (!inSingleQuote && !inDoubleQuote) {
                if (char === '[') {
                    inBrackets++;
                } else if (char === ']') {
                    inBrackets--;
                } else if (char === '{') {
                    inBraces++;
                } else if (char === '}') {
                    inBraces--;
                } else if (char === '(') {
                    inParens++;
                } else if (char === ')') {
                    inParens--;
                }
            }
    
            // Check if we're outside quotes, brackets, braces, and parentheses
            if (!inSingleQuote && !inDoubleQuote && inBrackets === 0 && inBraces === 0 && inParens === 0) {
                // Look ahead to see if we match a logical operator starting at this position
                const remainingInput = input.slice(i);
                const operatorMatch = remainingInput.match(logicalOperatorsRegex);
    
                // If a logical operator is found at the beginning of the remaining input
                if (operatorMatch && operatorMatch.index === 0) {
                    // Push the current buffer content to the result (if there's anything in it)
                    if (buffer.trim()) {
                        result.push(buffer.trim());
                        buffer = '';
                        // Clear buffer
                    }
    
                    // Push the matched operator to the result
                    result.push(operatorMatch[0]);
    
                    // Move the index to the end of the matched operator
                    i += operatorMatch[0].length - 1;
                    // -1 because `i++` will happen at the end of the loop
                    continue;
                    // Move to the next iteration after processing the operator
                }
            }
    
            // Append the current character to the buffer if it's not part of an operator
            buffer += char;
        }
    
        // Push any remaining buffer content to the result
        if (buffer.trim()) {
            result.push(buffer.trim());
        }
    
        return result;
    },
    splitOperators(input) {
        const operators = ["+", "-", "*", "/"];
        const result = [];
        let buffer = '';
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let inBrackets = 0;
        let inBraces = 0;
        let inParens = 0;
        let escapeNext = false; // Flag for escaping characters
    
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
    
            if (escapeNext) {
                // If the previous character was an escape, we don't toggle the quote flag
                escapeNext = false;
                buffer += char;
                continue;
            }
    
            if (char === '\\') {
                // Set escape flag if we encounter a backslash
                escapeNext = true;
                buffer += char;
                continue;
            }
    
            if (char === "'" && !inDoubleQuote && !inBrackets && !inBraces && !inParens) {
                // Toggle single quote unless escaped
                if (!escapeNext) {
                    inSingleQuote = !inSingleQuote;
                }
                buffer += char;
            } else if (char === '"' && !inSingleQuote && !inBrackets && !inBraces && !inParens) {
                // Toggle double quote unless escaped
                if (!escapeNext) {
                    inDoubleQuote = !inDoubleQuote;
                }
                buffer += char;
            } else if (!inSingleQuote && !inDoubleQuote) {
                // Track brackets, braces, and parentheses nesting
                if (char === '[') {
                    inBrackets++;
                } else if (char === ']') {
                    inBrackets--;
                } else if (char === '{') {
                    inBraces++;
                } else if (char === '}') {
                    inBraces--;
                } else if (char === '(') {
                    inParens++;
                } else if (char === ')') {
                    inParens--;
                }
    
                // Split on operators only when not inside quotes, brackets, braces, or parentheses
                if (operators.includes(char) && inBrackets === 0 && inBraces === 0 && inParens === 0) {
                    if (char != "+" || (char == "+" && (input[i-1] != "+" && input[i+1] != "+"))) {
                        if (buffer.trim()) {
                            result.push(buffer.trim());
                        }
                        result.push(char); // Keep the operator as a separate element
                        buffer = '';
                    } else {
                        if (char == "+" && input[i+1] == "+") {
                            result.push(buffer.trim());
                            buffer = "";
                        }
                        buffer += char;
                        if (char == "+" && input[i-1] == "+") {
                            result.push(buffer.trim());
                            buffer = "";
                        }
                    }
                } else {
                    buffer += char;
                }
            } else {
                // Continue accumulating characters inside quotes or other structures
                buffer += char;
            }
        }
    
        // Push the last buffer if not empty
        if (buffer.trim()) {
            result.push(buffer.trim());
        }
    
        return result;
    },
    splitComparsion(input) {
        const operators = /(==|!=|~=|:=|>=|<=)/;
        const result = [];
        let buffer = '';
        let inSingleQuote = false;
        let inDoubleQuote = false;
        let inBrackets = 0;
        let inBraces = 0;
        let inParens = 0;
    
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            const nextChar = input[i + 1];
            const prevChar = input[i - 1];
    
            // Check for escaped quotes (preceded by a backslash)
            const isEscapedSingleQuote = prevChar === '\\' && char === "'";
            const isEscapedDoubleQuote = prevChar === '\\' && char === '"';
    
            // Toggle flags for quotes, but ignore escaped quotes
            if (char === "'" && !inDoubleQuote && !isEscapedSingleQuote && !inBrackets && !inBraces && !inParens) {
                inSingleQuote = !inSingleQuote;
            } else if (char === '"' && !inSingleQuote && !isEscapedDoubleQuote && !inBrackets && !inBraces && !inParens) {
                inDoubleQuote = !inDoubleQuote;
            }
    
            // Track brackets, braces, and parentheses nesting
            if (!inSingleQuote && !inDoubleQuote) {
                if (char === '[') {
                    inBrackets++;
                } else if (char === ']') {
                    inBrackets--;
                } else if (char === '{') {
                    inBraces++;
                } else if (char === '}') {
                    inBraces--;
                } else if (char === '(') {
                    inParens++;
                } else if (char === ')') {
                    inParens--;
                }
            }
    
            // Check for multi-character operators (==, !=, ~=, etc.)
            if (operators.test(char + nextChar) && !inSingleQuote && !inDoubleQuote && inBrackets === 0 && inBraces === 0 && inParens === 0) {
                if (buffer.trim()) {
                    result.push(buffer.trim());
                }
                result.push(char + nextChar);
                // Add the operator as a separate element
                buffer = '';
                i++;
                // Skip the next character as it's part of the operator
            } // Check for single-character operators (<, >)
            else if ([">", "<"].includes(char) && !inSingleQuote && !inDoubleQuote && inBrackets === 0 && inBraces === 0 && inParens === 0) {
                if (buffer.trim()) {
                    result.push(buffer.trim());
                }
                result.push(char);
                // Add the single-character operator
                buffer = '';
            } // Append the character to the buffer if it's not part of an operator
            else {
                buffer += char;
            }
        }
    
        // Push the last buffer if not empty
        if (buffer.trim()) {
            result.push(buffer.trim());
        }
        return result;
    },
    splitStatement(input) {
        const result = [];
        let currentPart = '';
        let braceCount = 0;
        let parenCount = 0;
        let insideQuotes = false;
        let quoteType = '';
        let i = 0;
    
        while (i < input.length) {
            const char = input[i];
            const prevChar = input[i - 1];
    
            // Handle escaped quotes (preceded by a backslash)
            const isEscapedQuote = prevChar === '\\';
    
            // Check for the start of a quote
            if ((char === '"' || char === "'") && !isEscapedQuote) {
                if (!insideQuotes) {
                    insideQuotes = true;
                    quoteType = char;
                    // Remember the type of quote
                } else if (char === quoteType) {
                    insideQuotes = false;
                    // Exit quotes only if the same type of quote is encountered
                }
            }
    
            // If we are outside quotes, handle braces and parentheses
            if (!insideQuotes) {
                if (char === '(') {
                    parenCount++;
                    currentPart += char;
                } else if (char === ')') {
                    parenCount--;
                    currentPart += char;
                } else if (char === '{') {
                    if (parenCount === 0 && braceCount === 0) {
                        if (currentPart.trim()) {
                            result.push(currentPart.trim());
                            currentPart = '';
                        }
                    }
                    currentPart += char;
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;
                    currentPart += char;
                    if (parenCount === 0 && braceCount === 0) {
                        if (currentPart.trim()) {
                            result.push(currentPart.trim());
                            currentPart = '';
                        }
                    }
                } else if (char === ';' && braceCount === 0 && parenCount === 0) {
                    result.push(currentPart.trim());
                    currentPart = '';
                } else {
                    currentPart += char;
                }
            } else {
                currentPart += char;
            }
    
            i++;
        }
    
        // Push any remaining part that wasn't processed
        if (currentPart.trim()) {
            result.push(currentPart.trim());
        }
    
        return result;
    },
    splitSegment(input) {
        let result = [];
        let current = "";
    
        let inSingleQuotes = false;
        let inDoubleQuotes = false;
    
        let bracketDepth = 0;
        let squareDepth = 0;
        let curlyDepth = 0;
    
        let i = -1;
        for (let char of input) {
            i++;
    
            // Handle escaped quotes
            const prevChar = i > 0 ? input[i - 1] : null;
            const isEscapedQuote = prevChar === '\\';
    
            // Toggle quotes unless the quote is escaped
            if (char === '"' && !inSingleQuotes && !isEscapedQuote) {
                inDoubleQuotes = !inDoubleQuotes;
            }
            if (char === "'" && !inDoubleQuotes && !isEscapedQuote) {
                inSingleQuotes = !inSingleQuotes;
            }
    
            let inAnyQuotes = inSingleQuotes || inDoubleQuotes;
    
            // Handle other characters when not inside quotes
            if (!inAnyQuotes) {
                switch (char) {
                    case "{":
                        curlyDepth++;
                        current += char;
                        break;
                    case "}":
                        curlyDepth--;
                        current += char;
                        if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0 && input[i + 1] !== "(") {
                            if (current) {
                                result.push(current.trim());
                                current = "";
                            }
                        }
                        break;
                    case "[":
                        squareDepth++;
                        current += char;
                        break;
                    case "]":
                        squareDepth--;
                        current += char;
                        break;
                    case "(":
                        bracketDepth++;
                        current += char;
                        break;
                    case ")":
                        bracketDepth--;
                        current += char;
                        break;
                    case ";":
                        if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
                            if (current) {
                                result.push(current.trim());
                                current = "";
                            }
                        } else {
                            current += char;
                        }
                        break;
                    default:
                        current += char;
                }
            } else {
                current += char;
            }
        }
    
        // Push any remaining part if necessary
        if (current) {
            result.push(current.trim());
        }
    
        return result;
    },
    splitAssignment(input) {
        let result = [];
        let current = "";
    
        let inSingleQuotes = false;
        let inDoubleQuotes = false;
    
        let notset = true;
    
        let bracketDepth = 0;
        let squareDepth = 0;
        let curlyDepth = 0;
    
        let ops = ["+", "-", "*", "/"];
        let opsae = ops.concat("=");
    
        let i = -1;
        for (let char of input) {
            i++;
    
            const prevChar = i > 0 ? input[i - 1] : null;
            const isEscapedQuote = prevChar === '\\';
    
            // Toggle quotes unless the quote is escaped
            if (char === '"' && !inSingleQuotes && !isEscapedQuote) {
                inDoubleQuotes = !inDoubleQuotes;
            }
            if (char === "'" && !inDoubleQuotes && !isEscapedQuote) {
                inSingleQuotes = !inSingleQuotes;
            }
    
            let inAnyQuotes = inSingleQuotes || inDoubleQuotes;
    
            // Process outside of quotes
            if (!inAnyQuotes) {
                switch (char) {
                    case "{":
                        curlyDepth++;
                        current += char;
                        break;
                    case "}":
                        curlyDepth--;
                        current += char;
                        if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
                            if (current) {
                                result.push(current.trim());
                                current = "";
                            }
                        }
                        break;
    
                    case "[":
                        squareDepth++;
                        current += char;
                        break;
                    case "]":
                        squareDepth--;
                        current += char;
                        break;
    
                    case "(":
                        bracketDepth++;
                        current += char;
                        break;
                    case ")":
                        bracketDepth--;
                        current += char;
                        break;
    
                    case "=":
                        if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0 && notset) {
                            // Assignment with operator (e.g., x+=2)
                            if (ops.includes(input[i - 1]) && notset && !(ops.includes(char))) {
                                current += char;
                                result.push(current.trim());
                                current = "";
                                notset = false;
                                continue;
                            }
                        }
                        if (bracketDepth === 0 && curlyDepth === 0 && squareDepth === 0 && notset && !(opsae.includes(input[i + 1])) && !(opsae.includes(input[i - 1]))) {
                            // If not inside any brackets/braces/square brackets and operator not set
                            if (!(ops.includes(input[i - 1]))) {
                                if (current.trim()) {
                                    result.push(current.trim());
                                }
                                result.push(char);
                                current = "";
                            } else {
                                current += char;
                                if (current) {
                                    result.push(current.trim());
                                }
                                current = "";
                            }
                            notset = false;
                        } else {
                            current += char;
                        }
                        break;
    
                    default:
                        // Handle operators or other characters
                        if (ops.includes(input[i + 1]) && opsae.includes(input[i + 2]) && notset) {
                            if (current.trim()) {
                                result.push(current.trim());
                            }
                            current = "";
                        }
                        current += char;
                }
            } else {
                current += char;
            }
        }
    
        if (current) {
            result.push(current.trim());
        }
    
        return result;
    },
    splitByFirstSpace(str) {
        // Trim leading and trailing spaces first (optional)
        str = str.trim();
    
        const firstSpaceIndex = str.indexOf(' ');
    
        // If there's no space, return the whole string as the first part
        if (firstSpaceIndex === -1) {
            return [str];
        }
    
        // Split into the first part and the rest of the string
        const firstPart = str.slice(0, firstSpaceIndex);
        const secondPart = str.slice(firstSpaceIndex + 1);
    
        return [firstPart, secondPart];
    },
    splitCharedCommand(str, chr) {
        const result = [];
        let buffer = '';
        let insideDoubleQuotes = false;
        let insideSingleQuotes = false;
        let parensDepth = 0;
        let curlyDepth = 0;
        let squareDepth = 0;
        let escaping = false;  // Track if we are escaping a character
    
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
    
            // Handle escape sequences (escape character is backslash \)
            if (escaping) {
                buffer += char;
                escaping = false;  // Reset escaping after the character is added
                continue;
            }
    
            // Check if the current character is an escape character
            if (char === '\\') {
                escaping = true;  // Mark that the next character should be treated as escaped
                buffer += char;
                continue;
            }
    
            // Handle quote states
            if (char === '"' && !insideSingleQuotes && parensDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
                insideDoubleQuotes = !insideDoubleQuotes;
                buffer += char;
                continue;
            }
            if (char === "'" && !insideDoubleQuotes && parensDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
                insideSingleQuotes = !insideSingleQuotes;
                buffer += char;
                continue;
            }
    
            // Handle brackets depth
            if (!insideDoubleQuotes && !insideSingleQuotes) {
                if (char === '(') {
                    parensDepth++;
                    buffer += char;
                    continue;
                }
                if (char === '{') {
                    curlyDepth++;
                    buffer += char;
                    continue;
                }
                if (char === '[') {
                    squareDepth++;
                    buffer += char;
                    continue;
                }
                if (char === ')' && parensDepth > 0) {
                    parensDepth--;
                    buffer += char;
                    continue;
                }
                if (char === '}' && curlyDepth > 0) {
                    curlyDepth--;
                    buffer += char;
                    continue;
                }
                if (char === ']' && squareDepth > 0) {
                    squareDepth--;
                    buffer += char;
                    continue;
                }
            }
    
            // Split by the specified character if not inside quotes or brackets
            if (char === chr && !insideDoubleQuotes && !insideSingleQuotes && parensDepth === 0 && curlyDepth === 0 && squareDepth === 0) {
                if (buffer.length > 0) {
                    result.push(buffer.trim());
                    buffer = '';
                }
            } else {
                buffer += char;
            }
        }
    
        // Push the final buffer if it contains any content
        if (buffer.length > 0) {
            result.push(buffer.trim());
        }
    
        return result;
    },
    splitCommand(input) {
        const result = [];
        let currentPart = '';
        let isInQuotes = false;
        let quoteChar = '';
        let depth = 0;        // Parentheses depth
        let cdepth = 0;       // Curly braces depth
        let sdepth = 0;       // Square brackets depth
        let escaping = false; // Flag for escaping characters
    
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
    
            // Handle escaping
            if (escaping) {
                currentPart += char; // Add the escaped character to the current part
                escaping = false;     // Reset escaping flag
                continue;
            }
    
            // Handle escape sequences (escape character is backslash)
            if (char === '\\') {
                escaping = true; // Next character should be treated as a literal
                currentPart += char; // Add the backslash to the current part
                continue;
            }
    
            // Handle quotes (either single ' or double ")
            if (isInQuotes) {
                currentPart += char;
                if (char === quoteChar) {
                    isInQuotes = false; // End of quoted part
                }
            } else if (char === '"' || char === "'") {
                isInQuotes = true;
                quoteChar = char; // Track which type of quote we are inside
                currentPart += char;
            } // Handle opening brackets (parentheses, curly braces, square brackets)
            else if (char === '(') {
                if (depth === 0 && cdepth === 0 && sdepth === 0) {
                    if (currentPart !== "") {
                        result.push(currentPart.trim());
                    }
                    currentPart = "(";
                } else {
                    currentPart += "(";
                }
                depth++;
            } else if (char === ')') {
                depth--;
                if (depth === 0 && cdepth === 0 && sdepth === 0) {
                    currentPart += ")";
                    if (currentPart !== "") {
                        result.push(currentPart.trim());
                    }
                    currentPart = "";
                } else {
                    currentPart += ")";
                }
            } // Handle curly braces
            else if (char === '{') {
                cdepth++;
                currentPart += char;
            } else if (char === '}') {
                cdepth--;
                currentPart += char;
                if (depth === 0 && cdepth === 0 && sdepth === 0) {
                    if (currentPart !== "") {
                        result.push(currentPart.trim());
                    }
                    currentPart = "";
                }
            } // Handle square brackets
            else if (char === '[') {
                sdepth++;
                currentPart += char;
            } else if (char === ']') {
                sdepth--;
                currentPart += char;
                if (depth === 0 && cdepth === 0 && sdepth === 0) {
                    if (currentPart !== "") {
                        result.push(currentPart.trim());
                    }
                    currentPart = "";
                }
            } // Regular characters
            else {
                currentPart += char;
            }
        }
    
        if (currentPart !== "") {
            result.push(currentPart.trim());
        }
    
        return result;
    },
    splitReferences(str) {
        const result = [];
        let buffer = '';
        let parensDepth = 0;
        let curlyDepth = 0;
        let squareDepth = 0;
        let isInQuotes = false;
        let quoteChar = "";
    
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
    
            if (isInQuotes) {
                buffer += char;
                if (char === quoteChar) {
                    isInQuotes = false; // End of quoted part
                }
                continue;
            } else if (char === '"' || char === "'") {
                isInQuotes = true;
                quoteChar = char;
                buffer += char;
                continue;
            }
    
            // Handle bracket depths
            if (char === '(') parensDepth++;
            if (char === '{') curlyDepth++;
            if (char === '[') squareDepth++;
    
            if (char === ')') parensDepth--;
            if (char === '}') curlyDepth--;
            if (char === ']') squareDepth--;
    
            // Handle opening square brackets (start a new reference)
            if (char === '[' && squareDepth === 1) {
                // If outside parentheses or curly braces, push the current buffer
                if (parensDepth === 0 && curlyDepth === 0 && buffer !== '') {
                    result.push(buffer.trim());
                    buffer = '';
                }
    
                // Start a new bracketed section
                buffer += char;
                continue;
            }
    
            // Handle closing square brackets
            if (char === ']' && squareDepth === 0) {
                buffer += char; // Add closing bracket
                // If we've closed all the depth of that type, push the buffer
                if (parensDepth === 0 && curlyDepth === 0) {
                    result.push(buffer.trim());
                    buffer = '';
                }
                continue;
            }
    
            // If we're inside a reference section (square brackets), keep accumulating the characters
            if (squareDepth > 0) {
                buffer += char;
                continue;
            }
    
            // Regular characters outside of any quotes or brackets
            buffer += char;
        }
    
        // Push any remaining buffer
        if (buffer.length > 0) {
            result.push(buffer.trim());
        }
    
        return result;
    },
    splitCommandParams(input) {
        const result = [];
        let currentSegment = '';
        let inDoubleQuotes = false;
        let inSingleQuotes = false;
        let inCurlyBraces = 0;
        let inSquareBrackets = 0;
        let inParentheses = 0;
    
        // Helper function to check if we are inside any delimiter
        function isInAnyDelimiter() {
            return inDoubleQuotes || inSingleQuotes || inCurlyBraces > 0 || inSquareBrackets > 0 || inParentheses > 0;
        }
    
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
    
            // Handle escape characters inside quotes or other delimiters
            if ((inDoubleQuotes || inSingleQuotes) && char === '\\' && i + 1 < input.length) {
                // If the next character exists, add the escape sequence
                currentSegment += char + input[i + 1];
                i++; // Skip the escaped character
                continue;
            }
    
            // Handle opening and closing of delimiters
            if (char === '"' && !inSingleQuotes) {
                inDoubleQuotes = !inDoubleQuotes;
                currentSegment += char;
            } else if (char === "'" && !inDoubleQuotes) {
                inSingleQuotes = !inSingleQuotes;
                currentSegment += char;
            } else if (char === '{' && !inDoubleQuotes && !inSingleQuotes) {
                inCurlyBraces++;
                currentSegment += char;
            } else if (char === '}' && !inDoubleQuotes && !inSingleQuotes) {
                inCurlyBraces--;
                currentSegment += char;
            } else if (char === '[' && !inDoubleQuotes && !inSingleQuotes) {
                inSquareBrackets++;
                currentSegment += char;
            } else if (char === ']' && !inDoubleQuotes && !inSingleQuotes) {
                inSquareBrackets--;
                currentSegment += char;
            } else if (char === '(' && !inDoubleQuotes && !inSingleQuotes) {
                inParentheses++;
                currentSegment += char;
            } else if (char === ')' && !inDoubleQuotes && !inSingleQuotes) {
                inParentheses--;
                currentSegment += char;
            } else if (char === ',' && !isInAnyDelimiter()) {
                // Split by comma if outside any quotes or brackets
                result.push(currentSegment.trim());
                currentSegment = '';
            } else {
                currentSegment += char;
            }
        }
    
        // Push the last segment if it exists
        if (currentSegment) {
            result.push(currentSegment.trim());
        }
    
        return result;
    }
};


utils = {
    fsl_log(text, name) {
        if (!name) { name = "fsl" }
        console.log("[" + name + "]" + " " + "[log]" + " " + text);
    },
    fsl_warn(text, name) {
        if (!name) { name = "fsl" }
        console.warn("[" + name + "]" + " " + "[warning]" + " " + text);
    },
    fsl_error(text, name) {
        if (!name) { name = "fsl" }
        console.error("[" + name + "]" + " " + "[error]" + " " + text);
        process.exit(1);
    },
    MD5(r){function n(r,n){var t,o,e,u,f;return e=2147483648&r,u=2147483648&n,f=(1073741823&r)+(1073741823&n),(t=1073741824&r)&(o=1073741824&n)?2147483648^f^e^u:t|o?1073741824&f?3221225472^f^e^u:1073741824^f^e^u:f^e^u}function t(r,t,o,e,u,f,a){return r=n(r,n(n(t&o|~t&e,u),a)),n(r<<f|r>>>32-f,t)}function o(r,t,o,e,u,f,a){return r=n(r,n(n(t&e|o&~e,u),a)),n(r<<f|r>>>32-f,t)}function e(r,t,o,e,u,f,a){return r=n(r,n(n(t^o^e,u),a)),n(r<<f|r>>>32-f,t)}function u(r,t,o,e,u,f,a){return r=n(r,n(n(o^(t|~e),u),a)),n(r<<f|r>>>32-f,t)}function f(r){var n,t="",o="";for(n=0;3>=n;n++)t+=(o="0"+(o=r>>>8*n&255).toString(16)).substr(o.length-2,2);return t}var a,i,C,c,g,h,d,v,S;for(r=function(r){r=r.replace(/\r\n/g,"\n");for(var n="",t=0;t<r.length;t++){var o=r.charCodeAt(t);128>o?n+=String.fromCharCode(o):(127<o&&2048>o?n+=String.fromCharCode(o>>6|192):(n+=String.fromCharCode(o>>12|224),n+=String.fromCharCode(o>>6&63|128)),n+=String.fromCharCode(63&o|128))}return n}(r),a=function(r){for(var n,t=r.length,o=16*(((n=t+8)-n%64)/64+1),e=Array(o-1),u=0,f=0;f<t;)u=f%4*8,e[n=(f-f%4)/4]|=r.charCodeAt(f)<<u,f++;return e[n=(f-f%4)/4]|=128<<f%4*8,e[o-2]=t<<3,e[o-1]=t>>>29,e}(r),h=1732584193,d=4023233417,v=2562383102,S=271733878,r=0;r<a.length;r+=16)i=h,C=d,c=v,g=S,h=t(h,d,v,S,a[r+0],7,3614090360),S=t(S,h,d,v,a[r+1],12,3905402710),v=t(v,S,h,d,a[r+2],17,606105819),d=t(d,v,S,h,a[r+3],22,3250441966),h=t(h,d,v,S,a[r+4],7,4118548399),S=t(S,h,d,v,a[r+5],12,1200080426),v=t(v,S,h,d,a[r+6],17,2821735955),d=t(d,v,S,h,a[r+7],22,4249261313),h=t(h,d,v,S,a[r+8],7,1770035416),S=t(S,h,d,v,a[r+9],12,2336552879),v=t(v,S,h,d,a[r+10],17,4294925233),d=t(d,v,S,h,a[r+11],22,2304563134),h=t(h,d,v,S,a[r+12],7,1804603682),S=t(S,h,d,v,a[r+13],12,4254626195),v=t(v,S,h,d,a[r+14],17,2792965006),h=o(h,d=t(d,v,S,h,a[r+15],22,1236535329),v,S,a[r+1],5,4129170786),S=o(S,h,d,v,a[r+6],9,3225465664),v=o(v,S,h,d,a[r+11],14,643717713),d=o(d,v,S,h,a[r+0],20,3921069994),h=o(h,d,v,S,a[r+5],5,3593408605),S=o(S,h,d,v,a[r+10],9,38016083),v=o(v,S,h,d,a[r+15],14,3634488961),d=o(d,v,S,h,a[r+4],20,3889429448),h=o(h,d,v,S,a[r+9],5,568446438),S=o(S,h,d,v,a[r+14],9,3275163606),v=o(v,S,h,d,a[r+3],14,4107603335),d=o(d,v,S,h,a[r+8],20,1163531501),h=o(h,d,v,S,a[r+13],5,2850285829),S=o(S,h,d,v,a[r+2],9,4243563512),v=o(v,S,h,d,a[r+7],14,1735328473),h=e(h,d=o(d,v,S,h,a[r+12],20,2368359562),v,S,a[r+5],4,4294588738),S=e(S,h,d,v,a[r+8],11,2272392833),v=e(v,S,h,d,a[r+11],16,1839030562),d=e(d,v,S,h,a[r+14],23,4259657740),h=e(h,d,v,S,a[r+1],4,2763975236),S=e(S,h,d,v,a[r+4],11,1272893353),v=e(v,S,h,d,a[r+7],16,4139469664),d=e(d,v,S,h,a[r+10],23,3200236656),h=e(h,d,v,S,a[r+13],4,681279174),S=e(S,h,d,v,a[r+0],11,3936430074),v=e(v,S,h,d,a[r+3],16,3572445317),d=e(d,v,S,h,a[r+6],23,76029189),h=e(h,d,v,S,a[r+9],4,3654602809),S=e(S,h,d,v,a[r+12],11,3873151461),v=e(v,S,h,d,a[r+15],16,530742520),h=u(h,d=e(d,v,S,h,a[r+2],23,3299628645),v,S,a[r+0],6,4096336452),S=u(S,h,d,v,a[r+7],10,1126891415),v=u(v,S,h,d,a[r+14],15,2878612391),d=u(d,v,S,h,a[r+5],21,4237533241),h=u(h,d,v,S,a[r+12],6,1700485571),S=u(S,h,d,v,a[r+3],10,2399980690),v=u(v,S,h,d,a[r+10],15,4293915773),d=u(d,v,S,h,a[r+1],21,2240044497),h=u(h,d,v,S,a[r+8],6,1873313359),S=u(S,h,d,v,a[r+15],10,4264355552),v=u(v,S,h,d,a[r+6],15,2734768916),d=u(d,v,S,h,a[r+13],21,1309151649),h=u(h,d,v,S,a[r+4],6,4149444226),S=u(S,h,d,v,a[r+11],10,3174756917),v=u(v,S,h,d,a[r+2],15,718787259),d=u(d,v,S,h,a[r+9],21,3951481745),h=n(h,i),d=n(d,C),v=n(v,c),S=n(S,g);return(f(h)+f(d)+f(v)+f(S)).toLowerCase()},
    randomStr(length = 10) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },
    Object_merge(e,t){if("object"!=typeof e||"object"!=typeof t)return t;{let o=Object_clone(e);for(let r in t)t.hasOwnProperty(r)&&("object"==typeof t[r]?o[r]=Object_merge(e[r],t[r]):o[r]=t[r]);return o}},
    Object_clone(e){if(null===e)return null;if("object"==typeof e){if(Array.isArray(e))return e.map((e=>Object_clone(e)));if(e instanceof RegExp)return new RegExp(e);{let n={};for(let r in e)e.hasOwnProperty(r)&&(n[r]=Object_clone(e[r]));return n}}return e},
    Object_isSame(e,t){if("object"!=typeof e||"object"!=typeof t)return!1;{if(e===t)return!0;let r=Object.keys(e),f=Object.keys(t);if(r.length!==f.length)return!1;for(let n of f){if(!r.includes(n))return!1;let i=typeof e[n],o=typeof t[n];if(i!==o)return!1;if("object"===i&&"object"===o){if(!Object_isSame(e[n],t[n]))return!1}else if(e[n]!==t[n])return!1}return!0}},
}

function removeStr(input) {
    let temp = input.replace(/\\\\n/g, '\uE000');
    temp = temp.replace(/\\n/g, '\n');
    let result = temp.replace(/\uE000/g, '\\n');
    return result.slice(1, -1);
}
function removeCurlyBrackets(input) { return input.replace(/^\{|\}$/g, '').trim(); }
function removeSquareBrackets(input) { return input.replace(/^\[|\]$/g, '').trim(); }
function removeBrackets(input) { return input.replace(/^\(|\)$/g, '').trim(); }
function removeComments(code) { return code.replace(/(["'])(?:(?=(\\?))\2.)*?\1|\/\/.*|\/\*[\s\S]*?\*\//g, (match, quote) => (quote ? match : "")); }

function isCurlyBrackets(input) { if (typeof input != "string") { return false } return input[0] == "{" && input[input.length - 1] == "}"; }
function isSquareBrackets(input) { if (typeof input != "string") { return false } return input[0] == "[" && input[input.length - 1] == "]"; }
function isBrackets(input) { if (typeof input != "string") { return false } return input[0] == "(" && input[input.length - 1] == ")"; }
const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string);
function isValidVariableFormat(str) { const regex = /^[A-Za-z0-9_@#]+$/; return regex.test(str); }
function isValidFunctionFormat(str) { const regex = /^[A-Za-z0-9_.@#]+$/; return regex.test(str); }
function isValidDefinitionFormat(str) { const regex = /^[A-Za-z0-9_.@# ]+$/; return regex.test(str); }
function isValidAssignFormat(str) { const regex = /^[A-Za-z0-9_.@#\[\]\" ]+$/; return regex.test(str); }

const spacedCommandsHighPriority = [
    "return"
]

function generateAst(content) {
    return generateAstSegment(content);
}
function generateAstSegment(content) {
    var out = { "content": [] };

    const segmentTokens = splitters.splitSegment(content);
    for (let i = 0; i < segmentTokens.length; i++) {
        const segmentToken = segmentTokens[i];
        const data = generateAstNode(removeComments(segmentToken));
        if (!data) { continue }
        switch (data["type"]) {
            case "function":
                if (!Object.keys(out).includes("functions")) {
                    out["functions"] = {}
                }
                delete data["type"]
                out["functions"][data["hash"]] = data;
                break
            default:
                out["content"].push(data);
        }
    }

    return out;
}
function generateAstNode(content) {
    const commandTokens = splitters.splitCommand(content);
    const spacedTokens = splitters.splitCharedCommand(content, " ");
    const logicTokens = splitters.splitLogic(content);
    const comparisonTokens = splitters.splitComparsion(content);
    const operatorTokens = splitters.splitOperators(content);
    const methodTokens = splitters.splitCharedCommand(content, ".");
    const assignmentTokens = splitters.splitAssignment(content);

    if (!content) { return null }

    if (spacedTokens.length > 1) {
        if (spacedCommandsHighPriority.includes(spacedTokens[0])) {
            return {
                "type": "spaced command",
                "name": spacedTokens.shift(),
                "data": generateAstNode(spacedTokens.join(" "))
            }
        }
    }

    if (assignmentTokens.length == 3) {
        const assignmentType = {
            "=": "set",
            "+=": "inc_by",
            "-=": "dec_by",
            "++": "inc",
            "--": "dec",
        }[assignmentTokens[1]]
        if (assignmentType) {
            return {
                "type": "assignment",
                "key": generateAstPath(assignmentTokens[0]),
                "assignment": assignmentType,
                "value": generateAstNode(assignmentTokens[2])
            }
        }
    }

    // functions
    if (commandTokens.length == 3) {
        const temp = splitters.splitCharedCommand(commandTokens[0], " ");
        if (
            !isBrackets(commandTokens[0]) &&
            isBrackets(commandTokens[1]) &&
            isCurlyBrackets(commandTokens[2]) &&
            (
                temp[0] == "fn" &&
                isValidVariableFormat(temp[1])
            )
        ) {
            // TODO: do args
            return {
                "type": "function",
                "key": temp[1],
                "args": splitters.splitCommandParams(removeBrackets(commandTokens[1])).map(item => {
                    const tokens = splitters.splitCharedCommand(item, " ");
                    if (tokens.length == 1 && isValidVariableFormat(tokens[0])) {
                        return { "name": tokens[0], "type": "any" };
                    }
                    const startAssignmentTokens = splitters.splitAssignment(item);
                    if (startAssignmentTokens.length == 3 && isValidVariableFormat(startAssignmentTokens[0]) && startAssignmentTokens[1] == "=") {
                        return { "name": startAssignmentTokens[0], "type": "any", "default": generateAstNode(startAssignmentTokens[2]) };
                    }

                    let type = tokens.shift();
                    if (isSquareBrackets(type)) {
                        type = splitters.splitCommandParams(removeSquareBrackets(type));
                    } else {
                        if (!isValidVariableFormat(type)) {
                            console.warn("unknown type " + type)
                            return null;
                        }
                    }

                    const other = tokens.join(" ");
                    if (tokens.length == 1 && isValidVariableFormat(tokens[0])) {
                        return { "name": tokens[0], "type": type };
                    }

                    const assignmentTokens = splitters.splitAssignment(other);
                    if (assignmentTokens.length == 3 && isValidVariableFormat(assignmentTokens[0]) && assignmentTokens[1] == "=") {
                        return { "name": assignmentTokens[0], "type": type, "default": generateAstNode(assignmentTokens[2]) };
                    }
                }),
                "content": generateAstSegment(
                    removeCurlyBrackets(commandTokens[2])
                ),
                "hash": utils.MD5(content)
            };
        }
    }

    if (commandTokens.length > 1) {
        const tokens = commandTokens;
        const latest = tokens.pop();
        if (isBrackets(latest) && isValidFunctionFormat(tokens.join(""))) {
            return {
                "type": "execution",
                "key": generateAstNode(tokens.join("")),
                "args": generateAstParams(
                    removeBrackets(latest)
                )
            };
        }
    }

    if (logicTokens.length > 1) {
        const operators = {
            "||": "or",
            "&&": "and"
        }
        if (Object.keys(operators).includes(logicTokens[logicTokens.length - 2])) {
            return {
                "type": "logic",
                "b": generateAstNode(logicTokens.pop()),
                "operator": operators[logicTokens.pop()],
                "a": generateAstNode(logicTokens.join(" "))
            }
        }
    }

    if (comparisonTokens.length == 3) {
        const comparisons = {
            "==": "equal",
            "!=": "not_equal",
            "~=": "string_equal",
            ":=": "type_equal",
            ">": "greater",
            "<": "smaller",
            ">=": "greater_equal",
            "<=": "smaller_equal"
        }
        if (Object.keys(comparisons).includes(comparisonTokens[1])) {
            return {
                "type": "comparison",
                "comparison": comparisons[comparisonTokens[1]],
                "a": generateAstNode(comparisonTokens[0]),
                "b": generateAstNode(comparisonTokens[2])
            }
        }
    }

    if (operatorTokens.length > 1) {
        const b = generateAstNode(operatorTokens.pop());
        const op = operatorTokens.pop();
        const a = generateAstNode(operatorTokens.join(" "));
        return {
            "type": "operator",
            "operator": op,
            "a": a,
            "b": b
        };
    }

    if (spacedTokens.length > 1) {
        if (isValidVariableFormat(spacedTokens[0])) {
            return {
                "type": "spaced command",
                "name": spacedTokens.shift(),
                "data": generateAstNode(spacedTokens.join(" "))
            }
        }
    }

    if (isNumeric(content)) {
        return {
            "type": "literal",
            "data": [Number(content), "number"]
        }
    }

    if (methodTokens.length > 1) {
        const methodCommandTokens = splitters.splitCommand(methodTokens.pop());
        if (
            methodCommandTokens.length == 2 &&
            (!isBrackets(methodCommandTokens[0]) && !isSquareBrackets(methodCommandTokens[0]) && !isCurlyBrackets(methodCommandTokens[0])) &&
            (isBrackets(methodCommandTokens[1]) && !isSquareBrackets(methodCommandTokens[1]) && !isCurlyBrackets(methodCommandTokens[1]))
        ) {
            return {
                "type": "method",
                "key": methodCommandTokens[0],
                "args": generateAstParams(removeBrackets(methodCommandTokens[1])),
                "value": generateAstNode(methodTokens.join("."))
            }
        }
    }

    if ((content[0] == '"' && content[content.length - 1] == '"') || (content[0] == "'" && content[content.length - 1] == "'")) {
        return {
            "type": "literal",
            "data": [removeStr(content), "string"]
        };
    }

    const constants = {
        "true": [true, "bool"],
        "false": [false, "bool"],
    }

    if (Object.keys(constants).includes(content)) {
        return { "type": "literal", "data": constants[content] };
    }

    if (isValidVariableFormat(content)) {
        return {
            "type": "reference",
            "key": content
        };
    }

    if (isBrackets(content)) {
        return generateAstNode(removeBrackets(content));
    }

    utils.fsl_error("unknown node '" + content + "'")
    return {
        "type": "empty"
    };
}
function generateAstParams(content) {
    let data = [];
    const tokens = splitters.splitCommandParams(content);
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        data.push(generateAstNode(token));
    }
    return data;
}
function generateAstPath(path) {
    let totalPath = [];
    let remainingPath = path;
    while (remainingPath) {
        const keyTokens = splitters.splitReferences(remainingPath);
        if (keyTokens.length > 1 && isSquareBrackets(keyTokens[keyTokens.length - 1])) {
            const key = generateAstNode(removeSquareBrackets(keyTokens.pop()));
            totalPath.push(key);
            remainingPath = keyTokens.join();
        } else {
            const methodTokens = splitters.splitCharedCommand(remainingPath, ".");
            if (methodTokens.length > 1) {
                totalPath.push({ "type": "literal", "data": [methodTokens.pop(), "string"] });
                remainingPath = methodTokens.join(".");
            } else {
                totalPath.push({ "type": "reference", "key": remainingPath });
                remainingPath = "";
            }
        }
    }
    console.log(totalPath.reverse())
    return totalPath.reverse();
}

let { randomStr, Object_merge, Object_isSame } = utils;

var scopes = {};
var functions = {};

var funcCacheKey = {};

function runAst(content, func = "main", args = [], start = false) {
    const scopeID = randomStr();
    if (start) {
        const out = runSegmentFunc(content, "", args, scopeID);
        if (out[1] != "null" && out[0] != "segmentNull") {
            return out;
        }
    }
    return runSegmentFunc(content, func, args, scopeID);
}
function runSegmentFunc(content, funcName, args = [], scopeID) {
    if (!Object.keys(scopes).includes(scopeID)) {
        // initialise the scope if missing
        let scope = getDefaultScope();
        // add functions as variables
        if (Object.keys(content).includes("functions")) {
            const keys = Object.keys(content["functions"]);
            const values = Object.values(content["functions"]);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const name = values[i]["key"];
                scope["variables"][name] = [{"type":"ref","data":key},"function"]
                functions[key] = values[i];
            }
        }
        scopes[scopeID] = scope;
    }
    // its not running in a function
    if (funcName == "" && Object.keys(content).includes("content")) {
        return runSegment(content["content"], scopeID);
    }
    // search for the function its trying to run
    if (Object.keys(content).includes("functions")) {
        const keys = Object.keys(content["functions"]);
        const values = Object.values(content["functions"]);
        let id = "";
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const func = values[i];
            if (funcMatches(func,funcName,args)) {
                id = key;
            }
        }
        if (id) {
            const func = content["functions"][id];

            // setup args
            let scope = scopes[scopeID];
            for (let i = 0; i < func["args"].length; i++) {
                const arg = func["args"][i];
                const passed_arg = args[i];
                if (passed_arg) {
                    scope["variables"][arg["name"]] = passed_arg;
                } else {
                    scope["variables"][arg["name"]] = runNode(arg["default"],scopeID);
                }
            }
            scopes[scopeID] = scope;

            return runSegment(func["content"]["content"], scopeID);
        }
    }
    return ["functionNull","null"];
}
function runSegment(content, scopeID) {
    for (let i = 0; i < content.length; i++) {
        const node = content[i];
        const out = runNode(node, scopeID);
        if (typeof out == "object" && !Array.isArray(out) && out) {
            return out["data"];
        }
    }
    return ["segmentNull","null"];
}
function runNodes(content, scopeID) {
    let out = [];
    for (let i = 0; i < content.length; i++) {
        out.push(runNode(content[i],scopeID));
    }
    return out;
}
function runNode(content, scopeID) {
    switch (content["type"]) {
        case "execution":
            return runExecution(runNode(content["key"],scopeID),runNodes(content["args"],scopeID),scopeID);
        case "literal":
            return content["data"];
        case "reference":
            const local_scope = scopes[scopeID]["variables"];
            if (!Object.keys(local_scope).includes(content["key"])) {
                error(content["key"], "is not defined.");
            }
            return local_scope[content["key"]];
        case "function":
            return [{"type":"def","data":content}];
        case "spaced command":
            switch (content["name"]) {
                case "return":
                    return {"data":runNode(content["data"],scopeID)}
                default:
                    error("unknown spaced command type", content["name"]);
            }
            return
        case "operator":
            return runMath(content["operator"],runNode(content["a"],scopeID),runNode(content["b"],scopeID));
        case "comparison":
            return runComparison(content["comparison"],runNode(content["a"],scopeID),runNode(content["b"],scopeID))
        case "logic":
            const logic_a = castType(runNode(content["a"],scopeID),"bool");
            const logic_b = castType(runNode(content["b"],scopeID),"bool");
            switch (content["operator"]) {
                case "or":
                    return [logic_a[0] || logic_b[0],"bool"];
                case "and":
                    return [logic_a[0] && logic_b[0],"bool"];
                default:
                    error("unknown logic operator", content["operator"]);
            }
            break
        case "assignment":
            //console.log(content["key"])
            break
        default:
            error("unknown node type '" + content["type"] + "'")
            return ["null","null"];
    }
}
function runExecution(key, args, scopeID) {
    switch (key[1]) {
        case "function":
            switch (key[0]["type"]) {
                case "js":
                    return key[0]["data"](args,scopeID);
                case "ref":
                    const func = functions[key[0]["data"]];
                    return runSegmentFunc({"functions":[func]},func["key"],args,randomStr())
                default:
                    error("unknown function type",key[0]["type"])
            }
            break
        default:
            error("cannot run",key[1])
    }
    return ["null","null"];
}
function runMath(operator,a,b) {
    switch (operator) {
        case "+":
            try {
                const num_a = castType(a,"number",true);
                const num_b = castType(b,"number",true);
                return [num_a[0] + num_b[0],"number"];
            } catch {}
            return [castType(a,"string")[0] + " " + castType(b,"string")[0],"string"];
        case "++":
            return [castType(a,"string")[0] + castType(b,"string")[0],"string"];
        case "-":
            try {
                const num_a = castType(a,"number",true);
                const num_b = castType(b,"number",true);
                return [num_a[0] - num_b[0],"number"];
            } catch (e) {}
            error("cannot subtract",a[1],"by",b[1])
        case "*":
            try {
                const num_a = castType(a,"number",true);
                const num_b = castType(b,"number",true);
                return [num_a[0] * num_b[0],"number"];
            } catch {}
            try {
                const str_a = castType(a,"string",true);
                const num_b = castType(b,"number",true);
                return [str_a[0].repeat(num_b[0]),"string"];
            } catch {}
            error("cannot multiply",a[1],"by",b[1])
        case "/":
            try {
                const num_a = castType(a,"number",true);
                const num_b = castType(b,"number",true);
                return [num_a[0] / num_b[0],"number"];
            } catch (e) {}
            error("cannot divide",a[1],"by",b[1])
        default:
            error("unknown operator",operator);
    }
    return ["null","null"];
}
function runComparison(comparison,a,b) {
    switch (comparison) {
        case "equal":
            // needs object and array support
            return [a[0] == b[0] && typeEqual(a[1],b[1]), "bool"];
        case "not_equal":
            // needs object and array support
            return [!(a[0] == b[0] && typeEqual(a[1],b[1])), "bool"];
        case "string_equal":
            a = castType(a, "string");
            b = castType(b, "string");
            return [a[0] == b[0], "bool"];
        case "type_equal":
            return [a[1] == b[1], "bool"];
        case "greater": a = castType(a, "number"); b = castType(b, "number"); return [a[0] > b[0], "bool"];
        case "smaller": a = castType(a, "number"); b = castType(b, "number"); return [a[0] < b[0], "bool"];
        case "greater_equal": a = castType(a, "number"); b = castType(b, "number"); return [a[0] >= b[0], "bool"];
        case "smaller_equal": a = castType(a, "number"); b = castType(b, "number"); return [a[0] <= b[0], "bool"];
        default:
            error("unknown comparison",comparison);
    }
}

function typeEqual(a,b) {
    if (a == "any" || b == "any") {
        return true;
    }
    return a == b;
}
function typesEqual(a,b) {
    for (let i = 0; i < a.length; i++) {
        if (typeEqual(a[i],b)) {
            return true;
        }
    }
    return false;
}
function castType(value,type,tryTo = false) {
    if (!Array.isArray(value)) { return ["null","null"]; }
    if (value[1] == type) { return value; }
    switch (type) {
        case "string":
            if (typeof value[1] == "object") {
                return [JSON.stringify(value),"string"];
            }
            return [value[0].toString(),"string"];
        case "number":
            if (typeof value[1] == "string") {
                if (isNumeric(value[0])) {
                    return [Number(value[0]),"number"]
                }
            }
        default:
            if (!tryTo) {
                error("cannot cast to",type);
            }
    }
}

function funcMatches(func,key,args) {
    if (func["key"] != key) { return false; } // its not the same name
    if (func["args"].length == 0 && args.length == 0) { return true; } // there arent any args, no need to check
    // there are more arguments passed in,
    // however, this isnt done for less arguments passed in, due to param = value args
    if (args.length > func["args"].length) { return false; }
    for (let i = 0; i < func["args"].length; i++) {
        if (i >= args.length) {
            // if the variable doesnt have a default (arg = val) then theres a missing param
            if (!Object.keys(func["args"][i]).includes("default")) {
                return false;
            }
        } else {
            const arg = args[i];
            if (!Array.isArray(arg)) {
                error("invalid passed in arg",arg);
                return false;
            }
            if (!argMatches(func["args"][i], arg)) {
                return false;
            }
        }
    }
    return true;
}
function argMatches(arg,match) {
    if (Array.isArray(arg["type"])) {
        if (!typesEqual(arg["type"],match[1])) {
            return false;
        }
    } else {
        if (!typeEqual(arg["type"],match[1])) {
            return false;
        }
    }
    return true;
}

function getDefaultScope() {
    return {
        "variables": {
            "print": [
                {
                    "type": "js",
                    "data": function(args, scopeID) {
                        console.log(...args.map(v => formatString(v)));
                        return ["null","null"];
                    }
                },
                "function"
            ],
            "type": [
                {
                    "type": "js",
                    "data": function(args, scopeID) {
                        return [args[0][1],"string"];
                    }
                },
                "function"
            ]
        }
    }
}

function error(...args) {
    console.error(...args);
}
function formatString(value) {
    return castType(value,"string")[0];
}


console.log(runAst(generateAst(`print("hello world")`),"main",[],true))
