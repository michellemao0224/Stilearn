package com.tarena.service;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import com.tarena.common.BusinessException;
import com.tarena.common.Md5Util;
import com.tarena.common.SystemConstant;
import com.tarena.common.UUIDUtil;
import com.tarena.dao.NoteBookMapper;
import com.tarena.dao.NoteBookTypeMapper;
import com.tarena.dao.UserMapper;
import com.tarena.entity.NoteBook;
import com.tarena.entity.NoteBookType;
import com.tarena.entity.User;

@Service
public class UserService {

	@Resource
	private UserMapper userMapper;
	
	@Resource
	private NoteBookTypeMapper noteBookTypeMapper;
	
	@Resource
	private NoteBookMapper noteBookMapper;

	/**
	 * Register user
	 * @param user
	 * @return
	 */
	public boolean createUser(User user) {
		//validate username
		if(this.checkUserName(user.getCn_user_name())) {
			//pass validation，create user
			this.addUser(user);
			//initial notebook
			this.initNoteBook(user.getCn_user_id());
			return true;
		} else {
			//fail validation
			return false;
		}
	}
	
	/**
	 * username validation
	 * 
	 * @param userName
	 * @return
	 * @throws BusinessException
	 */
	public boolean checkUserName(String userName) {
		if (userName == null)
			throw new BusinessException("Username can't be NULL.");
		User user = userMapper.findByName(userName);
		if (user == null)
			return true;
		else
			return false;
	}

	/**
	 * 	Create user
	 * 
	 * @param user
	 * @throws BusinessException
	 */
	public void addUser(User user) {
		if(user == null)
			throw new BusinessException("Value is NULL.");
		user.setCn_user_id(UUIDUtil.getUID());
		// encrypt password
		user.setCn_user_password(
			Md5Util.md5(user.getCn_user_password()));
		userMapper.save(user);
	}
	
	/**
	 * Initial notebook
	 */
	public void initNoteBook(String userId) {
		if(userId == null)
			throw new BusinessException("Value is NULL.");
		// Find the type of special notebook
		List<NoteBookType> noteBookTypes = 
			noteBookTypeMapper.findSpecialType();
		// To each special type, create a default notebook
		for(NoteBookType type : noteBookTypes) {
			NoteBook book = new NoteBook();
			book.setCn_notebook_id(UUIDUtil.getUID());
			book.setCn_user_id(userId);
			book.setCn_notebook_type_id(type.getCn_notebook_type_id());
			book.setCn_notebook_name(type.getCn_notebook_type_name());
			book.setCn_notebook_createtime(
				new Timestamp(System.currentTimeMillis()));
			noteBookMapper.save(book);
		}
	}
	
	/**
	 * Validate username and password
	 * 
	 * @param userName
	 * @param pwd
	 * @return
	 */
	public Map<String, Object> checkUser(String userName, String pwd) {
		Map<String, Object> map = new HashMap<String, Object>();
		if(userName == null)
			throw new BusinessException("Username is NULL.");
		if(pwd == null)
			throw new BusinessException("Password is NULL.");
		
		User user = userMapper.findByName(userName);
		if(user == null) {
			map.put("flag", SystemConstant.LOGIN_PASSWORD_ERROR);
			map.put("msg", "Username incorrect.");
		} else if (!user.getCn_user_password().equals(Md5Util.md5(pwd))) {
			map.put("flag", SystemConstant.LOGIN_PASSWORD_ERROR);
			map.put("msg", "Password incorrect.");
		} else {
			map.put("flag", SystemConstant.LOGIN_SUCCESS);
			map.put("msg", "Login success.");
		}
		return map;
	}
	
	/**
	 * Find user
	 * 
	 * @param userName
	 * @return
	 */
	public User findUser(String userName) {
		if(userName == null)
			throw new BusinessException("Username is NULL.");
		return userMapper.findByName(userName);
	}
	
	/**
	 * Update user
	 */
	public void update(User user) {
		userMapper.update(user);
	}
	
}
