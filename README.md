# What is "HTML5 Srt Support"
This is a small javascript class that will help you add support for .srt tracks for your website.
The goal of this "plugin" is not to add support for tracks in general, but to add support for .srt tracks for browsers
that already text tracks in general.

This "plugin" can play well with other solutions(for example: videojs) that don't support .srt subtitles.

## Browser support?
The source code is written in ES2015(also called ES6), but was meant to be transpiled into ES5. The support list
considers the code has been transpiled to ES5.

Before proceeding to the support table please note **The code will run on the listed browsers, but if it doesn't support
text tracks it won't show them.**
That means that you might need another solution to add text track support for older browsers, but this "plugin" can
play well with other ones if you need to.

**Desktop:**
IE10+, Firefox 20+, Chrome 22+, Safari 6.1+, Opera 12.1+

**Mobile:**
IOS Safari 6.1+, Android Browser 56+, ~~Opera Mini~~, Opera Mobile 12.1+,  Blackberry Browser 10+, and all the rest...

## How to use
NOTE: Im using CommonJS modules, but if you wish to change it, it is very easy, there is only one export.

1: Get a video element
```javascript
let videoElement = document.getElementsByTagName('video')[0];
```

2: Import the module and pass it the Video Element.
```javascript
let videoElement = document.getElementsByTagName('video')[0],
    srtSupport = require('srtsupport')(videoElement);
```
***Important note:*** This is an Asynchronous process, so if you want to preform an action after its done, you can pass
a callback as the second argument, however it is optional.

3: Initialize it.
```javascript
let videoElement = document.getElementsByTagName('video')[0],
    srtSupport = require('srtsupport')(videoElement);

srtSupport.init();
```

Thats all, three lines.

### With callback
```javascript
let videoElement = document.getElementsByTagName('video')[0],
    srtSupport = require('srtsupport')(videoElement, function() {
        // Callback function
    });

srtSupport.init();
```
