App = function () {
	this.token = 'token';
	this.domain = '';
	this.networkAvailable = true;
	this.requestCount = 0;
	this.unit = Const.UNIT_INCH;
	
	this.currentWeather = null;
	this.currentResort = null;
	this.currentListId = null;
	this.resortList = [];
	this.weather = Const.SNOW;
	this.weatherMode = false;
	
	this.effect = Effect.getInstance();
	this.settings = {};
	this.settings.effect = true;
}

App.instance = null;

App.getInstance = function() 
{
	if (!App.instance)
	{
		App.instance = new App();
		setTimeout("App.instance.start();", 10);
	}
	
	return App.instance;
}

App.prototype.start = function()
{
	$("palm-list").innerHTML = TConst.RSS_LOADING;
	this.activateEffect();
	this.resortListRequest();
}

// Mountain
App.prototype.resortListRequest = function()
{
	//$("palm-list").innerHTML = TConst.RSS_LOADING;
	
	//if (!this.getNetworkStatus()) return;
	this.requestCount = 0;
	const rssArray = [Const.PIPE_RSS];
	
	for (var i = 0; i < rssArray.length; i++)
	{
		var px = new ResortRSSProxy();
		px.search(rssArray[i], this.onRSSReturn);
		this.requestCount++;
	}
	
	//this.dispatchEvent(Ev.SHOW_SPINNER);
}

App.prototype.onRSSReturn = function(e)
{	
	//const temp = e.event_data.data;
	const temp = e;
	const xml = Util.removeXMLPrefix(temp.responseText, Const.RSS_PREFIX);
	const data = Util.createJSONArrayFromRSS(xml);
	
	if (data.length)
	{
		var item, match;
		
		for (var i = 0; i < data.length; i++)
		{
			item = data[i];
			
			match = false;
			
			for (var j = 0; j < this.resortList.length; j++)
			{
				if (this.resortList[j].id == item.id)
				{
					match = true;
					break;
				}
			}
			
			if (!match)
			{
				this.resortList.push(item);
			}
		}
	}
	
	this.requestCount--;
	
	if (this.requestCount == 0)
	{
		this.sortListData();
		//this.dispatchEvent(Ev.HIDE_SPINNER);
		//this.dispatchEvent(Ev.RESORT_LIST_UPDATE);
		this.resortListUpdate();
	}
}

App.prototype.sortListData = function()
{
	function sorter(a, b)
	{
		var nameA = a.title.toLowerCase( );
		var nameB = b.title.toLowerCase( );
		if (nameA < nameB) {return -1}
		if (nameA > nameB) {return 1}
		return 0;
	}
	this.resortList = this.resortList.sort(sorter);
}

App.prototype.resortListUpdate = function()
{
	var output = "";
	var currentGroup = null;
	for (var i=0; i< this.resortList.length; i++) {
		var item = this.resortList[i];
		var group = item.title.charAt(0);
		if (group != currentGroup) {
			currentGroup = group;
			output += Templates.listDivider(group);
		}
		output += Templates.listItem(item,i);
	}
	$("palm-list").innerHTML = output;
}

App.prototype.handleListTap = function(resortIndex) 
{
	this.currentResort = this.resortList[resortIndex];
	this.currentListId = resortIndex;
	this.updateSnowReport();
}

App.prototype.updateSnowReport = function()
{
	this.weatherMode = false;
	
	var data = this.currentResort;
	
	if (!data) return;
	
	$("header").innerHTML = data.title;
	$("header").className = 'open-status mini ' + data.status;
	
	$("time-stamp").innerHTML = data.updated;
	data.con = WeatherUtil.getConvertedSnowData(data, this.unit);
	data.unit = this.getUnits();
	
	var temp = Templates.snowReportView(data);
	$("detail-list").innerHTML = temp;
	
	this.toggleButtons();

	$("palm-list").style["display"] = "none";
	$("detail").style["display"] = "block";
	window.location = "#detail";
}

App.prototype.getUnits = function()
{
	var unit = {};
	unit.humidity = '%';
	
	if (this.unit == Const.UNIT_INCH)
	{
		unit.temp = 'F';
		unit.height = 'in';
		unit.distance = 'mi';
		unit.speed = 'mph';
	}
	else
	{
		unit.temp = 'C';
		unit.height = 'cm';
		unit.distance = 'km';
		unit.speed = 'kmh';
	}
	
	return unit;
}

App.prototype.updateWeather = function()
{
	//if (!this.weatherMode) return;
	
	this.toggleButtons();
	
	var data = this.currentWeather;
	//this.onHideSpinner();
	if (!data) 
	{
		$("detail-list").innerHTML = TConst.WEATHER_ERROR;
		return;
	}
	this.weather = WeatherUtil.getWeatherCode(data.code);
	if (!this.activated) 
	{
		//this.activateEffect();
		this.activated = true;
	}
	$("time-stamp").innerHTML = data.updated;
	data.con = WeatherUtil.getConvertedWeatherData(data, this.unit);
	data.unit = this.getUnits();

	var temp = Templates.weatherView(data);

	$("detail-list").innerHTML = temp;
}

App.prototype.onWeatherRequest = function(e)
{	
	this.showSpinner();
	this.weatherMode = true;
	//const city = e.event_data.data;
	var city = this.currentResort.title;
	//This is assigning the closest city to the following mountains due to yahoo weather not having them in their database.
	if(city=='The Canyons'){
		city = "Park City, Utah";
	}
	if(city=="Heavenly"){
		city = "Lake Tahoe";
	}
	//this.dispatchEvent(Ev.WOEID_REQUEST, city);
	this.onWOEIDRequest(city);
}

App.prototype.onWOEIDRequest = function(city)
{	
	//const city = e.event_data.data;
	const url = Const.GEO_URL.replace(/CITYNAME/, Util.urlEncode(city));
	var px = new WOEIDProxy();
	px.search(url);
}

App.prototype.onWOEIDReturn = function(woeid)
{	
	//const woeid = e.event_data.data;
	const url = Const.WEATHER_URL.replace(/WOEID/, woeid);
	
	var px = new WeatherProxy();
	px.search(url);
}

App.prototype.onWeatherReturn = function(e)
{	
	//const temp = e.event_data.data;
	//const temp = data;
	const xml = Util.removeXMLPrefix(e.responseText, /yweather(:)/gi);
	const data = Util.createJSONFromYGEO(xml);
	this.currentWeather = data;
	//this.dispatchEvent(Ev.WEATHER_UPDATE, data);
	
	this.hideSpinner();
	this.updateWeather();
}

App.prototype.onSetUnitCm = function(e)
{
	this.unit = Const.UNIT_CM;
	this.setUnit();
	this.toggleUnitButtons();
}
App.prototype.onSetUnitInch = function(e)
{
	this.unit = Const.UNIT_INCH;
	this.setUnit();
	this.toggleUnitButtons();
}

App.prototype.setUnit = function()
{
	//this.dispatchEvent(Ev.UPDATE_UNIT);
	this.onUpdateUnit();
	//this.saveUnit();
}

App.prototype.onUpdateUnit = function(event) 
{	
	if (this.weatherMode)
		this.updateWeather();
	else
		this.updateSnowReport();
}

App.prototype.activateEffect = function(e)
{
	if (!this.settings.effect) return;	
	this.effect.weather = this.weather;
	this.effect.activateEffect(e);
}

App.prototype.deactivateEffect = function()
{
	this.effect.deactivateEffect();
}

App.prototype.onEffectUpdate = function(data)
{
	$("effect").innerHTML = data;
}

App.prototype.onShowMainView = function()
{
	$("palm-list").style["display"] = "block";
	$("detail").style["display"] = "none";
	window.location = "#resort-" + this.currentListId;
}

App.prototype.showSpinner = function()
{
	$("spinner").style["display"] = "block";
}

App.prototype.hideSpinner = function()
{
	$("spinner").style["display"] = "none";
}

App.prototype.toggleButtons = function()
{
	if (this.weatherMode) {
		$("header-left-end").className = "left-end-black";
		$("header-left-mid").className = "mid-black";
		$("header-right-mid").className = "mid-blue";
		$("header-right-end").className = "right-end-blue";
	} else {
		$("header-left-end").className = "left-end-blue";
		$("header-left-mid").className = "mid-blue";
		$("header-right-mid").className = "mid-black";
		$("header-right-end").className = "right-end-black";
	}
}

App.prototype.toggleUnitButtons = function()
{
	if (this.unit == Const.UNIT_CM) {
		$("footer-left-end").className = "left-end-black";
		$("footer-left-mid").className = "mid-black";
		$("footer-right-mid").className = "mid-blue";
		$("footer-right-end").className = "right-end-blue";
	} else {
		$("footer-left-end").className = "left-end-blue";
		$("footer-left-mid").className = "mid-blue";
		$("footer-right-mid").className = "mid-black";
		$("footer-right-end").className = "right-end-black";
	}
}
