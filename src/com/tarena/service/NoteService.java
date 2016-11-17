package com.tarena.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.tarena.common.BusinessException;
import com.tarena.common.SystemConstant;
import com.tarena.common.UUIDUtil;
import com.tarena.dao.ActivityMapper;
import com.tarena.dao.NoteBookMapper;
import com.tarena.dao.NoteMapper;
import com.tarena.dao.ShareMapper;
import com.tarena.entity.Note;
import com.tarena.entity.NoteActivity;
import com.tarena.entity.NoteBook;
import com.tarena.entity.Share;

@Service
public class NoteService {

	@Resource
	private NoteMapper noteMapper;
	
	@Resource
	private NoteBookMapper noteBookMapper;
	
	@Resource
	private ShareMapper shareMapper;
	
	@Resource
	private ActivityMapper activityMapper;
	
	/**
	 * Find note
	 */
	public List<Note> findNote(String noteBookId) {
		if (noteBookId == null)
			throw new BusinessException("Value is NULL.");
		return noteMapper.findByNoteBook(noteBookId);
	}
	
	/**
	 * Find note detail
	 */
	public Note findNoteDetail(String noteId) {
		if (noteId == null)
			throw new BusinessException("Value is NULL.");
		return noteMapper.findById(noteId);
	}
	
	/**
	 * Add new note
	 */
	public void addNote(Note note) {
		if(note == null)
			throw new BusinessException("Value is NULL.");
		note.setCn_note_id(UUIDUtil.getUID());
		note.setCn_note_create_time(System.currentTimeMillis());
		note.setCn_note_last_modify_time(System.currentTimeMillis());
		noteMapper.save(note);
	}
	
	/**
	 * Edit note，update it's title and content
	 */
	public void updateNoteBody(Note note) {
		if (note == null)
			throw new BusinessException("Value is NULL.");
		Note n = noteMapper.findById(note.getCn_note_id());
		n.setCn_note_title(note.getCn_note_title());
		n.setCn_note_body(note.getCn_note_body());
		n.setCn_note_last_modify_time(System.currentTimeMillis());
		noteMapper.update(n);
	}
	
	/**
	 * Delete note, and put in trash
	 */
	public void deleteNote(String noteId) {
		if (noteId == null)
			throw new BusinessException("Value is NULL.");
		Note note = noteMapper.findById(noteId);
		List<NoteBook> list = 
			noteBookMapper.findSpecialNoteBook(note.getCn_user_id());
		for (NoteBook book : list) {
			if(book.getCn_notebook_type_code()
					.equals(SystemConstant.NOTEBOOK_RECYCLE)) {
				moveNote(noteId, book.getCn_notebook_id());
				break;
			}
		}
	}

	/**
	 * Move note to given notebook
	 */
	public void moveNote(String noteId, String noteBookId) {
		if (noteId == null || noteBookId == null)
			throw new BusinessException("Value is NULL.");
		Note note = noteMapper.findById(noteId);
		note.setCn_notebook_id(noteBookId);
		note.setCn_note_last_modify_time(System.currentTimeMillis());
		noteMapper.update(note);
	}
	
	/**
	 * Delete note from trash (empty trash)
	 */
	public void deleteNoteReally(String noteId) {
		if (noteId == null)
			throw new BusinessException("Value is NULL.");
		noteMapper.delete(noteId);
	}

	/**
	 * Share note
	 */
	public void addShareNote(String noteId) {
		if (noteId == null)
			throw new BusinessException("Value is NULL.");
		Note note = noteMapper.findById(noteId);
		Share share = new Share();
		share.setCn_share_id(UUIDUtil.getUID());
		share.setCn_note_id(noteId);
		share.setCn_share_title(note.getCn_note_title());
		share.setCn_share_body(note.getCn_note_body());
		shareMapper.save(share);
	}
	
	/**
	 * Search shared note
	 */
	public List<Share> findShareNote(String searchKey, int currentPage, int pageSize) {
		if(searchKey == null)
			throw new BusinessException("Value is NULL.");
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("searchKey", searchKey);
		param.put("begin", (currentPage-1)*pageSize);
		param.put("pageSize", pageSize);
		return shareMapper.findByPage(param);
	}
	
	/**
	 * Find shared note
	 */
	public Share findShareNoteDetail(String shareId) {
		if(shareId == null)
			throw new BusinessException("Value is NULL.");
		return shareMapper.findById(shareId);
	}
	
	/**
	 * Favorite shared note
	 */
	public void likeShareNote(String shareId, String userId) {
		Share share = shareMapper.findById(shareId);
		Note note = new Note();
		note.setCn_user_id(userId);
		note.setCn_note_title(share.getCn_share_title());
		note.setCn_note_body(share.getCn_share_body());
		List<NoteBook> list = 
			noteBookMapper.findSpecialNoteBook(note.getCn_user_id());
		for (NoteBook book : list) {
			if(book.getCn_notebook_type_code()
					.equals(SystemConstant.NOTEBOOK_FAVORITES)) {
				note.setCn_notebook_id(book.getCn_notebook_id());
				break;
			}
		}
		
		this.addNote(note);
	}
	
	/**
	 * Favorite event note
	 */
	public void likeActivityNote(String noteActivityId, String userId) {
		NoteActivity acvitity = activityMapper.findNoteActivityById(noteActivityId);
		Note note = new Note();
		note.setCn_user_id(userId);
		note.setCn_note_title(acvitity.getCn_note_activity_title());
		note.setCn_note_body(acvitity.getCn_note_activity_body());
		List<NoteBook> list = 
			noteBookMapper.findSpecialNoteBook(note.getCn_user_id());
		for (NoteBook book : list) {
			if(book.getCn_notebook_type_code()
					.equals(SystemConstant.NOTEBOOK_FAVORITES)) {
				note.setCn_notebook_id(book.getCn_notebook_id());
				break;
			}
		}
		
		this.addNote(note);
	}
	
}
