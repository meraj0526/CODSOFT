/**
 * AuraBot Logic
 * Features: Web Audio API Synths, Regex Pattern Matching, DOM Manipulation, LocalStorage
 */

// --- 1. Audio Synthesizer (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let soundEnabled = true;

const soundToggleBtn = document.getElementById('sound-toggle');
soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggleBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if(soundEnabled) playClick();
});

function playTone(freq, type, duration, vol) {
    if (!soundEnabled) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playClick() {
    playTone(800, 'sine', 0.1, 0.1);
}

function playPop() {
    playTone(400, 'sine', 0.1, 0.2);
    setTimeout(() => playTone(600, 'sine', 0.15, 0.2), 50);
}

function playNotification() {
    playTone(880, 'sine', 0.1, 0.1); // A5
    setTimeout(() => playTone(1108.73, 'sine', 0.3, 0.1), 100); // C#6
}

function playWhoosh() {
    // A simple noise burst mimicking a whoosh for modals
    if (!soundEnabled) return;
    const bufferSize = audioCtx.sampleRate * 0.2; // 0.2 seconds
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    const biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = 'lowpass';
    biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    biquadFilter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
    
    noiseSource.connect(biquadFilter);
    biquadFilter.connect(gain);
    gain.connect(audioCtx.destination);
    
    noiseSource.start();
}


// --- 2. UI & Interaction Logic ---
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('btn-send');
const chatMessages = document.getElementById('chat-messages');
const clearBtn = document.getElementById('btn-clear');
const quickReplies = document.querySelectorAll('.quick-reply-btn');

// Emoji Logic
const btnEmoji = document.getElementById('btn-emoji');
const emojiPicker = document.getElementById('emoji-picker');
const emojiSpans = document.querySelectorAll('.emoji-grid span');

btnEmoji.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiPicker.classList.toggle('active');
    playClick();
});

document.addEventListener('click', (e) => {
    if (!btnEmoji.contains(e.target) && !emojiPicker.contains(e.target)) {
        emojiPicker.classList.remove('active');
    }
});

emojiSpans.forEach(span => {
    span.addEventListener('click', () => {
        chatInput.value += span.innerText;
        chatInput.focus();
        playPop();
    });
});

// Ripple Effect for buttons
document.querySelectorAll('.ripple').forEach(button => {
    button.addEventListener('click', function(e) {
        let rect = this.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        let ripple = document.createElement('span');
        ripple.className = 'ripple-element';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Parallax Background Effect
document.addEventListener('mousemove', (e) => {
    // Calculate normalized mouse coordinates (-1 to 1)
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    const layer1 = document.querySelector('.parallax-1');
    const layer2 = document.querySelector('.parallax-2');
    const layer3 = document.querySelector('.parallax-3');
    
    // Apply parallax with different depth multipliers
    if (layer1) layer1.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
    if (layer2) layer2.style.transform = `translate(${x * -25}px, ${y * -25}px)`;
    if (layer3) layer3.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
});

// Modals Logic
const modals = {
    about: document.getElementById('modal-about'),
    help: document.getElementById('modal-help'),
    contact: document.getElementById('modal-contact')
};

function openModal(id) {
    playWhoosh();
    modals[id].classList.add('active');
}

function closeModal(id) {
    playWhoosh();
    modals[id].classList.remove('active');
}

document.getElementById('btn-about').addEventListener('click', () => openModal('about'));
document.getElementById('btn-help').addEventListener('click', () => openModal('help'));
document.getElementById('btn-contact').addEventListener('click', () => openModal('contact'));

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        closeModal(e.target.dataset.close.split('-')[1]);
    });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) {
            closeModal(overlay.id.split('-')[1]);
        }
    });
});

// Contact Form Submit Logic
document.getElementById('btn-submit-contact').addEventListener('click', () => {
    const messageInput = document.getElementById('contact-message');
    const successMsg = document.getElementById('contact-success');
    
    if (messageInput.value.trim() === '') {
        alert('Please enter a message before sending!');
        messageInput.focus();
        return;
    }
    
    playNotification();
    
    // Simulate sending message
    document.getElementById('contact-form').style.display = 'none';
    successMsg.style.display = 'block';
    
    setTimeout(() => {
        closeModal('contact');
        // Reset form for next time
        setTimeout(() => {
            document.getElementById('contact-form').style.display = 'flex';
            successMsg.style.display = 'none';
            document.getElementById('contact-name').value = '';
            messageInput.value = '';
        }, 500);
    }, 2000);
});

// --- 3. Chat Logic & State Management ---
let context = { step: 'init', name: '' };

// Chat starts fresh on load. Default message is in HTML.

clearBtn.addEventListener('click', () => {
    playClick();
    chatMessages.innerHTML = '';
    appendMessage('bot', 'Chat cleared! How can I help you today? ✨');
    context = { step: 'init', name: '' };
});

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender} slide-up`;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = text; // allow bold tags
    
    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot typing-msg slide-up';
    msgDiv.id = 'typing-indicator';
    
    const bubble = document.createElement('div');
    bubble.className = 'typing-indicator';
    bubble.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
    
    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
    const typingMsg = document.getElementById('typing-indicator');
    if (typingMsg) typingMsg.remove();
}

function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    playPop();
    appendMessage('user', text);
    chatInput.value = '';
    
    showTyping();
    
    // Check for Image Generation
    const imgGenMatch = text.toLowerCase().match(/^(?:generate|create|draw|make)\s+(?:an?\s+)?image\s+of\s+(.+)$/i);
    if (imgGenMatch) {
        const query = imgGenMatch[1];
        setTimeout(() => {
            hideTyping();
            playNotification();
            const loadingId = 'img-loading-' + Date.now();
            appendMessage('bot', `Generating image of "<b>${query}</b>"... ⏳<br><div id="${loadingId}"></div>`);
            
            // Fetch Image from Pollinations
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}?width=400&height=300&nologo=true`;
            const img = new Image();
            img.onload = () => {
                const loadingDiv = document.getElementById(loadingId);
                if(loadingDiv) {
                    loadingDiv.innerHTML = `<img src="${imageUrl}" class="uploaded-img" alt="Generated: ${query}">`;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    playNotification();
                }
            };
            img.onerror = () => {
                const loadingDiv = document.getElementById(loadingId);
                if(loadingDiv) {
                    loadingDiv.innerHTML = `<span style="color:red;">Failed to generate image. Try again later.</span>`;
                }
            };
            img.src = imageUrl;
            
        }, 1000);
        return;
    }

    // Standard simulate network delay
    setTimeout(async () => {
        const reply = await botBrain(text);
        hideTyping();
        playNotification();
        appendMessage('bot', reply);
    }, 1000 + Math.random() * 1000);
}

sendBtn.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});

quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
        chatInput.value = btn.innerText;
        handleSend();
    });
});


// --- 4. Bot Intelligence (Pattern Matching) ---
let jokeIndex = 0;
const jokesList = [
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
    "Why do Java developers wear glasses? Because they don't C#! 😎",
    "A SQL query goes into a bar, walks up to two tables and asks... 'Can I join you?' 🗄️",
    "How do you comfort a JavaScript bug? You console it! 🖥️",
    "I would tell you a UDP joke, but you might not get it. 🌐",
    "There are 10 types of people in the world: those who understand binary, and those who don't. 🔢",
    "Why did the programmer quit his job? Because he didn't get arrays. 📉",
    "What is the most used language in programming? Profanity. 🤬",
    "Real programmers count from 0! 🤓"
];

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function botBrain(input) {
    let lowerInput = input.trim().toLowerCase().replace(/[?!.,']/g, '');
    
    // 1. Math Evaluation (Simple)
    const mathRegex = /^(\d+)\s*([\+\-\*\/])\s*(\d+)$/;
    const mathMatch = lowerInput.match(mathRegex);
    if (mathMatch) {
        let num1 = parseFloat(mathMatch[1]);
        let op = mathMatch[2];
        let num2 = parseFloat(mathMatch[3]);
        let res;
        switch(op) {
            case '+': res = num1 + num2; break;
            case '-': res = num1 - num2; break;
            case '*': res = num1 * num2; break;
            case '/': res = num2 !== 0 ? num1 / num2 : 'Infinity'; break;
        }
        return `That's easy! The answer is <b>${res}</b>.`;
    }
    
    // 2. Context Handling (Name)
    if (context.step === 'ask_name') {
        const nameMatch = lowerInput.match(/\b(?:my name is|i am|im|i'm)\s+([a-z]+)\b/i);
        let name = nameMatch ? nameMatch[1] : lowerInput.split(' ')[0];
        
        name = name.charAt(0).toUpperCase() + name.slice(1);
        context.name = name;
        context.step = 'normal';
        return `Nice to meet you, ${name}! How can I assist you today?`;
    }

    // 3. Advanced Intent Matching (Priority Ordered)
    const intents = [
        // 1. Greetings
        {
            keywords: ["hi", "hello", "hey", "yo", "sup", "hola"],
            responses: ["Hello! 😊 How can I help you?", "Hey there! 👋 What can I do for you?", "Hi! 😄 Ask me anything!"]
        },
        // 2. How are you
        {
            keywords: ["how are you", "how's it going", "how do you do", "how r u", "how are u"],
            responses: ["I'm doing fantastic, thank you! ✨ How about you?", "I'm fully-charged and ready to chat! ⚡"]
        },
        // 3. Name
        {
            keywords: ["what is your name", "who are you", "tell me your name", "whats your name"],
            responses: ["I am Aura, your smart assistant 🤖✨"]
        },
        // 4. Purpose
        {
            keywords: ["what do you do", "why are you here", "your purpose"],
            responses: ["I'm here to chat, answer questions, make you laugh, and help you out! 🚀"]
        },
        // 5. Help
        {
            keywords: ["help", "what can you do", "support", "assist me"],
            responses: ["I can chat with you, generate images, tell jokes, check the time, or solve simple math! Just ask! 😊"]
        },
        // 6. Exit
        {
            keywords: ["bye", "goodbye", "exit", "quit", "see ya", "cya"],
            responses: ["Goodbye! 👋 Have a great day!", "See you later! ✨ Take care!"]
        },
        // 7. Jokes
        {
            keywords: ["joke", "funny", "tell me a joke", "make me laugh", "something funny"],
            isJoke: true
        },
        // 8. Weather
        {
            keywords: ["what's the weather", "whats the weather", "is it raining", "is it sunny", "weather"],
            responses: ["I don't have access to live weather data yet, but I hope it's a beautiful day outside! ☀️🌤️"]
        },
        // 9. Time
        {
            keywords: ["what time is it", "check time", "clock", "time"],
            responses: [`The current time is <b>${new Date().toLocaleTimeString()}</b>. ⏰`]
        },
        // 10. Creator
        {
            keywords: ["who created you", "who built you", "who made you", "creator", "developer"],
            responses: ["I was created by Meraj Fathima 💻✨"]
        },
        // 11. Coding
        {
            keywords: ["coding", "programming", "developer life", "code"],
            responses: ["Coding is like magic! You write lines of text, and boom—software is born! 🪄💻", "Remember: it's not a bug, it's an undocumented feature! 😉"]
        },
        // 12. Age
        {
            keywords: ["how old are you", "your age", "when were you born"],
            responses: ["I'm as old as the code that runs me! Age is just a number in the digital world. 🌐⏳"]
        },
        // Casual Responses
        {
            keywords: ["ok", "okay", "alright"],
            responses: ["Alright 👍", "Okay! 😊"]
        },
        {
            keywords: ["thanks", "thank you", "thx"],
            responses: ["You're welcome 😊", "Happy to help! 💖"]
        }
    ];

    // Check if input is JUST an emoji (emoji handling)
    const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F201}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{E0062}-\u{E007F}\u{200D}\u{FE0F}]+$/u;
    if (emojiRegex.test(input.trim())) {
        const emojiResponses = [
            "Nice emoji! 😄", "Right back at ya! ✨", "Love that! ❤️", "Haha! 😜", "Emojis make everything better! 🎉"
        ];
        return getRandom(emojiResponses);
    }

    // Split words to avoid partial matching
    const words = lowerInput.split(' ');

    for (let intent of intents) {
        let match = intent.keywords.some(kw => {
            // For multi-word phrases, check includes
            if (kw.includes(' ')) {
                return lowerInput.includes(kw);
            }
            // For single words, check exact word match
            return words.includes(kw);
        });
        
        if (match) {
            if (intent.isJoke) {
                let res = jokesList[jokeIndex];
                jokeIndex = (jokeIndex + 1) % jokesList.length;
                return res;
            }

            let res = getRandom(intent.responses);
            if (context.name && Math.random() > 0.5) {
                res = res.replace("you", context.name).replace("there", context.name);
            }
            return res;
        }
    }

    // 4. Smart Fallback for General Questions (No API used)
    const fallbacks = [
        "That’s a great question! 🤔 I’m still learning, but I can try to help!",
        "I’m not fully sure about that yet, but I’m improving every day 😊",
        "Interesting! Let’s explore that together sometime 🚀",
        "Hmm, I might need an update to answer that completely. Anything else?"
    ];
    return getRandom(fallbacks);
}
