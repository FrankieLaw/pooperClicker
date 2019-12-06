function AppSessionState( ) {
//=======================================================
// [x] Session State - Variables
//=======================================================
	//=======================================================
	// Required Variables about SaveGame
	//=======================================================
	var _storageKey = "tempSlot";		//Use for permentant save
	var _quickKey   = "quickSlot";		//Use for quickSave

	//=======================================================
	// Required Variables about Windows
	//=======================================================
	var _window     = { current : "page1", previous : "" };

	//=======================================================
	// Required Variables about Characters
	//=======================================================
	var _heroes = {};


	//=======================================================
	// Required Variables about Current Game Run State
	//=======================================================
	var _runTime 		 = {};
	var _totalPooCollect = 0;
	var _upgradeList     = {};





//=======================================================
// [x] Session State - Methods
//=======================================================
	//=======================================================
	// [x] addHero - Add hero [obj] into the _heroes
	//=======================================================
	function addHero( newHero ) {
		var keyLength = countHero( );
		
		let key 	  = "hero" + (keyLength + 1);
		_heroes[key] = newHero;
	}

	//=======================================================
	// [x] getHero - Retrieve Hero from _heroes based on key
	//=======================================================
	function getHero( heroID ) { 
		var key = "hero" + (heroID + 1)

		if( _heroes[key] != undefined ) { 
			return _heroes[key]; 
		}		
	}

	//=======================================================
	// [x] countHero - How many hero within the JSON object
	//=======================================================
	function countHero( ) { return Object.getOwnPropertyNames( _heroes ).length; }


	//=======================================================
	// [x] saveHeroList - Compile HeroObj to JSON and list
	// them all under "HeroList"
	//=======================================================
	function saveHeroList( ) {
		var output = {};
		    output["HeroList"] = {};

		for( key in _heroes ) {
			output["HeroList"][key] = _heroes[key].toJSON( );
		}

		return output;
	}



	//=======================================================
	// [x] Window Methods - Complete
	//=======================================================
	function ED_StageChange( newWindow ) {
		_window.previous = _window.current;
		_window.current = newWindow;

		if( _window.previous != "" ) {
			document.getElementById( _window.previous ).style.display = "none";
		}

		document.getElementById( _window.current ).style.display = "block";
	}

	function curWindow( ) { return _window.current; }


	//=======================================================
	// [x] Save Keys Methods - Complete
	//=======================================================
	function newSlot( newSlot ) { _storageKey = newSlot; }
	function saveSlot( ) { return _storageKey; }


	//=======================================================
	// [x] Session State - Loading & Reset
	//=======================================================
	function reset( ) {
		_storageKey 	 = "tempSlot";
		_quickKey   	 = "quickSlot";
		_window     	 = { current : "page1", previous : "" };
		_heroes	 		 = {};
		_runTime    	 = {};
		_totalPooCollect = 0;
	}


	function setFromSaveSlot( slotID, slotData ) {
		_storageKey = slotID;
		_quickKey   = "quickSlot";
		_window     = { current : "page2", previous : "" };
		_heroes     = {};

		for( keys in slotData["HeroList"] ) {
			let temp = new ED_Hero( );
			temp.createFromJSON( slotData["HeroList"][keys] );
			addHero( temp );
		}

		for( keys in slotData["TimeRan"] ) {
			let temp = new ED_Timer( );
			temp.createFromJSON( slotData["TimeRan"][keys] );
			_runTime = temp;
		}

		slotData["TotalPooCollect"] == undefined ? 0 : _totalPooCollect = slotData["TotalPooCollect"];
	}


	//=======================================================
	// [x] Session State - Timer
	//=======================================================
	function setTimer( timeObj ) { _runTime = timeObj; }
	function getTimer( ) { return _runTime; }
	function addTimer( ) { _runTime = new ED_Timer( ); }

	function saveTimeRan( ) {
		return { "TimeRan" : _runTime.toJSON( ) };
	}


	//=======================================================
	// [x] Session State - Game Statistics
	//=======================================================
	function addPoo( quantity )      { _totalPooCollect += quantity; }
	function subtractPoo( quantity ) { _totalPooCollect -= quantity; }

	function getTotalPoo( ) { return _totalPooCollect; }
	function savePoo( ) { 
		return { "TotalPooCollect" : _totalPooCollect };
	}

	//=======================================================
	// [x] Session State - For Debugging Only
	//=======================================================
	function debug( ) {
		console.group( "Session State Condition" );
			console.log( "Storage Key: " + _storageKey );
			console.log( "Quick Key: "   + _quickKey );
			console.log( _window );
			console.log( _heroes );
			console.log( "Seconds: " + _runTime.seconds( ) );
			console.log( "T. Poo Collect: " + _totalPooCollect );
		console.groupEnd( );
	}


	//=======================================================
	// [x] API Return
	//=======================================================
	let AppSessionStateAPI = {
		//========================
		// GAME - SAVE/LOAD/RESET
		//========================
		reset    : reset,
		makeGame : setFromSaveSlot,
		saveSlot : saveSlot,
		newSlot  : newSlot,

		//========================
		// GAME - WINDOW
		//========================
		getCurWindow   : curWindow,
		ED_StageChange : ED_StageChange,

		//========================
		// GAME - HERO
		//========================
		addHero      : addHero,
		getHero      : getHero,
		countHero    : countHero,
		saveHeroList : saveHeroList,

		//========================
		// GAME - TIMER
		//========================
		setTimer    : setTimer,
		getTimer    : getTimer,
		addTimer    : addTimer,
		saveTimeRan : saveTimeRan,

		//========================
		// GAME - GAME STATISTIC
		//========================
		addPoo      : addPoo,
		getTotalPoo : getTotalPoo,
		subtractPoo : subtractPoo,
		savePoo     : savePoo,

		debug : debug
	};

	return AppSessionStateAPI;
};





// ==================================================
// registry is closed off from the outside world
// ==================================================
function AppEventRegistry( ) {
	let eventKeys = { };

	function addEventRegistry( id, eType, eCall ) {
		if( !eventKeys.hasOwnProperty( id ) ) {
			eventKeys[ id ] = [ ];
		}

		eventKeys[ id ].push( { eventType : eType, callback : eCall	} );
	}

	function removeEventRegistry( id, eType ) {
		eventKeys[ id ] = eventKeys[ id ].filter( ( element ) => {
			return element.eventType === eType ? false : true;
		});

		if( eventKeys[ id ].length === 0 ) {
			delete eventKeys[ id ];
		}
	}

	function getEventRegistry( id, eType ) {
		let event = "";

		eventKeys[ id ].forEach( ( element ) => {
			if( element.eventType === eType ) {
				event = element;
			}
		});

		return event;
	}

	let registryAPI = {
		keys     : eventKeys,
		add  	 : addEventRegistry,
		remove 	 : removeEventRegistry,
		getEvent : getEventRegistry
	}

	return registryAPI;
}