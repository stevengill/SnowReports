function WOEIDProxy() 
{
	this.result = null;
}

WOEIDProxy.prototype.search = function(url) 
{		
	var req = Util.createProxy(url, this.onSuccess);
	req.send();
}

WOEIDProxy.prototype.onSuccess = function(e) 
{
	this.result = e;	
	var app = App.getInstance();
	var woeid = e.responseXML.getElementsByTagName('woeid')[0].childNodes[0].nodeValue;
	
	//app.dispatchEvent(Ev.WOEID_RETURN, woeid);
	app.onWOEIDReturn(woeid);
}