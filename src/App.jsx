// import React from 'react';
// import Routers from './router';

// import './app.less';

// const App = () => {
//   return (
//     <Routers></Routers>
//   );
// };

// export default App

import React, { useEffect, useState, useRef } from 'react';
import * as PIXI from 'pixi.js';
import './app.css'
import { base64Images } from './img/base64image';
const urlPr = 'https://dyh-image-bed-1303123520.cos.ap-guangzhou.myqcloud.com/image/2021122'
//创建树对象
const treeObj = function(dir,row,col,trees_num) {
	//定义x周距中心偏移量
	let a_arr = [60,85,110,140];
	let x_arr = [500,495,470,460];//顶层树木距离左边距离-左边
	let x_arr_right = [400,402,407,460];//顶层树木距离左边距离-右边
	let y_all = 370;//水平线距离屏幕下框距离
	let y_top = 190;//水平线距离上边距离
	let center_x = function(a,h) {
		//a -初始中心店距离最近树的距离
		let b = 100;//初始中心点距离视觉焦点的距离
		return (a*(b+h)/b).toFixed(2);
	}
	this.y_py = function(a,max,min) {
		a = a || 10;
		max = max || 19;
		min = min || 1;
		return a-Math.round(Math.random()*max+min);
	}
	this.opt = {
		pic : "../../img/snow/tree.png",
		dir:dir,
		row:row,
		col:col,
		trees_num:trees_num
	}
	this.get_initY = function() {
		return y_all/this.opt.trees_num*this.opt.row+y_top;
	}
	this.get_x = function(h) {
		if(this.opt.dir == 'left') {//左边列
			return x_arr[this.opt.col]-parseFloat(center_x(a_arr[this.opt.col],h));
		} else if(this.opt.dir == 'right') {
			return x_arr_right[this.opt.col]+parseFloat(center_x(a_arr[this.opt.col],h));
		}
	}
	this.get_y = function() {
		return y_all/this.opt.trees_num*this.opt.row+y_top+this.y_py();
	}
	this.get_scale = function(nowH) {
		return (nowH/(y_all))*0.6+0.1;
	}
}

//创建食物对象
const giftObj = function() {
	//定义x周距中心偏移量
	let centerX = 400;
	let y_all = 370;//水平线距离屏幕下框距离
	let y_top = 190;//水平线距离上边距离
	let center_x = function(a,h) {
		//a -初始中心店距离最近树的距离
		let b = 100;//初始中心点距离视觉焦点的距离
		return (a*(b+h)/b).toFixed(2);
	}
	
	//随机范围
	let mathNum = function(min,max) {
		return Math.round(Math.random()*max+min);
	}
	this.num = 0;
	this.mathSpeed = mathNum(1,1);
	
	this.initX = center_x(Math.round(Math.random()*1)==1?mathNum(1,40)*-1:mathNum(1,40),0);;
	
	this.opt = {
		maxWidth:60,
	}
	
	this.get_initY = function() {
		return y_top;
	}
	
	this.get_x = function(h) {
		return centerX+parseFloat(center_x(this.initX,h));
	}
	this.get_y = function() {
//		370/7*i+190+(10-Math.round(Math.random()*19+1));
		return y_all/this.opt.trees_num*this.opt.row+y_top;
	}
	this.get_scale = function(nowH) {
		return (nowH/(y_all))*0.6+0.1;
	}
}

//键盘事件 
const keyboard=(value)=>{
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };
  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };
  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}
const App = (props) => {
  const [pixiObj, setPixiObj] = useState(null);
  const canvasDemo1 = useRef();

  useEffect(() => {
    // 特别说明：pixi.jsv5版本以上默认使用webgl渲染，如果希望可以回退到canvas，需要使用pixi.js-legacy
    console.log('support WebGL:', PIXI.utils.isWebGLSupported())
    if (PIXI.utils.isWebGLSupported()) {
      initFn();
    }
  }, []);

  const initFn = () => {
    console.log('PIXI:', PIXI);
    console.log('canvasDemo1:',canvasDemo1.current)
    const app = new PIXI.Application({
      width: 800,  // default: 800 宽度
      height: 520,  // default: 800 宽度
      antialias: true, //  default: false 反锯齿  使得字体的边界和图形更加平滑
      backgroundAlpha: true, // 透明度
      resolution: 1, // default: 1 分辨率  不同屏幕和分辨率适配
      backgroundColor: 0xffffff
    });
    setPixiObj(app);
    if (!pixiObj) {
      canvasDemo1.current.appendChild(app.view);
    }
    case4(app);
  }
  const case4 = (app) =>{
    //建立背景容器
		let container_bg = new PIXI.Container();
		app.stage.addChild(container_bg);
		let sprite_bg = new PIXI.Sprite.from(base64Images.bg);
		container_bg.addChild(sprite_bg);


    //绘制树
		let container_tree = new PIXI.Container();
		app.stage.addChild(container_tree);
    
    //定义x周距中心偏移量
    let a_arr = [50,80,150,200];

		let center_x = function(a,h) {
			//a -初始中心点距离最近树的距离
			let b = 100;//初始中心点距离视觉焦点的距离
			return (a*(b+h)/b).toFixed(2);
		}

    container_tree.width = 800;
		container_tree.height = 520;

	
		let texture = PIXI.Texture.from('https://dyh-image-bed-1303123520.cos.ap-guangzhou.myqcloud.com/image%2F2021122%2Ftree.png');
		let treesInit = [
			{num:5,dir:'left',col:0},
			{num:7,dir:'left',col:1},
			{num:8,dir:'left',col:2},
			{num:8,dir:'left',col:3},
			{num:5,dir:'right',col:0},
			{num:6,dir:'right',col:1},
			{num:8,dir:'right',col:2},
		]
		let treesArr = [];
		treesInit.map(function(v,index) {
			for (let i = 0; i < v.num; i++) {
				let tree_obj = new treeObj(v.dir,i,v.col,v.num);
				let tree = new PIXI.Sprite.from(texture);
				tree.anchor.set(tree.width/2,tree.height);
				tree.x = tree_obj.get_x(tree_obj.get_initY());
				tree.y = tree_obj.get_y();
				let scale_num = tree_obj.get_scale(tree.y);
				tree.scale.set(scale_num);
				container_tree.addChild(tree);
				treesArr.push({tree:tree,tree_obj:tree_obj});
			}
		})

    app.ticker.add(function(delta) {
			for(let i = 0,l = treesArr.length;i < l; i++) {
				treesArr[i].tree.y+=(1+delta);
				treesArr[i].tree.x = treesArr[i].tree_obj.get_x(treesArr[i].tree.y);
				let scale_num = treesArr[i].tree_obj.get_scale(treesArr[i].tree.y);
				treesArr[i].tree.scale.set(scale_num);
				if(treesArr[i].tree.y >= 560) {
					treesArr[i].tree.y = 190;
					treesArr[i].tree.x = treesArr[i].tree_obj.get_x(treesArr[i].tree.y);
					let scale_num = treesArr[i].tree_obj.get_scale(treesArr[i].tree.y);
					treesArr[i].tree.scale.set(scale_num);
				}
			}
		});

		//绘制树
		// // 创建一个图片精灵
    // app.loader
		// 	.add('sss',`https://dyh-image-bed-1303123520.cos.ap-guangzhou.myqcloud.com/image%2F2021122%2Fpeople.png`)
    // 	.load(setup);
		// function setup() {
		// 	let testPic = new PIXI.Sprite(
		// 		app.loader.resources['sss'].texture
		// 	);
		// 	testPic.scale.set(0.5, 0.5);
		// 	testPic.x = 300;
		// 	testPic.y = 300;
		// 	testPic.position.set(300, 300)
		// 	// 修改旋转中心为图片中心
		// 	testPic.anchor.set(0.5, 0.5)
		// 	app.stage.addChild(testPic);
		// }
		const ground = PIXI.Texture.from('https://dyh-image-bed-1303123520.cos.ap-guangzhou.myqcloud.com/image%2F2021122%2Fpeople.png')
    const tilingSprite2 = new PIXI.Sprite(ground)
    tilingSprite2.y = 150;
    app.stage.addChild(tilingSprite2)
    
    //绘制礼物
    let container_gift = new PIXI.Container();
		app.stage.addChild(container_gift);
		container_gift.width = 800;
		container_gift.height = 520;

    // let gift1 = PIXI.Texture.from('/src/img/gift1.png');
    // let gift2 = PIXI.Texture.from('/src/img/gift2.png');
    // let gift3 = PIXI.Texture.from('/src/img/gift3.png');
    let giftPic = [
			base64Images.gift1,
			base64Images.gift2,
			base64Images.gift3
		];
    let scrollGift = [];

    let k = 0,timeInit;
		let l = scrollGift.length;
		function mathSetGift(flag) {
			timeInit = setTimeout(function() {
				let gift_obj = new giftObj();
				let giftNum = Math.round(Math.random()*2+0);
				gift_obj.num = giftNum;
				let gift = new PIXI.Sprite.from(giftPic[giftNum]);
			    // let gift = new PIXI.Sprite();
			    gift.anchor.set(1);
				gift.x = gift_obj.get_x(0);
			    gift.y = gift_obj.get_initY();
			    gift.scale.set(0.5);
			    container_gift.addChild(gift);
			    scrollGift.push({gift:gift,gift_obj:gift_obj});
			    l = scrollGift.length;
			    //console.log("add "+ l);
			    //console.log(scrollGift.toString());
			    if(flag) {
			    	k++;
			    	if(k >= 4) {
				    	clearTimeout(timeInit);
				    } else {
				    	mathSetGift(true);
				    }
			    }
			},Math.round(Math.random()*4000+1000))
		}
		mathSetGift(true);


    //绘制小人
    let container_p = new PIXI.Container();
    app.stage.addChild(container_p);
    container_p.width = 800
    container_p.height = 520

    let people = PIXI.Sprite.from(base64Images.people)
    container_p.addChild(people)
    people.scale.set(0.6)
    people.x = 400
    people.y = 380
    people.vx = 0
    people.vy = 0

    //给小人键盘事件让其移动
    let left = keyboard("ArrowLeft")
    let up = keyboard("ArrowUp")
    let right = keyboard("ArrowRight")
    let down = keyboard("ArrowDown")

    left.press = () => {
      //Change the cat's velocity when the key is pressed
      people.vx = -5;
      people.vy = 0;
    }
    left.release = () =>{
      if (!right.isDown && people.vy === 0) {
        people.vx = 0;
      }
    }
    right.press = () => {
      people.vx = 5;
      people.vy = 0;
    };
    right.release = () => {
      if (!left.isDown && people.vy === 0) {
        people.vx = 0;
      }
    };
    //Set the game state
    let state = play
    //Start the game loop
    app.ticker.add(delta => gameLoop(delta));
    function gameLoop(delta){
      //Update the current game state:
      state(delta);
    }
    function play(){
      people.x += people.vx
      people.y += people.vy
    }


		//绘制文字
		let style = new PIXI.TextStyle({
			fontFamily: 'Arial',
			fontSize: 36,
			fontStyle: 'italic',
			fontWeight: 'bold',
			fill: ['#ffffff', '#00ff99'], // gradient
			stroke: '#4a1850',
			strokeThickness: 5,
			dropShadow: true,
			dropShadowColor: '#000000',
			dropShadowBlur: 4,
			dropShadowAngle: Math.PI / 6,
			dropShadowDistance: 6,
			wordWrap: true,
			wordWrapWidth: 440
		});
		
		let richText1 = new PIXI.Text('0', style);
		let richText2 = new PIXI.Text('0', style);
		let richText3 = new PIXI.Text('0', style);
		richText1.x = 90;
		richText1.y = 63;
		richText1.anchor.x = 0.5;
		richText1.anchor.y = 0.5;
		richText2.x = 188;
		richText2.y = 63;
		richText2.anchor.x = 0.5;
		richText2.anchor.y = 0.5;
		richText3.x = 280;
		richText3.y = 63;
		richText3.anchor.x = 0.5;
		richText3.anchor.y = 0.5;
		app.stage.addChild(richText1);
		app.stage.addChild(richText2);
		app.stage.addChild(richText3);

				
		let textAdd = new PIXI.Text('+1', style);
		textAdd.x = 420;
		textAdd.y = 200;
		textAdd.anchor.x = 0.5;
		textAdd.anchor.y = 1;
		textAdd.scale.set(0);
		app.stage.addChild(textAdd);

		let count = 0,ani;
		function animate() {
			count+= 0.2;
			textAdd.scale.set(count);
			if(count >= 3) {
				count = 0;
				textAdd.scale.set(0);
				cancelAnimationFrame(ani);
				return;
			}
			ani = requestAnimationFrame(animate);
		}

		//吃掉后加分
		app.ticker.add(function(delta) {
			for(let i = 0,flag = true;i < l; flag?i++:i) {
				let tickObj = scrollGift[i],
				speed = tickObj.gift_obj.mathSpeed;
				tickObj.gift.y+=speed;
				tickObj.gift.x = tickObj.gift_obj.get_x(tickObj.gift.y-190);
				let scale_num = tickObj.gift_obj.get_scale(tickObj.gift.y);
				tickObj.gift.scale.set(scale_num);
				
				if(tickObj.gift.y >= 560) {
					tickObj.gift.y = tickObj.gift_obj.get_initY();
					tickObj.gift.x = tickObj.gift_obj.get_x(0);
					let scale_num = tickObj.gift_obj.get_scale(tickObj.gift.y-190);
					tickObj.gift.scale.set(scale_num);
				}
				
				let people_gift = Math.abs(people.x+50 - tickObj.gift.x);
				if(people_gift < 30 && tickObj.gift.y >= 450) {
					//console.log("del before "+ l+"---i"+i);
					//console.log(scrollGift.toString());
					animate();
					let num = tickObj.gift_obj.num;
					if(num == 0) {
						richText1.text++;
					} else if(num == 1) {
						richText2.text++;
					} else if(num == 2) {
						richText3.text++;
					}
					container_gift.removeChild(tickObj.gift);
					scrollGift.splice(i,1);
					flag = false;
					l = scrollGift.length;
					//console.log("del "+ l+"---i"+i);
					//console.log(scrollGift.toString());
					mathSetGift(false);
					if(scrollGift.length <= 0) break;
				} else {
					flag = true;
				}
			}
		});
  }

  return (
    <div className={'demo-page'}>
      {PIXI.utils.isWebGLSupported() ?
        <div className="demo-canvas" ref={canvasDemo1}></div> :
        <div className="demo-canvas" ref={canvasDemo1}>浏览器暂不支持webgl</div>
      }
    </div>
  );
}

export default App;
