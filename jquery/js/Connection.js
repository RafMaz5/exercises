  function Connection(url, contactId, settings) {
    this.contactId = contactId;
    this.settings = {};
    if(settings){
      this.settings = settings;
    }
    this.classifyNote = function (note, sessionDuration) {
      var startClassificationInVO = new StartClassificationInVO(contactId, note, sessionDuration);
      var msg = new Message("classify", startClassificationInVO);
      this.connection.send(JSON.stringify(msg));
    }

    this.rejectClassification = function (sessionDuration) {
      var msg = new Message("REJECT");
      msg.setSessionDuration(sessionDuration);
      this.connection.send(JSON.stringify(msg));
    }

    this.cancelClassification = function (sessionDuration) {
      var msg = new Message("CANCEL");
      msg.setSessionDuration(sessionDuration);
      this.connection.send(JSON.stringify(msg));
    }

    this.acceptClassification = function(idTupla, sessionDuration) {
      var msg = new Message("ACCEPT");
      msg.setTupleId(idTupla);
      msg.setSessionDuration(sessionDuration);
      this.connection.send(JSON.stringify(msg));
    }

    this.wsUrl = url + this.contactId;
    if (this.settings && this.settings.terminalId) {
      this.wsUrl = this.wsUrl+'?terminalId=' + this.settings.terminalId;
    }
    this.connection = new WebSocket(this.wsUrl);
    this.connection.onopen = function (e) {};
    this.connection.onerror = function (error) {
      console.log('WebSocket Error ' + error + "\nfor connection: " + + error.currentTarget.url);
      if(settings.errorCallback) {
        settings.errorCallback(error);
      }
    };
    this.connection.onclose = function () {
      console.log('WebSocket connection closed.');
      if(settings.closeCallback) {
        settings.closeCallback();
      }
    };
    // Log messages from the server
    this.connection.onmessage = function (e) {
      var message = JSON.parse(e.data);
      console.log('Server responds with: ' + e.data);
      if (message.type == 'CONFIG'){
        settings.terminalId = message.terminalId;
        if(settings.startCallback) {
          settings.startCallback(message);
        }
      } else if (message.type == 'classify') {
        if(settings.messageCallback) {
          settings.messageCallback(JSON.stringify(message.idTupleToLevel));
        }
      } else if (message.type == 'ACCEPT') {
        if(settings.acceptCallback) {
          settings.acceptCallback(JSON.stringify(message.status));
        }
      } else if (message.type == 'REJECT') {
        if(settings.rejectCallback) {
          settings.rejectCallback(JSON.stringify(message.status));
        }
      } else if (message.type == 'CANCEL') {
        if(settings.cancelCallback) {
          settings.cancelCallback(JSON.stringify(message.status));
        }
      }
    };
  }

  function StartClassificationInVO (contactId, textMessage,sessionDuration, language, classificationLogics, notShowExtractedConcepts, notShowNeRecognized) {
    this.contactId = contactId;
    this.textMessage = textMessage;
    this.sessionDuration = sessionDuration;
    this.language = language;
    this.classificationLogics = classificationLogics;
    this.notShowExtractedConcepts = notShowExtractedConcepts;
    this.notShowNeRecognized = notShowNeRecognized;

    this.addClassificationLogic = function (classificationLogic) {
      if(!(this.classificationLogics)) {
        this.classificationLogics = [];
      }
      this.classificationLogics.push(classificationLogic)
    }
  }

  function Message (type, startClassificationInVO, idTupleToLevel) {
    this.type = type;
    this.startClassificationInVO = startClassificationInVO;
    this.idTupleToLevel = idTupleToLevel;
    this.tupleId = undefined;
    this.sessionDuration = undefined;
    this.setTupleId = function(tupleId) {
      this.tupleId = tupleId;
    }
    this.setSessionDuration = function(sessionDuration) {
      this.sessionDuration = sessionDuration;
    }
  }
