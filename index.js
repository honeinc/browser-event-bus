'use strict';

var EventEmitter = require( 'eventemitter2' ).EventEmitter2;
var extend = require( 'extend' );

module.exports = BrowserEventBus;

function BrowserEventBus( options ) {
    var self = this;
    
    self._options = extend( {
        namespace: '',
        domain: '*'
    }, options );
    
    window.addEventListener( 'message', self._onMessage.bind( self ), false );
}

BrowserEventBus.supported = ( 'postMessage' in window ) && ( 'bind' in function(){} ) && ( 'JSON' in window );

BrowserEventBus.prototype = Object.create( EventEmitter.prototype, {} );

BrowserEventBus.prototype._emit = BrowserEventBus.prototype.emit;

BrowserEventBus.prototype.emit = function() {
    var self = this;
    
    var args = Array.prototype.slice.call( arguments, 0 );
    var event = ( self._options.namespace ? self._options.namespace + ':' : '' ) + JSON.stringify( args );

    // walk up any iframe tree
    var win = ( window === window.parent ) ? null : window.parent;
    while( win ) {
        win.postMessage( event, self._options.domain );
        win = ( win === win.parent ) ? null : win.parent;
    }

    // post to all frames we contain
    for ( var index = 0; index < window.frames.length; ++index ) {
        win = window.frames[ index ];
        if ( win !== window ) {
            win.postMessage( event, self._options.domain );
        }
    }
};

BrowserEventBus.prototype._onMessage = function( event ) {
    var self = this;
    
    if ( self._options.namespace && event.data.indexOf( self._options.namespace ) !== 0 ) {
        return;
    }

    var json = event.data.slice( self._options.namespace ? self._options.namespace.length + 1 : 0 );
    var msg = null;
    
    try {
        msg = JSON.parse( json );
    }
    catch( ex ) {
        msg = null;
        self._emit( 'error', 'browser-event-bus: ' + ex );
        return;
    }
    
    if ( !Array.isArray( msg ) ) {
        self._emit( 'error', new Error( 'browser-event-bus: Did not get an array from event: ' + event.data ) );
        return;
    }

    self._emit.apply( self, msg );
};