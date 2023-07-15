import unionBy from "../util/unionBy.js";

const DIRECTION_UP = 'up'
const DIRECTION_RIGHT = 'right'
const DIRECTION_DOWN = 'down'
const DIRECTION_LEFT = 'left'

export default class Snake {
    _ctx = null
    _positions = [{x: 0, y: 0}]
    _size = 20

    _lastPosition = null
    _lastDirection = 'down'

    get ctx() {
        return this._ctx
    }

    get positions() {
        return this._positions
    }

    get size() {
        return this._size
    }


    get snakeLength() {
        return this._positions.length
    }

    get lastPosition() {
        return this._lastPosition
    }

    get lastDirection() {
        return this._lastDirection
    }

    set ctx(payload) {
        this._ctx = payload
    }

    set positions(payload) {
        this._positions = payload
    }

    set size(payload) {
        return this._size = payload
    }

    set lastPosition(payload) {
        this._lastPosition = payload
    }

    set lastDirection(payload) {
        this._lastDirection = payload
    }


    constructor({ctx, positions, size = 20}) {
        this.ctx = ctx
        this.positions = positions
        this.size = size
    }

    moveUp() {
        if (this.lastDirection === DIRECTION_DOWN) {
            return this.moveDown()
        }
        this.lastPosition = this.positions.shift()
        this.lastDirection = DIRECTION_UP

        if (this.snakeLength) {
            this.positions.push({
                x: this.positions[this.snakeLength - 1]?.x,
                y: this.positions[this.snakeLength - 1]?.y - this.size
            })
        } else {
            this.positions = [{x: this.lastPosition.x, y: this.lastPosition.y - this.size}]
        }

        this.checkSnakePosition()
    }

    moveRight() {
        if (this.lastDirection === DIRECTION_LEFT) {
            return this.moveLeft()
        }
        this.lastPosition = this.positions.shift()
        this.lastDirection = DIRECTION_RIGHT

        if (this.snakeLength) {
            this.positions.push({
                x: this.positions[this.snakeLength - 1]?.x + this.size,
                y: this.positions[this.snakeLength - 1]?.y
            })
        } else {
            this.positions = [{x: this.lastPosition.x + this.size, y: this.lastPosition.y}]
        }

        this.checkSnakePosition()
    }

    moveDown() {
        if (this.lastDirection === DIRECTION_UP) {
            return this.moveUp()
        }
        this.lastPosition = this.positions.shift()
        this.lastDirection = DIRECTION_DOWN

        if (this.snakeLength) {
            this.positions.push({
                x: this.positions[this.snakeLength - 1]?.x,
                y: this.positions[this.snakeLength - 1]?.y + this.size
            })
        } else {
            this.positions = [{x: this.lastPosition.x, y: this.lastPosition.y + this.size}]
        }

        this.checkSnakePosition()
    }

    moveLeft() {
        if (this.lastDirection === DIRECTION_RIGHT) {
            return this.moveRight()
        }
        this.lastPosition = this.positions.shift()
        this.lastDirection = DIRECTION_LEFT

        if (this.snakeLength) {
            this.positions.push({
                x: this.positions[this.snakeLength - 1]?.x - this.size,
                y: this.positions[this.snakeLength - 1]?.y
            })
        } else {
            this.positions = [{x: this.lastPosition.x - this.size, y: this.lastPosition.y}]
        }

        this.checkSnakePosition()
    }

    move() {
        switch (this.lastDirection) {
            case 'up':
                this.moveUp()
                break;
            case 'right':
                this.moveRight()
                break;
            case 'down':
                this.moveDown()
                break;
            case 'left':
                this.moveLeft()
        }
    }

    checkSnakePosition() {
        let x = this.positions[this.snakeLength - 1].x
        let y = this.positions[this.snakeLength - 1].y

        // Если вышли за рамки игровой области
        if (x < 0 || x > this.ctx.size || y < 0 || y > this.ctx.size) {
            return this.gameOver()
        }

        // Если голова воткнулась в туловище
        if (this.positions.findIndex((item) => item.x === x && item.y === y) !== this.snakeLength -1) {
            return this.gameOver()
        }
    }

    gameOver() {
        if (this.ctx && typeof this.ctx.gameOver === "function") {
            this.ctx.gameOver()
        }
    }
}
