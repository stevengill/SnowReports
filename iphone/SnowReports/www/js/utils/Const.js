const Const = {
	APP_NAME:'Snow Report',
	
	PIPE_RSS:'http://pipes.yahoo.com/pipes/pipe.run?_id=1bc8093b79ac0370dc04aa6969605a30&_render=rss',
	GEO_URL:'http://where.yahooapis.com/v1/places.q(CITYNAME);start=0;content=5?appid=I2NYDsnV34HGUib0m9E7t5OG00b126QhNZzIEkwBvnyFxEgvE5PbjX5a83BgIWidhiQs',
	WEATHER_URL:'http://weather.yahooapis.com/forecastrss?w=WOEID',
	
	RSS_PREFIX: /ots\:/gi,
	RSS_NAMES:[		'title', 	'open_status', 	'resort_id', 	'base_depth', 	'snowfall_48hr',	'surface_condition', 	'base_depth_metric', 	'pubDate'],
	RSS_RENAMES:[	'title', 	'status', 		'id',			'depth', 		'snowfall',			'condition', 			'unit', 				'updated'],
	
	YGEO_NAMES:[	'title', 	'description'],
	YGEO_RENAMES:[	'title', 	'description'],
	
	
	TEMP_LIST_ITEM:'common/list-item-template',
	TEMP_SPINNER:'common/spinner',
	
	UNIT_CM:'cm',
	UNIT_INCH:'inch',
	
	//RESORT_SEARCH_URL:'http://services.onthesnow.com/axis2/services/SnowReport2009/find/resorts/name/DOMAIN/TOKEN?lang=en&search=KEYWORD&get_n=10',
		
	//WHISTLER_XML: 'http://whistlerblackcombsnowreport.com/feed',
	
	IN_TO_CM:2.54,
	MI_TO_KM:1.609344,
	
	TABLENAME:'settings001',
	UNIT_KEY:'unit',
	EFFECT_KEY:'effect',
	
	SNOW:'snow',
	HEAVY_SNOW:'heavySnow',
	RAIN:'rain',
	CLOUDY:'cloudy',
	FOG:'fog',
	WINDY:'windy',
	UNKNOWN:'unkown',
	
	DEAFUT_MENU_ATT:{spacerHeight:0, menuClass:'no-fade'},
	FRAME_RATE:20,
	
	END:'end'
}