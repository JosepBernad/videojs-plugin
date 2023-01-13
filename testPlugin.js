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
    this.ui = new NpawPluginUi();

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

    this.ui.newSessionEvent(sessionEvent);
    console.log('Session data sent');
  }
}

class SessionEvent {
  constructor(contentPosition, eventId) {
    this.position = contentPosition;
    this.eventId = eventId;
    this.timestamp = Date.now();
  }
}

class NpawPluginUi {

  constructor() {
    this.sessionEvents = [];
  }

  newSessionEvent(sessionEvent) {
    this.sessionEvents.push(sessionEvent);

    this.updateEventUi(sessionEvent);
  }

  updateEventUi(sessionEvent) {
    let eventColor = this.getEventColor(sessionEvent.eventId);
    let eventText = PlayerEventsUi[sessionEvent.eventId];
    let eventDate = this.getEventDate(sessionEvent.timestamp);
    let eventPosition = this.getEventPosition(sessionEvent.position);

    // Current state
    let playerState = '<div class="px-5 py-4 ' + eventColor + ' rounded-lg">' +
      '                  <span class="font-light text-xs">State</span> <br/>' +
      '                  <h1 class="font-extrabold text-3xl ">' + eventText + '</h1>' +
      '                </div>'
    document.querySelector('#state-placeholder').innerHTML = playerState;

    // Event list
    let eventItem = '<li class="mt-2 px-5 py-3 ' + eventColor + '/50 rounded flex flex-row place-content-between">\n' +
      '              <div>\n' +
      '                <div class="font-bold text-xl">' + eventText + '</div>' +
      '                <div class="text-white/40">' + eventDate + '</div>' +
      '              </div>' +
      '              <div class="my-auto bg-white/30 py-1 px-2 rounded">' +
                       eventPosition +
      '              </div>' +
      '            </li>';
    document.querySelector('#events-list-placeholder').innerHTML += eventItem;
  }

  getEventColor(eventId) {
    switch (eventId) {
      case PlayerEventsIds.onReady:
        return 'bg-purple-700';
      case PlayerEventsIds.onFirstPlay:
        return 'bg-blue-700';
      case PlayerEventsIds.onPlay:
        return 'bg-green-700';
      case PlayerEventsIds.onPause:
        return 'bg-yellow-700';
      case PlayerEventsIds.onEnded:
        return 'bg-red-700';
      default:
        return 'bg-gray-700';
    }
  }

  getEventDate(timestamp) {
    let timestampDate = new Date(timestamp);
    let dateValues = [
      timestampDate.getHours(),
      timestampDate.getMinutes(),
      timestampDate.getSeconds()
    ]

    let dateValuesFormatted = dateValues.map(value => {
      return (value < 10) ? '0' + value.toString() : value.toString();
    })

    return dateValuesFormatted.join(':');
  }

  getEventPosition(position) {
    let hours = Math.floor(position / 3600);
    let minutes = Math.floor((position % 3600) / 60);
    let seconds = Math.floor(position % 60);

    let positionValues = [
      hours,
      minutes,
      seconds
    ]

    if (hours === 0) {
      positionValues.shift();
    }

    let positionValuesFormatted = positionValues.map(value => {
      return (value < 10) ? '0' + value.toString() : value.toString();
    })

    return positionValuesFormatted.join(':');// + ':' + minutes + ':' + seconds + ':' + milliseconds;
  }

}
