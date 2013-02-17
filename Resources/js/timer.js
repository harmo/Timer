// Instanciate the Timer object
oT = typeof(oT) == 'undefined' ? new Timer() : oT;
oT.init();

// Listener on Start / Stop button
$('.projectLine').on('click', '.stopStart', function(e){
	e.preventDefault();
	if($(this).hasClass('off')){
		oT.launch($(this).parent('.projectLine').attr('id'));
	}
	else {
		oT.kill($(this).parent('.projectLine').attr('id'));
	}
});

// Listener on Reset button 
$('.projectLine').on('click', '.reset', function(e){
	e.preventDefault();
	oT.resetTime($(this).parent('.projectLine').attr('id'));
});

/**
 * The Timer object
 */
function Timer(){

	/**
	 * Array contains object parameters
	 * @type {Object}
	 */
	this.timer = {};

	/**
	 * Initialize the Timer object, display all the html
	 * @return {void}
	 */
	this.init = function(){
		sHtml = '';
		aTimers = oD.select('projects', ['id', 'name', 'time', 'total_time']);
		if(aTimers == 'empty'){
			sHtml = 'No projects found, please add one with tab "Projects".';
		}
		else {
			for(project in aTimers){
				sHtml += '<div class="projectLine" id="'+aTimers[project].id+'">'+"\n"+
	       				'<a class="stopStart btn btn-success fLeft off" href="#"><i class="icon-play"></i></a>'+"\n"+
	        			'<code class="timer fLeft alert-info">'+oT.getTimer(aTimers[project]['time'])+'</code>'+"\n"+
	       				'<a class="reset btn btn-danger fLeft" href="#"><i class="icon-fire"></i></a>'+"\n"+
	        			'<span class="label">'+aTimers[project].name+'</span>'+"\n"+
	        			'<div class="clear"></div>'+"\n"+
      				'</div>';
      			oT.timer[aTimers[project].id] = {'name': aTimers[project].name, 'seconds': aTimers[project]['time'], 'total_time': aTimers[project]['total_time'], 'timeOut': null};
			}
		}
		sHtml += '<div id="message"></div>';
		$('#content').html(sHtml);
		oT.stopOthers();
	}

	/**
	 * Launch the timer for the designed project
	 * Register the start action in statistics table
	 * @param  {Int} idProject The project ID
	 * @return {void}           
	 */
	this.launch = function(idProject){
		idProject = parseInt(idProject);
		oT.stopOthers();
		oT.start(idProject);
		now = new Date().getTime();
		oD.insert('statistics', [idProject, now, 'start', oT.timer[idProject].seconds]);
	}

	/**
	 * Loop for increment the concerned timer
	 * @param  {Int} idProject The project ID
	 * @return {void}
	 */
	this.start = function(idProject){
		idProject = parseInt(idProject);
		$('#'+idProject+' .stopStart').removeClass('off').addClass('on').removeClass('btn-success').addClass('btn-warning').html('<i class="icon-stop"></i>');
		$('#'+idProject+' .timer').html(oT.getTimer(oT.timer[idProject].seconds));
		oT.timer[idProject].seconds ++;
		oT.timer[idProject].timeOut = setTimeout('oT.start('+idProject+')', 1000);
	}

	/**
	 * Stop the timer for concerned project
	 * @param  {Integer} idProject The project ID
	 * @return {void}
	 */
	this.kill = function(idProject){
		$('#'+idProject+' .stopStart').removeClass('on').addClass('off').removeClass('btn-warning').addClass('btn-success').html('<i class="icon-play"></i>');
		clearTimeout(oT.timer[idProject].timeOut);
		oT.registerSeconds(parseInt(idProject), oT.timer[idProject].seconds);
	}

	/**
	 * Function for stop the started timers
	 * Activate when a click event is trigger on another project start button
	 * @return {void}
	 */
	this.stopOthers = function(){
		$('.stopStart').each(function(){
			if($(this).hasClass('on')){
				$(this).removeClass('on').addClass('off').removeClass('btn-warning').addClass('btn-success');
				oT.kill($(this).parent('.projectLine').attr('id'));
			}
		});
	}

	/**
	 * Reset the concerned timer to restart new one
	 * Register reset action in statistics table
	 * Increment the total time in projects table
	 * @param  {Int} idProject The project ID
	 * @return {void}
	 */
	this.resetTime = function(idProject){
		idProject = parseInt(idProject);
		if(oT.timer[idProject].seconds > 0){
			totalTime = aTimers[project]['total_time'] + oT.timer[idProject].seconds;
			oD.update('projects', {'time': 0, 'total_time': totalTime}, {'id': idProject});
			now = new Date().getTime();
			oD.insert('statistics', [idProject, now, 'reset', oT.timer[idProject].seconds]);
			$('#'+idProject).find('.timer').html('00 : 00 : 00');
			oM.show('<p class="text-success">Project '+oT.timer[idProject].name+' Successfully reset.</p>');
		}
	}

	/**
	 * Register the timer seconds in the projects table
	 * Register the stop action in statistics table
	 * @param  {Int} idProject The project ID
	 * @param  {Int} seconds   
	 * @return {void}           
	 */
	this.registerSeconds = function(idProject, seconds){
		oD.update('projects', {'time': seconds}, {'id': idProject});
		now = new Date().getTime();
		oD.insert('statistics', [idProject, now, 'stop', seconds]);
	}

	/**
	 * Function for transform seconds in a string like 00 : 00 : 00
	 * @param  {Int} seconds 
	 * @return {String} The formated time
	 */
	this.getTimer = function(seconds){
		var rest = seconds;
		var result = '';
		var nbHours = Math.floor(rest / 3600);
		rest -= nbHours * 3600;
		var nbMinutes = Math.floor(rest / 60);
		rest -= nbMinutes * 60;
		var nbSeconds = rest;

		if (nbHours > 0)
			result = oT.zeroFill(result+nbHours, 2) + ' : ';
		else 
			result = '00 : ';
		if (nbMinutes > 0)
			result = result + oT.zeroFill(nbMinutes, 2) + ' : ';
		else 
			result = result + '00 : ';
		if (nbSeconds > 0)
			result = result + oT.zeroFill(nbSeconds, 2);
		else 
			result = result + '00';

		return result;
	}

	/**
	 * Function for number formating (8 => 08)
	 * @param  {Int} number 
	 * @param  {Int} width  The number of 0 needed before the number
	 * @return {String}  The formated number
	 */
	this.zeroFill = function(number, width){
		width -= number.toString().length;
		if(width > 0){
			return new Array(width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
		}
		return number + "";
	}
}