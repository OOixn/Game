// Canvas 요소 가져오기
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Canvas 크기 설정
canvas.width = 1000;
canvas.height = 600;

// 게임 변수 초기화
let score = 0;
let scoreInterval;
let time = 60;
let timeInterval;
let timer = 0;
let animation;
let jump = false;
let jumpTimer = 0;
let down = false;

// 캐릭터 이미지 로드
let imgBasic = new Image();
imgBasic.src = "./img/basic.png";

const imgJump = new Image();
imgJump.src = "./img/jump.png";

const imgDown = new Image();
imgDown.src = "./img/Down.png";

imgBasic.onload = () => {
  character.draw();
};

// 캐릭터
let character = {
  x: 20,
  y: canvas.height - 240,
  width: 70,
  height: 120,
  img: imgBasic,

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  },
};

// 장애물 이미지 배열
const obstacleImages = [];

const imgObstacle1 = new Image();
imgObstacle1.src = "./img/1.png";
obstacleImages.push(imgObstacle1);

const imgObstacle2 = new Image();
imgObstacle2.src = "./img/2.png";
obstacleImages.push(imgObstacle2);

const imgObstacle3 = new Image();
imgObstacle3.src = "./img/3.png";
obstacleImages.push(imgObstacle3);

// 장애물 종류를 나타내는 클래스
class Obstacle {
  constructor(x, y, width, height, speed, image) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.speed = speed;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move() {
    this.x -= this.speed;
  }
}

// 장애물 타입
const obstacles = [];
const obstacleTypes = [
  { width: 50, height: 46, speed: 2, image: obstacleImages[0] },
  { width: 51, height: 39, speed: 3, image: obstacleImages[1] },
  { width: 50, height: 50, speed: 4, image: obstacleImages[2] },
];

// 초기 장애물을 생성하는 함수
function initObstacles() {
  for (let i = 0; i < 3; i++) {
    // 3번 반복
    obstacles.push(getRandomObstacle()); // 임의의 장애물을 생성하여 obstacles 배열에 추가
  }
}

// 임의의 장애물을 생성하는 함수
function getRandomObstacle() {
  // 장애물 종류를 무작위로 선택
  const randomIndex = Math.floor(Math.random() * obstacleTypes.length);
  // 선택한 종류에 해당하는 정보 가져오기
  const type = obstacleTypes[randomIndex];
  // x 좌표는 캔버스 오른쪽 끝부터 시작
  const x = canvas.width;
  let y;
  // 장애물 종류에 따라 y 좌표 설정
  if (randomIndex === 2) {
    y = canvas.height - 220 - type.height; // index 2 장애물의 y 위치
  } else {
    y = canvas.height - 120 - type.height; // 일반 장애물의 y 위치
  }
  // 새로운 장애물 객체를 생성하여 반환
  return new Obstacle(x, y, type.width, type.height, type.speed, type.image);
}

// 장애물 이동을 처리하는 함수
function moveObstacles() {
  // 모든 장애물에 대해 반복
  for (const obstacle of obstacles) {
    // 각 장애물을 이동 시킴
    obstacle.move();
  }
}

// 충돌 확인
function checkCollisions() {
  for (const obstacle of obstacles) {
    if (
      (character.x < obstacle.x + obstacle.width - 110 && // 캐릭터의 왼쪽 경계가 장애물의 오른쪽 경계보다 왼쪽에 있고
        character.x + character.width > obstacle.x && // 캐릭터의 오른쪽 경계가 장애물의 왼쪽 경계보다 오른쪽에 있으며
        character.y < obstacle.y + obstacle.height - 10 && // 캐릭터의 상단 경계가 장애물의 하단 경계보다 위쪽에 있고
        character.y + character.height > obstacle.y) ||
      time === 0
    ) {
      // 캐릭터의 하단 경계가 장애물의 상단 경계보다 아래쪽에 있으면
      endGame(); // 게임을 종료함
    }
  }
}

// 게임 종료
function endGame() {
  // 현재 게임 애니메이션 프레임 초기화
  cancelAnimationFrame(animation);
  // 스코어 인터벌을 초기화
  clearInterval(scoreInterval);
  // 장애물 배열을 초기화
  obstacles.length = 0;

  // 화면에 게임 오버 메시지와 스코어를 표시
  ctx.fillStyle = "black";
  ctx.font = "48px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 40);
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 40, canvas.height / 2 + 20);
  // 게임 시작시 사라졌던 플레이 버튼 화면에 표시
  playBtn.style.display = "block";
}

// 스코어를 그리는 함수
function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function drawTime() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Time: ${time}`, 180, 30);
}

// 스코어를 1씩 증가시키는 함수
function increaseScore() {
  score++;
}

function decreaseTime() {
  time--;
}

// 스페이스바 입력 확인
imgJump.onload = function () {
  document.addEventListener("keydown", function (e) {
    // 만약 이벤트의 키 코드가 "Space" (스페이스바)인 경우 이미지를 점프 이미지로 변경하고 점프 상태로 만들어줌
    if (e.code === "Space") {
      character.img = imgJump;
      jump = true;
    }
  });
};

// 방향키 아래 버튼 입력 확인
imgDown.onload = function () {
  document.addEventListener("keydown", function (e) {
    if (e.code === "ArrowDown") {
      // 아래 방향키를 눌렀을 경우 캐릭터 y위치가 canvas.height - 240 보다 작을 경우만 엎드림
      if (character.y < canvas.height - 235) {
        character.width = 115;
        character.height = 75;
        character.img = imgDown;
        down = true;

        // 캐릭터의 너비와 높이 값을 변경하게 되면 하늘에 뜬 것처럼 되어 y좌표를 조정
        character.y += 50;

        // 캐릭터의 충돌 박스 정보를 저장
        character.collisionX = character.x;
        character.collisionY = character.y;
        character.collisionWidth = character.width;
        character.collisionHeight = character.height;
      }
    }
  });
};

//방향키 아래 버튼 떼어졌을시 다시 기본 값으로 조정
document.addEventListener("keyup", function (e) {
  if (e.code === "ArrowDown") {
    character.width = 70;
    character.height = 120;
    down = false;
    character.y -= 50;
    character.img = imgBasic;
  }
});

// 프레임마다 장애물 생성, 실행 횟수는 모니터 fps에 따라 다를 수 있음.
function animate() {
  // 애니메이션 프레임을 요청하여 게임 루프를 구현
  animation = requestAnimationFrame(animate);
  timer++; // 타이머를 증가시켜 시간 경과를 추적
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveObstacles();

  // 240프레임(4초)마다 새로운 장애물을 생성
  if (timer % 240 === 0) {
    obstacles.push(getRandomObstacle());
  }

  // array에 담겨 있는 장애물을 모두 그려줌, x좌표가 0 미만이면 제거, 스코어 100점 추가
  obstacles.forEach((a, i, o) => {
    if (a.x + a.width < 0) {
      o.splice(i, 1);
      score += 100;
    }
    a.draw();
  });

  // 충돌 확인
  checkCollisions();

  // 점프
  if (jump == true) {
    // 점프 상태인 경우 캐릭터의 y 좌표가 300보다 크면
    if (character.y > 250) {
      character.y -= 5; // 점프 속도 5
    } else {
      // 캐릭터가 점프 중인데 300에 도달한 경우 점프 상태를 해제함
      character.y = 250;
      jump = false;
    }
  }

  if (jump == false) {
    // 점프 상태가 아닌 경우 이미지를 기본 이미지로 변경, 캐릭터가 y 좌표 canvas.height - 265까지 내려오게 함
    if (character.y < canvas.height - 240) {
      character.y += 5; // 내려오는 속도 5
      character.img = imgBasic;
    }
  }
  // 점프 타이머가 100 이상인 경우 (점프 시간이 100프레임 이상인 경우) 점프 상태를 해제하고 점프 타이머를 재설정
  if (jumpTimer > 100) {
    jump = false;
    jumpTimer = 0;
  }

  drawScore();
  drawTime();
  character.draw();
}

let playBtn = document.getElementById("playBtn");

playBtn.addEventListener("click", function () {
  cancelAnimationFrame(animation);
  animation = requestAnimationFrame(animate);
  score = 0;
  scoreInterval = setInterval(increaseScore, 1000);
  time = 60;
  timeInterval = setInterval(decreaseTime, 1000);
  playBtn.style.display = "none";
});

// 초기화 함수 호출
initObstacles();
