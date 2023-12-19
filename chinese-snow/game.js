const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 2000;
canvas.height = 1600;

let words = ['安全', '不仅', '表扬', '表达', '安排', '博士', '本来', '抱歉', '不但', '安静']; // HSK 4급 수준의 중국어 단어
// let words = ['단어1', '단어2', '단어3', '단어4', '단어5', '단어6', '단어7', '단어8', '단어9', '단어10']; // HSK 4급 수준의 중국어 단어로 대체
let fallingWords = [];
let score = 0;
let lives = 88;
let gameSpeed = 0.5; // 초기 단어 떨어지는 속도 낮춤
let acceleration = 0.0005; // 가속도 증가량 낮춤

// 나머지 게임 로직은 이어서 설명할게. continue라고 말해줘.
document.getElementById('submitWord').addEventListener('click', submitWord);
document.getElementById('wordInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    submitWord();
  }
});

function submitWord() {
  const inputWord = document.getElementById('wordInput').value;
  for (let i = 0; i < fallingWords.length; i++) {
    if (fallingWords[i].text === inputWord) {
      fallingWords.splice(i, 1);
      score++;
      break;
    }
  }
  document.getElementById('wordInput').value = '';
}

let availableWords = [...words]; // 사용 가능한 단어들을 복사

function addFallingWord() {
  if (availableWords.length === 0) {
    // 모든 단어를 사용했다면, 배열을 다시 초기화
    availableWords = [...words];
  }

  // 랜덤한 단어 선택
  const wordIndex = Math.floor(Math.random() * availableWords.length);
  const word = availableWords[wordIndex];

  // 선택된 단어 제거
  availableWords.splice(wordIndex, 1);

  const x = Math.random() * (canvas.width - 100); // 단어 너비 고려
  fallingWords.push({
    text: word,
    x: x,
    y: 0,
    xSpeed: (Math.random() * 2 - 1), // -1과 1 사이의 무작위 속도로 조정
    xDirectionChange: Math.random() * 100 + 50 // 50에서 150 사이의 프레임마다 방향 변경
  });
}


function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);



  // 점수와 목숨 표시
  ctx.fillStyle = 'black'; // 텍스트 색상
  ctx.font = '70px Arial'; // 텍스트 폰트
  ctx.fillText(`Score: ${score}`, 50, 100); // 왼쪽 상단에 점수 표시
  ctx.fillText(`Life: ${lives}`, canvas.width - 280, 100); // 오른쪽 상단에 목숨 표시

  // 단어의 스타일 설정
  ctx.font = '50px Arial'; // Increase font size
  ctx.fillStyle = 'white'; // White color for snow effect
  ctx.shadowColor = 'lightblue'; // Light blue shadow for icy effect
  ctx.shadowBlur = 5; // Shadow blur to enhance the icy effect
  

  for (let i = 0; i < fallingWords.length; i++) {
    let word = fallingWords[i];
    // 단어 그리기
    ctx.fillText(word.text, word.x, word.y); // 텍스트 채우기
    ctx.strokeText(word.text, word.x, word.y); // 텍스트 테두리 그리기

    // 서서히 속도와 방향을 변경
    if (word.xDirectionChange <= 0) {
        word.xDirectionChange = Math.random() * 100 + 50;
        word.targetXSpeed = -word.xSpeed; // 새 목표 속도 설정
    } else {
        word.xDirectionChange--;
    }

    // 현재 속도를 목표 속도에 점차적으로 맞춤
    if (word.xSpeed < word.targetXSpeed) {
        word.xSpeed += 0.1; // 점차 가속
    } else if (word.xSpeed > word.targetXSpeed) {
        word.xSpeed -= 0.1; // 점차 감속
    }

    word.x += word.xSpeed;
    word.y += gameSpeed;

    // 단어가 화면 밖으로 나가지 않도록 범위 조절
    if (word.x < 0 || word.x > canvas.width) {
        word.xSpeed *= -1;
    }

    if (word.y > canvas.height) {
      fallingWords.splice(i, 1);
      lives--;
      if (lives <= 0) {
        alert('Game Over');
        return;
      }
    } else {
      ctx.fillText(word.text, word.x, word.y);
    }
  }

  gameSpeed += acceleration; // 가속도 적용
  requestAnimationFrame(updateGame);
}


// 게임 시작
addFallingWord();
setInterval(addFallingWord, 2000); // 2초마다 새 단어 추가
requestAnimationFrame(updateGame);
