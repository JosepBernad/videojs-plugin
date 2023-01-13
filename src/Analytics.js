class Analytics {

  constructor() {
    this.sessionEvents = [];

    this.numPlays = 0;
    this.numPauses = 0;
    this.currentTimePlaying = 0;
    this.currentTimePaused = 0;
    this.totalTimePlaying = 0;
    this.totalTimePaused = 0;

    this.setupTimer();
  }

  newSessionEvent(sessionEvent) {
    this.sessionEvents.push(sessionEvent);

    switch (sessionEvent.eventId) {
      case PlayerEventsIds.onFirstPlay:
      case PlayerEventsIds.onPlay:
        ++this.numPlays;
        break;
      case PlayerEventsIds.onPause:
        ++this.numPauses;
        break;
    }

    this.updateAnalyticsUi();
  }

  setupTimer() {
    setInterval(function() {
      if (this.numPlays > this.numPauses) {
        ++this.totalTimePlaying;
        document.querySelector("#time-playing-placeholder").innerHTML = this.formatTime(this.totalTimePlaying);
      } else if (this.numPlays !== 0) {
        ++this.totalTimePaused;
        document.querySelector("#time-paused-placeholder").innerHTML = this.formatTime(this.totalTimePaused);
      }

    }.bind(this), 1000);
  }

  updateAnalyticsUi() {
    document.querySelector("#n-plays-placeholder").innerHTML = this.numPlays;
    document.querySelector("#n-pauses-placeholder").innerHTML = this.numPauses;
  }

  formatTime(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = Math.floor(time % 60);

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

  static showAnalyticsUi() {
    document.querySelector('#events-section-placeholder').classList.add("hidden");
    document.querySelector('#analytics-section-placeholder').classList.remove("hidden");

    document.querySelector('#nav-events').classList.add("bg-gray-600");
    document.querySelector('#nav-events').classList.remove("bg-gray-400/70");
    document.querySelector('#nav-analytics').classList.add("bg-gray-400/70");
    document.querySelector('#nav-analytics').classList.remove("bg-gray-600");
  }
}
