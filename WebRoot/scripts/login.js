/**
 * Init web page, bind function
 */
$(function(){
	//Store account num
	$("#count").val(getCookie("userName"));
	
	//Register
	$("#regist_button").click(function(){
		register();
	});
	
	//Login
	$("#login").click(function(){
		login();
	});
	
	//Logout
	$("#logout").click(function(){
		logout();
	});
	
	//Change password
	$("#changePassword").click(function(){
		changepwd();
	})
	
});

//Register
function register() {
	// Get value
	var userName = $("#regist_username").val();
	var password = $("#regist_password").val();
	var password2 = $("#final_password").val();
	var nickname = $("#nickname").val();
	
	// Check userName format
	var reg = /^\w{3,20}$/;
	if(!reg.test(userName)) {
		$("#warning_1").text("3-20 digits,numbers,'_'.").show();
		return;
	} else {
		$("#warning_1").hide();
	}
	//Check password
	if(password.length<6) {
		$("#warning_2").text("Password shouldn't less than 6 digits.").show();
		return;
	} else {
		$("#warning_2").hide();
	}
	//Check repeated password
	if(password != password2) {
		$("#warning_3").text("Two inputs are different.").show();
		return;
	} else {
		$("#warning_3").hide();
	}
	
	//Registering
	var user = {
		"cn_user_name":userName,
		"cn_user_password":password,
		"cn_user_desc":nickname
	};
	$.ajax({
		type:"post",
		url:basePath+"user/register.do",
		dataType:"json",
		data:user,
		success:function(result) {
			if(result.status==0) {
				if(result.data) {
					alert("Register success.");
					$("#zc").attr("class","sig sig_out");
					$("#dl").attr("class","log log_in");
				} else {
					$("#warning_1").text("Username exists.").show();
				}
			} else {
				alert(result.message);
			}
		},
		error:function(xhr,status,error) {
			alert("Request Error.");
		}
	});
}

//Login
function login() {
	var count = $("#count").val();
	var password = $("#password").val();
	if(count=="" || password=="") {
		return;
	}
	$.ajax({
		type:"post",
		url:basePath+"user/login.do",
		dataType:"json",
		data:{"userName":count,"password":password},
		success:function(result) {
			if(result.status==0) {
				if(result.data.flag==0) {
					//Login success
					location.href="edit.html";
					addCookie("userId",result.data.user.cn_user_id,5);
					addCookie("userName",result.data.user.cn_user_name,5);
				} else {
					alert(result.data.msg);
				}
			} else {
				alert(result.message);
			}
		},
		error:function(xhr,status,error) {
			alert("Request error.");
		}
	});
}

/**
 * Log out
 */
function logout(){
	//Log out all msg
	$.ajax({
		type:"post",
		url:basePath+"user/logout.do",
		dataType:"json",
		data:{},
		success:function(result) {
			if(result.status==0) {
				//Back to login page
				location.href="login.html";
			} else {
				alert(result.message);
			}
		},
		error:function(xhr,status,error) {
			alert("Request error.");
		}
	});
}

/**
 * Edit password
 */
function changepwd(){
	var newPassword = $("#new_password").val();
	var finalPassword = $("#final_password").val();
	if(newPassword.length < 6) {
		alert("Password should longer then 6 digits.");
		return;
	} else if(newPassword != finalPassword) {
		alert("Two input password are different.");
		return;
	}
	
	var lastPassword = $("#last_password").val();
	$.ajax({
		type:"post",
		url:basePath+"user/changePassword.do",
		dataType:"json",
		data:{"lastPassword":lastPassword,"newPassword":newPassword},
		success:function(result) {
			if(result.status==0) {
				alert(result.data);
				logout();
			} else {
				alert(result.message);
			}
		},
		error:function(xhr,status,error) {
			alert("Request error.");
		}
	});
}


