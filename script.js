document.addEventListener('DOMContentLoaded', function() {

    const gameArena = document.getElementById('game-arena');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false; // Flag to check if the game has started 
    let food = { x: 300, y: 200 }; // Initial food position
    let snake = [{ x: 160, y: 200 } , { x: 140, y: 200 }, { x: 120, y: 200 }]; // Initial snake position    
    // const snakeGame = new SnakeGame(gameArena);
    // snakeGame.start();

    let dx = cellSize; 
    let dy = 0; // Initial direction of the snake
    let intervalId; 
    let gameSpeed = 200; // Initial game speed

    function moveFood() {
        // Generate random position for food
        let newX, newY;
        do {
            newX = Math.floor(Math.random() * 30) * cellSize;
            newY = Math.floor(Math.random() * 30) * cellSize;
        } while (snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY)); // Ensure food doesn't spawn on the snake
            food = { x: newX, y: newY };
    }

    function updateSnake() {
    
        // Calculate new head position
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead); // Add new head to the front of the snake

        // Check  collisions with food
        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10; // Increase score
            moveFood(); // Move food to a new position
            if (gameSpeed > 50) {
                
                clearInterval(intervalId); // Clear the previous interval
                gameSpeed -= 10; // Increase game speed
                gameLoop(); // Start a new game loop with the updated speed
            }
        }else {
            snake.pop(); // Remove the last segment of the snake if no food is eaten

        }
        // Check if the snake has eaten the food
        // if (newHead.x === food.x && newHead.y === food.y) {
        //     score += 5; // Increase score
        //     moveFood(); // Move food to a new position
        // } else {
        //     snake.pop(); // Remove the last segment of the snake if no food is eaten
        // }

       // drawFoodAndSnake(); // Redraw the game arena
    }


    function changeDirection(e){
        console.log("key pressed", e.key);
        // Prevent the snake from going in the opposite direction
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;
        if(e.key==='ArrowUp' && !isGoingDown){
            dy = -cellSize;
            dx = 0;
        } else if(e.key==='ArrowDown' && !isGoingUp) {
            dy = cellSize;
            dx = 0;
        } else if(e.key==='ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if(e.key==='ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    function drawDiv(x, y, className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;

    }


    function drawFoodAndSnake() {
        gameArena.innerHTML = ''; // Clear the arena
        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        })

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }

    function isGameOver() {
    
        // Check if the snake collides with itself
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                return true; // Game over
            }
        }

        // Check if the snake hits the walls
        const HittingLeftWall = snake[0].x < 0;
        const HittingRightWall = snake[0].x > arenaSize- cellSize;
        const HittingTopWall = snake[0].y < 0;
        const HittingBottomWall = snake[0].y > arenaSize- cellSize;

        return HittingLeftWall  || HittingRightWall || HittingTopWall || HittingBottomWall;
    }

    function gameLoop() {
        intervalId = setInterval(() => {
            if (isGameOver()) {
                clearInterval(intervalId);
                alert(`Game Over! Your score is ${score}`);
                gameStarted = false;
                return;
            }
       updateSnake(); 
       drawFoodAndSnake();
       drawScoreBoard(); // Update the score board
    }, gameSpeed); 
}
    function runGame() {
        if (!gameStarted) {
            gameStarted = true;
            document.addEventListener('keydown', changeDirection);
            // drawFoodAndSnake();
            gameLoop();
        }
    }

    function drawScoreBoard(){
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`;
        
    }

    // Function to initiate the game

    function initiateGame() {

        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';

        document.body.insertBefore(scoreBoard, gameArena);

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');

        


        startButton.addEventListener('click',  function startGame()  {
            startButton.style.display = 'none';

            runGame();
        });
          document.body.appendChild(startButton);
    }

    initiateGame()
});

