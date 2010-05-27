function WeatherProxy() 
{
	this.result = null;
}

WeatherProxy.prototype.search = function(url) 
{		
	var req = Util.createProxy(url, this.onSuccess);
	req.send();
}

WeatherProxy.prototype.onSuccess = function(e) 
{
	this.result = e;	
	var app = App.getInstance();
	app.onWeatherReturn(this.result);
	//app.dispatchEvent(Ev.WEATHER_RETURN, this.result);
}