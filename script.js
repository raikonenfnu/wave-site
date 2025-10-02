// Syntax highlighting function
function highlightCode(codeElement) {
    // Store the original text content for copying
    const originalText = codeElement.textContent || codeElement.innerText;
    codeElement.setAttribute('data-original-text', originalText);

    // Get the plain text content
    let code = originalText;

    // Create tokens to protect already-highlighted content
    const tokens = [];
    let tokenIndex = 0;

    // Helper function to create a unique token
    function createToken(content) {
        const token = `__TOKEN_${tokenIndex}__`;
        tokens[tokenIndex] = content;
        tokenIndex++;
        return token;
    }

    // Apply syntax highlighting in order of precedence
    // Comments (must come first to avoid conflicts)
    code = code.replace(/(#.*?)$/gm, (match) => createToken(`<span class="highlight c">${match}</span>`));

    // Triple quoted strings (must come before single/double quotes)
    code = code.replace(/("""[\s\S]*?""")/g, (match) => createToken(`<span class="highlight s">${match}</span>`));
    code = code.replace(/('''[\s\S]*?''')/g, (match) => createToken(`<span class="highlight s">${match}</span>`));

    // Strings (single and double quoted)
    code = code.replace(/("(?:[^"\\]|\\.)*")/g, (match) => createToken(`<span class="highlight s">${match}</span>`));
    code = code.replace(/('(?:[^'\\]|\\.)*')/g, (match) => createToken(`<span class="highlight s">${match}</span>`));

    // Decorators (match @ followed by word characters, allowing for spaces)
    // code = code.replace(/(@\s*\w+(?:\.\w+)*)/g, (match) => createToken(`<span class="highlight nd">${match}</span>`));

    // Keywords
    code = code.replace(/\b(import|from|as|def|class|if|else|elif|for|while|try|except|finally|with|return|yield|break|continue|pass|global|nonlocal|assert|del|lambda|and|or|not|in|is|True|False|None)\b/g, (match) => createToken(`<span class="highlight k">${match}</span>`));

    // Built-in functions and types
    code = code.replace(/\b(torch|len|range|enumerate|zip|map|filter|str|int|float|bool|list|dict|tuple|set|print|input|open|type|isinstance|hasattr|getattr|setattr)\b/g, (match) => createToken(`<span class="highlight nb">${match}</span>`));

    // Numbers
    code = code.replace(/\b(\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g, (match) => createToken(`<span class="highlight m">${match}</span>`));

    // Function definitions and calls
    code = code.replace(/\b(\w+)(?=\s*\()/g, (match) => createToken(`<span class="highlight nf">${match}</span>`));

    // Operators
    code = code.replace(/(\+|\-|\*|\/|\/\/|\*\*|%|==|!=|<=|>=|<|>|=|\+=|\-=|\*=|\/=|%=|\||\&|\^|~|<<|>>)/g, (match) => createToken(`<span class="highlight o">${match}</span>`));

    // Replace tokens back with their highlighted content
    tokens.forEach((content, index) => {
        code = code.replace(`__TOKEN_${index}__`, content);
    });

    codeElement.innerHTML = code;
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        // Show feedback
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#22c55e';

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

// Helper function to get plain text from code elements
function getPlainTextFromCode(codeElement) {
    // Create a temporary element to decode HTML entities
    const temp = document.createElement('div');
    temp.innerHTML = codeElement.textContent || codeElement.innerText;
    return temp.textContent || temp.innerText;
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Apply syntax highlighting to all code blocks
    const codeBlocks = document.querySelectorAll('pre code, .code-content code');
    codeBlocks.forEach(codeElement => {
        highlightCode(codeElement);
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        }
    });
});