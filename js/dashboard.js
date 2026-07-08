
// =================================
// 数据图表
// charts.js
// =================================



// 创建饼图


function createStatusChart(data){


const dom = 
document.getElementById(
"statusChart"
);



if(!dom)return;



let chart =
echarts.init(dom);




chart.setOption({


tooltip:{


trigger:"item"


},



legend:{


bottom:10


},




series:[{


name:"视频状态",


type:"pie",


radius:[
"50%",
"75%"
],



data:data,



label:{


show:true,

formatter:"{b} {c}条"


}




}]



});





window.addEventListener(
"resize",
()=>{

chart.resize();

}

);



}






// 播放趋势图


function createViewChart(data){



const dom =
document.getElementById(
"viewChart"
);



if(!dom)return;



const chart =
echarts.init(dom);



chart.setOption({


tooltip:{


trigger:"axis"


},



xAxis:{


type:"category",


data:data.map(
i=>i.date
)


},



yAxis:{


type:"value"


},



series:[{


type:"line",


smooth:true,


data:data.map(
i=>i.views
),


areaStyle:{}


}]



});



window.addEventListener(
"resize",
()=>chart.resize()
);



}



