package com.tarena.web.interceptor;

import java.io.Writer;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import com.tarena.entity.User;

/**
 *	Login and check interceptor
 */
public class LoginInterceptor implements HandlerInterceptor {

	@Override
	public void afterCompletion(HttpServletRequest arg0,
			HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {

	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1,
			Object arg2, ModelAndView arg3) throws Exception {

	}

	@Override
	public boolean preHandle(HttpServletRequest request, 
			HttpServletResponse response, Object arg2) throws Exception {
		User user = (User) request.getSession().getAttribute("user");
		if(user == null) {
			response.setCharacterEncoding("utf-8");
			response.setContentType("application/json");
			Writer witer = response.getWriter();
			witer.write("{\"status\":1,\"message\":\"Please login.\"}");
			witer.close();
			return false;
		} else {
			return true;
		}
	}

}
