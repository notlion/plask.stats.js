Stats.js for Plask!
===================

Only FPS mode works for now..

### Usage ###

```javascript
var plask = require('plask');
var stats = require('./stats');

plask.simpleWindow({
    init: function(){
        this.framerate(60);
        this.stats = new stats.Stats(100, 60).open();
    },
    draw: function(){
        this.stats.update();
    }
});
```
