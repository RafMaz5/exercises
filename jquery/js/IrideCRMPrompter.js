connection=undefined;
startDate=undefined;

$(function() {
	connection = new Connection('Pippo', {terminalId: 'fuffa', messageCallback: loadTuples});
	startDate=(new Date()).getTime();
	displayPrompter();
});
function displayPrompter() {
	$('<div/>')
		.addClass('prompter-container')
		.attr('id', 'container')
		.appendTo('body');
	$('<div/>')
		.attr('id', 'header')
		.addClass('header')
		.appendTo('#container');
	$('<img/>')
		.attr('src', 'img/CRM.png')
		.attr('height', '50px')
		.appendTo('#header');
	$('<div/>')
		.addClass('content')
		.attr('id', 'content')
		.appendTo('#container');
	$('<textarea/>')
		.attr('id', 'note')
		.attr('placeholder', 'Scrivi la nota operatore')
		.focus()
		.appendTo('#content');
	$('<button/>')
		.addClass('btn classify')
		.attr('id', 'classify')
		.attr('title', 'Classifica')
		.text('Classifica')
		.click(function() {
			if ($('#note').val() != '') {
				classifyNote($('#note').val());
			}
		})
		.appendTo('#content');
	$('<button/>')
		.addClass('btn clear')
		.attr('id', 'clear')
		.attr('title', 'Annulla')
		.val('Annulla')
		.click(function() {
			$('#note').val('');
			$('#results').html('');
		})
		.appendTo('#content');
	$('<button/>')
		.addClass('btn reject')
		.attr('id', 'reject')
		.attr('title', 'Rifiuta')
		.val('Rifiuta')
		.click(function() {
			alert($('#note').val());
		})
		.appendTo('#content');
	$('<div/>')
		.addClass('results')
		.attr('id', 'results')
		.appendTo('#container');
}
function classifyNote(note) {
	var now = (new Date()).getTime();
	var sessionDuration = Math.round((now - this.startDate)/1000);
	connection.classifyNote(note, sessionDuration);
}

function loadTuples(args) {
	if(args && args != ''){
		var msg = JSON.parse(args);
		if(!msg[0]){
			for (var i in msg)  {
				$('<div/>')
					.addClass('tupla')
					.attr('id', 'tupla-' + i).appendTo('#results');
				$('<button/>')
				.addClass('btn accept')
				.attr('id','accept-' + i)
				.val(i)
				.click(function() {
					alert($(this).val());
				}).appendTo('#tupla-' + i);
				for(var j in msg[i]) {
					$('<span/>')
						.addClass('tuple-list')
						.text(msg[i][j]).appendTo('#tupla-' + i);
					console.log(i + " - " + msg[i][j]);
				}
			}
		}
	}
}
/*
	  <div class="results">
	  	<div class="tupla">
		  	<button class="btn btn-accept" >Ok</button>
		  	<span id="tuple-pippo-1" class="tuple-list" >Info</span>
		  	<span id="tuple-pippo-2" class="tuple-list">Contatto</span>
		  	<span id="tuple-pippo-3" class="tuple-list">Credito</span>
	  	</div>
	  	<div class="tupla">
		  	<button class="btn btn-accept" >Ok</button>
		  	<span id="tuple-pluto-1" class="tuple-list" >Info</span>
		  	<span id="tuple-pluto-2" class="tuple-list">Contatto</span>
		  	<span id="tuple-pluto-3" class="tuple-list">Credito</span>
	  	</div>
	  </div>
	</div>
*/