function ResortRSSProxy() 
{
	this.result = null;
}

ResortRSSProxy.prototype.search = function(url) 
{		
	var req = Util.createProxy(url, this.onSuccess );
	req.send();
}

ResortRSSProxy.prototype.onSuccess = function(e) 
{
	this.result = e;	
	var app = App.getInstance();
	app.onRSSReturn(this.result);
	//app.dispatchEvent(Ev.RSS_RETURN, this.result);
}