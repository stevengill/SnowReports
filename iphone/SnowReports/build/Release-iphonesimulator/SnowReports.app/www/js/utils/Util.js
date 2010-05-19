var Util = 
{
	createProxy:function(url, onSuccess, onError)
	{
		var req = new XMLHttpRequest();
		
		//POST was getting 404 here for WOEIDRequest.
		req.open('GET', url, true);
		req.onreadystatechange = function () 
		{
			if (req.readyState != 4) return;

			if (req.status != 200 && req.status != 304) 
			{		
				if (!onError)
				{
					
				}
				else 
				{
					onError(this);
				}
				
				return;
			}
			else if (req.status == 200)
			{
				onSuccess(req);	
			}
		}
		return req;
	},
	
	removeXMLPrefix:function(xmlString, prefix)
	{
		xmlString = xmlString.replace(prefix, '');
		var parser = new DOMParser();
		return parser.parseFromString(xmlString,"text/xml");
	},
	
	createJSONArrayFromRSS:function(xml)
	{
		var items = xml.getElementsByTagName('item');
		var item, json, j, description;
		var id = 0;
		var open_status = document.createElement("open_status");
		var resort_id = document.createElement("resort_id");
		var base_depth = document.createElement("base_depth");
		var snowfall_48hr = document.createElement("snowfall_48hr");
		var surface_condition = document.createElement("surface_condition");
		var base_depth_metric = document.createElement("base_depth_metric");
		var pubDate = document.createElement("pubDate");
		var ar = [];
		var myArray = {};
					
		for (var i = 0; i < items.length; i++)
		{
			item = items[i];
			json = {};
			item.appendChild(open_status);
			item.appendChild(resort_id);
			item.appendChild(base_depth);
			item.appendChild(snowfall_48hr);
			item.appendChild(surface_condition);
			item.appendChild(base_depth_metric);
			description = item.getElementsByTagName("description")[0].childNodes[0].nodeValue;
			myArray = eval("("+description+")");
			//This code is to change Whistler and Mt.Washington's units to inchs by default.
			if((item.getElementsByTagName("title")[0].childNodes[0].nodeValue=="Whistler / Blackcomb") || (item.getElementsByTagName("title")[0].childNodes[0].nodeValue=="Mt. Washington"))
			{
				myArray.Depth = myArray.Depth * 0.393700787;
				myArray.Last24hrs = myArray.Last24hrs * 0.393700787;
			}

			open_status.innerText=myArray.Status;
			if(open_status.innerText=='N/A'){
				open_status.innerText = 'Unknown';
			}
			resort_id.innerText=id;
			base_depth.innerText=Math.round(myArray.Depth);
			snowfall_48hr.innerText=Math.round(myArray.Last24hrs);
			surface_condition.innerText=myArray.Condition;
			base_depth_metric.innerText="in";
			
			for (j = 0; j < (Const.RSS_NAMES.length-1); j++)
			{
				json[Const.RSS_RENAMES[j]] = item.getElementsByTagName(Const.RSS_NAMES[j])[0].childNodes[0].nodeValue;
			}
			
			//this code is due to the rss feeds of these mountains not having a pubDate field.
			if((item.getElementsByTagName("title")[0].childNodes[0].nodeValue=="Vail") ||
				(item.getElementsByTagName("title")[0].childNodes[0].nodeValue=="Beaver Creek") ||
				(item.getElementsByTagName("title")[0].childNodes[0].nodeValue=="Breckenridge") ||
				(item.getElementsByTagName("title")[0].childNodes[0].nodeValue=="Keystone") ||
				(item.getElementsByTagName("title")[0].childNodes[0].nodeValue=="Heavenly"))
			{
				item.appendChild(pubDate);
				pubDate.innerText=xml.getElementsByTagName("pubDate")[0].childNodes[0].nodeValue;
				json[Const.RSS_RENAMES[7]] = item.getElementsByTagName('pubdate')[0].childNodes[0].nodeValue;
			}else
			{
				json[Const.RSS_RENAMES[7]] = item.getElementsByTagName(Const.RSS_NAMES[7])[0].childNodes[0].nodeValue;		
			}
			
			ar.push(json);
			id = id + 1;
		}
		return ar;
	},
	
	convertDescToNames:function(xml)
	{
		var items = xml.getElementsByTagName('item');
		var item, json, j;	
		for (var i = 0; i < items.length; i++)
		{
			item = items[i];
			j = ""+item +"";
			alert(j);}
	},
	
	createJSONFromYGEO:function(xml)
	{
		var items = xml.getElementsByTagName('item');
		var item, json, j;
		
		if (xml.getElementsByTagName('condition').length < 1) return null;
		
		//item = items[0];
		json = {};
		json.temperature = xml.getElementsByTagName('condition')[0].getAttributeNode('temp').nodeValue || 'NA';
		json.condition = xml.getElementsByTagName('condition')[0].getAttributeNode('text').nodeValue || 'NA';
		json.code = parseInt(xml.getElementsByTagName('condition')[0].getAttributeNode('code').nodeValue) || 0;
		json.humidity = xml.getElementsByTagName('atmosphere')[0].getAttributeNode('humidity').nodeValue || 'NA';
		json.visibility = xml.getElementsByTagName('atmosphere')[0].getAttributeNode('visibility').nodeValue || 'NA';
		json.pressure = xml.getElementsByTagName('atmosphere')[0].getAttributeNode('pressure').nodeValue || 'NA';
		json.speed = xml.getElementsByTagName('wind')[0].getAttributeNode('speed').nodeValue || 'NA';
		json.chill = xml.getElementsByTagName('wind')[0].getAttributeNode('chill').nodeValue || 'NA';
		json.direction = xml.getElementsByTagName('wind')[0].getAttributeNode('direction').nodeValue || 'NA';
		json.updated = xml.getElementsByTagName('pubDate')[0].childNodes[0].nodeValue || 'NA';
		//for (j = 0; j < Const.YGEO_NAMES.length; j++)
		//{
		//json[Const.YGEO_RENAMES[j]] = item.getElementsByTagName(Const.YGEO_NAMES[j])[0].childNodes[0].nodeValue;
		//}
	
		return json;
	},
	
	urlEncode:function(str) {
		return escape(str).replace(/\+/g,'%2B').replace(/%20/g, '+').replace(/\*/g, '%2A').replace(/\//g, '%2F').replace(/@/g, '%40');
	}
	
	
	
}

if (typeof $ == 'undefined') {
	$ = function(el) {
		if (typeof el == 'string')
			return document.getElementById(el);
		else
			return el;
	}
}