var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");

            function setUpTheCanvas() {
                ctx.font = "20px Arial";
                ctx.fillText("X-axis", 940, 480);
                ctx.fillText("Y-axis", 10, 20);
            }
            setUpTheCanvas();

            class Ball {
                constructor(positionP, velocityP, accelerationP, radiusP, contextP, colorP) {
                    this.radius = radiusP;
                    this.context = contextP;
                    this.color = colorP;

                    this.position = {
                        x: positionP.x,
                        y: positionP.y
                    }

                    this.velocity = {
                        x: velocityP.x,
                        y: velocityP.y
                    }

                    this.acceleration = {
                        x: 0,
                        y: accelerationP / 60
                    }
                }

                draw() {
                    this.context.beginPath();
                    this.context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
                    this.context.fill();
                    this.context.fillStyle = this.color;
                }

                move() {
                    this.velocity.x += this.acceleration.x;
                    this.velocity.y += this.acceleration.y;

                    this.position.x += this.velocity.x;
                    this.position.y -= this.velocity.y;
                }
            }

            let launchBtn = document.getElementById("launch");
            let reset = document.getElementById("reset");
            let inputVelocity = document.getElementById("velocity");
            let inputAngle = document.getElementById("angle");


            let Balls = [];

            launchBtn.addEventListener('click', () => {
                performManuaLaunch();
            });

            reset.addEventListener('click', () => {
                clearScreen();
            });

            var originBalls = {
                x: 0,
                y: canvas.height - 1
            }


            window.requestAnimationFrame(loop);
            function loop() {
                for (let i = Balls.length - 1; i >= 0; i--) {
                    Balls[i].draw();
                    Balls[i].move();
                }
                for (let i = Balls.length - 1; i >= 0; i--) {
                    let ball = Balls[i];
                    if (ball.position.y > canvas.height) {
                        Balls.filter((ball) => {
                            return ball.position.y <= canvas.height
                        });
                    }
                }

                window.requestAnimationFrame(loop);
            }


            function performManuaLaunch() {
                let launchData = createManualBall();
                let { ball, velocities, maxHeight, maxDisplacement } = launchData;

                showManualData(velocities, maxHeight, maxDisplacement);
                Balls.push(ball);
            }

            function createManualBall() {
                let mTime, maxDisplacement, maxHeight, mBall;

                let angle = parseFloat(inputAngle.value);
                let velocity = parseFloat(inputVelocity.value);
                let G = -9.807;  //Gravity
                let velY = Math.sin((angle * Math.PI) / 180) * velocity;
                let velX = Math.cos((angle * Math.PI) / 180) * velocity;

                // time
                mTime = Math.abs(velY / G) * 2;
                mTime = mTime.toFixed(3);

                // max range 
                maxDisplacement = (velX * mTime).toFixed(0);

                // maximum height 
                maxHeight = Math.abs((velY * velY) / (2 * G)).toFixed(2);

                mBall = new Ball(originBalls, {
                    x: velX,
                    y: velY
                }, G, 5, ctx, "red");

                return {
                    maxDisplacement,
                    maxHeight,
                    velocities: { x: velX, y: velY },
                    ball: mBall
                }
            }

            function showManualData(velocities, maxHeight, maxDisplacement) {
                document.getElementById('maxHeight').value = parseFloat(maxHeight).toFixed(2);
                document.getElementById('maxDisplacement').value = parseFloat(maxDisplacement).toFixed(2);
            }

            function clearScreen() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setUpTheCanvas();
                document.getElementById("velocity").value = ``;
                document.getElementById("angle").value = ``;
                document.getElementById('maxHeight').value = ``;
                document.getElementById('maxDisplacement').value = ``;
            }