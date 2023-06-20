# ws-vtuberplus-tiktok
How to use:

You will need to install node.js in order to use this. Once node.js is installed, use terminal commands and type
```
npm i tiktok-live-connector
```
and
```
npm install ws
```

Code to modify:

change
```js
// Username of someone who is currently live (change this to your username)
let tiktokUsername = "crocscorelive";
```
to your username.

Tiktok live connector keeps track of how many likes a user gives. I like to throw x number of items (x being the amount of likes the user gives) at the user.

Using the https://vtuberplus.com/#websockets documentation with VTuber plus, you need 4 different arguments.
```js
  let Count = data.likeCount;
  let ItemIndex = 1;
  let CustomItemIndex = -1;
  let Damage = 0;
```

You can change ItemIndex to the item you wish to throw at your avatar, '1' is an beach ball. Change ItemIndex to '7' for a random item to be thrown at you.

Another thing I made in this is a countdown timer for both the "follow" and the "share" 
options. For every follow, a headpat will appear on your head with a speed of 50 (you can change to what ever speed you want) and for ever follow after that, 5 seconds gets added to the timer. When the timer is up, the Headpat disappears from your head.
```js
// Timer related variables and functions for Follows
var followTimerId = null;
var followTimeLeft = 0;

function addFollowTime() {
  followTimeLeft += 5;
  if (followTimerId === null) {
    let message = `VTP_HeadPat:50`; // change this message to what you the websocket command you want!
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
      let message = `VTP_HeadPat:50`; // have this be the same as the first message :)
      ws.send(message);
    }
  }, 1000);
}
```

After you have all that done, go to the correct file directory and run
```
node ws-vtuberplus.js
```

and hopefully it all works out for you :)

That is the tutorial of the thing I made in like 3 hours. If you have any issues/ pull request go ahead and open them.
