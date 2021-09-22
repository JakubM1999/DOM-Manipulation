/* Screen Loader */
const loader = document.querySelector(".loader");
const loaderBackground = document.querySelector(".holy_wrapper");

window.onload = () => {
    setTimeout(function()
    {loader.style.opacity = "0", 
    loaderBackground.style.display = "block";}, 1500);  

}

/* Pong game */

/*Posision classes */
class Vec
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    get len()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set len(value)
    {
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
    }

}

class Rect
{    
    constructor(w, h)
    {
        this.pos = new Vec;
        this.size = new Vec(w, h);
    }
    get left()
    {
        return this.pos.x - this.size.x / 2;
    }
    get right()
    {
        return this.pos.x + this.size.x / 2;
    }
    get top()
    {
        return this.pos.y - this.size.y / 2;
    }
    get bottom()
    {
        return this.pos.y + this.size.y / 2;
    }
}
/* Ball Rect and player Rect classes */

class Ball extends Rect
{
    constructor()
    {
        super(20, 20);
        this.vel = new Vec;
    }
}

class player extends Rect
{
    constructor()
    {
        super(30, 200);
        this.score = 0;
    }
}

class Pong
{   /* Ball Velocity, Posision and Animation */
    constructor(canvas)
    {
        this._canvas = canvas;
        this._context = canvas.getContext("2d")

        this._ball = new Ball;


        this.players = [
            new player,
            new player,
        ];

        this.players[0].pos.x = 40;
        this.players[1].pos.x = this._canvas.width - 40;
        this.players.forEach(player =>{
            player.pos.y = this._canvas.height / 2;
        })

        let lastTime;
        const callback = (millis) => {
            if (lastTime) {
                this.update((millis - lastTime) / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        
        };
        callback();

        this.CHAR_PIXEL = 10;
        this.CHARS = [
            "111101101101111",
            "010010010010010",
            "111001111100111",
            "111001111001111",
            "101101111001001",
            "111100111001111",
            "111100111101111",
            "111001001001001",
            "111101111101111",
            "111101111001111"
        ].map(str => {
            const canvas = document.createElement("canvas");
            canvas.height = this.CHAR_PIXEL * 5;
            canvas.width = this.CHAR_PIXEL * 3;
            const context = canvas.getContext("2d")
            context.fillStyle = "#fff";
            str.split("").forEach((fill, i) => {
                if (fill === "1") {
                    context.fillRect(
                    (i % 3) * this.CHAR_PIXEL,
                    (i / 3 | 0) * this.CHAR_PIXEL,
                    this.CHAR_PIXEL,
                    this.CHAR_PIXEL);
                }
            })
            return canvas;
        })

        this.reset();
    }
    collide(player, ball)
    {
        if (player.left < ball.right && player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top){
            const len = ball.vel.len;
            ball.vel.x = -ball.vel.x;
            ball.vel.y += 300 * (Math.random() - .5);
            ball.vel.len = len * 1.05;
            }
    }
    draw()
    {
        this._context.fillStyle = "#1a1a1a";
        this._context.fillRect(0, 0,
            this._canvas.width, this._canvas.height);

        this.drawRect(this._ball)
        this.players.forEach(player => this.drawRect(player))

        this.drawScore();
    }
    drawRect(rect)
    {
        this._context.fillStyle = "#fff"; 
        this._context.fillRect(rect.left, rect.top,
                               rect.size.x, rect.size.y);
    }
    drawScore()
    {
        const align = this._canvas.width / 3;
        const CHAR_W = this.CHAR_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split("");
            const offset = align * 
                           (index + 1) - 
                           (CHAR_W * chars.length / 2) + 
                           this.CHAR_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0],
                                       offset + pos * CHAR_W, 20);
            })
        })
    }
    reset()
    {
        this._ball.pos.x = this._canvas.width / 2;
        this._ball.pos.y = this._canvas.height / 2;
        this._ball.vel.x = 0;
        this._ball.vel.y = 0;
    }

    start()
    {
        if(this._ball.vel.x === 0 && this._ball.vel.y === 0){
            this._ball.vel.x = 600 * (Math.random() > .5 ? 1 : -1);
            this._ball.vel.y = 600 * (Math.random() * 2 - 1);
            this._ball.vel.len = 400;
        }
    }
/* Ball collision with walls  */
    update = (dt) => {

        this._ball.pos.y += this._ball.vel.y * dt;
        this._ball.pos.x += this._ball.vel.x * dt;

        if (this._ball.left < 0 || this._ball.right > this._canvas.width) {
            let playerId = this._ball.vel.x < 0 | 0;
            this.players[playerId].score++;
            this.reset();
        }
        if (this._ball.top < 0 || this._ball.bottom > this._canvas.height) {
            this._ball.vel.y = -this._ball.vel.y
        }

        this.players[1].pos.y = this._ball.pos.y;

        this.players.forEach(player => this.collide(player, this._ball));

        this.draw();
    }
}

const canvas = document.getElementById("pong");
const pong = new Pong(canvas);

canvas.addEventListener("mousemove", event =>{
    const scale = event.offsetY / event.target.getBoundingClientRect().height
    pong.players[0].pos.y = canvas.height * scale;
})

canvas.addEventListener("click", event =>{
    pong.start();
})


