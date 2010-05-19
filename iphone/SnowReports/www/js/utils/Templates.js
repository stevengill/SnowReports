Templates = {
	listDivider: function(title) {
		return "<div class='divider black reg'>" + title + "</div>";
	},
	
	listItem: function(item, index) {
		return '<div id="resort-' + index + '" onclick="App.getInstance().handleListTap(' + index + ');" class="palm-row list-item no-separator"><div class="palm-row-wrapper row-wrapper"><div class="open-status ' + 
				item.status + '"><div class="large p28"><b>' + item.title + '</b></div><div class="reg p28"><b>Status:</b> ' + 
				item.status + '</div></div></div></div>';
				
	},
	
	snowReportView: function (item) {
		var html = 
		'<div class="palm-row first large no-separator">' +
		'<div class="row-wrapper">' +
		'	<div class="left b">Status</div>' +
		'	<div class="right">' + item.status + '</div>' +
		'</div>' +
		'</div>' +

		'<div class="palm-row large no-separator">' +
		'<div class="row-wrapper">' +
		'	<div class="left b">Condition</div>' +
		'	<div class="right">' + item.condition + '</div>' +
		'</div>' +
		'</div>' +

		'<div class="palm-row large no-separator">' +
		'<div class="row-wrapper">' +
		'	<div class="left b">Base Depth</div>' +
		'	<div class="right">' + item.con.depth + ' ' + item.unit.height + '</div>' +
		'</div>' +
		'</div>' +

		'<div class="palm-row large no-separator">' +
		'<div class="row-wrapper">' +
		'	<div class="left b">New Snow</div>' +
		'	<div class="right">' + item.con.snowfall + ' ' + item.unit.height + '</div>' +
		'</div>' +
		'</div>';
		return html;
	},
	
	weatherView: function (item) {
		var html = 
		'<div class="palm-row large first no-separator">' +
			'<div class="palm-row-wrapper row-wrapper">' +
				'<div class="left b">Condition</div>' +
				'<div class="right">' + item.condition + '</div>' +
			'</div>' +
		'</div>' +

		'<div class="palm-row large no-separator">' +
		'<div class="row-wrapper">' +
			'<div class="left b">Temperature</div>' +
			'<div class="right">' + item.con.temp + ' ' + item.unit.temp + '</div>' +
		'</div>' +
		'</div>' +

		'<div class="palm-row large no-separator">' +
		'<div class="row-wrapper">' +
			'<div class="left b">Wind</div>' +
			'<div class="right">' + item.con.direction + ' ' + item.con.speed + ' ' + item.unit.speed + '</div>' +
		'</div>' +
		'</div>' +

		'<div class="palm-row large no-separator">' +
		'<div class="row-wrapper">' +
			'<div class="left b">Wind Chill</div>' +
			'<div class="right">' + item.con.chill + ' ' + item.unit.temp + '</div>' +
		'</div>' +
		'</div>' +

		'<div class="palm-row large no-separator">' +
		'<div class="row-wrapper">' +
			'<div class="left b">Humidity</div>' +
			'<div class="right">' + item.humidity + ' ' + item.unit.humidity + '</div>' +
		'</div>' +
		'</div>' +

		'<div class="palm-row large no-separator">' +
		'<div class="row-wrapper">' +
			'<div class="left b">Visibility</div>' +
			'<div class="right">' + item.con.visibility + ' ' + item.unit.distance + '</div>' +
		'</div>';
		return html;
	}
}

Effects = {
	snow: function(data) {
		var html = 
		'<div class="snow type' + data.type + '"' +
			'style="left:' + data.left + 'px;top:' + data.top + 'px;opacity:' + data.alpha + ';">' + 
		'</div>';
		return html;
	}
}