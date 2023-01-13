class SessionEvent {
  constructor(contentPosition, eventId) {
    this.position = contentPosition;
    this.eventId = eventId;
    this.timestamp = Date.now();
  }
}
