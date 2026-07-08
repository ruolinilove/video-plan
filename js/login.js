
// =================================
// 登录系统
// login.js
// =================================



// 登录

async function login(){


const username =
document.getElementById(
"usernameInput"
).value.trim();



const password =
document.getElementById(
"passwordInput"
).value.trim();



const error =
document.getElementById(
"loginError"
);



error.innerHTML="";



try{


const {

data,

error:dbError

}=await supabaseClient

.from("app_users")

.select("*")

.eq(
"username",
username
)

.eq(
"password",
password
)

.single();





if(dbError || !data){


error.innerHTML=
"账号或密码错误";


return;


}




currentUser=data;



sessionStorage.setItem(
"loggedInUser",
username
);



await loadAllData();



enterDashboard();



}

catch(e){


console.error(e);


error.innerHTML=
"登录失败，请检查网络";


}



}








// 进入后台


function enterDashboard(){



document.getElementById(
"loginPage"
).style.display="none";



document.getElementById(
"loginBg"
).style.display="none";



document.getElementById(
"particleCanvas"
).style.display="none";



document.getElementById(
"appContainer"
).style.display="block";





// 用户头像


document.getElementById(
"userAvatar"
).innerHTML=

currentUser
.username
.charAt(0)
.toUpperCase();





renderSidebar();



switchPage(
"dashboard"
);



}









// 自动登录


async function autoLogin(){



const savedUser =

sessionStorage.getItem(
"loggedInUser"
);



if(!savedUser)return;





const {

data

}=await supabaseClient

.from("app_users")

.select("*")

.eq(
"username",
savedUser
)

.single();





if(data){


currentUser=data;


await loadAllData();


enterDashboard();


}




}









// 退出登录


function logout(){



sessionStorage.removeItem(
"loggedInUser"
);



currentUser=null;



document.getElementById(
"appContainer"
).style.display="none";



document.getElementById(
"loginPage"
).style.display="flex";



document.getElementById(
"loginBg"
).style.display="block";



document.getElementById(
"particleCanvas"
).style.display="block";



}









// 用户菜单


function toggleUserDropdown(){



document

.getElementById(
"userDropdown"
)

.classList.toggle(
"show"
);



}





window.addEventListener(
"click",
(e)=>{


const menu=
document.getElementById(
"userDropdown"
);



if(
!e.target.closest(
".user-avatar"
)
&&
!e.target.closest(
".user-dropdown"
)

){


menu.classList.remove(
"show"
);


}



});









// 打开修改密码


function showChangePassword(){



document.getElementById(
"passwordModal"
)

.classList.add(
"show"
);



}







// 关闭密码窗口


function closePasswordModal(){



document.getElementById(
"passwordModal"
)

.classList.remove(
"show"
);



}









// 修改密码


async function changePassword(){



const oldPassword=

document.getElementById(
"oldPassword"
).value.trim();



const newPassword=

document.getElementById(
"newPassword"
).value.trim();



const confirmPassword=

document.getElementById(
"confirmPassword"
).value.trim();



const error=

document.getElementById(
"passwordError"
);




error.innerHTML="";




if(oldPassword!==currentUser.password){


error.innerHTML=
"当前密码错误";


return;


}




if(newPassword.length<3){


error.innerHTML=
"新密码至少3位";


return;


}




if(newPassword!==confirmPassword){


error.innerHTML=
"两次密码不一致";


return;


}






await supabaseClient

.from("app_users")

.update({

password:newPassword

})

.eq(
"id",
currentUser.id
);






currentUser.password=
newPassword;



closePasswordModal();



showToast(
"密码修改成功",
"success"
);



}








// 页面启动

autoLogin();
