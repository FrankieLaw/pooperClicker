//===========================================
// ED_Timer - Manages FPS in the game.
//===========================================
function ED_Timer( ) {
	//===========================================
	// Timer's Attributes
	//===========================================
	var   _seconds = 0;
	var   _timer   = "";
	const _fps     = 1000;

	function createFromJSON( storageObj ) {
		_seconds = storageObj;		
	}

	function seconds( ) { return _seconds;	}

	function toJSON( ) {
		return { "second" : _seconds };
	}

	function start( ) {
		_timer = setInterval( function( ) {
			_seconds += 1;		
		}, _fps );
	}

	function end( ) {
		clearInterval(_timer);
	}

	function elapsedToString( ) {
		let seconds = 0;
		let minutes = 0;
		let hours   = 0;
		let days    = 0;
		let years   = 0;

		seconds = _seconds % 60;							//Total Seconds
		minutes = Math.floor( _seconds / 60 );				//Total Minutes
		hours   = Math.floor( _seconds / 3600 );
		days    = Math.floor( _seconds / 86400 );
		years   = Math.floor( _seconds / 31536000 );

		if( years >= 1 ) { 
			if( years >=2 ) { return ( years + " Years Ago" ); }
			else { return ( years + " Year Ago" ); }

		} else if( days >= 1 ) {
			if( days >=2 ) { return ( days + " Days Ago" ); }
			else { return ( days + " Day Ago" ); }

		} else if( hours >= 1 ) {
			if( hours >=2 ) { return ( hours + " Hours Ago" ); }
			else { return ( hours + " Hour Ago" ); }

		} else if( minutes >= 1 ) {
			if( minutes >=2 ) { return ( minutes + " Minutes Ago" ); }
			else { return ( minutes + " Minute Ago" ); }

		} else {
			if( seconds >=2 ) { return ( seconds + " Seconds Ago" ); }
			else { return ( seconds + " Second Ago" ); }
		}
	}

	return {
		createFromJSON : createFromJSON,
		seconds 	   : seconds,
		elapsedToString: elapsedToString,
		toJSON         : toJSON,

		start          : start,
		end	   		   : end
	};
};



//===========================================
// PooNumber - Manages numbers popping up
// when you click on the poo.
// Made to self destruct. Don't mess with it
//===========================================
function PooNumber( element ) {
	this.timer      = "";
	this.anime      = "";

	this.element    = element;		//Reference to "this" object's Element

	this.endTimer   = endTimer;		//Reference to "this" object's endTimer function
	this.startTimer = startTimer;	//Reference to "this" object's startTimer function
	this.startAnime = startAnime;

	var self        = this;			//Reference to itself

	function startTimer( ) {
		self.timer = setInterval( self.endTimer, 3000 );
		self.anime = setInterval( self.startAnime, 15 );
	}

	function endTimer( ) {
		clearInterval( self.timer );
		clearInterval( self.anime );

		let parent = self.element.parentElement;
		parent.removeChild( self.element );
	}

	function startAnime( ) {
		let opacity = self.element.style.opacity;
		let element = self.element.style.top;
		element = element.slice( 0, element.length - 2 );

		element--;
		opacity -= 0.005;

		self.element.style.top = element + "px";
		self.element.style.opacity = opacity;
	}

	return {
		start : startTimer
	};
}