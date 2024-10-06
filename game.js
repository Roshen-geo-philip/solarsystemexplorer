// Global game state
let cardsArray = [];
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
const totalPairs = 8;  // Total 8 pairs in the 4x4 grid

// Fetch data from NASA's Near-Earth Comets API to use as card names
async function fetchNASAData() {
    const response = await fetch('https://data.nasa.gov/resource/b67r-rgxc.json');
    const data = await response.json();
    return data;
}

// Randomly select 8 object names for the game from the API data
async function setupGame() {
    const data = await fetchNASAData();
    
    // Select 8 random objects from the data
    let selectedNames = [];
    while (selectedNames.length < totalPairs) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const object = data[randomIndex];
        const objectName = object.object_name || `Unknown Object`;  // Fallback name

        // Avoid duplicates
        if (!selectedNames.includes(objectName)) {
            selectedNames.push(objectName);
        }
    }

    // Duplicate the selected names to create pairs
    cardsArray = [...selectedNames, ...selectedNames];

    // Shuffle the cards
    shuffle(cardsArray);

    // Create the game board
    createGameBoard();
}

// Shuffle array function
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// Create the game board
function createGameBoard() {
    const gameBoard = document.getElementById('game-board');
    
    cardsArray.forEach((objectName, index) => {
        // Create the card elements
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = objectName;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <p>${objectName}</p>
                </div>
            </div>
        `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });

    // Show the cards for 5 seconds, then flip them back
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => card.classList.remove('is-flipped'));
    }, 5000);
}

// Flip card logic
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('is-flipped');

    if (!firstCard) {
        // First card is flipped
        firstCard = this;
    } else {
        // Second card is flipped
        secondCard = this;

        // Check if cards match
        checkForMatch();
    }
}

// Check if the two selected cards are a match
function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        // Cards match, remove them
        disableCards();
        matchedPairs++;

        if (matchedPairs === totalPairs) {
            setTimeout(() => alert('Congratulations! You found all pairs!'), 500);
        }
    } else {
        // Cards don't match, flip them back after 1 second
        unflipCards();
    }
}

// Disable cards after a match
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

// Unflip cards if they don't match
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');
        resetBoard();
    }, 1000);
}

// Reset the board for the next turn
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Start the game
setupGame();
