package com.tarena.web;

import java.sql.Timestamp;

import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.support.WebBindingInitializer;
import org.springframework.web.context.request.WebRequest;

import com.tarena.common.TimestampEditor;

public class BaseController implements WebBindingInitializer {

	@Override
	@InitBinder
	public void initBinder(WebDataBinder binder, WebRequest request) {
		binder.registerCustomEditor(
				Timestamp.class, new TimestampEditor());
	}

}
