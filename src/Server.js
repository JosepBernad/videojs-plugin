class Server {

  sendInitialData(initialData) {
    console.log('Initial data sent');
    if (1 === 0) {
      // TODO: Handle authorization
      fetch('https://api.example.com/view-session', {
        method: 'POST',
        body: JSON.parse(JSON.stringify(initialData)),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {

        } else {
          // TODO: Handle error
        }
      });
    }
  }

  sendSessionEvent(sessionId, sessionEvent) {
    console.log('Session event sent');
    if (1 === 0) {
      // TODO: Handle authorization
      fetch('https://api.example.com/view-session/' + sessionId + '/events', {
        method: 'POST',
        body: JSON.parse(JSON.stringify(sessionEvent)),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {

        } else {
          // TODO: Handle error
        }
      });
    }
  }
}
