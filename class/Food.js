export default class Food {
    _position = null
    _size = 20


    get position() {
        return this._position
    }

    get size() {
        return this._size
    }

    set ctx(payload) {
        this._ctx = payload
    }

    set position(payload) {
        this._position = payload
    }

    set size(payload) {
        this._size = payload
    }

    constructor({ position, size = 20}) {
        this.position = position
        this.size = size
    }
}
