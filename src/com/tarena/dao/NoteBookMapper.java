package com.tarena.dao;

import java.util.List;

import com.tarena.entity.NoteBook;

@MyBatisRepository
public interface NoteBookMapper {

	/**
	 * Add new notebook
	 */
	void save(NoteBook noteBook);
	
	/**
	 * Find all normal notebooks from a given user
	 */
	List<NoteBook> findNormalNoteBook(String userId);

	/**
	 * Find all special notebooks from a given user
	 */
	List<NoteBook> findSpecialNoteBook(String userId);
	
	/**
	 * Update notebook
	 */
	void update(NoteBook noteBook);
	
	/**
	 * Query notebook
	 */
	NoteBook findById(String noteBookId);
	
	/**
	 * Delete notebook
	 */
	void delete(String noteBookId);

}
