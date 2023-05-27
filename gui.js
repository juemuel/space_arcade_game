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
import GameLoop from './gameloop.js';
export default class Gui {
  constructor(game) {
    this.cnv = null;
    this.ctx = null;
    this.resources = null;
    this.resourcesToLoad = 0;
    this.gameloop = new GameLoop(game);
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