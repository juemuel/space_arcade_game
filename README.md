# Space Arcade Game
- EXP：资源加载和GUI切换（index、gui）、canvas工具类（fx）、按键事件处理（keyhandler）、日间夜间样式切换
- 页面结构：加载页、开始页、游戏页、结束页
- 文件结构
  - index：窗口调整、资源加载
  - GUI(game):资源加载和页面显示
    - Gameloop(game)：游戏刷新与进程控制
  
  - Game：游戏主体
    - AsteroidService：Png敌机
    - Player(fx)：Png玩家
      - Keyhandler：按键事件
      - Projectile：子弹
  
    - Else
      - ParticleService：Canvas粒子特效
      - Lightdark：日夜模式

## 部署
- npx webpack 生成dist
- 预览dist内的html

## 预览图

![image-20230528001527416](https://s2.loli.net/2023/05/28/3bKqSOrC5wfAQ8B.png)

![image-20230528012341443](https://s2.loli.net/2023/05/28/u4SojBPFycMKaNT.png)



![image-20230528012216843](https://s2.loli.net/2023/05/28/uxAobDmaerEhKdH.png)
