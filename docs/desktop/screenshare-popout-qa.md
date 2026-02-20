# Screenshare Popout Manual QA Checklist

## Web Runtime

- [ ] Pop out one remote screenshare and confirm the tile switches to an "Opened in a pop-out window" placeholder.
- [ ] Pop out multiple screenshares and confirm each opens in its own window.
- [ ] Close a popout manually and confirm the in-channel tile resumes inline playback.
- [ ] Stop a screenshare at the source and confirm its popout closes automatically.
- [ ] Confirm only popout audio plays while a stream is popped out (no duplicated inline audio).
- [ ] Change popout volume/mute and confirm the same stream volume persists in-channel after returning.

## Desktop Runtime (Electron)

- [ ] Confirm popout windows open inside the app for screenshare streams.
- [ ] Confirm external http/https links still open in the system browser.
- [ ] Leave voice channel or switch channels while popouts are open and confirm windows close cleanly.
