class Animator {
      constructor(playSpeed, showTime, images) {
          this.playSpeed = playSpeed;
          this.showTime = showTime;
          this.images = images;
          this.timer = 0;
          this.index = 0;
      }
  
      // A method used to update the animation over time.
      update() {
          this.timer += this.playSpeed;
          if (this.timer >= this.showTime) {
              this.timer = 0;
              this.index = (this.index + 1) % this.images.length;
          }
      }
  
      // A method that returns the current image of the animation.
      getImage() {
          return this.images[this.index];
      }
  
      // A method that reset the animation to the first image.
      reset() {
          this.index = 0;
      }
  
  
      // A method that can be used to create an instance of an animator
      // by specifying images' locations instead of instances of HTMLImageElements.
      static create(playSpeed, showTime, imageSources) {
          const images = [];
          for (let i = 0; i < imageSources.length; i++) {
              const image = new Image();
              image.src = imageSources[i];
              images.push(image);
          }
  
          return new Animator(playSpeed, showTime, images);
      }
    }
      
      class Point2D {
          constructor(x, y) {
              this.x = x;
              this.y = y;
          }
      
          // A method that can be used to increase
          // or decrease the value of x and y.
          add(dx, dy) {
              this.x += dx;
              this.y += dy;
          }
      }

class Player {
    constructor(position, animator, movement, collider) {
        this.position = position;
        this.animator = animator;
        this.movement = movement;
        this.collider = collider;
    }

    // A method that update the player's movement and animation.
    update() {
        this.movement.update();
        if (this.movement.isGrounded())
            this.animator.update();
    }

    // A method that draws the player object.
    draw(ctx) {
        ctx.beginPath();
        ctx.drawImage(
            this.animator.getImage(),
            this.position.x,
            this.position.y,
            this.collider.w,
            this.collider.h
        );
        ctx.closePath();
    }

    // A method that starts the jumping behaviour.
    jump() {
        if (this.movement.isGrounded()) {
            this.movement.jump();
            this.animator.reset();
        }
    }

    // A method that returns true if the player's collider 
    // overlaps with one in the list of colliders.
    overlapsWithOthers(others) {
        return this.collider.overlapsWithOthers(others);
    }

    // A method that can be used to create a player by
    // passing an object specifying player details.
    static create(options, groundY) {
        const position = new Point2D(options.startX, groundY);
        const collider = new Collider(position, options.width, options.height);
        const animator = Animator.create(options.playSpeed, options.showTime, options.imageSources);
        const movement = new Movement(position, groundY, options.height, options.jumpPower, options.jumpHeight, options.gravity);
        return new Player(position, animator, movement, collider);
    }
}

class Spawner {
    constructor(obstacles, maxActive, speed, startX, minLength, maxlength) {
        this.obstacles = obstacles;
        this.maxActive = maxActive;
        this.speed = speed;
        this.startX = startX;
        this.minLength = minLength;
        this.maxlength = maxlength;
        this.activeObstacles = [];
        this.lastObstacle = null;
    }

    // A method that can be used to draw the active obstacles.
    draw(ctx) {
        for (let i = 0; i < this.activeObstacles.length; i++)
            this.activeObstacles[i].draw(ctx);
    }

    // A method that can be used to update the spawn behaviour.
    update() {
        // Move active obstacles, and remove them
        // from the active list if they are out of sight.
        for (let i = this.activeObstacles.length - 1; i > -1; i--) {
            this.activeObstacles[i].position.add(-this.speed, 0);

            if (this.activeObstacles[i].position.x < 0)
                this.activeObstacles.splice(i, 1);
        }

        // Try to spawn a new obstacle.
        this.trySpawn();
    }

    // A method that can be used to try spawning an obstacle.
    trySpawn() {
        // Don't allow any spawns if the number of active
        // obstacles is greater or equal to the value
        // of maxActive.
        if (this.activeObstacles.length >= this.maxActive)
            return;

        // Don't allow any spawns if the last obstacle
        // is not far enough away from the spawn position.
        if (this.lastObstacle != null &&
            this.lastObstacle.position.x > this.startX - this.nextSpawnLength)
            return;

        // Get the inactive obstacles and continue if any
        // were found.
        const inactiveObstacles = this.getInactiveObstacles();
        if (inactiveObstacles.length == 0)
            return;

        // Get a random obstacle and spawn it to the scene.
        const randomIndex = Math.floor(Math.random() * inactiveObstacles.length);
        this.spawn(inactiveObstacles[randomIndex]);
    }

    // A method that can be used to spawn an obstacle to the scene.
    spawn(obstacle) {
        // Set it as the last spawned obstacle.
        this.lastObstacle = obstacle;
        // Move it to the start position.
        this.lastObstacle.position.x = this.startX;
        // Add it to the list of active obstacles.
        this.activeObstacles.push(obstacle);
        // Calculate a new spawn length.
        this.nextSpawnLength = Math.floor(Math.random() * this.maxlength + this.minLength);
    }

    // A method that can be used to get a list of inactive obstacles.
    getInactiveObstacles() {
        const inactiveObstacles = [];
        for (let i = 0; i < this.obstacles.length; i++) {
            if (this.obstacles[i].position.x < 0 || this.obstacles[i].x > this.startX)
                inactiveObstacles.push(this.obstacles[i]);
        }
        return inactiveObstacles;
    }

    // A method that can be used to create a spawner by
    // passing an object specifying spawn details.
    static create(options, startX, groundY) {
        for (let i = 0; i < options.obstacles.length; i++) {
            options.obstacles[i].position.x = -1;
            options.obstacles[i].position.y = groundY - options.obstacles[i].h;
        }


        return new Spawner(
            options.obstacles,
            options.maxActive,
            options.speed,
            startX,
            options.minLength,
            options.maxlength);
    }
}

class Background {
    constructor(max, w, h) {
        this.max = max;
        this.w = w;
        this.h = h;
        this.current = max;
        this.decrease = true;
    }

    // A method used to draw the background color,
    // and it also sets an inverse fill and stroke color,
    // used by other objects than the background.
    draw(ctx) {
        // Draw background color.
        ctx.beginPath();
        ctx.fillStyle = `rgb(${this.current}, ${this.current}, ${this.current})`;
        ctx.rect(0, 0, this.w, this.h);
        ctx.fill();
        ctx.closePath();

        // Set inverse colors for other objects.
        const inverse = this.max - this.current;
        ctx.fillStyle = `rgb(${inverse}, ${inverse}, ${inverse})`;
        ctx.strokeStyle = `rgb(${inverse}, ${inverse}, ${inverse})`;
    }

    // A method that can be used to update the background color.
    update() {
        this.current += (this.decrease ? -1 : 1);

        if (this.current == this.max)
            this.decrease = true;
        else if (this.current == 0)
            this.decrease = false;
    }
}

class EndlessRunnerGame {
    constructor(id, frameRate, groundOffset, playerOptions, spawnerOptions, difficulty) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext("2d");
        this.frameRate = frameRate;
        this.groundY = this.canvas.height - groundOffset;
        this.playerOptions = playerOptions;
        this.spawnerOptions = spawnerOptions;
        this.difficulty = difficulty;
        this.initialize();
    }

    // A method used to initialize the game.
    initialize() {
        this.background = new Background(255, this.canvas.width, this.canvas.height);
        this.player = Player.create(playerOptions, this.groundY);
        this.spawner = Spawner.create(spawnerOptions, this.canvas.width, this.groundY);
        this.speed = 0;
        this.score = 0;
        this.gameOver = false;
    }

    // A method used to start the game.
    start() {
        document.addEventListener('keydown', this.keydown.bind(this));
        setInterval(this.loop.bind(this), this.frameRate);
    }

    // A method used to execute the game's keydown events.
    keydown(event) {
        if (event.code == 'Space') {
            // If the game is ended,
            // restart the game.
            if (this.gameOver)
                this.initialize();
            // otherwise, execute the 
            // player's jump behaviour.
            else
                this.player.jump();
        }
    }

    // A method used to execute the game's continuous behaviour.
    loop() {
        // Clear the canvas.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw game objects
        this.background.draw(this.ctx);
        this.drawGround();
        this.drawScore();
        this.player.draw(this.ctx);
        this.spawner.draw(this.ctx);

        // If the game is ended.
        if (this.gameOver) {
            // Draw game over elements.
            this.drawGameOver();

            // otherwise, execute game behaviour.
        } else {
            // Increase difficulty.
            this.increaseDifficulty();

            // Execute update.
            this.background.update();
            this.player.update();
            this.spawner.update();

            // Check for collisions.
            this.gameOver = this.player.overlapsWithOthers(this.spawner.activeObstacles);

            // Increase score.
            this.score++;
        }
    }

    // A method used to increase the game's difficulty.
    increaseDifficulty() {
        if (this.speed < this.difficulty.maxIncreasement) {
            this.speed += this.difficulty.speedIncreasement;
            this.player.movement.jumpPower += this.difficulty.speedIncreasement;
            this.player.movement.gravity += this.difficulty.speedIncreasement;
            this.spawner.speed += this.difficulty.speedIncreasement;
        }
    }

    // A method used to draw the game over text
    // if the game ends.
    drawGameOver() {
        this.ctx.beginPath();
        this.ctx.fillText("GAMEOVER", this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.closePath();
    }

    // A method used to draw the game's score.
    drawScore() {
        this.ctx.beginPath();
        this.ctx.fillText("score: " + this.score, 10, 20);
        this.ctx.closePath();
    }

    // A method used to draw the scene's ground.
    drawGround() {
        this.ctx.beginPath();
        this.ctx.rect(0, this.groundY, this.canvas.width, 3);
        this.ctx.fill();
        this.ctx.closePath();
    }
}
