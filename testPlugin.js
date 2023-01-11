const PlayerEvents = {
  onLoadStart: 'loadstart',
  onWaiting: 'waiting',
  onSeeking: 'seeking',
  onSeeked: 'seeked',
  onEnded: 'ended',
  onPlay: 'play',
  onFirstPlay: 'firstplay',
  onPause: 'pause',
  onDurationChange: 'durationchange',
  onFullscreenChange: 'fullscreenchange'
}

const PlayerEventsIds = {
  onLoadStart: 0,
  onWaiting: 1,
  onSeeking: 2,
  onSeeked: 3,
  onEnded: 4,
  onPlay: 5,
  onFirstPlay: 6,
  onPause: 7,
  onDurationChange: 8,
  onFullscreenChange: 9
}

function testPlugin(options) {

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
    this.id = crypto.randomUUID();
    this.timestamp = Date.now();
    this.userId = userId;
    this.contentId = contentId;
    this.sessionEvents = [];

    this.uploadInitialData();
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
    this.sessionEvents.push(new SessionEvent(contentPosition, eventId));

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
        } else {
          // TODO: Handle error
        }
      });
    }

    console.log('Session data sent');
    console.log(this.sessionEvents);
  }
}

class SessionEvent {
  constructor(contentPosition, eventId) {
    this.contentPosition = contentPosition;
    this.eventId = eventId;
    this.timestamp = Date.now();
  }
}
