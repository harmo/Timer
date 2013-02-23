// Instanciate the Statistics object
var oSt = typeof(oSt) == 'undefined' ? new Statistics() : oSt;
oSt.init();

function Statistics(){

	this.aProjects = {};

	this.aDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

	this.aMonths = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Déçembre'];

	this.actions = {'addProject': 'Ajout du projet', 'deleteProject': 'Suppression du projet', 'reset': 'Remise à zéro du compteur', 'start': 'Démarrage du compteur', 'stop': 'Arrêt du compteur'};

	this.init = function(){
		oSt.getAllAsArray();
		$('#content').html(oSt.getHtml());
	}

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

	this.getAllAsArray = function(){
		aStats = oD.select('Statistics', ['id_project', 'timestamp', 'action', 'time']);
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
}