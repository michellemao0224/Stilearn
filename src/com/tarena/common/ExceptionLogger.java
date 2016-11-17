package com.tarena.common;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.tarena.entity.Result;
import com.tarena.entity.User;

/**
 *	Record Exceptional Log
 */
@Component
@Aspect
public class ExceptionLogger {
	
	@Around("within(com.tarena.web..*)")
	public Object log(ProceedingJoinPoint point) throws Exception {
		ServletRequestAttributes attrs = 
			(ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		HttpServletRequest request = attrs.getRequest();  
//		System.out.println(request.hashCode());
		
		Object obj = null;
		try {
			obj = point.proceed();
		} catch (Throwable e) {
			e.printStackTrace();
			// Record error log
			Logger logger = Logger.getLogger(this.getClass());
			
			User user = (User) request.getSession().getAttribute("user");
			if(user != null) {
				String className = point.getTarget().getClass().getName();
				String method = point.getSignature().getName();
				String date = new SimpleDateFormat(
						"yyyy-MM-dd hh:mm:ss").format(new Date());
				
				StringBuffer sb = new StringBuffer();
				sb.append("User[").append(user.getCn_user_name()).append("], ");
				sb.append("IP[").append(request.getRemoteHost()).append("], ");
				sb.append("when[").append(date).append("], execute[");
				sb.append(className).append(".").append(method);
				sb.append("]，exists exceptions as below：");
				logger.error(sb.toString());
			}
			
			StackTraceElement[] elems = e.getStackTrace();
			for(StackTraceElement elem : elems) {
				logger.error("\t" + elem.toString());
			}
			
			// return error message
			Result result = new Result();
			result.setStatus(1);
			if (e instanceof BusinessException) {
				// If it is business exception, then return exception message
				result.setMessage(e.getMessage());
			} else {
				// If system has other exceptions, return the same error prompt 
				result.setMessage("System error，please contact admin.");
			}
			return result;
		}
		return obj;
	}

}
