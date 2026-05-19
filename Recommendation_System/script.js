// State Management
let shownItems = new Set();
let isDarkTheme = true;

// Web Audio API for Premium Sound Effects
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'click') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'pop') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.1);
    }
}

// Dynamic Data Generators to ensure infinite variety
const generators = {
    movies: () => {
        const adjectives = ["Silent", "Crimson", "Quantum", "Neon", "Midnight", "Lost", "Fallen", "Eternal", "Galactic", "Hidden"];
        const nouns = ["Horizon", "Shadow", "Protocol", "Echo", "Requiem", "Paradox", "Nebula", "Empire", "Symphony", "Voyage"];
        const genres = ["Sci-Fi", "Thriller", "Action", "Drama", "Mystery"];
        const id = Math.random().toString(36).substring(7);
        return {
            id: `movie_${id}`,
            category: 'Movie',
            icon: 'fa-film',
            title: `The ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`,
            desc: `An unforgettable ${genres[Math.floor(Math.random() * genres.length)]} experience that will keep you on the edge of your seat.`
        };
    },
    books: () => {
        const words1 = ["Art", "Science", "History", "Secrets", "Chronicles", "Journey", "Whispers", "Tales", "Theory"];
        const words2 = ["Tomorrow", "the Deep", "Magic", "the Ancients", "Space", "Time", "the Cosmos"];
        const id = Math.random().toString(36).substring(7);
        return {
            id: `book_${id}`,
            category: 'Book',
            icon: 'fa-book',
            title: `${words1[Math.floor(Math.random() * words1.length)]} of ${words2[Math.floor(Math.random() * words2.length)]}`,
            desc: `A compelling read exploring profound themes and captivating narratives.`
        };
    },
    gadgets: () => {
        const brands = ["Nexus", "Aura", "Quantum", "Cyber", "Nova", "Zenith"];
        const types = ["Pro", "Max", "Ultra", "Lite", "Elite", "X"];
        const devices = ["Watch", "Buds", "Pad", "Phone", "Book", "Lens"];
        const id = Math.random().toString(36).substring(7);
        return {
            id: `gadget_${id}`,
            category: 'Gadget',
            icon: 'fa-microchip',
            title: `${brands[Math.floor(Math.random() * brands.length)]} ${devices[Math.floor(Math.random() * devices.length)]} ${types[Math.floor(Math.random() * types.length)]}`,
            desc: `Next-generation technology designed to elevate your daily workflow.`
        };
    }
};

const predefinedJokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "I invented a new word! Plagiarism!",
    "Why don't skeletons fight each other? They don't have the guts.",
    "What do you call fake spaghetti? An impasta!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "I would tell you a UDP joke, but you might not get it.",
    "There are 10 types of people in the world: those who understand binary, and those who don't.",
    "Why did the developer go broke? Because he used up all his cache.",
    "A SQL query goes into a bar, walks up to two tables and asks... 'Can I join you?'",
    "How do you comfort a JavaScript bug? You console it.",
    "What's the object-oriented way to become wealthy? Inheritance.",
    "Why did the programmer quit his job? Because he didn't get arrays.",
    "What do you call a programmer from Finland? Nerdic.",
    "Why do Java programmers have to wear glasses? Because they don't C#.",
    "I've got a really good joke about a blank piece of paper... but it's tearable."
];

let jokeIndex = 0;

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const searchInput = document.getElementById('user-input');
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results-container');
const loadingSpinner = document.getElementById('loading-spinner');
const chips = document.querySelectorAll('.chip');
const welcomeModal = document.getElementById('welcome-modal');
const modalOverlay = document.getElementById('modal-overlay');
const startBtn = document.getElementById('start-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    // Show welcome modal
    setTimeout(() => {
        modalOverlay.classList.add('active');
        welcomeModal.classList.add('active');
        playSound('pop');
    }, 500);
});

// Theme Toggling
themeToggle.addEventListener('click', () => {
    playSound('click');
    isDarkTheme = !isDarkTheme;
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    themeIcon.className = isDarkTheme ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
});

// Modal Start Button
startBtn.addEventListener('click', () => {
    playSound('click');
    modalOverlay.classList.remove('active');
    welcomeModal.classList.remove('active');
    searchInput.focus();
});

// Toast Notification
function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.className = `toast show ${isError ? 'error' : 'success'}`;
    toastIcon.className = isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Input Handling
searchBtn.addEventListener('click', handleQuery);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleQuery();
});

chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
        playSound('click');
        searchInput.value = e.target.textContent;
        handleQuery();
    });
});

function handleQuery() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        playSound('click');
        showToast('Please enter what you are looking for!', true);
        return;
    }

    playSound('click');
    
    // UI transition
    document.querySelector('.input-section').classList.add('compact');
    resultsContainer.innerHTML = '';
    resultsContainer.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    // Simulate AI thinking
    setTimeout(() => {
        generateResults(query);
    }, 800);
}

function generateResults(query) {
    loadingSpinner.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    
    let items = [];
    
    // Conversation Intelligence
    if (query.includes('who are you') || query.includes('your name') || query.includes('what are you')) {
        renderConversational("I am NexusAI, your advanced recommendation assistant. I can help you discover movies, books, gadgets, or just tell you a joke! What would you like?");
        return;
    }
    
    if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
        renderConversational("Hello there! Ready to discover something new? Try asking for movie recommendations, books, or tech gadgets.");
        return;
    }

    // Determine intent
    let intent = 'movies'; // default
    if (query.includes('book') || query.includes('novel') || query.includes('read')) intent = 'books';
    else if (query.includes('gadget') || query.includes('tech') || query.includes('phone')) intent = 'gadgets';
    else if (query.includes('joke') || query.includes('funny') || query.includes('laugh')) intent = 'jokes';
    else if (query.includes('movie') || query.includes('film') || query.includes('watch')) intent = 'movies';

    // Generate 10 unique items
    let attempts = 0;
    while (items.length < 10 && attempts < 100) {
        attempts++;
        
        if (intent === 'jokes') {
            if (jokeIndex < predefinedJokes.length) {
                const joke = predefinedJokes[jokeIndex++];
                items.push({
                    id: `joke_${jokeIndex}`,
                    category: 'Joke',
                    icon: 'fa-face-laugh-squint',
                    title: "Here's a joke:",
                    desc: joke
                });
            } else {
                // If we run out of predefined jokes, generate variations
                const jokeId = Math.random().toString(36).substring(7);
                items.push({
                    id: `joke_gen_${jokeId}`,
                    category: 'Joke',
                    icon: 'fa-face-laugh-squint',
                    title: "Random thought:",
                    desc: `Why did the AI cross the road? To optimize the path on the other side! (Instance ${jokeId})`
                });
            }
        } else {
            const generatedItem = generators[intent]();
            if (!shownItems.has(generatedItem.title)) {
                shownItems.add(generatedItem.title);
                items.push(generatedItem);
            }
        }
    }

    renderCards(items);
    showToast('Here are your personalized picks 🎉');
    playSound('pop');
}

function renderConversational(text) {
    resultsContainer.innerHTML = `
        <div class="result-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <i class="fa-solid fa-robot" style="font-size: 3rem; color: var(--primary-glow); margin-bottom: 1rem;"></i>
            <h2 class="card-title" style="font-size: 1.5rem;">Message from NexusAI</h2>
            <p class="card-desc" style="font-size: 1.1rem; margin-top: 1rem;">${text}</p>
        </div>
    `;
    playSound('pop');
}

function renderCards(items) {
    resultsContainer.innerHTML = '';
    
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="card-header">
                <span class="card-category">${item.category}</span>
                <i class="fa-solid ${item.icon} card-icon"></i>
            </div>
            <h3 class="card-title">${item.title}</h3>
            <p class="card-desc">${item.desc}</p>
        `;
        
        // Add hover sound listener
        card.addEventListener('mouseenter', () => {
            // Optional very light hover sound could go here, but omitted to prevent spam.
        });
        
        resultsContainer.appendChild(card);
    });
}
