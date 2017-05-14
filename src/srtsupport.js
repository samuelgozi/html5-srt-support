// This class is instantiated each time you want to convert a video's subtitles into vtt.
class TracksConvertionTask {
    constructor(videoElement, callback) {
        this.videoElement = videoElement;

        //if tere is a callback, save it.
        if (callback) this.callback = callback;
    }

    init() { //debugger;
        let tracks = this.getTracksInfo();
        // TODO: Handle errors
        this.loadTracksContent(tracks, (err, tracksWithContent) => {
            let vttTracks = this.convertTracksToVtt(tracksWithContent);
            this.removeOldSrtElements();
            this.loadTracks(vttTracks);

            // run the callback if exists
            if (this.callback) this.callback();
        });
    }

    // Get only the necessary info of the SRT tracks.
    getTracksInfo() {
        // getElementsByTagName returns an "HTMLCollection", so we convert it to an array
        // for "cleaner" code. Still needs to be checked for performance.
        // TODO: check if there is any "faster" way of doing it.
        let allTracksElements = Array.from(this.videoElement.getElementsByTagName('track'));

        // Remove non-srt files from the array.
        let srtTracksElements = allTracksElements.filter( track => {
            return track.src.indexOf('.srt') != '-1';
        });

        // Save track elements so we can delete them later.
        this.tracksElements = srtTracksElements;

        // Return an array of objects with the necesarry info.
        return srtTracksElements.map(track => {
            return {
                src: track.src,
                kind: track.kind,
                srclang: track.srclang,
                label: track.label
            };
        });
    }

    // Request the content of the tracks via AJAX.
    // Callback will be called only if the request is succesful.
    // TODO: Better tracking, and error handeling.
    loadTracksContent(tracksInfo, callback) {
        // we need to keep track of the finished requests so we can know when to call the callback.
        let finishedCount = 0;

        tracksInfo.forEach( (track, index, array) => {
            let req = new XMLHttpRequest();

            // When ready run this.
            req.onreadystatechange = () => {
                // Check if its ready and succesful...
                if( req.readyState == 4 && req.status == 200 ) {
                    // Save it...
                    track.content = req.responseText;

                    // Update the counter to keep track.
                    finishedCount++;

                    // If this is the last one run the callback without errors, and pass the new array.
                    if (finishedCount == array.length) callback(null, array);
                }
            };

            req.open('GET', track.src, true);
            req.send();
        });
    }

    convertTracksToVtt(tracksWithContent) {
        tracksWithContent.forEach(track => {
            // Will match the timestamps of subtitles except the comas, example:
            // "00:00:00,000 --> 00:00:24,500" will match:
            // (Group 1: 00:00:00)
            // ,
            // (Group 2: 000 --> 00:00:24)
            // ,
            // (Group 3: 500)
            let regExp = /^(\d\d:\d\d:\d\d),(\d{3} --> \d\d:\d\d:\d\d),(\d{3})$/gm;

            // Append and change a few things, and update the old content.
            track.content = 'WEBVTT \r\n' + track.content.replace(regExp, '$1.$2.$3');
        });

        return tracksWithContent;
    }

    removeOldSrtElements() {
        this.tracksElements.forEach(track => {
            track.parentElement.removeChild(track);
        });
    }

    loadTracks(tracksWithVttContent) {
        console.log(tracksWithVttContent);
        tracksWithVttContent.forEach(track => {
            // Create a file to hold the new track.
            let blob = new Blob([track.content], {type: 'text/vtt'} ),
                // Create a URL for the new track file.
                blobUrl = URL.createObjectURL(blob),
                // Create the track element.
                newTrackElement = document.createElement("track");

            console.log(blobUrl);

            // Fill it with the info.
            newTrackElement.kind = track.kind;
            newTrackElement.label = track.label;
            newTrackElement.srclang = track.srclang;
            newTrackElement.src = blobUrl;

            // Append it to the video.
            this.videoElement.appendChild(newTrackElement);
        });
    }
}

module.exports = function createNewTask(videoElement) {
        return new TracksConvertionTask(videoElement);
};
