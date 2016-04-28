  function Connection(contactId, terminalId, messageCallback, errorCallback, closeCallback) {
    this.contactId = contactId;
    this.terminalId = terminalId;

    this.messageCallback = messageCallback;
    this.errorCallback = errorCallback;
    this.closeCallback = closeCallback;
    this.classifyNote = function (note, sessionDuration) {
      var startClassificationInVO = new StartClassificationInVO(contactId, note, sessionDuration);
      var msg = new Message("classify", startClassificationInVO);
      this.connection.send(JSON.stringify(msg));
    }


    this.wsUrl = 'ws://127.0.0.1:8080/webapplication-api-crm/prompterWebSocketServer/' + this.contactId;
    if (terminalId) {
      this.wsUrl = this.wsUrl+'?terminalId=' + terminalId;
    }
    this.connection = new WebSocket(this.wsUrl);
    this.connection.onopen = function (e) {};
    this.connection.onerror = function (error) {
      console.log('WebSocket Error ' + error + "\nfor connection: " + + error.currentTarget.url);
      if(this.errorCallback) {
        this.errorCallback(error);
      }
    };
    this.connection.onclose = function () {
      console.log('WebSocket connection closed.');
      if(this.closeCallback) {
        this.closeCallback();
      }
    };
    // Log messages from the server
    this.connection.onmessage = function (e) {
      var message = JSON.parse(e.data);
      console.log('Server responds with: ' + e.data);
      if (message.terminalId){
        this.terminalId = message.terminalId;
        if(this.messageCallback) {
          this.messageCallback(JSON.stringify(message.terminalId));
        }
      } else {
        if(this.messageCallback) {
          this.messageCallback(JSON.stringify(message.idTupleToLevel));
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
