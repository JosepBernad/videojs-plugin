// TODO: Improve player responsiveness.

const TEST_USER_ID = 1234;
const TEST_CONTENT_ID = 5678;

videojs.plugin('plugin', plugin);

let player = videojs('player');

player.plugin({
  userId: TEST_USER_ID,
  contentId: TEST_CONTENT_ID
});

