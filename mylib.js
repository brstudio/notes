/*
		все переменные с _x , все id с __x
	*/
		const _mask = 'n_';
		let _globalHashTagsSet = new Set();
		let _currTags = new Set();
		let _tmpArray = [];

		function init(){
			if (localStorage.length <= 0){
				localStorage.setItem('maxKey','1');
			} 
			if (localStorage.getItem('hashtags') == null){
				localStorage.setItem('hashtags','');
			} else if (localStorage.getItem('hashtags').length > 0){
				_tmpArray = localStorage.getItem('hashtags');				
				_tmpArray = _tmpArray.split(',');
				for (let i = 0; i < _tmpArray.length; i++){
					_globalHashTagsSet.add(_tmpArray[i]);
				}
			}			
		}

		function deleteNodes(ID){			
	        let _node = document.getElementById(ID);
			while (_node.firstChild) {
			    _node.removeChild(_node.firstChild);
			}
		}

		function showTagsList(){
			let _tagsListDiv = document.createElement('div');
			_tagsListDiv.id = "__forms__tagsList";
			_tagsListDiv.className = "tagsList";
			document.getElementById("__base-div__forms").appendChild(_tagsListDiv);
			let _inputText = document.createElement('input');
			_inputText.type = "text";
			_inputText.className = "inputText";
			_inputText.placeholder = "enter tag for search";
			_inputText.addEventListener('keyup', function(event){
				if (event.keyCode == 13){
					let text = this.value;					
					showNotesList(text);
				}				
			});
			document.getElementById("__forms__tagsList").appendChild(_inputText);
			let _newUl = document.createElement('ul');
			_newUl.id = "__taglistUl";
			document.getElementById("__forms__tagsList").appendChild(_newUl);
			let ul = document.getElementById("__taglistUl");
			if (_tmpArray.length > 0){
				for (let i = 0; i < _tmpArray.length ; i++){
					let _newLi = document.createElement('li');
					_newLi.id = _tmpArray[i];
					_newLi.className = "tagsListItem";
					_newLi.innerHTML = _tmpArray[i];	
					_newLi.addEventListener('dblclick', function(){tagDel(_tmpArray[i])});
					ul.appendChild(_newLi);	
				}
			}
		}

		function showNotesList(flg){
			//delete previous nodes in DOM
			init();
			deleteNodes("__base-div__forms");
			let _notesListDiv = document.createElement('div');
			_notesListDiv.id = "__forms__notesList";
			_notesListDiv.className = "notesList";
			//add div into DOM
			document.getElementById("__base-div__forms").appendChild(_notesListDiv);
			showTagsList();
			//add ul into div
			let _newUl = document.createElement('ul');
			_newUl.id = "__newUl";
			document.getElementById("__forms__notesList").appendChild(_newUl);
			let ul = document.getElementById("__newUl");
			//verify localstorage length
			if (localStorage.length > 2) { //1 - maxID, 2 - tags array
				//add li into ul in loop
				for (let i = 0; i < localStorage.length; i++) {
					//mask verify
					let _key = localStorage.key(i);
					if (_key.indexOf(_mask) == 0) {
						if (flg == undefined){
							let _newLi = document.createElement('li');
							_newLi.id = _key;
							_newLi.className = "noteListItem";
							_newLi.innerHTML = localStorage.getItem(_key);	
							_newLi.addEventListener('click', function(){note(_key);});
							ul.appendChild(_newLi);	
						} else { //search
							if (localStorage.getItem(_key).indexOf('#'+flg) != -1){
								//alert(localStorage.getItem(_key));
								let _newLi = document.createElement('li');
								_newLi.id = _key;
								_newLi.className = "noteListItem";
								_newLi.innerHTML = localStorage.getItem(_key);	
								_newLi.addEventListener('click', function(){note(_key);});
								ul.appendChild(_newLi);	
							}
						}						
					}					
				}	
			}
		}		

		function tagDel(flg){						
			for (let i = 0; i < localStorage.length; i++) {
				//mask verify
				let _key = localStorage.key(i);
				if (_key.indexOf(_mask) == 0) {						
					if (localStorage.getItem(_key).indexOf('#'+flg) != -1){
						_globalHashTagsSet.delete(flg);
						localStorage.setItem('hashtags',Array.from(_globalHashTagsSet));
						//del in tmp -> save local
						let _strTemp = localStorage.getItem(_key);							
						_strTemp = _strTemp.replace('#'+ flg, flg);
						localStorage.setItem(_key, _strTemp);
					}						
				}					
			}	
			showNotesList();
			location.reload();
		}
		
		function note(flg){		
			/*
				flags: 
				undefined- new note
				noteID - show note
			*/	
			//delete previous childs DOM 
			deleteNodes("__base-div__forms");
			let _newTextArea = document.createElement('div');
  			_newTextArea.id = "__forms__textarea";
  			_newTextArea.className = "textarea_div";
  			_newTextArea.contentEditable = false;  			
  			_newTextArea.setAttribute("placeHolder","enter note text");	  			
			document.getElementById("__base-div__forms").appendChild(_newTextArea);
			let _tagsArea = document.createElement('p');
			_tagsArea.id ="__tagsArea";
			_tagsArea.className = "tagsArea";
			document.getElementById("__base-div__forms").appendChild(_tagsArea);
			//breakpoint: flg view|new note
			if (flg == undefined){ //new note
				_newTextArea.contentEditable = true;
				addSaveButton();				
				parseCurrTags();				
			} else { //view note
				addBtnDel(flg);
				_newTextArea.innerHTML = localStorage.getItem(flg);				
				parseTags(_newTextArea.innerHTML);
				_newTextArea.addEventListener('dblclick', function(){ 
					document.getElementById("__forms__textarea").contentEditable = true;
					addSaveButton(flg);					
					parseCurrTags();
				});
			}			
		}	

		function addBtnDel(flg){
			let _newBtnDel = document.createElement('button');
			_newBtnDel.innerHTML = 'delete';
			_newBtnDel.addEventListener('click', function(){localStorage.removeItem(flg); showNotesList();});
			_newBtnDel.className = "btn";
			document.getElementById("__base-div__forms").appendChild(_newBtnDel);
		}

		function addSaveButton(flg){// flags new|edit 			
			let _newBtnSave = document.createElement('button');
			_newBtnSave.innerHTML = 'save';	
			_newBtnSave.className = "btn";		
			if (flg == undefined){// new note
				_newBtnSave.addEventListener('click',function(){
				saveNote();				
				document.getElementById("__forms__textarea").contentEditable = false;
				document.getElementById("__base-div__forms").removeChild(document.getElementById("__base-div__forms").lastChild);
				});
			} else {
				_newBtnSave.addEventListener('click',function(){
					saveNote(flg);					
					document.getElementById("__forms__textarea").contentEditable = false;
					document.getElementById("__base-div__forms").removeChild(document.getElementById("__base-div__forms").lastChild);
				});
			}			
			_newBtnSave.className = "btn";
			document.getElementById("__base-div__forms").appendChild(_newBtnSave);
		}

		function saveNote(flg){
			if (flg == undefined) {//new note save
				let num = parseInt(localStorage.getItem('maxKey'),10);
				num++;
				localStorage.setItem(_mask + num,document.getElementById("__forms__textarea").innerHTML);
				localStorage.setItem('maxKey', num);				
			} else {//edit note save
				localStorage.setItem(flg, document.getElementById("__forms__textarea").innerHTML);				
			}
			saveGlobalTags();	
		}		

		function saveGlobalTags(){
			if (_currTags.size > 0){				
				for (let item of _currTags) _globalHashTagsSet.add(item);
				localStorage.setItem('hashtags',Array.from(_globalHashTagsSet));
			}
		}

		function clearTempSet(){
			for (let item of _currTags) _currTags.delete(item);			
		}

		function parseTags(text){
			clearTempSet();
			let _tagsArray =[];
			_tagsArray = text;
			_tagsArray = _tagsArray.split(' ');
			for (let i = 0; i < _tagsArray.length; i++){
				if (_tagsArray[i].indexOf('#') == 0 ){	
					let _s = _tagsArray[i];
					let _s2 = _s.substring(1,_s.length);									
					_currTags.add(_s2);							
				}
			}					
			document.getElementById("__tagsArea").innerHTML = Array.from(_currTags);
		}

		function parseCurrTags(){
			//in opened note
			let input = document.querySelector('.textarea_div');
			input.addEventListener('keyup', function (event) {
				if (event.keyCode == 32){
					let text = this.textContent;
					parseTags(text);
				}
			});			 
		}	