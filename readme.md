# NPAW Video.js plugin

This is my resolution of the NPAW's challenge to create a plugin to get the playback data while streaming video content.

> ### Table of contents
> 1. [Requirements and restrictions](#requirements)
> 2. [Philosophy and architecture](#philosophy)
> 3. [Improvements and known issues](#improvements)

## 1. Requirements and restrictions <div id='requirements'/>

### 1.1. Software requirements
- Cunt how many times the video is paused during playback.
- Cunt how many times the video is resumed during playback.
- Count the time elapsed between the pause and resume event.
- Show all the values gathered.
- Make a fake HTTP request to the random address and with the parameters
  that you consider when:
  - Video starts.
  - Video is resumed.
  - Video is finished.

### 1.2. Technical requirements and restrictions
- Use Video.js v4.12 **([v4.12.15](https://github.com/videojs/video.js/releases/tag/v4.12.15))**
- *NOT* use javascript frameworks
- Use of css frameworks **([Tailwind.css](https://tailwindcss.com))**


## 2. Philosophy and architecture <div id='philosophy'/>
Thanks to my knowledge of another media player ([howler.js](https://howlerjs.com/)) used in previous projects I was already
familiar with the usage of the standard callbacks of a media player (`onPlay`, `onPause`, `onEnded`, etc.), so part of
the research and investigation was already done. I focused on the architecture of the solution to be as close as
possible from a real user analytics plugin. Given the strict requirement of the Video.js version, the plugin had to be
a single function (it can be a class in newer versions) that sends all the information to the main class called 
`NpawPlugin` and from there create the logic to match the requirements.

The `NpawPlugin` class retrieves, stores and sends all the initial data to create a unique viewing session:

- `id`: unique UUID for each viewing session
- `timestamp`: timestamp of the start of the viewing session
- `userId`: id of the user logged in
- `contentId`: id of the content the user is consuming 
- `sessionEvents`: Array of all the events that happened during the view session. Every event is an instance of the model `SessionEvent`.

The `SessionEvent` model stores all the information that will be useful in the future for its analysis:

- `position`: position of the playback
- `eventId`: id of the event typology
- `timestamp`: timestamp of the event

### 2.1. Events typology

To meet the requirements, I've just created 5 different events:
- `onReady`: fired when the player is ready to play the content
- `onFirstPlay`: fired when the user first plays the content
- `onPause`: fired when the user pauses the player
- `onPlay`: fired when the user resumes the player
- `onEnded`: fired when the content gets to its end

### 2.2. Events flow

All the events gathered are sent to three different actors:

- `Server` class: to send the events to the backend server.
- `Events` class: to show on the UI the current state and a list of all the event during the viewing session.
- `Analytics` class: to also show on the UI all the stats from the current viewing session.

> Note the `Server` methods have a `if (1 = 0)` statement to avoid running through it's code.

## 3. Improvements and known issues <div id='improvements'/>

### 3.1. Partial play/stop times

On the server side it would be easy to calculate the duration of each state.
It would be something like:

```js
let currentEvent = eventsList.at(-1);
let previousEvent = eventsList.at(-2);

let previousEventDuration = currentEvent.timestamp - previousEvent.timestamp;
```

In my opinion it's easier this to be handled by the server because it has all the information it needs and no clients
resources would be used.

### 3.2. Responsiveness of the website

This website has been created using a 13inch MacBook and the Ui has been optimized for rather large screens.

### 3.3. Random load errors

Once in a while, the player reports an error due to the cdn. The immediate fix is to refresh the page until it loads
properly.

### 3.4. Use of Tailwind's cdn dependency

The HTML line
```html
<script src="https://cdn.tailwindcss.com"></script>
```
is not recommended for production projects, it should be used NPM or other dependency managers.

### 3.5. Lack of unit tests

A variety test could be built to make sure that all the functionalities keeps working after further development.

### 3.6. User moving through the timeline

Every time the user changes the playback position on the timeline, the plugin gets a pause and a play.
The desired behaviour should avoid that because there's no real pause state.
