
# browser-event-bus

A simple wrapper around the postMessage API to simplify event handling.

## Usage

```javascript

// top level document

var EventBus = require( 'browser-event-bus' );

// listen for all events in the 'foo' namespace
var eventBus = new EventBus( {
    namespace: 'foo', // default: ''
    target: '//foo.com', // default: '*',
    origin: '//foo.com', // default: '*'
} );

eventBus.on( 'pong', function( msg ) {
    console.log( msg );
} );

eventBust.emit( 'ping' );

```

```javascript

// in iframe or other tab

var EventBus = require( 'browser-event-bus' );

var eventBus = new EventBus( {
    namespace: 'foo'
} );

eventBus.on( 'ping', function( msg ) {
    eventBus.emit( 'pong', 'hi!' );
} );


```