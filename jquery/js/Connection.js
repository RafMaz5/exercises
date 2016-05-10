  function Connection(u, cId, opts) {
    var contactId = cId;
    var config = {};
    var url = u;
    if(opts){
      config = opts;
    }
    this.classifyNote = function (note, sessionDuration) {
      var startClassificationInVO = new StartClassificationInVO(contactId, note, sessionDuration);
      var msg = new Message("classify", startClassificationInVO);
      socket.send(JSON.stringify(msg));
    }

    this.rejectClassification = function (sessionDuration) {
      var msg = new Message("REJECT");
      msg.setSessionDuration(sessionDuration);
      socket.send(JSON.stringify(msg));
    }

    this.cancelClassification = function (sessionDuration) {
      var msg = new Message("CANCEL");
      msg.setSessionDuration(sessionDuration);
      socket.send(JSON.stringify(msg));
    }

    this.acceptClassification = function(idTupla, sessionDuration) {
      var msg = new Message("ACCEPT");
      msg.setTupleId(idTupla);
      msg.setSessionDuration(sessionDuration);
      socket.send(JSON.stringify(msg));
    }

    constructWSUrl = function() {
      var wsUrl = url + contactId;
      if (config && config.terminalId) {
        wsUrl = wsUrl+'?terminalId=' + config.terminalId;
        if (config.isMaster != undefined) {
          wsUrl = wsUrl+'&isMaster=' + config.isMaster;
        }
      } else if (config && config.isMaster != undefined) {
        wsUrl = wsUrl+'?isMaster=' + config.isMaster;
      }
      return wsUrl;
    }

    reconnect = function () {
      socket = new WebSocket(constructWSUrl());
      socket.onopen = function (e) {};
      socket.onerror = function (error) {
        console.log('WebSocket Error ' + error + "\nfor connection: " + + error.currentTarget.url);
        if(config.errorCallback) {
          config.errorCallback(error);
        }
      };
      socket.onclose = function () {
        console.log('WebSocket connection closed.');
        reconnect();
        if(config.closeCallback) {
          config.closeCallback();
        }
      };
      // Log messages from the server
      socket.onmessage = function (e) {
        var message = JSON.parse(e.data);
        console.log('Server responds with: ' + e.data);
        if (message.type == 'CONFIG'){
          config.terminalId = message.terminalId;
          if(config.startCallback) {
            config.startCallback(message);
          }
        } else if (message.type == 'classify') {
          if(config.messageCallback) {
            config.messageCallback(JSON.stringify(message));
          }
        } else if (message.type == 'ACCEPT') {
          if(config.acceptCallback) {
            config.acceptCallback(JSON.stringify(message.status));
          }
        } else if (message.type == 'REJECT') {
          if(config.rejectCallback) {
            config.rejectCallback(JSON.stringify(message.status));
          }
        } else if (message.type == 'CANCEL') {
          if(config.cancelCallback) {
            config.cancelCallback(JSON.stringify(message.status));
          }
        }
      };
    };
    reconnect();
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
