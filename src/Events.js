class Events {

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
    let playerState = '' +
      '<div class="px-5 py-4 ' + eventColor + ' rounded-lg">' +
      '  <span class="font-light text-xs">State</span> <br/>' +
      '  <h1 class="font-extrabold text-3xl ">' + eventText + '</h1>' +
      '</div>'
    document.querySelector('#state-placeholder').innerHTML = playerState;

    // Event list
    let eventItem = '' +
      '<li class="mt-2 px-5 pys-3 ' + eventColor + '/50 rounded flex flex-row place-content-between">\n' +
      '  <div>\n' +
      '    <div class="font-bold text-xl">' + eventText + '</div>' +
      '    <div class="text-white/40">' + eventDate + '</div>' +
      '  </div>' +
      '  <div class="my-auto bg-white/30 py-1 px-2 rounded">' +
           eventPosition +
      '  </div>' +
      '</li>';
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

    return positionValuesFormatted.join(':');
  }

}
