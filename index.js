import Game from './game.js';
import Gui from './gui.js';
import './index.css'; // 生产环境时在js中引入CSS文件（开发环境时去掉）

// 引入资源文件，生产环境可以直接使用
const playerImg = require('./assets/player01.png').default;
const asteroidHardImg = require('./assets/enemy3.png').default;
const asteroidImg = require('./assets/enemy1.png').default;
const asteroidEasyImg = require('./assets/enemy2.png').default;
const laserAudio = require('./assets/shoot.wav').default;
const boomAudio = require('./assets/enemy-death.wav').default;

let game = new Game();
window.gui = new Gui(game);

window.onload = function(){
  console.log('loading...');
  console.log(asteroidEasyImg,laserAudio,boomAudio)
  window.gui.load([
    {id:"player-img", var:document.createElement("img"), file:playerImg},
    {id:"asteroid-hard", var:document.createElement("img"), file:asteroidHardImg},
    {id:"asteroid-medium", var:document.createElement("img"), file:asteroidImg},
    {id:"asteroid-easy", var:document.createElement("img"), file:asteroidEasyImg},
    {id:"laser-audio", var:document.createElement("audio"), file:laserAudio},
    {id:"boom-audio", var:document.createElement("audio"), file:boomAudio},
  ])
}

// 窗口调整行为：带gui调整
window.onresize = function(){
  console.log('resizing...');
  window.gui.resize();
}
