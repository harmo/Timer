/**
 * Utils object
 */
function Utils(){

	/**
	 * Function for get hexadecimal value from rgb one
	 * @param  {Int} r The red rgb color value
	 * @param  {Int} g The green rgb color value
	 * @param  {Int} b The blue rgb color value
	 * @return {String}   The hexadecimal color value
	 */
	this.hexFromRGB = function(r, g, b){
		var hex = [
			r.toString(16),
			g.toString(16),
			b.toString(16)
		];
		$.each(hex, function(nr, val){
			if (val.length == 1) {
				hex[nr] = '0' + val;
			}
		});
		return hex.join('').toUpperCase();
	}

	/**
	 * Function for get separated rgb colors from hexadecimal one
	 * @param  {String} rgb the rgb color value, like rgb(00, 00, 00)	
	 * @return {array}  like {r: 00, g: 00, b: 00}
	 */
	this.arrayFromRgb = function(rgb){
		rgb = rgb.replace('rgb(', '');
		rgb = rgb.replace(')', '');
		aRgb = rgb.split(',');
		return {r: aRgb[0], g: aRgb[1], b: aRgb[2]};
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
			result = uT.zeroFill(result+nbHours, 2) + ' : ';
		else 
			result = '00 : ';
		if (nbMinutes > 0)
			result = result + uT.zeroFill(nbMinutes, 2) + ' : ';
		else 
			result = result + '00 : ';
		if (nbSeconds > 0)
			result = result + uT.zeroFill(nbSeconds, 2);
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