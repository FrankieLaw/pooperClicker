class DOM { 
    constructor( ) { }
}

DOM.prototype.id = function( _id ) {
    return document.getElementById( _id );
}

DOM.prototype.clone = function( _id, deep = true ) {
    return document.getElementById( _id ).cloneNode( deep );
}