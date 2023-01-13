const PlayerEvents = {
  onReady: 'ready',
  onFirstPlay: 'firstplay',
  onPause: 'pause',
  onPlay: 'play',
  onEnded: 'ended'
}

const PlayerEventsIds = {
  onReady: 0,
  onFirstPlay: 1,
  onPause: 2,
  onPlay: 3,
  onEnded: 4
}

const PlayerEventsUi = {
  0: 'Ready',
  1: 'Initial Play',
  2: 'Paused',
  3: 'Playing',
  4: 'Ended'
}

function plugin(options) {

  let npawPlugin = new NpawPlugin(options.userId, options.contentId)

  this.on(PlayerEvents.onFirstPlay, function() {
    console.log('FIRST PLAY');
    npawPlugin.newViewingSessionEvent(this.currentTime(), PlayerEventsIds.onFirstPlay);
  });

  this.on(PlayerEvents.onPlay, function() {
    console.log('PLAY');
    npawPlugin.newViewingSessionEvent(this.currentTime(), PlayerEventsIds.onPlay);
  });

  this.on(PlayerEvents.onPause, function() {
    console.log('PAUSE');
    npawPlugin.newViewingSessionEvent(this.currentTime(), PlayerEventsIds.onPause);
  });

  this.on(PlayerEvents.onEnded, function() {
    console.log('ENDED');
    npawPlugin.newViewingSessionEvent(this.currentTime(), PlayerEventsIds.onEnded);
  });
}

class NpawPlugin {

  constructor(userId, contentId) {
    this.events = new Events();
    this.analytics = new Analytics();

    this.id = crypto.randomUUID();
    this.timestamp = Date.now();
    this.userId = userId;
    this.contentId = contentId;
    this.sessionEvents = [];

    this.uploadInitialData();
    this.newViewingSessionEvent(0, PlayerEventsIds.onReady);
  }

  uploadInitialData() {
    let initialData = [
      this.id,
      this.timestamp,
      this.userId,
      this.contentId,
    ];

    if (1 === 0) {
      // TODO: Handle authorization
      fetch('https://api.example.com/view-session', {
        method: 'POST',
        body: JSON.parse(JSON.stringify(initialData)),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(response => {
        if (!response.ok) {
          // TODO: Handle error
        }
      });
    }

    console.log('Initial data sent');
  }

  newViewingSessionEvent(contentPosition, eventId) {
    if (eventId === PlayerEventsIds.onPlay && this.sessionEvents.length === 2) {
      // Avoid the redundant play event after the firstPlay
      return;
    }

    let sessionEvent = new SessionEvent(contentPosition, eventId);

    this.sessionEvents.push(sessionEvent);

    this.analytics.newSessionEvent(sessionEvent);
    this.events.newSessionEvent(sessionEvent);

    if (1 === 0 && this.sessionEvents !== []) {
      // TODO: Handle authorization
      fetch('https://api.example.com/view-session/' + this.id + '/events', {
        method: 'POST',
        body: JSON.parse(JSON.stringify(this.sessionEvents)),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          this.sessionEvents = [];
          console.log('Session data sent');
        } else {
          // TODO: Handle error
        }
      });
    }
  }
}

