// Instanciate the Statistics object
var oSt = typeof(oSt) == 'undefined' ? new Statistics() : oSt;
oSt.init();

/**
 * The Statistics object
 */
function Statistics(){

	// Object filled with all projects and theirs datas
	this.aProjects = {};

	// Array of french days names
	this.aDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
	// Array of french months names
	this.aMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Déçembre'];
	// Objects filled with all statistics definitions
	this.actions = {'addProject': 'Ajout du projet', 'reset': 'Remise à zéro du compteur', 'start': 'Démarrage du compteur', 'stop': 'Arrêt du compteur'};

	/**
	 * Initialize the Statistics object
	 * Display the statistics
	 * @return {void} 
	 */
	this.init = function(){
		oSt.getAllAsArray();
		if(oSt.aProjects != 'empty'){
			$('#content').html(oSt.getHtml());
		}
		else {
			$('#content').html('<p>No projects found, please add one with tab "Projects".</p>');
		}
	}

	/**
	 * Construct the html
	 * @return {String} The rendered html
	 */
	this.getHtml = function(){
		sHtml = '<ul>';
		for(id in oSt.aProjects){
			pDate = new Date(oSt.aProjects[id].oP.timestamp * 1000);
			sHtml += '<li>' + oSt.aProjects[id].oP.name + ' créé le ' + oSt.getDateString(pDate, true)  + '<ul>';
			for(a in oSt.aProjects[id]){
				if(a != 'nbrActions' && a != 'oP'){
					aDate = new Date(oSt.aProjects[id][a]['timestamp'] * 1000);
					sHtml += '<li>' + oSt.actions[oSt.aProjects[id][a]['action']] + ' le ' + oSt.getDateString(aDate, true) + '</li>';
				}
			}
			sHtml += '</ul></li>';
		}
		sHtml += '</ul>';
		return sHtml;
	}

	/**
	 * Format a timestamp in a french string
	 * @param  {Object} oDate The Js Date object
	 * @param  {bool} full  If true, return the hours + minutes + seconds
	 * @return {String}       The formated date
	 */
	this.getDateString = function(oDate, full){
		seconds = oDate.getSeconds();
		minutes = oDate.getMinutes();
		hours = oDate.getHours();
		day = oSt.aDays[oDate.getDay()];
		dayOfMonth = oDate.getDate();
		month = oSt.aMonths[oDate.getMonth()];
		year = oDate.getFullYear();
		return day+' '+dayOfMonth+' '+month+' '+year+(full ? ' à '+hours+':'+minutes+':'+seconds : '');
	}

	/**
	 * Construct the aProjets object with all projects  datas
	 * @return {void} 
	 */
	this.getAllAsArray = function(){
		aStats = oD.select('Statistics', ['id_project', 'timestamp', 'action', 'time']);
		if(aStats != 'empty'){
			for(s = 0; s < Object.keys(aStats).length; s ++){
				id_project = aStats[s]['id_project'];
				aProject = (jQuery.isPlainObject(oSt.aProjects[id_project]) ? oSt.aProjects[id_project].oP : oD.select('projects', ['name', 'time', 'total_time', 'timestamp'], {'id': id_project}, ' ORDER BY name ASC'));
				oSt.aProjects[id_project] = (jQuery.isPlainObject(oSt.aProjects[id_project]) ? oSt.aProjects[id_project] : {'nbrActions': 0, 'oP': aProject[0]});
				oSt.aProjects[id_project][oSt.aProjects[id_project].nbrActions] = {
					'action': aStats[s]['action'],
					'timestamp': aStats[s]['timestamp'],
					'time': aStats[s]['time']
				};
				oSt.aProjects[id_project].nbrActions ++;
			}
		}
		else {
			oSt.aProjects = 'empty';
		}
	}
}