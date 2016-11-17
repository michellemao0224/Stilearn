/***
 * Load normal notebook
 */
function loadNormalNoteBook(){
	$.ajax({
		type:"post",
		url:basePath+"notebook/findNormal.do",
		dataType:"json",
		data:{},
		success:function(result) {
			console.log(this);
			if(result.status==0) {
				var list = result.data;
				$(list).each(function(){
					$("#first_side_right ul").append('<li class="online"><a><i class="fa fa-book" title="笔记本" rel="tooltip-bottom"></i> '+this.cn_notebook_name+'<button type="button" class="btn btn-default btn-xs btn_position btn_delete"><i class="fa fa-times"></i></button></a></li>');
					$('#first_side_right li:last').data('notebook',this);
				});
			} else {
				alert(result.message);
				if(result.message=="请先登录.") {
					setTimeout(function(){
						location.href="login.html";
					},1000);
				}
			}
		},
		error:function(xhr,status,error) {
			alert("Request error.");
		}
	});
}

/***
 * Load special notebook
 */
function loadSpecialNoteBook(){
	$.ajax({
		type:"post",
		url:basePath+"notebook/findSpecial.do",
		dataType:"json",
		data:{},
		success:function(result) {
			if(result.status==0) {
				var map = result.data;
				$('#first_side_right li:first').data('notebook',map.push);
				$('#rollback_button').data('notebook',map.recycle);
				$('#like_button').data('notebook',map.favorites);
				$('#action_button').data('notebook',map.action);
			} else {
				alert(result.message);
			}
		},
		error:function(xhr,status,error) {
			alert("Request error.");
		}
	});
}

/****
 * Add notebook
 */
function addNoteBook(noteBookName){
	$.ajax({
		type:"post",
		url:basePath+"notebook/addNoteBook.do",
		dataType:"json",
		data:{"cn_notebook_name":noteBookName},
		success:function(result) {
			if(result.status==0) {
				var noteBook = result.data;
				$("#first_side_right ul li:first").after('<li class="online"><a><i class="fa fa-book" title="笔记本" rel="tooltip-bottom"></i> '+noteBook.cn_notebook_name+'<button type="button" class="btn btn-default btn-xs btn_position btn_delete"><i class="fa fa-times"></i></button></a></li>');
				$("#first_side_right ul li:first").next().data('notebook',noteBook);
				$(".close,.cancle").trigger("click");
			} else {
				alert(result.message);
			}
		},
		error:function(xhr,status,error) {
			alert("Request error.");
		}
	});
}

/***
 * Rename notebook
 */
function updateNoteBook(notebook,dom){
	/**
	$.post(
		basePath+"notebook/updateNoteBookName.do",
		notebook,
		function(result) {
			if(result.status==0) {
				dom.children('a').html('<i class="fa fa-book" title="笔记本" rel="tooltip-bottom"></i> '+notebook.cn_notebook_name+'<button type="button" class="btn btn-default btn-xs btn_position btn_delete"><i class="fa fa-times"></i></button>');
				$('.close,.cancle').trigger('click');
			} else {
				alert(result.message);
			}
		}
	);
	**/
	$.ajax({
		type:"post",
		url:basePath+"notebook/updateNoteBookName.do",
		dataType:"json",
		data:notebook,
		success:function(result) {
			if(result.status==0) {
				dom.children('a').html('<i class="fa fa-book" title="笔记本" rel="tooltip-bottom"></i> '+notebook.cn_notebook_name+'<button type="button" class="btn btn-default btn-xs btn_position btn_delete"><i class="fa fa-times"></i></button>');
				$('.close,.cancle').trigger('click');
			} else {
				alert(result.message);
			}
		},
		error:function(xhr,status,error) {
			alert("Request error.");
		}
	});
}

/***
 * Delete notebook
 */
function deleteNoteBook(noteBookId,dom){
	$.ajax({
		type:"post",
		url:basePath+"notebook/deleteNoteBook.do",
		dataType:"json",
		data:{"noteBookId":noteBookId},
		success:function(result) {
			if(result.status==0) {
				dom.remove();
				$('.close,.cancle').trigger('click');
			} else {
				alert(result.message);
			}
		},
		error:function(xhr,status,error) {
			alert("Request error.");
		}
	});
}

/**
 * Put notebook list into select component
 */
function setNoteBookToSelect(selectId){
	$.ajax({
		type:"post",
		url:basePath+"notebook/findList.do",
		dataType:"json",
		data:{},
		success:function(result) {
			if(result.status==0) {
				var list = result.data;
				$(list).each(function(){
					var option = "<option value='"+this.cn_notebook_id+"'>"+this.cn_notebook_name+"</option>";
					$("#"+selectId).append(option);
				});
			} else {
				alert(result.message);
			}
		},
		error:function(xhr,status,error) {
			alert("Request error.");
		}
	});
}