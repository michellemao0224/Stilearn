package com.tarena.web;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.tarena.common.Md5Util;
import com.tarena.entity.Result;
import com.tarena.entity.User;
import com.tarena.service.UserService;

@Controller
@RequestMapping("/user")
public class UserController {
	
	@Resource
	private UserService userService;
	
	/**
	 * Register user
	 */
	@RequestMapping("/register.do")
	@ResponseBody
	public Result register(User user) {
		boolean b = userService.createUser(user);
		return new Result(b);
	}

	@RequestMapping("/login.do")
	@ResponseBody
	public Result login(String userName, 
			String password, HttpSession session) {
		Map<String, Object> data = 
			userService.checkUser(userName, password);
		if ("0".equals(data.get("flag").toString())) {
			//Login success
			User user = userService.findUser(userName);
			data.put("user", user);
			session.setAttribute("user", user);
		}

		return new Result(data);
	}
	
	@RequestMapping("/logout.do")
	@ResponseBody
	public Result logout(HttpSession session) {
		//Log out session
		session.invalidate();
		return new Result();
	}
	
	@RequestMapping("/changePassword.do")
	@ResponseBody
	public Result changePassword(String lastPassword, 
			String newPassword, HttpSession session) {
		User user = (User) session.getAttribute("user");
		if(user.getCn_user_password()
				.equals(Md5Util.md5(lastPassword))) {
			user.setCn_user_password(Md5Util.md5(newPassword));
			userService.update(user);
			return new Result("Edit success.");
		} else {
			return new Result("The origin password is incorrect.");
		}
	}

}
