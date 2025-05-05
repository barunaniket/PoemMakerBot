// Configuration for the Gemini API
const API_KEY = "AIzaSyC210KRfOwi2wdKtb1skumzakbajrHQkqw"; // Replace with your API key
const MODEL_NAME = "gemini-2.0-flash-lite";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// DOM Elements
const generateBtn = document.getElementById('generate');
const loadingEl = document.getElementById('loading');
const resultEl = document.getElementById('result');
const poemTextEl = document.getElementById('poem-text');

// Form Elements
const directionEl = document.getElementById('direction');
const recipientEl = document.getElementById('recipient');
const themeEl = document.getElementById('theme');
const linesEl = document.getElementById('lines');
const rhymeEl = document.getElementById('rhyme');
const styleEl = document.getElementById('style');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Add animation delay to form elements
    document.querySelectorAll('.form-group').forEach((el, index) => {
        el.style.animationDelay = `${0.1 * index}s`;
    });
    
    // Add copy button to result
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', copyPoemToClipboard);
    resultEl.appendChild(copyBtn);
});

generateBtn.addEventListener('click', generatePoem);

// Functions
async function generatePoem() {
    // Validate input
    if (!recipientEl.value.trim()) {
        alert("Please enter the recipient's name.");
        recipientEl.focus();
        return;
    }
    
    // Show loading state
    loadingEl.style.display = 'block';
    resultEl.style.display = 'none';
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    
    // Prepare prompt
    const direction = directionEl.value;
    const recipient = recipientEl.value;
    const theme = themeEl.value;
    const numLines = linesEl.value;
    const rhymeScheme = rhymeEl.value;
    const languageStyle = styleEl.value;
    
    const prompt = `
    Write a ${numLines}-line poem in ${languageStyle} style with a ${rhymeScheme} rhyme scheme. 
    The theme of the poem is "${theme}". 
    
    This poem is for ${recipient}.
    The poem is written by the ${direction}.  
    
    Include vivid imagery and emotional depth that matches the tone of the theme.  
    Ensure the poem feels personal and heartfelt, as if it's being written specifically for the recipient.
    `;
    
    try {
        // Call the Gemini API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extract the poem from the response
        let poemText = "Could not generate poem. Please try again.";
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            poemText = data.candidates[0].content.parts[0].text.trim();
        }
        
        // Display the poem
        poemTextEl.textContent = poemText;
        
        // Add visual styling to the poem
        formatPoem();
        
        // Show the result
        loadingEl.style.display = 'none';
        resultEl.style.display = 'block';
    } catch (error) {
        console.error("Error generating poem:", error);
        poemTextEl.textContent = `Error: ${error.message}. Please check your API key and try again.`;
        loadingEl.style.display = 'none';
        resultEl.style.display = 'block';
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Poem';
    }
}

function formatPoem() {
    // Add styling to the poem text
    const formattedText = poemTextEl.textContent
        .split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');
    
    poemTextEl.textContent = formattedText;
}

function copyPoemToClipboard() {
    const poemText = poemTextEl.textContent;
    navigator.clipboard.writeText(poemText)
        .then(() => {
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.backgroundColor = '#252525';
            copyBtn.style.color = '#fff';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
                copyBtn.style.color = '';
            }, 2000);
        })
        .catch(err => {
            console.error('Error copying text: ', err);
        });
}

// Add error handling for API key
function checkApiKey() {
    if (API_KEY.includes("AIzaSyBW3pQrM9RaGWWpE3W8-h8yktN56ekP4WY") || API_KEY.length < 10) {
        console.error("Please replace the API key in the JavaScript file");
        alert("API key not configured. Please update the API key in the JavaScript file.");
    }
}

// Check API key on load
checkApiKey();

// Add loading animation
function addLoadingAnimation() {
    const dots = document.createElement('span');
    dots.className = 'loading-dots';
    dots.textContent = '...';
    loadingEl.querySelector('p').appendChild(dots);
    
    let count = 0;
    setInterval(() => {
        count = (count + 1) % 4;
        dots.textContent = '.'.repeat(count);
    }, 300);
}

addLoadingAnimation();