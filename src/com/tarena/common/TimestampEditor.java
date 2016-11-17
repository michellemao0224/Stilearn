package com.tarena.common;

import java.beans.PropertyEditorSupport;
import java.sql.Timestamp;

public class TimestampEditor extends PropertyEditorSupport {
	
	@Override
	public void setAsText(String text) 
			throws IllegalArgumentException {
		if(text == null || text.length() == 0) {
			setValue(null);
		} else {
			try {
				setValue(new Timestamp(Long.valueOf(text)));
			} catch (Exception e) {
				setValue(Timestamp.valueOf(text));
			}
		}
	}

}
