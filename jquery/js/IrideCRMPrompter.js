function IrideCRMPrompter (container, options) {
	loadStyle('style')
	loadScript('jquery-1.12.3.min', function(){
		loadScript('Connection', function(){
			loadScript('i18n', function(){
				I18Nmsg = undefined;
				settings = {
					container: undefined,
					url : undefined,
					terminalId : undefined,
					contactId : undefined,
					language : undefined,
					classificationLogics : [],
					enableAutomaticClassification : undefined,
					numberOfWord : undefined,
					automaticClassificationDelayTimeout : undefined,
					completeClassificationTimeout : undefined,
					enableCancelButton : undefined,
					acceptCallback: undefined,
					cancelCallback: undefined,
					rejectCallback: undefined,
				};
				if (container) {
					settings.container = container;
				}
				if (options.terminalId) {
					settings.terminalId = options.terminalId;
				}
				if (options.contactId) {
					settings.contactId = options.contactId;
				}
				if (options.url) {
					settings.url = options.url;
				}
				var complete = false;
				var config = undefined;
				$.getJSON( "config/options.json", function(data) {
					reloadSettings(data);
				})
			  .fail(function(e) {
			    console.error( "Error during load configuration from file: " + e.status + " " + e.statusText );
			  })
			  .always(function(){
					connection = new Connection(settings.url, settings.contactId, {
						terminalId: settings.terminalId,
						messageCallback: loadTuples,
						acceptCallback: postAccept,
						cancelCallback: postCancel,
						rejectCallback: postReject,
						startCallback: displayPrompter
					});
					startDate=(new Date()).getTime();
			  })

				postAccept = function(arg) {
					reset();
					if (settings.acceptCallback) {
						settings.acceptCallback(arg);
					}
				}
				postCancel = function(arg) {
					reset();
					if(settings.cancelCallback) {
						settings.cancelCallback(arg)
					}
				}
				postReject = function(arg) {
					reset();
					if(settings.rejectCallback) {
						settings.rejectCallback(arg);
					}
				}
				loadTuples = function (args) {
					$('#results').html('');
					if(args && args != ''){
						var msg = JSON.parse(args);
						var width = undefined;
						if(!msg[0]){
							for (var i in msg)  {
								$('<div/>')
									.addClass('iride-crm-tupla')
									.attr('id', 'tupla-' + i).appendTo('#results');
								$('<button/>')
								.addClass('iride-crm-btn iride-crm-accept')
								.attr('id','accept-' + i)
								.attr('title',	I18Nmsg['accept.title'])
								.val(i)
								.click(function() {
									acceptClassification($(this).val());
								}).appendTo('#tupla-' + i);
								width = (100 - 13 * msg[i].length)/ msg[i].length;
								for(var j in msg[i]) {
									$('<span/>')
										.addClass('iride-crm-tuple-list')
										.text(msg[i][j]).appendTo('#tupla-' + i);
									console.log(i + " - " + msg[i][j]);
								}
							}
							if (width) {
								$('button#clear').hide();
								$('button#reject').show();
								$('.iride-crm-tuple-list').css('width', width + '%');
							}
						}
					}
				}
				displayPrompter = function (message) {
					if(message){
						reloadSettings(message)
					}
					$('<div/>')
						.addClass('iride-crm-prompter-container')
						.attr('id', 'container')
						.appendTo('#'+settings.container);
				/*	HEADER */
					$('<div/>')
						.attr('id', 'header')
						.addClass('header')
						.appendTo('#container');
					$('<img/>')
						.attr('src', 'img/IrideCRM.png')
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
						.attr('rows', 5)
						.attr('placeholder', I18Nmsg['textarea.placeholder'])
						.keyup(function () {
							if (settings.enableAutomaticClassification || settings.enableAutomaticClassification == 'true') {
								automaticClassify();
							}
						})
						.focus()
						.appendTo('#content');
				/*  CLASSIFY BUTTON */
					$('<button/>')
						.addClass('iride-crm-btn iride-crm-classify iride-crm-hide-' + settings.enableAutomaticClassification)
						.attr('id', 'classify')
						.attr('title', I18Nmsg['classify.title'])
						.text(I18Nmsg['classify.btn'])
						.click(function() {
							if ($('#note').val() != '') {
								classifyNote($('#note').val());
							}
						})
						.appendTo('#content');
				/* CLEAR BUTTON */
					$('<button/>')
						.addClass('iride-crm-btn iride-crm-clear iride-crm-hide-' + (!settings.enableCancelButton))
						.attr('id', 'clear')
						.attr('title', I18Nmsg['clear.title'])
						.click(function() {
							cancelClassification();
						})
						.appendTo('#content');
				/* REJECT BUTTON */ 
					$('<button/>')
						.addClass('iride-crm-btn iride-crm-reject')
						.attr('id', 'reject')
						.css('display', 'none')
						.attr('title', I18Nmsg['reject.title'])
						.click(function() {
							rejectClassification();
						})
						.appendTo('#content');
					$('<div/>')
						.addClass('iride-crm-results')
						.attr('id', 'results')
						.appendTo('#container');
				}

				reloadSettings = function(options) {
					if (!settings.url) {
						settings.url = options.url;
					}
					if (!settings.language) {
						settings.language = options.language;
					}
					if (!settings.language) {
						settings.language = options.language;
						I18Nmsg = new I18N();
					}
					if (settings.classificationLogics.length == 0) {
						settings.classificationLogics = options.classificationLogics;
					}
					if (!settings.numberOfWord) {
						settings.numberOfWord = options.numberOfWord;
					}
					if (settings.enableAutomaticClassification == undefined) {
						settings.enableAutomaticClassification = options.enableAutomaticClassification;
					}
					if (!settings.automaticClassificationDelayTimeout) {
						settings.automaticClassificationDelayTimeout = options.automaticClassificationDelayTimeout;
					}
					if (!settings.completeClassificationTimeout) {
						settings.completeClassificationTimeout = options.completeClassificationTimeout;
					}
					if (settings.enableCancelButton == undefined) {
						settings.enableCancelButton = options.enableCancelButton;
					}
					if (!settings.acceptCallback) {
						settings.acceptCallback = options.acceptCallback;
					}
					if (!settings.cancelCallback) {
						settings.cancelCallback = options.cancelCallback;
					}
					if (!settings.rejectCallback) {
						settings.rejectCallback = options.rejectCallback;
					}

				}
				rejectClassification = function() {
					connection.rejectClassification(calculateSessioDuration());
				}

				cancelClassification = function() {
					connection.cancelClassification(calculateSessioDuration());
				}

				acceptClassification = function(tuplaId) {
					connection.acceptClassification(tuplaId, calculateSessioDuration());
				}

				classifyNote = function(note) {
					connection.classifyNote(note);
				}

				automaticClassify = function() {
					if($('#note').val().length > 0){
						$('button#clear').hide();
						if(!($('#note').val().split(" ").length < settings.numberOfWord)) {
							if (settings.automaticClassificationDelayTimeout && settings.automaticClassificationDelayTimeout > 0) {
								setTimeout(classifyNote($('#note').val()), settings.automaticClassificationDelayTimeout);
							} else {
								classifyNote($('#note').val());
							}
						}
					} else {
						reset();
					}
				}

				calculateSessioDuration = function(){
					var now = (new Date()).getTime();
					var sessionDuration = Math.round((now - startDate)/1000);
					return sessionDuration;
				}
				reset = function() {
					$('#note').val('');
					$('#results').html('');
					$('button#clear').show();
					$('button#reject').hide();
				}
			})
		})
	});
}

function loadStyle(cssName) {
	var cssId = 'iride-css';  // you could encode the css path itself to generate id..
	if (!document.getElementById(cssId))
	{
	    var head  = document.getElementsByTagName('head')[0];
	    var link  = document.createElement('link');
	    link.id   = cssId;
	    link.rel  = 'stylesheet';
	    link.type = 'text/css';
	    link.href = 'css/'+ cssName +'.css';
	    link.media = 'all';
	    head.appendChild(link);
	}
}
function loadScript(jsName, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
            if (callback) 
            	callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            if (callback) 
            	callback();
        };
    }

    script.src = 'js/' + jsName + '.js';
    document.getElementsByTagName("head")[0].appendChild(script);
}