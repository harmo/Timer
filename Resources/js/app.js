var appDir = Ti.Filesystem.getResourcesDirectory();
var oM = new Message();
var oD = new Database('timer', true);
var oP = new Page();
var uT = new Utils();

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
		],
		'config': [
			'type TEXT NOT NULL',
			'width INTEGER NOT NULL',
			'max_width INTEGER NOT NULL',
			'height INTEGER NOT NULL',
			'max_height INTEGER NOT NULL',
			'bg_color TEXT NOT NULL'
		]
	};
	// Initialize the database 
	oD.init(aQueries);

	// Initialize Config
	oD.initConfig();

	// Add the default page
	oP.add('timer');

	// Listener on nav links
	$('.link').click(function(){
		if($(this).attr('id') == 'exit'){
			oP.exit();
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
	$('.navbar').mousedown(function(event){
	    dragging = true;
	    xstart = event.clientX;
	    ystart = event.clientY;
	});
	$('.navbar').mouseup(function(){
	    dragging = false;
	});

	// Simulate the click on default page, for display it
	$('#timer').trigger('click');

	// Construct the tray and dock menu
	var Tray = Ti.UI.addTray('app://icon-timer.png');
	var Menu = Ti.UI.createMenu();
	item1 = Ti.UI.createMenuItem('Exit', oP.exit, 'app://img/off.png');
	item2 = Ti.UI.createMenuItem('Updates', oP.checkUpdates, 'app://img/update.png');
	item3 = Ti.UI.createMenuItem('Maximize', oP.maximize, 'app://img/maximize.png');
	item4 = Ti.UI.createMenuItem('Minimize', oP.minimize, 'app://img/minimize.png');
	Menu.appendItem(item1);
	Menu.appendItem(item2);
	Menu.appendItem(item3);
	Menu.appendItem(item4);
	Tray.setMenu(Menu);
	Ti.UI.setDockMenu(Menu);
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

	this.maximize = function(){
		Ti.UI.currentWindow.maximize();
	}

	this.minimize = function(){
		Ti.UI.currentWindow.minimize();
	}

	this.exit = function(){
		Ti.UI.currentWindow.close();
	}

	this.checkUpdates = function(){
		return false;
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