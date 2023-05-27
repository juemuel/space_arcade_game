# Space Arcade Game
- EXP：资源加载和GUI切换（index、gui）、canvas工具类（fx）、按键事件处理（keyhandler）、日间夜间样式切换
- 页面结构：加载页、开始页、游戏页、结束页
- 文件结构
  - index：窗口调整、资源加载
  - gui(game):资源加载和页面显示
    - gameloop(game)：游戏刷新与进程控制
    - game：游戏主体
      - asteroidService：Png敌机
      - player(fx)：Png玩家
        - keyhandler：按键事件
        - projectile：子弹
    - Else
      - particleService：Canvas粒子特效
      - lightdark：日夜模式

## 部署
- npx webpack 生成dist
- 预览dist内的html

## 预览图

![image-20230528001527416](https://s2.loli.net/2023/05/28/3bKqSOrC5wfAQ8B.png)

