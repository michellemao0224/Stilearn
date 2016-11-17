package test;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Component;

import com.tarena.service.UserService;

@Component
@Aspect
public class TestAOP {
	
	@Before("within(com.tarena.service..*)")
	public void test1() {
		System.out.println("test1");
	}
	
	public static void main(String[] args) {
		ApplicationContext ctx = 
			new ClassPathXmlApplicationContext(
				"applicationContext.xml");
		UserService s = ctx.getBean(UserService.class);
		s.findUser("lhh");
	}

}
