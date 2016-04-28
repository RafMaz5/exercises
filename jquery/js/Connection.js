  function Connection(contactId, settings) {
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


    this.wsUrl = 'ws://127.0.0.1:8080/webapplication-api-crm/prompterWebSocketServer/' + this.contactId;
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
      if (message.terminalId){
        settings.terminalId = message.terminalId;
        if(settings.messageCallback) {
          settings.messageCallback(JSON.stringify(message.terminalId));
        }
      } else {
        if(settings.messageCallback) {
          settings.messageCallback(JSON.stringify(message.idTupleToLevel));
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
  }
