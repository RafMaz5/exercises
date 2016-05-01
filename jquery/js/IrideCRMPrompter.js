connection=undefined;
startDate=undefined;
settings = {};
$(function() {
	var url = 'ws://127.0.0.1:8080/webapplication-api-crm/prompterWebSocketServer/';
	connection = new Connection(url, 'Pippo', {
		terminalId: 'fuffa', 
		messageCallback: loadTuples,
		acceptCallback: postAccept,
		cancelCallback: postCancel,
		rejectCallback: postReject,
		startCallback: displayPrompter
	});
	startDate=(new Date()).getTime();
});
function displayPrompter(message) {
	if (message) {
		settings = message;
	}
	$('<div/>')
		.addClass('prompter-container')
		.attr('id', 'container')
		.appendTo('body');
/*	HEADER */
	$('<div/>')
		.attr('id', 'header')
		.addClass('header')
		.appendTo('#container');
	$('<img/>')
		.attr('src', 'img/CRM.png')
		.attr('height', '50px')
		.appendTo('#header');
/*  CONTENT */
	$('<div/>')
		.addClass('content')
		.attr('id', 'content')
		.appendTo('#container');
/* TEXTAREA */
	$('<textarea/>')
		.attr('id', 'note')
		.attr('placeholder', 'Scrivi la nota operatore')
		.keyup(function () {
			if (settings.enableAutomaticClassification || settings.enableAutomaticClassification == 'true') {
				automaticClassify();
			}
		})
		.focus()
		.appendTo('#content');
/*  CLASSIFY BUTTON */
	$('<button/>')
		.addClass('btn classify hide-' + settings.enableAutomaticClassification)
		.attr('id', 'classify')
		.attr('title', 'Classifica')
		.text('Classifica')
		.click(function() {
			if ($('#note').val() != '') {
				classifyNote($('#note').val());
			}
		})
		.appendTo('#content');
/* CLEAR BUTTON */
	$('<button/>')
		.addClass('btn clear')
		.attr('id', 'clear')
		.attr('title', 'Annulla')
		.val('Annulla')
		.click(function() {
			cancelClassification();
		})
		.appendTo('#content');
/* REJECT BUTTON */ 
	$('<button/>')
		.addClass('btn reject')
		.attr('id', 'reject')
		.attr('title', 'Rifiuta')
		.val('Rifiuta')
		.click(function() {
			rejectClassification();
		})
		.appendTo('#content');
	$('<div/>')
		.addClass('results')
		.attr('id', 'results')
		.appendTo('#container');
}

function loadTuples(args) {
	$('#results').html('');
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
					acceptClassification($(this).val());
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

function rejectClassification() {
	connection.rejectClassification(calculateSessioDuration());
}

function cancelClassification() {
	connection.cancelClassification(calculateSessioDuration());
}

function acceptClassification(tuplaId) {
	connection.acceptClassification(tuplaId, calculateSessioDuration());
}

function classifyNote(note) {
	connection.classifyNote(note);
}

function automaticClassify() {
	if($('#note').val().split(" ").length > settings.numberOfWord) {
		if (settings.automaticClassificationDelayTimeout && settings.automaticClassificationDelayTimeout > 0) {
			setTimeout(classifyNote($('#note').val()), settings.automaticClassificationDelayTimeout);
		} else {
			classifyNote($('#note').val());
		}
	}
}

function calculateSessioDuration(){
	var now = (new Date()).getTime();
	var sessionDuration = Math.round((now - this.startDate)/1000);
	return sessionDuration;
}

function reset() {
	$('#note').val('');
	$('#results').html('');
}


function postAccept() {
	reset();
}
function postCancel() {
	reset();
}
function postReject() {
	reset();
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