/**
 * The Database object
 * TODO A database namespace, for better query construct 
 * @param {String} dbFile The name of the database file (founded at application root)
 * @param {bool} debug  true for debug database actions
 */
function Database(dbFile, debug){

	// The connected database
	this.db;
	// The database file name
	this.dbFile = dbFile+'.db';
	// Name of the database
	this.dbName = dbFile;
	// Array filled with schema of the database, like an MySQL decribe
	this.schema = {};
	// Boolean for display debug
	this.debug = debug;

	/**
	 * Prepare and send a select query
	 * TODO Verifications on types with schema
	 * @param  {String} table   The table name
	 * @param  {Array} aFields The fields to select, like [field1, field2]
	 * @param  {Array} aWhere  All the conditions, like {field=value}
	 * @param  {String} other   The rest of the query
	 * @return {Array} All rows found with the request, String "empty" infact
	 */
	this.select = function(table, aFields, aWhere, other){
		aResults = {};
		where = '';
		if(aWhere && Object.keys(aWhere).length > 0){
			where = ' WHERE ';
			i = 1;
			for(field in aWhere){
				where += field+'='+aWhere[field]+(i == Object.keys(aWhere).length ? '' : ' AND ');
				i ++;
			}
		}
		fields = '';
		i = 1;
		for(f in aFields){
			fields += aFields[f]+(i == aFields.length ? '' : ', ');
			i ++;
		}
		query = 'SELECT '+fields+' FROM '+table+where+(other ? other : '')+';';
		oD.open();
		rows = oD.exec(query);
		i = 0;
		while(rows.isValidRow()){
			aResults[i] = {};
			for(f in aFields){
				aResults[i][aFields[f]] = rows.fieldByName(aFields[f]);
			}
			i ++;
			rows.next();
		}
		rows.close();
		oD.close();
		return Object.keys(aResults).length == 0 ? 'empty' : aResults;
	}

	/**
	 * Prepare and send an insert query
	 * TODO Better verifications on types with schema
	 * @param  {String} table  The table to insert datas
	 * @param  {Array} aDatas all datas  to insert, like [idValue, nameValue]
	 * @return {Boolean} or Array of errors if occured
	 */
	this.insert = function(table, aDatas){
		aErrors = [];
		values = '';
		i = 1;
		for(d in aDatas){
			testType = oD.isSameType(aDatas[d], oD.schema[table][d]);
			if(testType == 'ok'){
				values += (typeof(aDatas[d]) == 'string' && aDatas[d] != 'NULL' ? '"' : '')+aDatas[d]+(typeof(aDatas[d]) == 'string' && aDatas[d] != 'NULL' ? '"' : '')+(i == aDatas.length ? '' : ',');
			}
			else {
				aErrors.push(testType);
			}
			i ++;
		}
		schemaSize = Object.keys(oD.schema[table]).length;
		if(aDatas.length < schemaSize){
			values += ', ';
			for(i = (schemaSize - aDatas.length) + 1; i <= schemaSize; i ++){
				values += oD.schema[table][i - 1].dflt_value+(i == schemaSize ? '' : ', ');
			}
		}
		if(aErrors.length != 0){
			console.log(aErrors);
			return aErrors;
		}
		else {
			oD.open();
			insert = oD.exec('INSERT INTO '+table+' VALUES('+values+');');
			insert.close();
			oD.close();
			return insert;
		}
	}

	/**
	 * Prepare and send a delete query
	 * TODO Investigate on a return value
	 * @param  {String} table  The table to delete row
	 * @param  {Array} aDatas All the where conditions, like {field1:value1}
	 * @return {void} SQLite won't return any value on a delete :/
	 */
	this.deleteRow = function(table, aDatas){
		query = 'DELETE FROM '+table+' WHERE ';
		i = 1;
		for(field in aDatas){
			query += field+'='+aDatas[field]+(i == Object.keys(aDatas).length ? '' : ' AND ');
			i ++;
		}
		oD.open()
		oD.exec(query);
		oD.close();
	}

	/**
	 * Prepare and send an update query
	 * TODO Investigate on a return value
	 * @param  {String} table  The table to update
	 * @param  {Array} aSet   All the fields to set values, like {field1: value1}
	 * @param  {Array} aWhere All the where conditions, like {field1: value1}
	 * @return {void} SQLite won't return any value on an update :/
	 */
	this.update = function(table, aSet, aWhere){
		set = '';
		i = 1;
		for(field in aSet){
			set += field + '=' + aSet[field] + (i == Object.keys(aSet).length ? '' : ', ');
			i ++;
		}
		where = '';
		i = 1;
		for(field in aWhere){
			where += field + '=' + aWhere[field] + (i == Object.keys(aWhere).length ? '' : ' AND ');
			i ++;
		}
		query = 'UPDATE '+table+' SET '+set+' WHERE '+where;
		oD.open();
		oD.exec(query);
		oD.close();
	}

	/**
	 * Function for simulate a describe method
	 * TideSDK API don't have a database method for this
	 * Fill an array with all tables, each one filled with fields informations
	 * @return {Array} The entire database schema
	 */
	this.describe = function(){
		aTables = oD.exec('SELECT * FROM sqlite_master WHERE type="table"');
		for(t = 0; t < aTables.rowCount(); t ++){
			tableName = aTables.fieldByName('tbl_name');
			if(tableName != 'sqlite_sequence'){
				oD.schema[tableName] = {};
				aFields = oD.exec('PRAGMA TABLE_INFO('+tableName+')');
				for(r = 0; r < aFields.rowCount(); r ++){
					oD.schema[tableName][r] = {};
					for(f = 0; f < aFields.fieldCount(); f ++){
						oD.schema[tableName][r][aFields.fieldName(f)] = aFields.fieldByName(aFields.fieldName(f));
					}
					aFields.next();
				}
			}				
			aTables.next();
		}
		aTables.close();
		aFields.close();
	}

	/**
	 * Open the SQlite database file, using the TideSDK API 
	 * @return {void} 
	 */
	this.open = function(){
		oD.db = Ti.Database.openFile(appDir+'/'+oD.dbFile);
	}

	/**
	 * Close the opened database
	 * @return {void} 
	 */
	this.close = function(){
		oD.db.close();
	}

	/**
	 * Execute a given query
	 * @param  {String} query 
	 * @return {array}	the resulted DB object
	 */
	this.exec = function(query){
		return oD.db.execute(query);
	}

	/**
	 * Initialize the Database object
	 * Create all the tables if they don't exists
	 * @param  {Array} aQueries All the table to create, with all fields
	 * @return {void} The function show the results in messages container, if debug = true
	 */
	this.init = function(aQueries){
		if(Object.keys(aQueries).length > 0){
			oFile = Ti.Filesystem.getFile(appDir+'/'+oD.dbFile);
			if(!oFile.exists()){
				oD.open();
				for(t in aQueries){
					query = 'CREATE TABLE IF NOT EXISTS '+t+' ('+aQueries[t].join(',')+');';
					if(oD.exec(query) && oD.debug){
						oM.add('Table '+t+' created.');
					}
					else if(oD.debug){
						oM.add('Can\'t create table '+t);
					}
				}
				if(oD.debug){
					oM.add('Database '+oD.dbName+' created.');
				}
				oD.describe(oD.dbName);
				oD.close();
			}
			else {
				oD.open();
				oD.describe(oD.dbName);
				oD.close();
			}
		}
	}

	/**
	 * Test if the given field value is same type of the database field
	 * @param  {ALL}  a The given value to test
	 * @param  {Object}  b The database field object
	 * @return {String}   Ok on success, error message instead
	 */
	this.isSameType = function(a, b){
		sReturn = 'error';
		if(typeof(a) == 'string'){
			if(b.type == 'TEXT' || b.type == 'VARCHAR' || b.pk == 1 || b.notnull == 0){
				sReturn = 'ok';
			}
			else {
				sReturn = b.name+' is not '+b.type;
			}
		}
		else if(typeof(a) == 'number'){
			if(b.type == 'INTEGER' || b.type == 'FLOAT'){
				sReturn = 'ok';
			}
			else {
				sReturn = b.name+' is not '+b.type;
			}
		}
		else if(typeof(a) == 'null' || typeof(a) == 'object'){
			if(b.notnull == 0 || b.pk == 1){
				sReturn = 'ok';
			}
			else {
				sReturn = b.name+' can\'t be NULL';
			}
		}
		else {
			sReturn = 'Unauthorized type for '+a;
		}
		return sReturn;
	}
}