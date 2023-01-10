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

class NpawPlugin {
  get timestamp() {
    return this._timestamp;
  }

  set timestamp(value) {
    this._timestamp = value;
  }

  constructor(userId, contentId) {
    this.id = crypto.randomUUID();
    this.timestamp = Date.now();
    this.userId = userId;
    this.contentId = contentId;
    this.sessionEvents = [];

    this.uploadInitialData();

    setInterval(this.uploadSessionData, 5000);
  }

  newViewingSessionEvent(contentPosition, eventId) {
    this.sessionEvents.push(new SessionEvent(contentPosition, eventId));
  }

  uploadInitialData() {
    console.log('send initial data');
    let data = [
      this.id,
      this.timestamp,
      this.userId,
      this.contentId,
    ];

    if (1 === 0) {
      fetch('https://api.example.com/view-session', {
        method: 'POST',
        body: JSON.parse(JSON.stringify(data)),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(response => {
        if (!response.ok) {
          // TODO: Handle error
        }
      });
    }
  }

  uploadSessionData() {
    console.log('send data');

    if (1 === 0 && this.sessionEvents !== []) {
      fetch('https://api.example.com/view-session/' + this.id, {
        method: 'POST',
        body: JSON.parse(JSON.stringify(this.sessionEvents)),
        headers: {
          'Content-type': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          this.sessionEvents = [];
        }
      });
    }
  }
}

class SessionEvent {
  constructor(contentPosition, eventId) {
    this.contentPosition = contentPosition;
    this.eventId = eventId;
    this.timestamp = Date.now();
  }
}
