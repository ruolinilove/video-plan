
// ==================================
// 背景粒子效果
// effects.js
// ==================================


(function(){


const canvas = document.getElementById(
    "particleCanvas"
);


if(!canvas)return;



const ctx = canvas.getContext(
    "2d"
);



let width;
let height;



let particles=[];



let mouse={

    x:-1000,

    y:-1000

};





// 屏幕尺寸

function resize(){


width=canvas.width=
window.innerWidth;


height=canvas.height=
window.innerHeight;


}



resize();



window.addEventListener(
"resize",
resize
);




// 鼠标位置

window.addEventListener(
"mousemove",
(e)=>{


mouse.x=e.clientX;

mouse.y=e.clientY;


});







// 创建粒子


for(let i=0;i<120;i++){


particles.push({


x:Math.random()*width,


y:Math.random()*height,


size:
Math.random()*3+1,


speedX:
(Math.random()-0.5)*0.4,


speedY:
(Math.random()-0.5)*0.4,


opacity:
Math.random()*0.5+0.2



});



}







function draw(){



ctx.clearRect(
0,
0,
width,
height
);




particles.forEach((p)=>{



// 鼠标影响

let dx =
mouse.x-p.x;


let dy =
mouse.y-p.y;



let distance =
Math.sqrt(
dx*dx+dy*dy
);



if(distance<180){


p.x-=dx*0.003;

p.y-=dy*0.003;


}







// 移动


p.x+=p.speedX;

p.y+=p.speedY;





// 边界


if(
p.x<0||
p.x>width
)

p.speedX*=-1;



if(
p.y<0||
p.y>height
)

p.speedY*=-1;








// 粒子


ctx.beginPath();



ctx.arc(

p.x,

p.y,

p.size,

0,

Math.PI*2

);



ctx.fillStyle=

`rgba(
59,
130,
246,
${p.opacity}
)`;


ctx.fill();







});





requestAnimationFrame(
draw
);


}





draw();





})();






// ==================================
// 登录框轻微视差
// ==================================



window.addEventListener(
"mousemove",
(e)=>{


const box =
document.getElementById(
"loginBox"
);



if(!box)return;



const x =
(e.clientX-window.innerWidth/2)
/50;



const y =
(e.clientY-window.innerHeight/2)
/50;




box.style.transform=

`translate(
${x}px,
${y}px
)`;


});
