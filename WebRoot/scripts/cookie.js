//Get cookie from a given object name
function getCookie(objName) {
	//get cookie's name and value
	var arrStr = document.cookie.split("; ");
	for ( var i = 0; i < arrStr.length; i++) {
		//split name and value   
		var temp = arrStr[i].split("=");
		if (temp[0] == objName)
			return unescape(temp[1]);
	}
	return "";
}

//Add cookie
function addCookie(objName, objValue, objHours) { 
	var str = objName + "=" + escape(objValue);
	//为0时不设定过期时间，浏览器关闭时cookie自动消失 Don't set expire time when objHours=0
	// When closing the browser, removing the cookie
	if (objHours > 0) { 
		var ms = objHours * 3600 * 1000;
		var date = new Date();
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
	}
	document.cookie = str;
}

//two attributes: name, value
function setCookie(name, value) {
	//Set to store cookie in 30days
	var Days = 30; 
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//Delete cookie
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if (cval != null) {
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	}
}
