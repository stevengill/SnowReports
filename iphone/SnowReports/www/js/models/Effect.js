function Effect()
{
	this.effectArray = [];
	this.weather = Const.SNOW;
	this.intervalID = null
}

Effect.getInstance = function () {
	if (!Effect.instance)
	{
		Effect.instance = new Effect();
	}
	
	return Effect.instance;
}

/* -------------------------------------------------------------------------------
	Effect event
-------------------------------------------------------------------------------- */

Effect.prototype.activateEffect = function(e)
{
	this.setupWeatherEffect(e);
	if (!this.intervalID || this.intervalID == null) 
		this.intervalID = setInterval( this.run, 1000/Const.FRAME_RATE);
}

Effect.prototype.deactivateEffect = function()
{
	if (this.intervalID)
	{
		this.effectArray = [];
		clearInterval(this.intervalID);
		this.intervalID = null;
		//this.dispatchEvent(Ev.EFFECT_UPDATE, '');
		App.getInstance().onEffectUpdate("");
	}
}

/* -------------------------------------------------------------------------------
	Setup
-------------------------------------------------------------------------------- */

Effect.prototype.setupWeatherEffect = function(count) 
{	
	var data;
	var W = 300;
	var len = count ? count : 10;
	var category = Const.SNOW;
	
	var limit = 24;	
	var add = 
	{
		decay:1,
		offset:0,
		base:0,
		speed:1,
		min:0,
		phase:1,
		alpha:0
	}
	
	switch (this.weather)
	{	
		case Const.CLOUDY:
		case Const.FOG:
			limit = 10;
			len = Math.round(len/2);
			add.offset = 100;
			add.base = -250;
			category = Const.CLOUDY;
			break;
		
		case Const.WINDY:
			limit = 10;
			len = Math.round(len/2);
			add.offset = 260;
			add.base = -50;
			add.speed = 6;
			add.phase = 0.5;
			category = Const.WINDY;
			break;
			
		case Const.RAIN:
			len = len*4;
			limit = 36;
			add.speed = 4;
			add.min = 2;
			add.offset = 200;
			add.decay = 1.5;
			category = Const.RAIN;
			break;
		
		case Const.HEAVY_SNOW:
		case Const.SNOW:
			add.alpha = 0.3;
			len = Math.round(len*0.9);
			break;
			
		default:
			return;
			break;
	}	
	
	// extra
	switch (this.weather)
	{
		case Const.FOG:		
			len = Math.round(len/2);
			add.alpha = -0.3;
			add.decay = 0.9;
			break;
		case Const.HEAVY_SNOW:
			add.alpha = 0.3;
			len = Math.round(len*1.2);
			break;
			
		default:
			break;
	}
	
	for (var i = 0; i < len; i++)
	{
		if (this.effectArray.length > limit) break;
		
		data = {};
		data.set = category;
		data.base = Math.random()*W + add.base;
		data.top = -(Math.random()*(150 + add.offset) + 5 + add.offset);
		data.alpha = Math.random()*0.2 + 0.8 + add.alpha;
		data.alphaDecay = (Math.random()*0.009 + 0.009)*add.decay;
		data.type = Math.round(Math.random()*3);
		data.speed = (Math.random()*5 + 3 + add.min)*add.speed;
		data.phase = 0;
		data.amplitude = Math.random()*50 + 10;
		data.phaseSpeed = (Math.random()*5 + 2)*(Math.PI/180)*add.phase;
		
		this.effectArray.push(data);
	}
}

/* -------------------------------------------------------------------------------
	Render information
-------------------------------------------------------------------------------- */

Effect.prototype.run = function() 
{
	var effect = Effect.getInstance();
	if (effect.effectArray.length < 1 || !App.getInstance().settings.effect)
	{
		effect.deactivateEffect();
		return;
	}
		
	var htmlArray = [];
	var temp, data;
	var offset = {};
	
	for (var i = 0; i < effect.effectArray.length; i++)
	{
		data = effect.effectArray[i];
		data.top += data.speed;
		data.phase += data.phaseSpeed;
		data.alpha -= data.alphaDecay;
		data.left = data.base + Math.sin(data.phase)*data.amplitude;
		
		offset.x = (data.set == Const.CLOUDY) ? 300 : ((data.set == Const.WINDY) ? 200 : 5);
		offset.y = (data.set == Const.CLOUDY) ? 300 : ((data.set == Const.WINDY) ? 350 : 5);
		if (data.alpha < 0.05)
		{
			effect.effectArray.splice(i, 1);
			i--;
		}
		else if (data.top > -offset.y && data.left < 320 + offset.x && data.left > -offset.x)
		{
			temp = Effects.snow(data);
			htmlArray.push(temp);
		}
	}
	
	//App.getInstance().dispatchEvent(Ev.EFFECT_UPDATE, htmlArray.join(''));
	App.getInstance().onEffectUpdate(htmlArray.join(''));
}
