// Основные переменные игры
let userBalance = 5.56; // Баланс пользователя в TON
let usersCount = 1247; // Количество пользователей
let currentMultiplier = 1.0; // Текущий множитель
let autoWithdrawValue = 2.0; // Значение авто-вывода
let isRocketFlying = false; // Летит ли ракета
let playerBets = []; // Список ставок игроков
let multiplierHistory = []; // История множителей

// Элементы DOM
const usersCountEl = document.getElementById('users-count');
const userBalanceEl = document.getElementById('user-balance');
const rocketDisplay = document.getElementById('rocket-display');
const rocketGif = document.getElementById('rocket-gif');
const multiplierDisplay = document.getElementById('multiplier-display');
const multipliersGrid = document.getElementById('multipliers-grid');
const playersList = document.getElementById('players-list');
const betModal = document.getElementById('bet-modal');
const openBetModalBtn = document.getElementById('open-bet-modal');
const closeModalBtn = document.getElementById('close-modal');
const betAmountInput = document.getElementById('bet-amount');
const displayAmount = document.getElementById('display-amount');
const giftsBtn = document.getElementById('gifts-btn');
const tonBtn = document.getElementById('ton-btn');
const giftsSection = document.getElementById('gifts-section');
const autoValue = document.getElementById('auto-value');
const autoMinusBtn = document.getElementById('auto-minus');
const autoPlusBtn = document.getElementById('auto-plus');
const placeBetBtn = document.getElementById('place-bet');

// Инициализация игры
function initGame() {
    updateUI();
    generateMockPlayers();
    loadMultiplierHistory();
    
    // Запустить ракету при загрузке
    setTimeout(() => {
        startRocketFlight(3.45);
    }, 2000);
}

// Обновление UI
function updateUI() {
    usersCountEl.textContent = `${usersCount} пользователей запустили бота`;
    userBalanceEl.textContent = `💎 ${userBalance.toFixed(2)} TON`;
    
    // Обновить кнопку ставки в зависимости от баланса
    updateBetButton();
}

// Загрузка истории множителей
function loadMultiplierHistory() {
    // Моковые данные для истории
    const mockHistory = [5.56, 2.34, 1.89, 3.21, 1.45];
    multiplierHistory = mockHistory;
    
    multipliersGrid.innerHTML = '';
    
    // Текущий множитель
    const currentBox = document.createElement('div');
    currentBox.className = 'multiplier-box current';
    currentBox.textContent = `${currentMultiplier.toFixed(2)}x`;
    multipliersGrid.appendChild(currentBox);
    
    // Предыдущие множители
    multiplierHistory.forEach(multiplier => {
        const box = document.createElement('div');
        box.className = 'multiplier-box';
        box.textContent = `${multiplier.toFixed(2)}x`;
        multipliersGrid.appendChild(box);
    });
}

// Генерация моковых игроков
function generateMockPlayers() {
    const mockPlayers = [
        { name: 'Алексей', bet: 1.50, multiplier: 2.45, avatarSeed: 'User1', isCurrent: false },
        { name: 'Мария', bet: 0.75, multiplier: 1.83, avatarSeed: 'User2', isCurrent: true },
        { name: 'Иван', bet: 2.25, multiplier: 1.12, avatarSeed: 'User3', isCurrent: false },
        { name: 'Ольга', bet: 0.50, multiplier: 3.67, avatarSeed: 'User4', isCurrent: false },
        { name: 'Дмитрий', bet: 1.00, multiplier: 2.89, avatarSeed: 'User5', isCurrent: false }
    ];
    
    playersList.innerHTML = '';
    mockPlayers.forEach(player => {
        const playerEl = document.createElement('div');
        playerEl.className = 'player-item';
        playerEl.innerHTML = `
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${player.avatarSeed}" alt="Аватар" class="player-avatar">
            <div class="player-info">
                <span class="player-name">${player.name}</span>
                <span class="player-bet">- ${player.bet.toFixed(2)} TON • 
                    <span class="player-multiplier ${player.isCurrent ? 'current-bet' : ''}">
                        ${player.multiplier.toFixed(2)}x
                    </span>
                </span>
            </div>
        `;
        playersList.appendChild(playerEl);
    });
}

// Запуск полета ракеты
function startRocketFlight(finalMultiplier) {
    if (isRocketFlying) return;
    
    isRocketFlying = true;
    currentMultiplier = 1.0;
    
    // Сбросить дисплей множителя
    multiplierDisplay.textContent = '';
    multiplierDisplay.style.display = 'none';
    
    // Установить GIF полета
    rocketGif.src = 'raketka/polet.gif';
    rocketGif.style.display = 'block';
    
    // Анимация увеличения множителя
    let multiplier = 1.0;
    const interval = setInterval(() => {
        multiplier += 0.01;
        currentMultiplier = multiplier;
        
        // Обновить текущий множитель
        const currentBox = document.querySelector('.multiplier-box.current');
        if (currentBox) {
            currentBox.textContent = `${multiplier.toFixed(2)}x`;
        }
        
        // Если достигнут конечный множитель - взрыв
        if (multiplier >= finalMultiplier) {
            clearInterval(interval);
            explodeRocket(finalMultiplier);
        }
    }, 50);
}

// Взрыв ракеты
function explodeRocket(finalMultiplier) {
    // Установить GIF взрыва
    rocketGif.src = 'raketka/bomba.gif';
    
    // Через 1.5 секунды показать множитель
    setTimeout(() => {
        rocketGif.style.display = 'none';
        multiplierDisplay.textContent = `${finalMultiplier.toFixed(2)}x`;
        multiplierDisplay.style.display = 'block';
        
        // Добавить в историю
        addToMultiplierHistory(finalMultiplier);
        
        // Обновить список игроков
        updatePlayersAfterExplosion(finalMultiplier);
        
        isRocketFlying = false;
        
        // Запустить новую ракету через 3 секунды
        setTimeout(() => {
            const newMultiplier = generateRandomMultiplier();
            startRocketFlight(newMultiplier);
        }, 3000);
    }, 1500);
}

// Генерация случайного множителя
function generateRandomMultiplier() {
    // Вероятность взрыва увеличивается с ростом множителя
    let multiplier = 1.0;
    while (Math.random() < 0.95 && multiplier < 10) {
        multiplier += 0.1;
    }
    return Math.min(multiplier, 10).toFixed(2);
}

// Добавить множитель в историю
function addToMultiplierHistory(multiplier) {
    multiplierHistory.unshift(multiplier);
    if (multiplierHistory.length > 4) {
        multiplierHistory.pop();
    }
    loadMultiplierHistory();
}

// Обновить список игроков после взрыва
function updatePlayersAfterExplosion(explosionMultiplier) {
    const playerMultipliers = document.querySelectorAll('.player-multiplier');
    playerMultipliers.forEach(multiplierEl => {
        const currentMultiplier = parseFloat(multiplierEl.textContent);
        if (currentMultiplier > explosionMultiplier) {
            multiplierEl.style.color = '#ef4444';
            multiplierEl.textContent = `${explosionMultiplier.toFixed(2)}x (взорвалась)`;
        }
    });
}

// Обновить состояние кнопки ставки
function updateBetButton() {
    const betAmount = parseFloat(betAmountInput.value) || 0;
    const hasEnoughBalance = userBalance >= betAmount;
    
    placeBetBtn.disabled = !hasEnoughBalance || betAmount <= 0;
}

// Модальное окно
openBetModalBtn.addEventListener('click', () => {
    betModal.style.display = 'flex';
    betAmountInput.value = '';
    displayAmount.textContent = '0';
    updateBetButton();
});

closeModalBtn.addEventListener('click', () => {
    betModal.style.display = 'none';
});

// Закрыть модальное окно при клике вне его
betModal.addEventListener('click', (e) => {
    if (e.target === betModal) {
        betModal.style.display = 'none';
    }
});

// Обновление отображаемой суммы
betAmountInput.addEventListener('input', () => {
    const value = betAmountInput.value;
    displayAmount.textContent = value || '0';
    updateBetButton();
});

// Переключение методов оплаты
tonBtn.addEventListener('click', () => {
    tonBtn.classList.add('active');
    giftsBtn.classList.remove('active');
    giftsSection.style.display = 'none';
});

giftsBtn.addEventListener('click', () => {
    giftsBtn.classList.add('active');
    tonBtn.classList.remove('active');
    giftsSection.style.display = 'block';
});

// Управление авто-выводом
autoMinusBtn.addEventListener('click', () => {
    if (autoWithdrawValue > 1.1) {
        autoWithdrawValue -= 0.1;
        autoValue.textContent = `${autoWithdrawValue.toFixed(1)}x`;
    }
});

autoPlusBtn.addEventListener('click', () => {
    if (autoWithdrawValue < 10) {
        autoWithdrawValue += 0.1;
        autoValue.textContent = `${autoWithdrawValue.toFixed(1)}x`;
    }
});

// Размещение ставки
placeBetBtn.addEventListener('click', () => {
    const betAmount = parseFloat(betAmountInput.value);
    
    if (!betAmount || betAmount <= 0) {
        alert('Введите сумму ставки');
        return;
    }
    
    if (userBalance < betAmount) {
        alert('Недостаточно средств на балансе');
        return;
    }
    
    // Списать средства
    userBalance -= betAmount;
    
    // Добавить ставку в список
    const playerBet = {
        name: 'Вы',
        bet: betAmount,
        autoWithdraw: autoWithdrawValue,
        avatarSeed: 'CurrentUser'
    };
    playerBets.push(playerBet);
    
    // Обновить UI
    updateUI();
    
    // Добавить игрока в список
    addPlayerToLeaderboard(playerBet);
    
    // Закрыть модальное окно
    betModal.style.display = 'none';
    
    // Показать сообщение об успехе
    alert(`Ставка ${betAmount.toFixed(2)} TON размещена! Авто-вывод на ${autoWithdrawValue.toFixed(1)}x`);
});

// Добавить игрока в таблицу лидеров
function addPlayerToLeaderboard(playerBet) {
    const playerEl = document.createElement('div');
    playerEl.className = 'player-item';
    playerEl.innerHTML = `
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${playerBet.avatarSeed}" alt="Аватар" class="player-avatar">
        <div class="player-info">
            <span class="player-name">${playerBet.name}</span>
            <span class="player-bet">- ${playerBet.bet.toFixed(2)} TON • 
                <span class="player-multiplier current-bet">1.00x</span>
            </span>
        </div>
    `;
    playersList.prepend(playerEl);
}

// Быстрые ставки
const quickBets = [0.1, 0.5, 1, 2, 5];

// Инициализировать игру при загрузке
document.addEventListener('DOMContentLoaded', initGame);

// Добавить обработчик клавиши Escape для закрытия модального окна
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && betModal.style.display === 'flex') {
        betModal.style.display = 'none';
    }
});
