//Format String
function formate_name(e){
	e=e.replace(/</g,'&lt;');
	e=e.replace(/>/g,'&gt;');
	return e;
}
//Delete space
function check_null(s){
	s=s.replace(/ /g,'');
	s=s.length;
	return s;
}


//Find notebook list
function get_nb_list(){
	loadNormalNoteBook();
}

//Find special notebook list
function get_spnb_list(){
	loadSpecialNoteBook();
}



//Find event list
function activity_list(){
	getActivityList();
}

//Find note list from event page
function get_activity_list(){
	var param=window.location.hash;
	global_ac_id=param.replace(/#/,'');
	$("#fifth_side_right .contact-body").empty();
	$("#more_activity_note").val(1);
	getNoteActivitys(global_ac_id,1);
}



//Get node from seleted notebook(li node)
function getCheckedNoteBook() {
	return $("#first_side_right .checked").parent();
}

//Get node from seleted note(li node)
function getCheckedNote() {
	return $("#second_side_right .checked").parent();
}

//Get node from seleted note in Trash(li node)
function getRecycleCheckedNote() {
	return $("#four_side_right .checked").parent();
}

//Get node from seleted note in Search engine(li node)
function getSearchCheckedNote() {
	return $("#sixth_side_right .checked").parent();
}

//Get node from seleted note in Favorites list(li node)
function getLikeCheckedNote() {
	return $("#seventh_side_right .checked").parent();
}



//Register event
$(function(){
	//Show username
	$(".profile-username").text(getCookie("userName"));
	
	//----close，cancel
	$(document).on("click", ".close,.cancle", function() {
		$('#input_notebook,#input_note').val('');
        $('.modal.fade.in').hide();
        $('.opacity_bg').hide();
    }),
	
    
    
    /***********Register notebook operations************/
	//----click notebook, find note
	$(document).on("click", "#pc_part_1 li", function() {
		$('#pc_part_2,#pc_part_3').show();
		$('#pc_part_2 ul').empty();
		$('#pc_part_4,#pc_part_5,#pc_part_6,#pc_part_7,#pc_part_8').hide();
		$('#rollback_button,#like_button,#action_button').removeClass('clicked');
		$(this).siblings('li').children('a').removeClass('checked');
		$(this).children('a').addClass('checked');
		var notebookId=$(this).data('notebook').cn_notebook_id;
		//$('#notebookId').data('cnNotebookId',notebookId);
		//Find note list from given notebook
		getNormalNoteList(notebookId);
    }),
    
	//----Open "create notebook" page
	$(document).on("click", "#add_notebook", function() {
		$('#can').load('./alert/alert_notebook.html',function(){
			$('#input_notebook').focus();
		});
		$('.opacity_bg').show();
    }),
    
	//----create notebook
	$(document).on("click", "#modalBasic .btn.btn-primary.sure", function() {
		var get_name=$('#input_notebook').val();
		var s_num=check_null(get_name);
		get_name=formate_name(get_name);
		if(get_name!=null&&get_name!=''&&s_num!=0){
			//save
			addNoteBook(get_name);
		}
    }),
    
	//----double click,open and edit "notebook" page
	$(document).on("dblclick", "#pc_part_1 li:gt(0)", function() {
		//dom=$(this);
		$('#can').load('./alert/alert_rename.html',function(){
			$('#input_notebook_rename').focus();
			//$('#modalBasic_4 .sure').data({'dom':dom});
		});
		$('.opacity_bg').show();
		//flag=$(this).children('a').children('button').length;
    }),
    
    //update notebook
	$(document).on("click",'#modalBasic_4 .sure',function() {
		var dom = getCheckedNoteBook();
		var notebook = dom.data("notebook");
		var newName=$('#input_notebook_rename').val();
		if(newName && newName!=notebook.cn_notebook_name){
			//update notebook
			notebook.cn_notebook_name=newName;
			updateNoteBook(notebook,dom);
		}
	});
    
	//----Open "delete notebook" page
	$(document).on("click", "#first_side_right .btn_delete", function() {
		$('#can').load('./alert/alert_delete_notebook.html');
		$('.opacity_bg').show();
		//dom=$(this).parents('li');
    }),
	
    //----delete notebook
	$(document).on('click','#modalBasic_6 .btn.btn-primary.sure',function(){
		//If notebook has note, then forbit it to be deleted.
		if($('#second_side_right ul').children().length >0){
			alert("This notebook has note, you can't detele it");
			return ;
		}
		//delete
		var dom = getCheckedNoteBook();
		var notebook=dom.data('notebook');
		deleteNoteBook(notebook.cn_notebook_id,dom);
	});
    
	
	
	/***********Register note operations************/
	//----click note
	$(document).on("click", "#pc_part_2 li", function() {
		$(this).siblings('li').children('a').removeClass('checked');
		$(this).children('a').addClass('checked');
		//var li_dom=$(this);
		//var note_id=$(this).data('note').cn_note_id;
		//$('#save_note').data({
		//	'noteId':note_id,
		//	'dom':li_dom
		//});
		var noteId = getCheckedNote().data("note").cn_note_id;
		getNoteDetail(noteId);
    }),
    
	//----open "create note" page
	$(document).on("click", "#add_note",
    function(a) {
		$('#can').load('./alert/alert_note.html',function() {
			$('#input_note').focus();
		});
		$('.opacity_bg').show();
    }),
    
	//----create note
	$(document).on("click", "#modalBasic_2 .btn.btn-primary.sure",
    function(a) {
		var noteBookName=$('#input_note').val()?$('#input_note').val():'新建笔记';
		noteBookName=formate_name(noteBookName);
		var noteBookId = getCheckedNoteBook().data("notebook").cn_notebook_id;
		//save
		createNormalNote(noteBookId, noteBookName);
    }),
    
    //----save note content
    $(document).on("click","#save_note",function() {
		//var notebook_id=$('#notebookId').data('cnNotebookId');
    	var noteBookId=getCheckedNoteBook().data("notebook").cn_notebook_id;
		//var note_id=$(this).data('noteId');
    	var noteId=getCheckedNote().data("note").cn_note_id;
		//var noteDom=$(this).data('dom');
    	var noteDom=getCheckedNote();
    	
		var noteTitle=$('#input_note_title').val();
		noteTitle=formate_name(noteTitle);
		var noteBody=um.getContent();
		
		var note={
				cn_note_id:noteId,
				cn_notebook_id:noteBookId,
				cn_note_title:noteTitle,
				cn_note_body:noteBody
		};
		//update
		updateNormalNote(note, noteDom);
    }),
    
    //----click the slide down button in the note list
	$(document).on("click", ".btn_slide_down", function() {
		$(this).parents('li').children('.note_menu').addClass('note_menu_show').mouseleave(function(){
			$(this).removeClass('note_menu_show');
		});
    }),
    
    //----open "detele note" page
	$(document).on("click", "#second_side_right .btn_delete", function() {
		$('#can').load('./alert/alert_delete_note.html');
		$('.opacity_bg').show();
		//dom=$(this).parents('li');
    }),
    
	//----confirm deletion
	$(document).on('click','#modalBasic_7 .btn.btn-primary.sure', function() {
		var noteId = getCheckedNote().data("note").cn_note_id;
		deleteNormalNote(noteId, getCheckedNote());
	});
    
	//----open "move note" page
	$(document).on("click", "#second_side_right .btn_move", function() {
		$('#can').load('./alert/alert_move.html',function(){
			// get notebook list
			setNoteBookToSelect("moveSelect");
			$('#moveSelect').focus();
		});
		$('.opacity_bg').show();
		//dom=$(this).parents('li');
    }),
    
	//----confirm move
	$(document).on('click','#modalBasic_11 .btn.btn-primary.sure',function(){
		var dom = getCheckedNote();
		var noteBookId = dom.data("note").cn_notebook_id;
		var toBookId = $('#moveSelect').val();
		if(toBookId && toBookId!=noteBookId){
			// execute "move note"
			var noteId = dom.data("note").cn_note_id;
			moveNote(noteId,toBookId,dom);
			//$('.close,.cancle').trigger('click');
		}
	});
    
	//----share note
	$(document).on("click", "#second_side_right .btn_share", function() {
		$(this).fadeOut(600);
		createShareNote(getCheckedNote().data("note").cn_note_id);
    }),
    
    
    /***********Register Trash operations************/
	//----click Trash button
	$(document).on("click", "#rollback_button", function() {
		$('#pc_part_2,#pc_part_3,#pc_part_6,#pc_part_7,#pc_part_8').hide();
		$('#pc_part_4,#pc_part_5').show();
		$('#first_side_right li a').removeClass('checked');
		$('#like_button,#action_button').removeClass('clicked');
		$(this).addClass('clicked');
		$('#pc_part_4 ul').empty();//everytime before loading, clear all "li node"
		var noteBookId=$('#rollback_button').data('notebook').cn_notebook_id
		getRecycleNoteList(noteBookId);
    }),
    
	//----click note in Trash
	$(document).on("click", "#pc_part_4 li", function() {
		$(this).siblings('li').children('a').removeClass('checked');
		$(this).children('a').addClass('checked');
		getRecycleNoteDetail(getRecycleCheckedNote().data('note').cn_note_id);
    }),
    
	//----click "put back" button in Trash
	$(document).on("click", "#four_side_right .btn_replay", function() {
		$('#can').load('./alert/alert_replay.html',function(){
			setNoteBookToSelect("replaySelect");
			$('#replaySelect').focus();
		});
		$('.opacity_bg').show();
		//dom=$(this).parents('li');
    }),
    
	//----confirm "put back"
	$(document).on('click','#modalBasic_3 .btn.btn-primary.sure', function(){
		var noteId = getRecycleCheckedNote().data("note").cn_note_id;
		var noteBookId = $('#replaySelect').val();
		if(noteBookId!=""&&noteId!="") {
			moveNote(noteId,noteBookId,getRecycleCheckedNote());
		}
	});

	//----click "empty" button in Trash
	$(document).on("click", "#four_side_right .btn_delete", function() {
		$('#can').load('./alert/alert_delete_rollback.html');
		$('.opacity_bg').show();
		//dom=$(this).parents('li');
    }),
    
	//----confirm "empty"
	$(document).on('click','#modalBasic_10 .btn.sure', function() {
		var noteId = getRecycleCheckedNote().data("note").cn_note_id;
		deleteRecycleNote(noteId,getRecycleCheckedNote());
	});
    
	
	/***********Register search note operations************/
	//----search note
	$(document).on("keyup", "body", function(e) {
		if($('#search_note').is(':focus')&&(e.keyCode==108||e.keyCode==13)){
			var m=$('#search_note').val();
			var n=m.replace(/ /g,'');
			var a=n.length;
			if(a!=0){
				$('#sixth_side_right ul').empty();
				$('#more_note').val(1);
				getShareNoteList(n,1);
			}
		}
    }),
    
	//----search more note
	$(document).on("click", "#more_note", function() {
		var m=$('#search_note').val();
		var n=m.replace(/ /g,'');
		var a=n.length;
		if(a!=0){
			var page = $('#more_note').val();
			$('#more_note').val(parseInt(page)+1);
			getShareNoteList(n,parseInt(page)+1);
		}
    }),
    
	//----click searched note
	$(document).on("click", "#sixth_side_right li", function() {
		$(this).siblings('li').children('a').removeClass('checked');
		$(this).children('a').addClass('checked');
		var shareId=$(this).data('share').cn_share_id;
		getShareNoteDetail(shareId);
    }),
    
	//----favorite searched note
	$(document).on("click", "#pc_part_6 .btn_like", function() {
		var dom=$(this);
		$('#can').load('./alert/alert_like.html',function(){
			$('#modalBasic_5 .btn.btn-primary.sure').click(function(){
				//$('.close,.cancle').trigger('click');
				var shareId=getSearchCheckedNote().data("share").cn_share_id;
				likeShareNote(shareId, dom);
			});
		});
		$('.opacity_bg').show();
    }),
    
    
    /***********Register favorites operations************/
	//----click favorite button
	$(document).on("click", "#like_button", function() {
		$('#pc_part_2,#pc_part_3,#pc_part_4,#pc_part_6,#pc_part_8').hide();
		$('#pc_part_7,#pc_part_5').show();
		$('#first_side_right li a').removeClass('checked');
		$('#rollback_button,#action_button').removeClass('clicked');
		$(this).addClass('clicked');
		$('#pc_part_7 ul').empty();//everytime before loading, clear all "li node"
		var like_id=$('#like_button').data('notebook').cn_notebook_id;
		getLikeNoteList(like_id);
    }),
	
	//----click favorite note
	$(document).on("click", "#pc_part_7 li", function() {
		$(this).siblings('li').children('a').removeClass('checked');
		$(this).children('a').addClass('checked');
		var note_id=$(this).data('note').cn_note_id;
		getLikeNoteDetail(note_id);
    }),
    
	//----click cancel favorite
	$(document).on("click", "#pc_part_7 li .btn_delete", function() {
		$('#can').load('./alert/alert_delete_like.html');
		$('.opacity_bg').show();
		//dom=$(this).parents('li');
    }),
    
	//----confirm cancellation
	$(document).on('click','#modalBasic_9 .btn.btn-primary.sure',function(){
		var noteId = getLikeCheckedNote().data("note").cn_note_id;
		deleteLikeNote(noteId,getLikeCheckedNote());
		
	});
    
	
	/***********Register event note operations************/
	//----click "participate in	activity" button
	$(document).on("click", "#action_button", function() {
		$('#pc_part_2,#pc_part_3,#pc_part_6,#pc_part_7,#pc_part_4').hide();
		$('#pc_part_8,#pc_part_5').show();
		$('#first_side_right li a').removeClass('checked');
		$('#rollback_button,#like_button').removeClass('clicked');
		$(this).addClass('clicked');
		$("#eighth_side_right ul").empty();
		var noteBookId = $('#action_button').data('notebook').cn_notebook_id;
		getNoteActivityList(noteBookId);
    }),
    
    //----click a note to participate in activity
	$(document).on("click", "#pc_part_8 li", function() {
		$(this).siblings('li').children('a').removeClass('checked');
		$(this).children('a').addClass('checked');
		getActivityNoteDetail($(this).data('note').cn_note_id);
    }),
	
    
    
    
    
    /***********Register event operations************/
	//----more event note
	$(document).on("click", "#more_activity_note", function() {
		var page = $('#more_activity_note').val();
		$('#more_activity_note').val(parseInt(page)+1);
		getNoteActivitys(global_ac_id,parseInt(page)+1);
    });
	
	//----click note(event page)
	$(document).on("click", "#action_part_1 li", function() {
		$('#rollback_button').removeClass('clicked');
		$(this).siblings('li').children('a').removeClass('checked');
		$(this).children('a').addClass('checked');
		$("#content_body").empty();
		getNoteActivityDetail($(this).data('noteActivity').cn_note_activity_id);
    }),
	
	//----click "participate in	activity"（event page）
	$(document).on("click", "#join_action", function() {
		$('#modalBasic_15,.opacity_bg').show();
		$('#select_notebook ul').empty();
		$('#select_note ul').empty();
		getSelectNoteBook();
    }),
    
	//----perpare note to participate in activity（event page）
	$(document).on("click", "#select_notebook li", function() {
		$(this).siblings('li').children('a').removeClass('checked');
		$(this).children('a').addClass('checked');
		var noteBookId=$(this).data('notebook').cn_notebook_id;
		$('#select_note ul').empty();
		getSelectNoteList(noteBookId);
    }),
    
	//----select note（event page）
	$(document).on("click", "#select_note li", function() {
		$(this).siblings('li').children('a').removeClass('checked');
		$(this).children('a').addClass('checked');
    }),

	//----confirm selection（event page）
	$(document).on("click", "#modalBasic_15 .btn.btn-primary.sure", function() {
		//var get_notename=$('#select_note li a.checked').text();
		//$('.close,.cancle').trigger('click');
		var dom=$("#select_note ul .checked").parent();
		var noteId=dom.data('note').cn_note_id;
		//var activity_Id=dom.data('noteBookId');
		createNoteActivity(noteId,global_ac_id,dom);
    }),
    
	//----click favorite（event page）
	$(document).on('click',"#first_action .btn_like", function() {
		var dom = $(this).parents("li");
		var noteActivityId = dom.data("noteActivity").cn_note_activity_id;
		likeActivityNote(noteActivityId, $(this));
    }),
	
	//----Like note（event page）
	$(document).on("click", "#first_action .btn_up", function() {
		var dom = $(this).parents("li");
		var noteActivityId = dom.data("noteActivity").cn_note_activity_id;
		up(noteActivityId,$(this));
    }),
    
	//----Dislike note（event page）
	$(document).on("click", "#first_action .btn_down", function() {
		var dom = $(this).parents("li");
		var noteActivityId = dom.data("noteActivity").cn_note_activity_id;
		down(noteActivityId,$(this));
    });
	
});