package com.tarena.dao;

import java.util.List;

import com.tarena.entity.Note;

@MyBatisRepository
public interface NoteMapper {

	/**
	 * Find all notes from a given notebook
	 */
	List<Note> findByNoteBook(String nodeBookId);
	
	/**
	 * Find note by ID
	 */
	Note findById(String noteId);
	
	/**
	 * Add new note
	 */
	void save(Note note);
	
	/**
	 * Update note
	 */
	void update(Note note);
	
	/**
	 * Delete note
	 */
	void delete(String noteId);
	
}
