const CARD_TYPES = ['🐑', '🌾', '🥕', '🚜', '🌻'];
const SLOT_LIMIT = 7;
let currentLevel = 1;
let slots = [];

function initGame() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    slots = [];
    
    const types = CARD_TYPES.slice(0, 2 + currentLevel);
    types.forEach(type => {
        for(let i = 0; i < 3; i++) {
            createCard(type, gameBoard);
        }
    });
}

function createCard(type, container) {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = type;
    
    const maxX = container.offsetWidth - 70;
    const maxY = container.offsetHeight - 90;
    card.style.left = Math.random() * maxX + 'px';
    card.style.top = Math.random() * maxY + 'px';
    card.style.zIndex = Math.floor(Math.random() * 50);
    
    card.onclick = () => handleCardClick(card);
    container.appendChild(card);
}

function handleCardClick(card) {
    if(isCardCovered(card)) return;
    
    card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    card.style.left = `${slots.length * 70 + 10}px`;
    card.style.top = '0';
    card.style.position = 'relative';
    
    setTimeout(() => {
        document.getElementById('slot-area').appendChild(card);
        slots.push(card);
        checkSlotLimit();
        checkMatch();
    }, 500);
}

function isCardCovered(card) {
    const rect = card.getBoundingClientRect();
    return Array.from(document.querySelectorAll('.card'))
        .some(other => {
            if(other === card || other.parentElement.id === 'slot-area') return false;
            const otherRect = other.getBoundingClientRect();
            return (
                parseInt(other.style.zIndex) > parseInt(card.style.zIndex) &&
                rect.left < otherRect.right &&
                rect.right > otherRect.left &&
                rect.top < otherRect.bottom &&
                rect.bottom > otherRect.top
            );
        });
}

function checkSlotLimit() {
    if(slots.length >= SLOT_LIMIT) {
        alert('卡槽已满，游戏失败！');
        resetGame();
    }
}

function checkMatch() {
    if(slots.length >= 3) {
        const lastThree = slots.slice(-3);
        if(new Set(lastThree.map(c => c.textContent)).size === 1) {
            lastThree.forEach(c => {
                c.style.transform = 'scale(0)';
                setTimeout(() => c.remove(), 300);
            });
            slots = slots.slice(0, -3);
            checkWin();
        }
    }
}

function checkWin() {
    if(document.querySelectorAll('.card').length === 0) {
        setTimeout(() => {
            if(confirm(`恭喜通过第${currentLevel}关！进入下一关？`)) {
                currentLevel++;
                document.getElementById('level').textContent = currentLevel;
                initGame();
            }
        }, 500);
    }
}

function resetGame() {
    currentLevel = 1;
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('slot-area').innerHTML = '';
    initGame();
}

function toggleHelp() {
    document.getElementById('help-modal').style.display = 
        document.getElementById('help-modal').style.display === 'block' ? 'none' : 'block';
}

initGame();
