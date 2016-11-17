package com.tarena.service;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.tarena.common.BusinessException;
import com.tarena.common.SystemConstant;
import com.tarena.common.UUIDUtil;
import com.tarena.dao.NoteBookMapper;
import com.tarena.dao.NoteBookTypeMapper;
import com.tarena.entity.NoteBook;
import com.tarena.entity.NoteBookType;

@Service
public class NoteBookService {

	@Resource
	private NoteBookTypeMapper noteBookTypeMapper;

	@Resource
	private NoteBookMapper noteBookMapper;

	/**
	 * Find all users' normal notebook
	 */
	public List<NoteBook> findNormalNoteBook(String userId) {
		if(userId == null)
			throw new BusinessException("Value is NULL.");
		return noteBookMapper.findNormalNoteBook(userId);
	}
	
	/**
	 * Find all users' special notebook
	 */
	public Map<String, NoteBook> findSpecialNoteBook(String userId) {
		if(userId == null)
			throw new BusinessException("Value is NULL.");
		Map<String, NoteBook> result = new HashMap<String, NoteBook>();
		List<NoteBook> list = noteBookMapper.findSpecialNoteBook(userId);
		for(NoteBook nb : list) {
			result.put(nb.getCn_notebook_type_code(), nb);
		}
		return result;
	}
	
	/**
	 * Add new notebook
	 */
	public void addNoteBook(NoteBook book) {
		if(book == null)
			throw new BusinessException("Value is NULL.");
		book.setCn_notebook_id(UUIDUtil.getUID());
		List<NoteBookType> types = noteBookTypeMapper.findAllType();
		for (NoteBookType type : types) {
			if (type.getCn_notebook_type_code().equals(SystemConstant.NOTEBOOK_NORMAL)) {
				book.setCn_notebook_type_id(type.getCn_notebook_type_id());
				break;
			}
		}
		book.setCn_notebook_createtime(
			new Timestamp(System.currentTimeMillis()));
		noteBookMapper.save(book);
	}
	

	/**
	 * Update notebook
	 */
	public void update(NoteBook noteBook) {
		if (noteBook == null)
			throw new BusinessException("Value is NULL.");
		noteBookMapper.update(noteBook);
	}
	
	/**
	 * Delete notebook
	 */
	public void deleteNoteBook(String noteBookId) {
		if(noteBookId == null)
			throw new BusinessException("Value is NULL.");
		noteBookMapper.delete(noteBookId);
	}
	
	/**
	 * Find user's notebook list
	 */
	public List<NoteBook> findNoteBookList(String userId) {
		if(userId == null)
			throw new BusinessException("Value is NULL.");
		Map<String, NoteBook> map = this.findSpecialNoteBook(userId);
		NoteBook push = map.get("push");
		push.setCn_notebook_name("Default notebook");
		
		List<NoteBook> list = this.findNormalNoteBook(userId);
		list.add(0, push);
		
		return list;
	}

}
