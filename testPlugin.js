const PlayerEvents = {
  onEnded: 'ended',
  onPlay: 'play',
  onFirstPlay: 'firstplay',
  onPause: 'pause'
}

const PlayerEventsIds = {
  onEnded: 4,
  onPlay: 5,
  onFirstPlay: 6,
  onPause: 7
}

const PlayerEventsUi = {
  4: 'Ended',
  5: 'Playing',
  6: 'Initial Play',
  7: 'Paused',
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
    if (eventId === PlayerEventsIds.onPlay && this.sessionEvents.length === 1) {
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
    let eventState = '<div class="mt-2 p-5 ' + eventColor + ' font-extrabold text-2xl rounded">' + eventText + '</div>'
    document.querySelector('#state-placeholder').innerHTML = eventState;

    // Event list
    let eventItem = '<li class="mt-2 px-5 py-2 ' + eventColor + '/50 rounded flex flex-row place-content-between">\n' +
      '              <div>\n' +
      '                <div class="font-bold text-xl">' + eventText + '</div>\n' +
      '                <div class="text-white/50">' + eventDate + '</div>\n' +
      '              </div>\n' +
      '              <div class="my-auto bg-white/30 py-1 px-2 rounded">\n' +
                       eventPosition +
      '              </div>\n' +
      '            </li>';
    document.querySelector('#events-list-placeholder').innerHTML += eventItem;
  }

  getEventColor(eventId) {
    let bgColor = 'bg-blue-500';

    switch (eventId) {
      case PlayerEventsIds.onFirstPlay:
        bgColor = 'bg-blue-700';
        break;
      case PlayerEventsIds.onPlay:
        bgColor = 'bg-green-700';
        break;
      case PlayerEventsIds.onPause:
        bgColor = 'bg-yellow-700';
        break;
      case PlayerEventsIds.onEnded:
        bgColor = 'bg-red-700';
        break;
    }

    return bgColor;
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
