import './style.css'

import Game from "./class/Game.js";

const game = new Game({size: 500, blockSize: 20, speed: .2, teleport: true, dynamicSpeed: {step: 5, percent: 15}})
