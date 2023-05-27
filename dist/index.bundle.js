/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _particle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _fx_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _asteroids_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);





class Game{
  constructor(){
    this.fx = new _fx_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this.particleService = new _particle_js__WEBPACK_IMPORTED_MODULE_1__.ParticleService();
    this.player = new _player_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.particleService);
    this.asteroidService = new _asteroids_js__WEBPACK_IMPORTED_MODULE_3__.AsteroidService(this.player, this.particleService);
    this.type = null;
  }
  
  init(){
    // console.log("game init");
    this.fx.init();
    this.player.init();
    this.asteroidService.init(8);
    this.particleService.init();
    this.tpye = 1;
  }
  
  
  resize(){
  }
  
  update(){
    this.player.update();
    this.asteroidService.update();
    this.particleService.update();
  }

  renderFillCanvas(type){
    this.type = type;
    switch(type){
      case 2:
        this.fx.fillCanvas("#000");        
        break;
      case 3:
        this.fx.fillCanvas("#fff");
        break;
      default:
        this.fx.fillCanvas("#ffe558");
        break;
    }
  }
  
  render(){
    this.renderFillCanvas(this.type);
    this.player.render();
    this.asteroidService.render();
    this.particleService.render();
  }
  
}



/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _projectile_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _keyhandler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _fx_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);




class Player{
  constructor(particles){
    this.fx = new _fx_js__WEBPACK_IMPORTED_MODULE_2__["default"]();
    this.keyHandler = new _keyhandler_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
    this.projectileService = new _projectile_js__WEBPACK_IMPORTED_MODULE_0__["default"](this);
    this.particles = particles;
    this.img = null;
    this.laserSound = null;
    
    this.turnSpeed = 5;
    this.acceleration = 5;
    this.friction = 0.00;
    
    this.x = 0;
    this.y = 0;
    this.thrust = {x:0, y:0};
    this.angle = 0;
    this.rotation = 0;
    
    // 状态
    this.alive = 1;
    this.dying = 2;
    this.dead = 3;
    
    this.reload = 10;
    this.frames = 0;
    this.state = this.alive;
    this.dyingTime = 240;
  }
  
  init(){
    // 资源加载
    this.fx.init();
    this.img = window.gui.getResouce("player-img");
    this.laserSound = window.gui.getResouce("laser-audio");
    this.boomSound = window.gui.getResouce("boom-audio");
    this.keyHandler.init();
    this.projectileService.init();
    
    // 出生位置
    this.x = this.fx.cnv.width/2 - this.img.width/2;
    this.y = this.fx.cnv.height/2 - this.img.height/2;
    this.thrust = {x:0, y:0};
    // 角度
    this.angle = 0/360*Math.PI;
    this.rotation = 0;
    // 状态
    this.state = this.alive;
    this.dyingTime = 240;
    // 弹药
    this.reload = 10;
    this.frames = 0;
  }

  update(){
    if(this.state == this.dead){
      window.gui.stopGame();
      return;
    }
    if(this.state == this.dying){
      this.dyingTime--;
      this.state = (this.dyingTime>0) ? this.dying : this.dead;
      return;
    }
    // 弹量更新
    this.frames++;
    // 位置更新
    this.rotation = 0;
    this.thrust.x = this.thrust.x * this.friction;
    this.thrust.y = this.thrust.y * this.friction;
    // console.log("画布宽度高度",this.fx.cnv.width,this.fx.cnv.height,"player位置",this.x,this.y)
    // 出界效果
    if(this.x > this.fx.cnv.width){
      this.x = 0 - this.img.width/2;
    }
    if(this.x + this.img.width < 0){
      this.x = this.fx.cnv.width;
    }
    if(this.y > this.fx.cnv.height){
     this.y = 0;
   }
    if(this.y + this.img.height < 0){
     this.y = this.fx.cnv.height;
    }
    
    if(this.keyHandler.keys.indexOf("ArrowUp") > -1){
      // 根据angle的方向来前进（即向上当作x坐标方向）
      this.thrust.x = this.acceleration * Math.sin(this.angle);
      this.thrust.y = - this.acceleration * Math.cos(this.angle);
    }
    if(this.keyHandler.keys.indexOf("ArrowLeft") > -1){
      this.rotation = - this.turnSpeed / 360 * Math.PI;
    }
    if(this.keyHandler.keys.indexOf("ArrowRight") > -1){
      this.rotation = this.turnSpeed / 360 * Math.PI;
    }

    if(this.keyHandler.keys.indexOf(" ") !== -1){
      if(this.frames > this.reload){
        this.frames = 0;
        this.laserSound.pause();
        this.laserSound.currentTime = 0;
        this.laserSound.play();    
        this.projectileService.fire();
      }
    }
    this.angle += this.rotation;
    this.x += this.thrust.x;
    this.y += this.thrust.y;
    this.projectileService.update();
  }
  
  render(){
    this.projectileService.render();
    if(this.state == this.alive){
      this.fx.rotateAndDrawImage(this.img, this.x, this.y, this.angle);
      this.fx.drawCircle(this.x, this.y,5, "gray")
    }
  }
  kill(){
    this.state = this.dying;
    this.particles.spawn(16,this);
    this.boomSound.pause();
    this.boomSound.currentTime = 0;
    this.boomSound.play();
  }
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Projectile: () => (/* binding */ Projectile),
/* harmony export */   "default": () => (/* binding */ ProjectileService)
/* harmony export */ });
/* harmony import */ var _fx_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

// 不止一个的可以设置Service类
class ProjectileService{
  constructor(owner){
    this.owner = owner;
    this.max = 10;
    this.pointer = 0;
    this.collection = [];
  }
  init(){
    this.pointer = 0;
    this.collection = [];
    for(let i = 0; i < this.max; i++){
      let p = new Projectile(this.owner);
      p.init();
      this.collection.push(p);
    }
  }
  update(){
    this.collection.forEach(p=>{
      p.update();
    });
  }
  render(){
    this.collection.forEach(p=>{
      p.render();
    });
  }
  fire(){
    if(this.pointer < this.max){
      this.collection[this.pointer].fire();
      this.pointer++;
    }else{
      this.pointer = 0;
    }
  }
}
class Projectile{
  constructor(owner){
    this.owner = owner;
    
    // 子弹角度、射速、坐标、大小
    this.angle = this.owner.angle;
    this.speed = 8;
    this.x = 0;
    this.y = 0;
    this.size = 3;
    
    this.active = false;
    this.lifeSpan = 100; // 子弹生命周期
    this.alive = this.lifeSpan;
    
    this.fx = new _fx_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }
  init(){
    this.active = false;
    this.fx.init();
  }
  update(){
    if(this.active){
      // 设置子弹方向，在递减alive期间保持
      this.x += Math.sin(this.angle) * this.speed;
      this.y -= Math.cos(this.angle) * this.speed;
      this.alive--;
      this.active = this.alive > 0 ? true :false;
      
      // 出界效果
       if(this.x > this.fx.cnv.width){
         this.x = 0 - this.size;
       }
       if(this.x + this.size < 0){
         this.x = this.fx.cnv.width;
       }
       if(this.y > this.fx.cnv.height){
        this.y = 0;
      }
       if(this.y + this.size < 0){
        this.y = this.fx.cnv.height;
      }
      
    }
  }
  render(){
    if(this.active){
      this.fx.drawCircle(this.x, this.y, this.size, "limegreen");
    }
  }
  // 设置开火角度、子弹起始位置
  fire(){
    this.angle = this.owner.angle;
    this.alive = this.lifeSpan;
    this.x = this.owner.x + this.owner.img.width/2;
    this.y = this.owner.y + this.owner.img.height/2;
    this.active = true;
  }
}

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Fx)
/* harmony export */ });
class Fx{
  constructor(){
    this.cnv = null;
    this.ctx = null;
  }
  
  init(){
    this.cnv = document.getElementById("canvas");
    this.ctx = this.cnv.getContext("2d");
    // var window_height = window.innerHeight;
    // var window_width = window.innerWidth;
    // this.cnv.width = window_width;
    // this.cnv.height = window_height;
  }
  
  fillCanvas(color){
    this.drawRect(0,0,this.cnv.width,this.cnv.height,color);
  }
  
  drawRect(x,y,width,height,color){
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x,y,width,height);
    this.ctx.fill();
  }
  drawCircle(x,y,size,color){
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.arc(x,y,size,0,Math.PI*2);
    this.ctx.fill();
  }
  // 旋转绘制img
  rotateAndDrawImage(image,atx,aty,angle){
    if(image && this.ctx){
      this.ctx.save();
      this.ctx.translate(atx+image.width/2, aty+image.height/2);
      this.ctx.rotate(angle);
      this.ctx.drawImage(image, -image.width/2, -image.height/2);
      this.ctx.restore();
    }
  }
}

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ KeyHandler)
/* harmony export */ });
class KeyHandler {
  constructor() {
    this.keys = [];
  }

  init() {
    window.addEventListener('keydown', (e) => {
      this.keyPressed(e);
    });
    window.addEventListener('keyup', (e) => {
      this.keyReleased(e);
    });
  }
  
  

  
  keyPressed(e) {  
    // 当按下时，如果e.key在数组中不存在，this.keys.indexOf(e.key)则为-1
    if( (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') 
        && this.keys.indexOf(e.key) === -1) {
          this.keys.push(e.key);
    }
  }
  

  keyReleased(e) {  
    if( (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ')
     && this.keys.indexOf(e.key) !== -1){
      this.keys.splice(this.keys.indexOf(e.key), 1);
    }
  }
}

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Particle: () => (/* binding */ Particle),
/* harmony export */   ParticleService: () => (/* binding */ ParticleService)
/* harmony export */ });
/* harmony import */ var _fx_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

class ParticleService {
  constructor(owner) {
    this.collection = [];
    this.fx = new _fx_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }
  init() {
    this.collection = [];
    this.fx.init();
  }
  update() {
    // 因为要用到坐标所以不用forEach了
    for (let i = 0; i < this.collection.length; i++) {
      this.collection[i].update();
      if (this.collection[i].active == false)
        this.collection.splice(i, 1);
    }
  }
  render() {
    this.collection.forEach(p => {
      p.render();
    });
  }
  spawn(total, owner) {
    for (let i = 0; i < total; i++) {
      console.log("1")
      let particle = new Particle(owner);
      this.collection.push(particle);
      particle.init();
      particle.activate();
    }
  }
}
class Particle {
  constructor(owner) {
    this.owner = owner;
    this.angle = 0;
    this.speed = 0;
    this.x = 0;
    this.y = 0;
    this.size = 2;
    this.active = false;

    this.lifeSpan = 100; // 子弹生命周期
    this.alive = this.lifeSpan;
    this.fx = new _fx_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  }
  init() {
    this.active = false;
    this.fx.init();
  }
  update() {
    if (this.active) {
      // 设置子弹方向，在递减alive期间保持
      this.x += Math.sin(this.angle) * this.speed;
      this.y -= Math.cos(this.angle) * this.speed;
      this.alive--;
      this.active = this.alive > 0 ? true : false;
    }
  }
  render() {
    if (this.active) {
      console.log("render")
      this.fx.drawCircle(this.x, this.y, this.size, "#fff");
    }
  }
  activate() {
    this.angle = Math.random()*Math.PI * 2.0;
    this.speed = Math.random()*15;
    this.alive = this.lifeSpan;
    this.x = this.owner.x + this.owner.img.width / 2;
    this.y = this.owner.y + this.owner.img.height / 2;
    this.active = true;
  }
}

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Asteroid: () => (/* binding */ Asteroid),
/* harmony export */   AsteroidService: () => (/* binding */ AsteroidService)
/* harmony export */ });
/* harmony import */ var _fx_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

class AsteroidService{
  constructor(player, particles){
    this.collection = [];
    this.player = player;
    this.particles = particles;
  }
  init(total){
    this.collection = [];
    for (let i = 0; i < total; i++) {
      let asteroid = new Asteroid(1);
      asteroid.init();
      this.collection.push(asteroid)
    }
  }
  update(){
    this.collection.forEach(a => {
      a.update();
      a.checkForCollisionsWithPhasers(this.player.projectileService.collection, this.particles,this);
      a.checkForCollisionsWithPlayer(this.player);
    })
  }
  render(){
    this.collection.forEach(a => {
      a.render();
    })
    
  }
  // 碰撞产生
  spawn(size, total, owner){
    for (var i = 0; i < total; i++) {
      let asteroid = new Asteroid(size);
      asteroid.init();
      asteroid.x = owner.x + owner.img.width/2;
      asteroid.y = owner.y + owner.img.height/2;
      this.collection.push(asteroid);
    }
  }
}
class Asteroid{
  constructor(size){
    this.size = size;
    this.fx = new _fx_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.img = null;
    this.boom = null;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.speed = 0;
    this.rotation = 0.0;
    this.turnrat = 0.0;
    this.active = false;
  }
  init(){
    this.fx.init();
    this.setAsteroidImg()
    this.boom = window.gui.getResouce("boom-audio");
    this.x = 0 + this.img.width/2;
    this.y = 0 + this.img.height/2;
    this.angle = Math.random()*Math.PI*2.0;
    this.speed = Math.random()*Math.PI*0.5;
    this.rotation = 0;
    this.turnrate = Math.random()*(0.04 - - 0.04) + -0.04;
    this.active=true;
  }
  update(){
    if(this.active){
      this.x += Math.sin(this.angle) * this.speed;
      this.y +=  Math.cos(this.angle) * this.speed;
      this.rotation += this.turnrate;
      // 出界效果
       if(this.x > this.fx.cnv.width){
         this.x = 0 - this.img.width/2;
       }
       if(this.x + this.fx.cnv.width < 0){
         this.x = this.fx.cnv.width;
       }
       if(this.y > this.fx.cnv.height){
        this.y = 0;
      }
       if(this.y + this.img.height < 0){
        this.y = this.fx.cnv.height;
      }
    }
  }
  render(){
    if(this.active){
      this.fx.rotateAndDrawImage(this.img, this.x, this.y, this.rotation);
      this.fx.drawCircle(this.x,this.y,5, "gray")
    }
  }
  collisionDetected(){
    this.active = false;
    this.boom.pause();
    this.boom.currentTime = 0;
    this.boom.play();
  }
  
  // 敌机碰撞检测：可以是子弹、也可玩家
  hasCollideWithEntity(entity){
    if(!this.active || !entity.active) return false;
    // 保证在地图内才能被击毁
    if(this.x<0 || this.y<0 || entity.x <0 || entity.y <0) return false;

    // 敌-四个边界外的判定，注意细节～可以先把x,y描出来
    let aLeftOfB = (entity.x + entity.size) < (this.x);
    // let aBelowB = (entity.y + entity.size) > (this.y + this.img.height);
    let aBelowB = (entity.y) > (this.y + this.img.height);
    let aRightOfB = (entity.x) > ( this.x + this.img.width);
    let aAboveB = (entity.y) < (this.y );
    if(!(aLeftOfB || aRightOfB || aAboveB || aBelowB)) console.log("玩家！")
    // 同时满足
    return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
  }
  
  // 敌-子弹碰撞检测
  checkForCollisionsWithPhasers(phasers,particles,service){
    if(this.active){
      phasers.forEach(p=>{
        if(this.hasCollideWithEntity(p)){
          this.collisionDetected();
          let nextSize = ++this.size;
          let total = Math.random() * 4;
          if(nextSize <=3){
            service.spawn(nextSize, total, this);
          }
          particles.spawn(16, this)
          p.active = false;
          return;
        }
      })
    }
  }
  
  // 敌-玩家碰撞检测
  checkForCollisionsWithPlayer(player){
    let active = (player.state == player.alive) ? true:false;
    let entity = {
      type:"player",
      x:player.x,
      y:player.y,
      size: player.img.width,
      active: active,
    }
    if(this.hasCollideWithEntity(entity)){
      console.log("hasCollide")
      player.kill();
    }
  }
  
  setAsteroidImg(){
    switch(this.size){
      case 2:
        this.img = window.gui.getResouce("asteroid-medium");
        break;
      case 3:
        this.img = window.gui.getResouce("asteroid-easy");
        break;
      default:
        this.img = window.gui.getResouce("asteroid-hard");
        break;
    }
  }

}

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gui)
/* harmony export */ });
/* harmony import */ var _gameloop_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/**
 * 结构
 * index：窗口调整、资源加载
 * ---GUI:资源加载和页面显示
 * -----Gameloop：游戏刷新与进程控制
 * ---Game：游戏主体
 * -----AsteroidService：敌机服务
 * -----player(fx)：玩家
 * -------ProjectileService：子弹
 * -------keyhandler：键盘事件
 */

class Gui {
  constructor(game) {
    this.cnv = null;
    this.ctx = null;
    this.resources = null;
    this.resourcesToLoad = 0;
    this.gameloop = new _gameloop_js__WEBPACK_IMPORTED_MODULE_0__["default"](game);
  }

  // 1.1 调整大小
  resize() {
    if (this.cnv) {
      this.cnv.width = window.innerWidth;
      this.cnv.height = window.innerHeight
      console.log("resize:", this.cnv)
    }
  }
  // 1. 调整为canvas为屏幕大小
  prepareCanvas() {
    this.cnv = document.getElementById("canvas");
    this.ctx = this.cnv.getContext("2d");
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    this.resize();
  }
  // 2. 切换显示，通过id切花
  toggleScreen(id, toggle) {
    let element = document.getElementById(id);
    let display = (toggle) ? "block" : "none";
    element.style.display = display;
  }
  // 3.1 关闭所有screen屏
  closeAllScreens() {
    let elements = document.querySelectorAll(".screen");
    [...elements].forEach(e => {
      e.style.display = "none";
    })
  }
  // 3.根据id显示screen
  showScreen(id) {
    console.log("show", id);
    this.closeAllScreens();
    this.toggleScreen(id, true);
  }
  launchIfReady() {
    this.resourcesToLoad--;
    console.log("进度：", this.resourcesToLoad, "/", this.resources.length)
    if (this.resourcesToLoad == 0) {
      this.prepareCanvas();
      //TODO：为什么this.showScreen("start")，是直接进入start页了
      setTimeout(() => { this.showScreen("start") }, 2000);
    }
  }

  beginLoadingImage(imgVar, fileName) {
    imgVar.onload = () => this.launchIfReady();
    imgVar.src = fileName;
  }
  beginLoadingAudio(audioVar, fileName) {
    console.log(fileName);
    audioVar.src = fileName;
    audioVar.addEventListener("canplay", () => this.launchIfReady());
  }
  // 4.加载资源
  load(resources) {
    if (!resources || resources.length == 0) {
      this.preapareCanvas();
      this.showScreen("start");
      return;
    }
    if (resources) {
      console.log("开始加载", resources);
      this.resources = resources;
      this.resourcesToLoad = this.resources.length;
      for (let i = 0; i < this.resources.length; i++) {
        if (this.resources[i].var != undefined) {
          console.log("加载中", this.resources[i].var.nodeName);
          // 元素的nodeName内容是大写的
          if (this.resources[i].var.nodeName == 'IMG') {
            this.beginLoadingImage(
              this.resources[i].var,
              this.resources[i].file);
            console.log("取到IMG：", this.resources[i].var)
          }
          if (this.resources[i].var.nodeName == 'AUDIO') {
            this.beginLoadingAudio(
              this.resources[i].var,
              this.resources[i].file);
            console.log("取到AUDIO：", this.resources[i].var)
          }
        }
      }
    }
  }
  getResouce(id) {
    return this.resources.filter(r => r.id === id)[0].var;
  }
  getResouces() {
    return this.resources;
  }
  startGame() {
    this.closeAllScreens();
    this.prepareCanvas();
    this.showScreen("canvas");
    this.gameloop.start();
  }
  stopGame() {
    this.closeAllScreens();
    this.showScreen("end");
    this.gameloop.stop();
  }
}

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameLoop)
/* harmony export */ });
// 用setInterval控制的Game刷新
class GameLoop{
  constructor(game){
    this.loop = null;
    this.game = game;
  }
  
  start(){
    this.init();
    this.loop = setInterval(()=>{
      this.update();
      this.render();
    }, 1000/60); // 每秒60次
  }
  
  stop(){
    clearInterval(this.loop);
  }
  
  init(){
    if(this.game){
      this.game.init();
    }
  }
  
  resize(){
    if(this.game){
      this.game.resize();
    }
  }
  
  update(){
    if(this.game){
      this.game.update();
    }
  }
  
  render(){
    if(this.game){
      this.game.render();
    }
  }
}

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(14);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(15);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(16);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(17);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),
/* 11 */
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 12 */
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),
/* 13 */
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),
/* 14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),
/* 15 */
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),
/* 16 */
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),
/* 17 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body{\n  background-color: #000;\n  color: #fff;\n  margin: 0px;\n  padding: 0px;\n  font-family: Arial;\n}\n\ni{\n  cursor: pointer;\n  position: absolute;\n  font-size: 3rem; \n  top:25%;\n  left:50%;\n  transform:translate(-50%, -50%)\n}\nbutton{\n  /* 边框：无边框样式、允许border合并（不屑则默认为浏览器默认样式） */\n  outline:none;\n  border: none;\n  border: collapse;\n  border-radius: 8px;\n  /* 大小、位置和背景色：vw、vh真好用，button、list等都适合 */\n  height:6vh;\n  width:10vw;\n  min-width: 100px;\n  min-height: 35px;\n  position: absolute;\n  left:50%;\n  top:65%;\n  transform: translate(-50%, -50%);\n  background-color: #2ecc71;\n  /* 文本、指针 */\n  padding:10px;\n  color:#fff;\n  text-align: center;\n  font-size: 1.5em;\n  overflow: hidden;\n  cursor: pointer;\n}\n\n/* 伪类要靠近元素名写 */\nbutton:hover{\n  background-color: #3498db;\n}\n.screen{\n  /* 绝对定位，使之位于屏幕中央，不会随页面滚动而移动 */\n  position: absolute;\n  left:50%;\n  top:50%;\n  transform: translate(-50%, -50%);\n}\n.screen img{\n  max-width: 100%; \n  max-height: 100%;\n  /* 覆盖全部窗口，无滚轮 */\n  transform: scale(1.5);\n  background-size: cover;\n}\n#load {font-size: 3em;}\n\n#load.screen{\n    animation: fadeIn 2s infinite alternate;\n}\n@keyframes fadeIn{\n  from{opacity: 0;}\n}\n/* 当窗口<768px时 */\n@media (max-width: 900px) {  \n  button {  \n    font-size: 1.2em;  \n  }  \n}\n@media (max-width: 768px) {  \n  button {  \n    font-size: 1em;  \n  }  \n}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 18 */
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),
/* 19 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("assets/player01.png");

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("assets/enemy3.png");

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("assets/enemy1.png");

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("assets/enemy2.png");

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("assets/shoot.wav");

/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("assets/enemy-death.wav");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _gui_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _index_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10);


 // 生产环境时在js中引入CSS文件（开发环境时去掉）

// 引入资源文件，生产环境可以直接使用
const playerImg = (__webpack_require__(20)["default"]);
const asteroidHardImg = (__webpack_require__(21)["default"]);
const asteroidImg = (__webpack_require__(22)["default"]);
const asteroidEasyImg = (__webpack_require__(23)["default"]);
const laserAudio = (__webpack_require__(24)["default"]);
const boomAudio = (__webpack_require__(25)["default"]);

let game = new _game_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
window.gui = new _gui_js__WEBPACK_IMPORTED_MODULE_1__["default"](game);

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

})();

/******/ })()
;