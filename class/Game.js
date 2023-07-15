import requestAnimFrame from "../util/requestAnimFrame.js";
import Snake from "./Snake.js";
import getPositionCoordinatesFromKey from "../util/getPositionCoordinatesFromKey.js";
import Food from "./Food.js";

export default class Game {
    _size = 500
    _canvas = null
    _text = null
    _lastTime = null
    _gameTime = 0
    _lastGameTime = 0
    _speed = 1
    _gameIsOver = false
    _snake = null
    _food = null
    _blockSize = 20

    _matrix = []

    get size() {
        return this._size
    }

    get $canvas() {
        return this._canvas
    }

    get $text() {
        return this._text
    }

    get ctx() {
        return this._canvas.getContext('2d')
    }

    get lastTime() {
        return this._lastTime
    }

    get gameTime() {
        return this._gameTime
    }

    get lastGameTime() {
        return this._lastGameTime
    }

    get speed() {
        return this._speed
    }

    get gameIsOver() {
        return this._gameIsOver
    }

    get snake() {
        return this._snake
    }

    get food() {
        return this._food
    }

    get blockSize() {
        return this._blockSize
    }

    get matrix() {
        return this._matrix
    }

    set size(payload) {
        this._size = payload
    }

    set $canvas(payload) {
        this._canvas = payload
    }

    set $text(payload) {
        this._text = payload
    }

    set lastTime(payload) {
        this._lastTime = payload
    }

    set gameTime(payload) {
        this._gameTime = payload
    }

    set lastGameTime(payload) {
        this._lastGameTime = payload
    }

    set speed(payload) {
        this._speed = payload
    }

    set gameIsOver(payload) {
        this._gameIsOver = Boolean(payload)
    }

    set snake(payload) {
        this._snake = payload
    }

    set food(payload) {
        this._food = payload
    }

    set blockSize(payload) {
        this._blockSize = payload
    }

    set matrix(payload) {
        this._matrix = payload
    }

    constructor({size = 500, blockSize = 20, speed = 1000}) {
        this.size = size
        this.$canvas = document.createElement('canvas')
        this.$canvas.width = size
        this.$canvas.height = size
        this.speed = speed
        this.blockSize = blockSize

        this.setCanvasToDocument()
            .setButtonsToDocument()
            .generateMatrix()
    }

    setCanvasToDocument() {
        document.querySelector('#game').appendChild(this.$canvas)

        return this
    }

    setButtonsToDocument() {
        let $wrapper = document.createElement('div')
        $wrapper.classList.add('game__actions')

        document.querySelector('#game').appendChild($wrapper)

        let $playButton = document.createElement('button')
        $playButton.type = 'button'
        $playButton.innerText = 'Play'
        $playButton.addEventListener('click', () => {
            this.init()
        })

        $wrapper.appendChild($playButton)

        this.$text = document.createElement('div')
        this.$text.classList.add('game__message')
        $wrapper.appendChild(this.$text)

        let $resetButton = document.createElement('button')
        $resetButton.type = 'button'
        $resetButton.innerText = 'Reset'
        $resetButton.addEventListener('click', () => {
            this.reset()
        })

        $wrapper.appendChild($resetButton)

        return this
    }

    generateMatrix() {
        let result = {}
        console.time('generateMatrix')
        for (let x = 0; x < this.size; x = x + this.blockSize) {
            for (let y = 0; y < this.size; y = y + this.blockSize) {
                result[`${x}_${y}`] = true
            }
        }
        this.matrix = result
        console.timeEnd('generateMatrix')
    }

    init() {
        this.reset()
        this.lastTime = Date.now()
        this.loop()
    }

    loop() {
        if (this.gameIsOver || this.pause) {
            return
        }
        let now = Date.now()
        let delta = (now - Number(this.lastTime || 0)) / 1000


        this.update(delta)
        this.render()

        let snakePosition = Object.assign({}, this.snake.positions[this.snake.positions.length - 1])

        if (snakePosition.x === this.food.position.x && snakePosition.y === this.food.position.y) {
            this.snake.positions.push(snakePosition)
            this.createFood()
        }

        this.lastTime = now

        requestAnimFrame(this.loop.bind(this))
    }

    update(delta) {
        this.gameTime += delta

        if ((this.gameTime - this.speed) >= this.lastGameTime) {
            this.handleInput()
            this.lastGameTime = this.gameTime
        }
    }

    handleInput() {
        switch (input.pressedKey()) {
            case 'UP':
            case 'w':
            case 'W':
                this.snake.moveUp()
                break;
            case 'RIGHT':
            case 'd':
            case 'D':
                this.snake.moveRight()
                break;
            case 'LEFT':
            case 'a':
            case 'A':
                this.snake.moveLeft()
                break;
            case 'DOWN':
            case 's':
            case 'S':
                this.snake.moveDown()
                break;
            default:
                this.snake.move()
        }
    }

    render() {
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.$canvas.width, this.$canvas.height)
        if (!this.gameIsOver) {
            this.renderEntity(this.food)
            this.renderEntity(this.snake)
        }
    }

    renderEntity(entity) {
        this.ctx.save()
        if (Array.isArray(entity.positions)) {
            this.ctx.fillStyle = 'white'
            entity.positions.forEach((item) => {
                this.ctx.fillRect(item.x, item.y, item.size || entity.size, item.size || entity.size)
            })
        }
        if (entity.position) {
            this.ctx.fillStyle = 'red'
            this.ctx.fillRect(entity.position.x, entity.position.y, entity.size, entity.size)
        }

        this.ctx.restore()
    }

    createSnake() {
        this.snake = new Snake({ctx: this, positions: [{x: 0, y: 0}], size: this.blockSize})

        return this
    }

    createFood() {
        console.time('createFood')

        let positionKey = Object.keys(this.matrix)
            .sort(() => Math.random() - 0.5)
            .find((item) => {
                let [x, y] = getPositionCoordinatesFromKey(item)
                x = Number(x)
                y = Number(y)

                return this.snake.positions.find((position) => position.x === x && position.y === y) ? false : true
            })

        if (positionKey) {
            let [x, y] = getPositionCoordinatesFromKey(positionKey)
            console.log(x, y, this.snake.positions)
            this.food = new Food({position: {x, y}, size: this.blockSize})
        } else {
            this.gameFinish()
        }

        console.timeEnd('createFood')
        return this
    }


    reset() {
        this.gameIsOver = false
        this.gameTime = 0
        this.lastTime = 0
        this.lastGameTime = 0
        this.createSnake()
            .createFood()
    }

    gameOver() {
        this.gameIsOver = true
        this.$text.innerText = `Game is over! Score:${this.snake.snakeLength}`
    }

    gameFinish() {
        this.gameIsOver = true
        this.$text.innerText = `You win! Score: ${this.snake.snakeLength}`
    }
}
