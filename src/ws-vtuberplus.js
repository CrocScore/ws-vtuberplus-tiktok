const WebSocket = require("ws");
const { WebcastPushConnection } = require("tiktok-live-connector");

// Username of someone who is currently live (change this to your username)
let tiktokUsername = "crocscorelive";

// create a new wrapper object and pass the username
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

// Create a connection to your WebSocket server
let ws = new WebSocket("ws://127.0.0.1:4430/vtplus");

ws.on("open", function open() {
  console.log("Connected to WebSocket server");
});

ws.on("message", function incoming(data) {
  console.log(data);
});

// Timer related variables and functions for Follows
var followTimerId = null;
var followTimeLeft = 0;

function addFollowTime() {
  followTimeLeft += 5;
  if (followTimerId === null) {
    let message = `VTP_HeadPat:50`;
    ws.send(message);
    startFollowTimer();
  }
}

function startFollowTimer() {
  if (followTimerId !== null) {
    clearTimeout(followTimerId);
  }
  followTimerId = setTimeout(function tick() {
    if (followTimeLeft > 0) {
      followTimeLeft -= 1;
      console.log("Follow Time left: " + followTimeLeft + " seconds");
      followTimerId = setTimeout(tick, 1000);
    } else {
      clearTimeout(followTimerId);
      followTimerId = null;
      let message = `VTP_HeadPat:50`;
      ws.send(message);
    }
  }, 1000);
}

// Timer related variables and functions for Shares
var shareTimerId = null;
var shareTimeLeft = 0;

function addShareTime() {
  shareTimeLeft += 5;
  if (shareTimerId === null) {
    let message = `VTP_FX:Rainbow`;
    ws.send(message);
    startShareTimer();
  }
}

function startShareTimer() {
  if (shareTimerId !== null) {
    clearTimeout(shareTimerId);
  }
  shareTimerId = setTimeout(function tick() {
    if (shareTimeLeft > 0) {
      shareTimeLeft -= 1;
      console.log("Share Time left: " + shareTimeLeft + " seconds");
      shareTimerId = setTimeout(tick, 1000);
    } else {
      clearTimeout(shareTimerId);
      shareTimerId = null;
      let message = `VTP_FX:Rainbow`;
      ws.send(message);
    }
  }, 1000);
}

// Connect to the chat (await can be used as well)
tiktokLiveConnection
  .connect()
  .then((state) => {
    console.info(`Connected to roomId ${state.roomId}`);
  })
  .catch((err) => {
    console.error("Failed to connect", err);
  });

// Find out when a user likes, and the total likes
tiktokLiveConnection.on("like", (data) => {
  console.log(
    `${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`
  );
  // TODO: send the data to the WebSocket server
  let Count = data.likeCount;
  let ItemIndex = 1; // default value based on your example
  let CustomItemIndex = -1; // default value
  let Damage = 0; // default value

  let message = `VTP_Throw:${Count}:${ItemIndex}:${CustomItemIndex}:${Damage}`;

  ws.send(message);
});

// Find out when a user follows
tiktokLiveConnection.on("follow", (data) => {
  console.log(data.uniqueId, "followed!");
  addFollowTime();
});

// Find out when a user shares
tiktokLiveConnection.on("share", (data) => {
  console.log(data.uniqueId, "shared the stream!");
  addShareTime();
});

tiktokLiveConnection.on("websocketConnected", (websocketClient) => {
  // console.log("Websocket:", websocketClient.connection);
});

// Listen for when stream ends
tiktokLiveConnection.on("streamEnd", (actionId) => {
  if (actionId === 3) {
    console.log("Stream ended by user");
  }
  if (actionId === 4) {
    console.log("Stream ended by platform moderator (ban)");
  }
});
