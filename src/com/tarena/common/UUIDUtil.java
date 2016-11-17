package com.tarena.common;

import java.util.UUID;

/**
 *	Generate random ID
 */
public class UUIDUtil {

	public static String getUID() {
		return UUID.randomUUID().toString();
	}

}
