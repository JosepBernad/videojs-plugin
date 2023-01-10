const TEST_USER_ID = 1234;
const TEST_CONTENT_ID = 5678;

let npawPlugin = null;

let player = videojs('player').ready(function() {
  npawPlugin = new NpawPlugin(TEST_USER_ID, TEST_CONTENT_ID);
});

player.on(PlayerEvents.onPlay, function() {
  let currentTime = this.currentTime();
  if (npawPlugin !== null && currentTime !== 0) {
    console.log('PLAY');
    npawPlugin.newViewingSessionEvent(currentTime, PlayerEventsIds.onPlay);
  }
});

player.on(PlayerEvents.onPause, function() {
  if (npawPlugin !== null) {
    console.log('PAUSE');
    npawPlugin.newViewingSessionEvent(this.currentTime(), PlayerEventsIds.onPause);
  }
});

player.on(PlayerEvents.onEnded, function() {
  if (npawPlugin !== null) {
    console.log('ENDED');
    npawPlugin.newViewingSessionEvent(this.currentTime(), PlayerEventsIds.onEnded);
  }
});
