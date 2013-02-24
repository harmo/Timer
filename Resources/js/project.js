// Instanciate the Project object nd initialize it
var oPr = typeof(oPr) == 'undefined' ? new Project() : oPr;
oPr.init();

// Listener on add project button
$('#content').on('click', '#addProject', function(e){
	e.preventDefault();
	oPr.addOne();
});

// Listener on delete project button
$('#content').on('click', '.deleteProject', function(e){
	e.preventDefault();
	oPr.deleteOne($(this).parent('div').attr('id'));
});

/**
 * The Project object
 */
function Project(){

	/**
	 * Add a project in database
	 * @return {void} 
	 */
	this.addOne = function(){
		sHtml = '';
		name = $('#name').val();
		if(name != ''){
			now = Math.round(new Date().getTime()/1000.0)
			if(oD.insert('projects', ['NULL', name, 0, 0, now])){
				aProject = oPr.displayProjects();
				oD.insert('statistics', [aProject.id, now, 'addProject', '0']);
				$('#content').html(oPr.displayForm() + aProject.sHtml);
			}
		}
		else {
			oM.show('<p class="text-error">Project name can\'t be empty</p>');
			$('#name').parent('div').addClass('error');
		}
	}

	/**
	 * Delete a project with all its statistics
	 * @param  {Int} projectId The project ID
	 * @return {void} 
	 */
	this.deleteOne = function(projectId){
		projectId = parseInt(projectId);
		oD.deleteRow('projects', {'id': projectId});
		oD.deleteRow('statistics', {'id_project': projectId});
		now = Math.round(new Date().getTime()/1000.0);
		$('#'+projectId).fadeOut('fast');
	}

	/**
	 * Initialize the page 	
	 * @return {void}
	 */
	this.init = function(){
		aProject = oPr.displayProjects();
		sHtml = oPr.displayForm();
		sHtml += aProject.sHtml + '<div id="message"></div>';
		$('#content').html(sHtml);
	}

	/**
	 * Display the add project form
	 * @return {String} The form html
	 */
	this.displayForm = function(){
		sHtml = '<div class="addProjectForm">'+"\n"+
				'<form>'+"\n"+
					'<div class="control-group">'+"\n"+
						'<input id="name" type="text" class="input-medium" placeholder="Project name" />'+"\n"+
					'</div>'+"\n"+
					'<input type="submit" id="addProject" class="btn btn-primary" value="Add project" />'+"\n"+
				'</form>'+"\n"+
			'</div>';
		return sHtml;
	}	

	/**
	 * Load and display all project saved with them options buttons
	 * @return {Array} 'id' => Id of the project, 'sHtml' => All html for saved projects
	 */
	this.displayProjects = function(){
		sHtml = '';
		aReturn = {};
		aTimers = oD.select('projects', ['id', 'name']);
		if(aTimers != 'empty'){
			for(project in aTimers){
				sHtml += '<div class="projectLineForDelete" id="'+aTimers[project].id+'">'+"\n"+
		   				'<a class="btn btn-danger deleteProject" href="#"><i class="icon-trash"></i></a>'+"\n"+
		    			'<span class="label">'+aTimers[project].name+'</span>'+"\n"+
		    			'<div class="clear"></div>'+"\n"+
					'</div>';
			}
		}
		aReturn['sHtml'] = sHtml;
		aReturn['id'] = aTimers != 'empty' ? aTimers[project].id : '';
		return aReturn;
	}
}