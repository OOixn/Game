// Canvas 요소 가져오기
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Canvas 크기 설정
canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// 스코어 변수 초기화
let score = 0;
let scoreInterval;

// 스코어를 화면에 표시할 위치 설정
const scoreX = 20;
const scoreY = 20;

// 스코어를 그리는 함수
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, scoreX, scoreY);
}

// 스코어를 1씩 증가시키는 함수
function increaseScore() {
  score++;
}

// 게임 시작시 스코어 초기화 및 스코어 증가 함수 주기적 실행
score = 0;
scoreInterval = setInterval(increaseScore, 1000);

// 캐릭터 이미지 로드
let img1 = new Image();
img1.src = "./img/basic.png";
img1.onload = () => {
  character.draw();
};

// 캐릭터
let character = {
  x: 20,
  y: canvas.height - 150,
  width: 50,
  height: 100,
  draw() {
    // 이미지 대신 직사각형을 그리기 위해 fillRect 사용
    // ctx.fillStyle = "green";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.Image(this.x, this.y, this.width, this.height);
  },
};

// 장애물은 크기나 모양이 다를 수 있으므로 클래스로 만드는게 일반적이라고 함.
class Cactus {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height - 80;
    this.width = 50;
    this.height = 50;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  setRandomX() {
    this.x = canvas.width + Math.floor(Math.random() * canvas.width);
  }
}

// 장애물 그리기
let cactus = new Cactus();
cactus.draw();

// 프레임마다 장애물을 생성하기 위한 timer 설정
let timer = 0;

// 장애물을 여러개 관리하기 위한 배열
let cacti = [];

// 점프처리를 위한 설정 값
let jump = false;
let jumptimer = 0;

let animation;

// 프레임마다 장애물을 생성, 실행 횟수는 모니터 fps에 따라 다를 수 있음.
function animate() {
  //화면 갱신을 최적화하기 위한 함수
  animation = requestAnimationFrame(animate);
  timer++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 장애물을 여러개 관리 해주기 위해 배열을 만들고 cactus를 생성 할 때 마다 배열에 추가
  if (timer % 240 === 0) {
    let cactus = new Cactus();
    cactus.setRandomX();
    cacti.push(cactus);
  }

  // 배열에 담겨 있는 장애물을 모두 그려줌, x좌표가  0 미만이면 제거, 스코어 100점 추가
  cacti.forEach((a, i, o) => {
    if (a.x < 0) {
      o.splice(i, 1);
      score += 100;
    }
    a.x -= 4;
    collision(character, a);
    a.draw();
  });

  // 점프
  if (jump == true) {
    if (character.y > 200) {
      character.y -= 5;
    } else {
      character.y = 200;
      jump = false;
    }
  }

  if (jump == false) {
    if (character.y < canvas.height - 410) {
      character.y += 5;
    }
  }

  if (jumptimer > 100) {
    jump = false;
    jumptimer = 0;
  }
  drawScore();
  character.draw();
}

let playBtn = document.getElementById("playBtn");

playBtn.addEventListener("click", play);

function play() {
  playBtn.removeEventListener("click", play);
  playBtn.style.color = "#3d3f45";
  getScore = 0;
  turn = 0;
  animate();
}

// 장애물 생성

// 충돌 확인
function collision(character, cactus) {
  // 충돌 영역 계산
  const characterLeft = character.x;
  const characterRight = character.x + character.width;
  const characterTop = character.y;
  const characterBottom = character.y + character.height;

  const cactusLeft = cactus.x;
  const cactusRight = cactus.x + cactus.width;
  const cactusTop = cactus.y;
  const cactusBottom = cactus.y + cactus.height;

  // 충돌 여부 확인
  if (characterLeft < cactusRight && characterRight > cactusLeft && characterTop < cactusBottom && characterBottom > cactusTop) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animation);
  }
}

// 스페이스바 입력 감지
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    jump = true;
  }
});
