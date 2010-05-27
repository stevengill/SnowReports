var WeatherUtil = 
{	
	fToC:function(F) {
		return (F-32)*(5/9);
	},
	
	getConvertedSnowData:function(data, unit)
	{
		var converted = {};

		if (unit == Const.UNIT_INCH)
		{
			converted.snowfall = data.snowfall;
			converted.depth = data.depth;
		}
		else
		{
			converted.snowfall = Math.round(data.snowfall * Const.IN_TO_CM);
			converted.depth = Math.round(data.depth * Const.IN_TO_CM);
		}

		return converted;
	},
	
	getConvertedWeatherData:function(data, unit)
	{
		var con = {};
		var dirs = 		[0, 	45, 	90, 	135, 	180, 	225, 	270, 	315, 	360];
		var symbols = 	['N',	'NE', 	'E', 	'SE', 	'S', 	'SW', 	'W', 	'NW', 	'N'];
		
		for (var i = 0; i < dirs.length; i++)
		{
			var dir = dirs[i];
			if (data.direction < dir+22.5 && data.direction >= dir-22.5)
			{
				con.direction = symbols[i];
				break;
			}
		}
		
		if (unit == Const.UNIT_INCH)
		{
			con.temp = data.temperature;
			con.chill = data.chill;
			con.visibility = data.visibility;
			con.speed = data.speed;
		}
		else
		{
			con.temp = Math.round(WeatherUtil.fToC(data.temperature));
			con.chill = Math.round(WeatherUtil.fToC(data.chill));
			con.visibility = Math.round((data.visibility * Const.MI_TO_KM)*10)/10;
			con.speed = Math.round((data.speed * Const.MI_TO_KM)*10)/10;
		}

		return con;
	},
	
	getWeatherCode:function(code)
	{
		switch (code)
		{
			// wind
			case 0:
			case 1:
			case 2:
			case 24:
				return Const.WINDY;
			
			//thunderstorms
			case 3:
			case 4:
			case 37:
			case 38:
			case 39:
			case 47:
				return Const.WINDY;
			
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 11:
			case 12:
			case 35:
			case 40:
			case 45:
			case 46:
				return Const.RAIN;
			
			// light snow
			case 14:
				return Const.SNOW;
				
			// snow
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
			case 18:
			case 41:
			case 42:
			case 43:
				return Const.HEAVY_SNOW;
			
			// fog
			case 19:
			case 20:
			case 21:
			case 23:
				return Const.FOG;
			
			case 26:
			case 22:
			case 27:
			case 28:
			case 29:
			case 30:
			case 30:
			case 44:
				return Const.CLOUDY;
			
			// clear
			case 31:
			case 32:
			case 33:
			case 34:
			case 36:
				return Const.SNOW;
			
		  	default:
		    	return Const.UNKNOWN;
		}
		
	}
	
	
}