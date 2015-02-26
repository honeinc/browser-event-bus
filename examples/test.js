'use strict';

var EventBus = require( '..' );
var eventBus = new EventBus( {
    namespace: 'browser-event-bus-test'
} );

var inIframe = window != window.top;

eventBus.on( 'ping', function( msg ) {
    var p = document.createElement( 'p' );
    p.textContent = JSON.stringify( msg ); 
    document.body.appendChild( p );
} );

setTimeout( function ping() {
    eventBus.emit( 'ping', {
        from: inIframe ? 'iframe' : 'parent'
    } );

    setTimeout( ping, 1000 );
}, 1000 );
