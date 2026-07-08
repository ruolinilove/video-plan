// =================================
// 后台系统核心
// dashboard.js
// =================================



// ===============================
// 左侧菜单
// ===============================


function renderSidebar(){


const sidebar =
document.getElementById(
"sidebar"
);



sidebar.innerHTML = `


<div class="sidebar-logo">

<span></span>

数据中心

</div>




<div class="nav-item active"
onclick="switchPage('dashboard')">


📊 数据大盘


</div>




<div class="nav-group">


<div class="nav-item"
onclick="toggleNav('brandSub')">


📊 品牌数据

</div>


<div id="brandSub"
class="sub-nav">


<div class="sub-item"
onclick="switchPage('brand-chuangyi')">

创艺装饰

</div>



<div class="sub-item"
onclick="switchPage('brand-xikexi')">

喜客喜装饰

</div>


</div>


</div>





<div class="nav-group">


<div class="nav-item"
onclick="toggleNav('contentSub')">


🎬 内容生产


</div>



<div id="contentSub"
class="sub-nav">


<div class="sub-item">

拍摄任务

</div>



<div class="sub-item">

剪辑任务

</div>



<div class="sub-item">

文案任务

</div>



<div class="sub-item">

灵感选题库

</div>



</div>


</div>





<div class="nav-group">


<div class="nav-item"
onclick="toggleNav('summarySub')">


📝 工作总结


</div>


<div id="summarySub"
class="sub-nav">


<div class="sub-item">

月度视频规划

</div>


<div class="sub-item">

周执行计划

</div>


<div class="sub-item">

周总结

</div>



<div class="sub-item">

月总结

</div>



<div class="sub-item">

年总结

</div>



</div>


</div>





<div class="nav-group">


<div class="nav-item"
onclick="toggleNav('maintainSub')">


🔧 数据维护


</div>



<div id="maintainSub"
class="sub-nav">


<div class="sub-item"
onclick="switchPage('maintain')">

平台数据

</div>



</div>


</div>





`;



}







// 菜单展开


function toggleNav(id){


const el =
document.getElementById(id);


if(!el)return;


el.classList.toggle(
"show"
);


}








// ===============================
// 页面切换
// ===============================


function switchPage(page){



const content =
document.getElementById(
"pageContent"
);



const breadcrumb =
document.getElementById(
"breadcrumb"
);




if(page==="dashboard"){


breadcrumb.innerHTML=
"📊 数据大盘";


renderDashboard(content);


}






else if(page==="brand-chuangyi"){


breadcrumb.innerHTML=
"📊 品牌数据 / 创艺装饰";


renderBrandPage(
content,
"创艺装饰"
);


}






else if(page==="brand-xikexi"){



breadcrumb.innerHTML=
"📊 品牌数据 / 喜客喜装饰";



renderBrandPage(
content,
"喜客喜装饰"
);



}




else{


content.innerHTML=`

<div class="card">

<h3>
页面开发中...
</h3>

</div>

`;

}// =================================
// 数据计算
// =================================



function formatNum(num){


if(!num)

return "0";


if(num>=10000)

return (

num/10000

).toFixed(1)+"w";


if(num>=1000)

return (

num/1000

).toFixed(1)+"k";


return num;

}






// 获取品牌视频


function getBrandVideos(name){



const brand =

appData.brands.find(

b=>b.name===name

);



if(!brand)

return [];



return appData.videos.filter(

v=>v.brand_id===brand.id

);



}







// 获取视频播放量


function getVideoViews(video){



return appData.platformData

.filter(

p=>p.video_id===video.id

)

.reduce(

(sum,p)=>

sum+(p.views||0)

,0

);



}







// =================================
// 首页数据大盘
// =================================



function renderDashboard(container){



const cy =

getBrandVideos(
"创艺装饰"
);



const xk =

getBrandVideos(
"喜客喜装饰"
);




const cyViews =

cy.reduce(

(s,v)=>

s+getVideoViews(v)

,0);



const xkViews =

xk.reduce(

(s,v)=>

s+getVideoViews(v)

,0);





const total =

appData.videos.length;



const published =

appData.videos.filter(

v=>v.status==="已发布"

).length;





// 状态统计


let status={};



appData.videos.forEach(v=>{


status[v.status]=

(status[v.status]||0)+1;


});



const statusData =

Object.keys(status)

.map(k=>({

name:k,

value:status[k]

}));






container.innerHTML=`

<div class="kpi-row">


<div class="kpi-card brand-card">

<div class="label">

🏠 创艺装饰 · 总播放

</div>


<div class="value">

${formatNum(cyViews)}

</div>


<div class="sub">

视频数量 ${cy.length}

</div>


</div>





<div class="kpi-card brand-card orange">

<div class="label">

🏡 喜客喜装饰 · 总播放

</div>


<div class="value">

${formatNum(xkViews)}

</div>


<div class="sub">

视频数量 ${xk.length}

</div>


</div>





<div class="kpi-card">


<div class="label">

📹 视频总数量

</div>


<div class="value">

${total}

</div>


<div class="sub">

全部视频数据

</div>


</div>





<div class="kpi-card">


<div class="label">

✅ 已发布

</div>


<div class="value">

${published}

</div>


<div class="sub">

当前完成进度

</div>


</div>



</div>






<div class="grid-2">


<div class="card">

<h3>

视频状态分布

</h3>


<div id="statusChart"

class="chart-box">

</div>


</div>







<div class="card">


<h3>

最近视频

</h3>


<table>


<tr>

<th>

标题

</th>


<th>

状态

</th>


</tr>



${
appData.videos

.slice(0,8)

.map(v=>`

<tr>

<td>

${v.title||"未命名"}

</td>


<td>

${v.status||""}

</td>


</tr>


`)

.join("")

}



</table>


</div>


</div>


`;





setTimeout(()=>{


createStatusChart(

statusData

);


},200);



}

// =================================
// 品牌数据页面
// =================================



function renderBrandPage(container,brandName){



const videos =

getBrandVideos(
brandName
);



const published =

videos.filter(

v=>v.status==="已发布"

);




const views =

published.reduce(

(s,v)=>

s+getVideoViews(v)

,0);



container.innerHTML=`

<div class="kpi-row">


<div class="kpi-card">


<div class="label">

品牌

</div>


<div class="value"

style="font-size:24px">

${brandName}

</div>


</div>





<div class="kpi-card">


<div class="label">

总播放

</div>


<div class="value">

${formatNum(views)}

</div>


</div>





<div class="kpi-card">


<div class="label">

视频数量

</div>


<div class="value">

${videos.length}

</div>


</div>



</div>







<div class="card">


<h3>

视频计划列表

</h3>




<table>


<tr>

<th>

标题

</th>


<th>

类型

</th>


<th>

日期

</th>


<th>

状态

</th>


</tr>





${
videos.map(v=>`

<tr>


<td>

${v.title||""}

</td>


<td>

${getTypeName(v.type_id)}

</td>


<td>

${v.planned_date||""}

</td>



<td>

<span class="status-tag">

${v.status||"未设置"}

</span>


</td>



</tr>



`).join("")

}



</table>


</div>



`;



}





// 获取视频类型


function getTypeName(id){



const item=

appData.videoTypes.find(

t=>t.id===id

);



return item?

item.name

:

"";

}






// =================================
// 平台维护页面
// =================================



function renderMaintain(container){



container.innerHTML=`

<div class="card">


<h3>

平台数据维护

</h3>



<p>

这里用于维护视频号、抖音、快手等平台数据。

</p>



<br>



<button class="btn btn-primary"

onclick="showPlatformData()">

进入数据维护

</button>



</div>



`;



}







function showPlatformData(){



const container=

document.getElementById(
"pageContent"
);



let html=`

<div class="card">


<h3>

平台数据

</h3>


`;



appData.videos.forEach(
(v,index)=>{


html+=`

<div style="
padding:15px;
background:#f8fafc;
border-radius:12px;
margin-bottom:10px;
">


<b>

${v.title}

</b>


<br><br>


播放：

<input 
id="views_${index}"
type="number"
value="0"
>


点赞：

<input
id="likes_${index}"
type="number"
value="0"
>


评论：

<input
id="comments_${index}"
type="number"
value="0"
>



</div>


`;



});



html+=`


<button class="btn btn-primary">

保存数据

</button>


</div>


`;



container.innerHTML=html;


}





// =================================
// 初始化后台
// =================================



async function initDashboard(){



await loadAllData();



renderSidebar();



switchPage(
"dashboard"
);



}





}
