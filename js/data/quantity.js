function Quantity( ) {
    const quantity    = ["1x", "10x", "100x"];
	Object.freeze( quantity );

    function getQuantity( ) { return quantity; }
    
    return {
        getQuantity
    };
}