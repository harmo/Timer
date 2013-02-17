var appDir = Ti.Filesystem.getResourcesDirectory();
var oM = new Message();
var oD = new Database('timer', true);
var oP = new Page();

$(document).ready(function(){

	/**
	 * Array filled with all tables and fields
	 * @type Array
	 */
	aQueries = {
		'projects': [
			'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT',
			'name TEXT NOT NULL',
			'time INTEGER NOT NULL DEFAULT 0',
			'total_time INTEGER NOT NULL DEFAULT 0',
			'timestamp INTEGER DEFAULT NULL'
		],
		'statistics': [
			'id_project INTEGER NOT NULL',
			'timestamp INTEGER NOT NULL',
			'action TEXT DEFAULT NULL',
			'time INTEGER DEFAULT NULL'
		]
	};
	// Initialize the database 
	oD.init(aQueries);

	// Add the default page
	oP.add('timer');

	// Listener on nav links
	$('.link').click(function(){
		if($(this).attr('id') == 'exit'){
			var window = Ti.UI.currentWindow;
			window.close();
		}
		else {
			oP.add($(this).attr('id'));
		}		
		return false;
	});

	// Listeners for moving application on desktop
	var dragging = false;
	$(document).mousemove(function(event){
	    if (!dragging)
	        return;

	    Ti.UI.currentWindow.setX(Ti.UI.currentWindow.getX() + event.clientX - xstart);
	    Ti.UI.currentWindow.setY(Ti.UI.currentWindow.getY() + event.clientY - ystart);
	});
	$(document).mousedown(function(event){
	    dragging = true;
	    xstart = event.clientX;
	    ystart = event.clientY;
	});
	$(document).mouseup(function(){
	    dragging = false;
	});

	// Simulate the click on default page, for display it
	$('#timer').trigger('click');
});

/**
 * Function for load functions and methods 
 * Depend on clicked link
 */
function Page(){

	/**
	 * Load the designed script
	 * @param {String} page The name of the script to load, without directory and extension
	 */
	this.add = function(page){
		oFile = Ti.Filesystem.getFile(appDir+'/js/'+page+'.js');
		if(oFile.exists){
			$.getScript('js/'+page+'.js');
		}
	}
}

/**
 * Function for display a message in the window
 */
function Message(){

	/**
	 * Clear the message container
	 * @return {void} 
	 */
	this.clear = function(){
		$('#message').html('');
	}

	/**
	 * Fill all the message container with custom Message
	 * @param  {String} message 
	 * @return {void} 
	 */
	this.show = function(message){
		$('#message').html(message+'<br />');
	}

	/**
	 * Append the custom message after others in the message container
	 * @param {String} message 
	 */
	this.add = function(message){
		$('#message').append(message+'<br />');
	}
}