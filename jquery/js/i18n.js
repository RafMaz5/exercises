function I18N (lang) {
	var language = undefined;
	if (!lang) {
		language = navigator.language || navigator.userLanguage;
	} else {
		language = lang;
	}
	var msg = {
		en:{
			'accept.title':'Accept classification',
			'reject.title':'Reject classification',
			'clear.title':'Cancel',
			'classify.title':'Classify the note',
			'classify.btn':'Classify',
			'textarea.placeholder':'Write the operator notes'
		},
		it:{
			'accept.title':'Accetta la classificazione',
			'reject.title':'Rifiuta la classificazione',
			'clear.title':'Annulla',
			'classify.title':'Classifica la nota',
			'classify.btn':'Classifica',
			'textarea.placeholder':'Scrivi la nota operatore'
		},
		es:{
			'accept.title':'Accept classification',
			'reject.title':'Reject classification',
			'clear.title':'Cancel',
			'classify.title':'Classify the note',
			'classify.btn':'Classify',
			'textarea.placeholder':'Write the operator notes'
		},
		pt:{
			'accept.title':'Accetta la classificazione',
			'reject.title':'Rifiuta la classificazione',
			'clear.title':'Annulla',
			'classify.title':'Classifica la nota',
			'classify.btn':'Classifica',
			'textarea.placeholder':'Scrivi la nota operatore'
		},
		de:{
			'accept.title':'Accept classification',
			'reject.title':'Reject classification',
			'clear.title':'Cancel',
			'classify.title':'Classify the note',
			'classify.btn':'Classify',
			'textarea.placeholder':'Write the operator notes'
		},
		fr:{
			'accept.title':'Accetta la classificazione',
			'reject.title':'Rifiuta la classificazione',
			'clear.title':'Annulla',
			'classify.title':'Classifica la nota',
			'classify.btn':'Classifica',
			'textarea.placeholder':'Scrivi la nota operatore'
		}
	}
	if (!msg[language]) {
		language = navigator.language || navigator.userLanguage;
	}
	return msg[language];
}