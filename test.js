// set up test for server
var events = [
        'starting app initiation',
        'main view rendered',
        'connection established',
        'initial data fetched',
        'page specific data fetched',
        'fully rendered'
    ],
    eventsClone = events.slice(0);

// fake the "window" global since we're on the server
global.window = {
    times: {
        start: Date.now()
    }
};

var assert = require('assert'),
    loadStats = require('./loading-stats');


function maybeDone() {
    loadStats.recordEvent(eventsClone.shift());
    if (!eventsClone.length) {
        var results = loadStats.getSummary(),
            previous = 0;

        // make sure results has the same number of keys
        // as the original
        assert.equal(Object.keys(results).length, events.length);
        for (var item in results) {
            assert.ok(previous < results[item]);
            previous = results[item];
        }
        console.log(results);
        process.exit();
    } else {
        setTimeout(maybeDone, Math.random() * 500);
    }
}

setTimeout(maybeDone, 400);
