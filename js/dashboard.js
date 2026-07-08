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

}



}
