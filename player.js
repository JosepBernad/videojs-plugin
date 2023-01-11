const TEST_USER_ID = 1234;
const TEST_CONTENT_ID = 5678;

videojs.plugin('testPlugin', testPlugin);

let player = videojs('player');

player.testPlugin({
  userId: TEST_USER_ID,
  contentId: TEST_CONTENT_ID
});
