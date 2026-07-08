
// ===============================
// Supabase 初始化
// ===============================


const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



// 全局数据

let currentUser = null;



let appData = {

    videos: [],

    brands: [],

    platforms: [],

    videoTypes: [],

    weeklyTasks: [],

    platformData: []

};




// 平台列表

const PLATFORMS = [

    '视频号',

    '快手',

    '抖音',

    'B站',

    '微博'

];





// 加载全部数据

async function loadAllData(){


try{


const [

videos,

brands,

platforms,

types,

tasks,

platformData


]=await Promise.all([


supabaseClient
.from('videos')
.select('*, brands(name), video_types(name)'),



supabaseClient
.from('brands')
.select('*'),



supabaseClient
.from('platforms')
.select('*'),



supabaseClient
.from('video_types')
.select('*'),



supabaseClient
.from('weekly_tasks')
.select('*'),



supabaseClient
.from('platform_data')
.select('*')



]);



if(videos.data)

appData.videos=videos.data;



if(brands.data)

appData.brands=brands.data;



if(platforms.data)

appData.platforms=platforms.data;



if(types.data)

appData.videoTypes=types.data;



if(tasks.data)

appData.weeklyTasks=tasks.data;



if(platformData.data)

appData.platformData=platformData.data;



updateDataTime();



}

catch(e){


console.error(
'数据加载失败:',
e
);


}


}





// 更新时间

function updateDataTime(){


const el=document.getElementById(
'dataTime'
);


if(!el)return;



const now=new Date();



el.textContent=

'更新于 '

+

now.getHours()
.toString()
.padStart(2,'0')

+

':'

+

now.getMinutes()
.toString()
.padStart(2,'0');



}


