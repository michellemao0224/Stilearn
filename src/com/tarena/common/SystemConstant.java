package com.tarena.common;

/**
 * Ssytem Constant
 */
public interface SystemConstant {

	// Login status
	int LOGIN_SUCCESS = 0;
	int LOGIN_USERNAME_ERROR = 1;
	int LOGIN_PASSWORD_ERROR = 2;

	// Favorites notebook
	String NOTEBOOK_FAVORITES = "favorites";
	// Trash notebook
	String NOTEBOOK_RECYCLE = "recycle";
	// Event notebook
	String NOTEBOOK_ACTION = "action";
	// Notification notebook (default)
	String NOTEBOOK_PUSH = "push";
	// Normal notebook
	String NOTEBOOK_NORMAL = "normal";
	
}
