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
    npawPlugin.newViewingSessionEvent(this.currentTime(), PlayerEventsIds.onFirstPlay);
  });

  this.on(PlayerEvents.onPlay, function() {
    npawPlugin.newViewingSessionEvent(this.currentTime(), PlayerEventsIds.onPlay);
  });

  this.on(PlayerEvents.onPause, function() {
    npawPlugin.newViewingSessionEvent(this.currentTime(), PlayerEventsIds.onPause);
  });

  this.on(PlayerEvents.onEnded, function() {
    npawPlugin.newViewingSessionEvent(this.currentTime(), PlayerEventsIds.onEnded);
  });
}

class NpawPlugin {

  constructor(userId, contentId) {
    this.server = new Server();
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

    this.server.sendInitialData(initialData);
  }

  newViewingSessionEvent(contentPosition, eventId) {
    if (eventId === PlayerEventsIds.onPlay && this.sessionEvents.length === 2) {
      // Avoid the redundant play event after the firstPlay
      return;
    }

    let sessionEvent = new SessionEvent(contentPosition, eventId);

    this.sessionEvents.push(sessionEvent);

    this.server.sendSessionEvent(this.id, sessionEvent);
    this.analytics.newSessionEvent(sessionEvent);
    this.events.newSessionEvent(sessionEvent);
  }
}

