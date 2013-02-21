// Instanciate the Config object
var oC = typeof(oC) == 'undefined' ? new Config() : oC;
oC.init();

// Listener on the colors bars
$('#content').on('click', '.progress', function(e){
	color = $(this).children('.bar').attr('id');
	pos = e.pageX- this.offsetLeft;
	$('#'+color).css('width', pos);
	oC.refreshColor(color, pos);
});

// Listeners on the submit input, to save values in db
$('#content').on('submit', '#configForm', function(e){
	e.preventDefault();
	oC.H = parseInt($('#height').val());
	oC.W = parseInt($('#width').val());
	oC.save();
	oC.win.setSize(oC.W, oC.H);
	oC.win.hide();
	oC.win.show();
});

function Config(){

	// The Window object
	this.win = null;
	// The height value
	this.H = null;
	// The max-height value
	this.maxH = null;
	// The width value
	this.W = null;
	// The max-width value
	this.maxW = null;
	// The background color of body
	this.bg = null;

	/**
	 * Initialize the Config object
	 * Apply values to colors bars
	 * @return {void} 
	 */
	this.init = function(from){
		oC.win = Ti.UI.getMainWindow();
		oC.H = oC.win.getHeight();
		oC.maxH = oC.win.getMaxHeight();
		oC.W = oC.win.getWidth();
		oC.maxW = oC.win.getMaxWidth();
		oC.bg = $('body').css('background-color');

		oC.displayForm();
		color = uT.arrayFromRgb(oC.bg);
		currentBarW = parseInt($('.progress-danger').width());
		rW = (currentBarW / 250) * color.r;
		gW = (currentBarW / 250) * color.g;
		bW = (currentBarW / 250) * color.b;
		$('#red').css('width', rW);
		$('#green').css('width', gW);
		$('#blue').css('width', bW);
	}

	/**
	 * Display the config form
	 * @return {String} The form html, with filled fields
	 */
	this.displayForm = function(){
		sHtml = '<form id="configForm">'+"\n"+
					'<label class="label label-info fLeft" for="height">Height</label>'+"\n"+
					'<input type="text" id="height" class="input-mini" value="'+oC.H+'" />'+"\n"+
					'<div class="clear"></div><br />'+"\n"+
					'<label class="label label-info fLeft" for="width">Width</label>'+"\n"+
					'<input type="text" id="width" class="input-mini" value="'+oC.W+'" />'+"\n"+
					'<div class="clear"></div><br />'+"\n"+
					'<div class="progress progress-danger">'+"\n"+
						'<div class="bar" id="red"></div>'+"\n"+
					'</div>'+"\n"+
					'<div class="progress progress-success">'+"\n"+
						'<div class="bar" id="green"></div>'+"\n"+
					'</div>'+"\n"+
					'<div class="progress">'+"\n"+
						'<div class="bar" id="blue"></div>'+"\n"+
					'</div>'+"\n"+
					'<button type="submit" class="btn">Save</button><br />'+"\n"+
				'</form>'+"\n"+
			'<div id="message"></div>';
		$('#content').html(sHtml);
	}

	/**
	 * Refresh the body color after calculate it from bars
	 * @return {void} 
	 */
	this.refreshColor = function(){
		currentBarW = parseInt($('.progress-danger').width());
		red = Math.ceil(parseInt($('#red').width()) / (currentBarW / 250));
		green = Math.ceil(parseInt($('#green').width()) / (currentBarW / 250));
		blue = Math.ceil(parseInt($('#blue').width()) / (currentBarW / 250));
		hex = uT.hexFromRGB(red, green, blue);
		oC.bg = '#' + hex
		$('body').animate({"background-color": "#" + hex}, 500);
	}

	/**
	 * Save the current configuration in db
	 * @return {void} 
	 */
	this.save = function(){
		oD.open();
		oD.update('config', {'height': oC.H, 'width': oC.W, 'bg_color': '"'+oC.bg+'"'}, {'type': '"global"'});
		oD.close();
		oM.show('<p class="text-success">Configuration saved !</p>');
	}
}