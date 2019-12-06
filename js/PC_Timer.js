function PooTimer( el, duration, animeDuration, type = "poo", delay = 0 ) {
	const _el       	 = el;				//element container
	const _duration      = duration;		//Duration of this timer
	const _aDuration     = animeDuration;	//Frame Regulator for Animation
	const _delay         = delay;			//Delay Start
	let   _delayCnt      = 0;				//Current Delay counter;

	let   _destructTimer = null;
	let   _animeTimer    = null;

	const start = ( ) => {
		_destructTimer = setInterval( end, _duration );

		if( type === "poo" )   _animeTimer = setInterval( pooAnimation,  _aDuration );
		if( type === "save" )  _animeTimer = setInterval( saveAnimation, _aDuration );
		if( type === "chevo" ) _animeTimer = setInterval( chevoAnimation, _aDuration );
	}

	const end = ( ) => {
		clearInterval( _destructTimer );
		clearInterval( _animeTimer );

		_el.parentElement.removeChild( _el );
	}

	const pooAnimation = ( ) => {
		let opacity = _el.style.opacity;
		let element = _el.style.top;
		element = element.replace( "px", "" );

		element--;
		opacity -= 0.005;

		_el.style.top = element + "px";
		_el.style.opacity = opacity;
	}

	const saveAnimation = ( ) => {
		let opacity = _el.style.opacity;
		    opacity -= 0.005;
		    
		_el.style.opacity = opacity;
	}

	const chevoAnimation = ( ) => {
		if( _delayCnt >= _delay ) {
			let opacity = _el.style.opacity;
		    opacity -= 0.005;
		    
			_el.style.opacity = opacity;
		}
		_delayCnt += _aDuration;
	}

	Object.freeze( _el );
	Object.freeze( _duration );

	return {
		start : start
	};
}
