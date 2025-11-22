// ジャンケンの選択肢（表示用、サーバーから取得した値で更新される）
let choices = {
    rock: { emoji: '🪨', name: 'グー' },
    scissors: { emoji: '✂️', name: 'チョキ' },
    paper: { emoji: '📄', name: 'パー' }
};

// ゲームの状態
let playerScore = 0;
let computerScore = 0;
let playerChoice = null;

// APIのベースURL
const API_BASE_URL = '';

// DOM要素の取得
const rockBtn = document.getElementById('rock-btn');
const scissorsBtn = document.getElementById('scissors-btn');
const paperBtn = document.getElementById('paper-btn');
const playerChoiceDisplay = document.getElementById('player-choice-display');
const computerChoiceDisplay = document.getElementById('computer-choice-display');
const resultMessage = document.getElementById('result-message');
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const resetBtn = document.getElementById('reset-btn');

// イベントリスナーの設定
rockBtn.addEventListener('click', () => playGame('rock'));
scissorsBtn.addEventListener('click', () => playGame('scissors'));
paperBtn.addEventListener('click', () => playGame('paper'));
resetBtn.addEventListener('click', resetGame);

// ゲームのメインロジック（APIを呼び出す）
async function playGame(playerChoiceValue) {
    // プレイヤーの選択を保存
    playerChoice = playerChoiceValue;
    
    // ボタンを無効化（連続クリック防止）
    setButtonsEnabled(false);
    
    try {
        // APIを呼び出してサーバー側で処理
        const response = await fetch(`${API_BASE_URL}/api/play`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ choice: playerChoiceValue })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        // サーバーから返された選択肢情報を更新
        if (data.choices) {
            choices = data.choices;
        }
        
        // UIを更新
        updateChoiceDisplay(playerChoiceDisplay, data.player_choice, 'あなた');
        updateChoiceDisplay(computerChoiceDisplay, data.computer_choice, 'コンピューター');
        
        // 結果を表示
        displayResult(data.result);
        
        // スコアを更新
        updateScore(data.result);
        
        // 選択ボタンのスタイルを更新
        updateButtonStyles(playerChoiceValue);
    } catch (error) {
        console.error('Error:', error);
        resultMessage.textContent = 'エラーが発生しました';
        resultMessage.classList.remove('win', 'lose', 'draw');
    } finally {
        // ボタンを再有効化
        setButtonsEnabled(true);
    }
}

// 選択肢の表示を更新
function updateChoiceDisplay(displayElement, choiceValue, playerName) {
    const emojiElement = displayElement.querySelector('.choice-emoji');
    const nameElement = displayElement.querySelector('.choice-name');
    
    emojiElement.textContent = choices[choiceValue].emoji;
    nameElement.textContent = playerName;
    
    // アニメーション効果
    emojiElement.classList.add('animate');
    setTimeout(() => {
        emojiElement.classList.remove('animate');
    }, 500);
}

// 結果を表示
function displayResult(result) {
    resultMessage.classList.remove('win', 'lose', 'draw');
    
    switch (result) {
        case 'win':
            resultMessage.textContent = '🎉 あなたの勝ち！';
            resultMessage.classList.add('win');
            break;
        case 'lose':
            resultMessage.textContent = '😢 あなたの負け...';
            resultMessage.classList.add('lose');
            break;
        case 'draw':
            resultMessage.textContent = '🤝 あいこ！';
            resultMessage.classList.add('draw');
            break;
    }
}

// スコアを更新
function updateScore(result) {
    if (result === 'win') {
        playerScore++;
        playerScoreDisplay.textContent = playerScore;
    } else if (result === 'lose') {
        computerScore++;
        computerScoreDisplay.textContent = computerScore;
    }
}

// ボタンのスタイルを更新
function updateButtonStyles(selectedChoice) {
    // すべてのボタンからselectedクラスを削除
    [rockBtn, scissorsBtn, paperBtn].forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 選択されたボタンにselectedクラスを追加
    const selectedBtn = document.querySelector(`[data-choice="${selectedChoice}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
}

// ボタンの有効/無効を切り替え
function setButtonsEnabled(enabled) {
    [rockBtn, scissorsBtn, paperBtn].forEach(btn => {
        btn.disabled = !enabled;
        btn.style.opacity = enabled ? '1' : '0.6';
        btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
    });
}

// ゲームをリセット
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    playerChoice = null;
    
    playerScoreDisplay.textContent = '0';
    computerScoreDisplay.textContent = '0';
    
    playerChoiceDisplay.querySelector('.choice-emoji').textContent = '?';
    playerChoiceDisplay.querySelector('.choice-name').textContent = 'あなた';
    computerChoiceDisplay.querySelector('.choice-emoji').textContent = '?';
    computerChoiceDisplay.querySelector('.choice-name').textContent = 'コンピューター';
    
    resultMessage.textContent = '選択してください';
    resultMessage.classList.remove('win', 'lose', 'draw');
    
    [rockBtn, scissorsBtn, paperBtn].forEach(btn => {
        btn.classList.remove('selected');
    });
}

