//=======================================================
// Procedure for Adding onto the game
//	Add attribute [_upgrade]
//  	Edit Reset
//		Edit debug
//		Edit setFromSaveSlot (Load Game)
//		App_SaveState.js -> Edit saveToLocalStorage
//=======================================================




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
	// Required Variables about Current Game Run State
	//=======================================================
	var _runTime 		 = {};
	var _totalPooCollect = 0;
	
	var _upgradeList     = {
		"Shovel"       : { "level" : 0, "lock" : true  },
		"Baby"         : { "level" : 0, "lock" : false },
		"Moo Moo Farm" : { "level" : 0, "lock" : false },
		"Bathroom"     : { "level" : 0, "lock" : false }
	};




//=======================================================
// [x] Session State - Methods
//=======================================================
	//=======================================================
	// [x] Window Methods - Complete
	//=======================================================
	function changeStageTo( newWindow ) {
		_window.previous = _window.current;
		_window.current = newWindow;

		if( _window.previous != "" ) {
			document.getElementById( _window.previous ).style.display = "none";
		}

		document.getElementById( _window.current ).style.display = "block";
	}

	function curWindow( ) { return _window.current; }



	//=======================================================
	// [x] Session State - Timer
	//=======================================================
	function setTimer( timeObj ) { _runTime = timeObj; }
	function getTimer( ) { return _runTime; }
	function addTimer( ) { _runTime = new ED_Timer( ); }



	//=======================================================
	// [x] Session State - Poo Statistics
	//=======================================================
	function addPoo( quantity )      { _totalPooCollect += quantity; }
	function subtractPoo( quantity ) { _totalPooCollect -= quantity; }
	function getTotalPoo( ) { return _totalPooCollect; }
	function isUpgradePurchaseable( name ) {
		let upgradeCost = UpgradeData.calcPrice( name, _upgradeList[name]["level"] );
		return ( upgradeCost <= _totalPooCollect ) ? true : false;
	}
	function isUpgradeEligible( ) {
		let upgradeData = UpgradeData.upgrade;

		//CHECK IF NEXT LEVEL UPGRADE IS ELIGIBLE [INDIVIDUAL UPGRADE]


		//CHECK IF NEXT TIRE UPGRADE IS ELIGIBLE
		for( key in UpgradeData.upgrade ) {
			if( _totalPooCollect >= ( 0.9 * UpgradeData.upgrade[key]["base"] ) ) {
				_upgradeList[key]["lock"] = true;
			}	
		}

		//CHECK IF TECH UPGRADE IS ELIGIBLE
	}
	

	//=======================================================
	// [x] Session State - Upgrade Statistics
	//=======================================================
	function upgradeLevelUp( name ) { _upgradeList[name]["level"]++; }
	function getLevel( name ) { return _upgradeList[name]["level"]; }
	function isUpgradeUnLock( name ) { return _upgradeList[name]["lock"]; }

	//=======================================================
	// [x] Save Keys Methods - Complete
	//=======================================================
	function newSlot( newSlot ) { _storageKey = newSlot; }
	function saveSlot( ) { return _storageKey; }	

	function setFromSaveSlot( slotID, slotData ) {
		_storageKey = slotID;
		_quickKey   = "quickSlot";
		_window     = { current : "page2", previous : "" };

		for( keys in slotData["TimeRan"] ) {
			let temp = new ED_Timer( );
			temp.createFromJSON( slotData["TimeRan"][keys] );
			_runTime = temp;
		}

		slotData["TotalPooCollect"] == undefined ? 0 : _totalPooCollect = slotData["TotalPooCollect"];

		for( key in slotData["upgrade"] ) {
			_upgradeList[key] = slotData["upgrade"][key];
		}

		// console.group( "Making Game" );
		// 	console.log( _upgradeList );
		// console.groupEnd( );
	}


	function saveTimeRan( ) {
		return { "TimeRan" : _runTime.toJSON( ) };
	}

	function savePoo( ) { 
		return { "TotalPooCollect" : _totalPooCollect };
	}

	function saveUpgrade( ) {
		return { "upgrade" : _upgradeList };
	}


	//=======================================================
	// [x] Session State - Loading & Reset
	//=======================================================
	function reset( ) {
		_storageKey 	 = "tempSlot";
		_quickKey   	 = "quickSlot";
		_window     	 = { current : "page1", previous : "" };
		_runTime    	 = {};
		_totalPooCollect = 0;
		
		_upgradeList = {
			"Shovel"       : { "level" : 0, "lock" : true  },
			"Baby"         : { "level" : 0, "lock" : false },
			"Moo Moo Farm" : { "level" : 0, "lock" : false },
			"Bathroom"     : { "level" : 0, "lock" : false }
		}

		console.clear( );
	}


	//=======================================================
	// [x] Session State - For Debugging Only
	//=======================================================
	function debug( ) {
		console.group( "Session State Condition" );
			console.log( "Storage Key: " + _storageKey );
			console.log( "Quick Key: "   + _quickKey );
			console.log( _window );
			console.log( "Seconds: " + _runTime.seconds( ) );
			console.log( "T. Poo Collect: " + _totalPooCollect );
			console.log( _upgradeList );
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
		changeStageTo  : changeStageTo,

		//========================
		// GAME - TIMER
		//========================
		setTimer    : setTimer,
		getTimer    : getTimer,
		addTimer    : addTimer,

		//========================
		// GAME - POO STATISTIC
		//========================
		addPoo      : addPoo,
		getTotalPoo : getTotalPoo,
		subtractPoo : subtractPoo,
		

		//==========================
		// GAME - UPGRADE STATISTIC
		//==========================
		getLevel       	      : getLevel,
		upgradeLevelUp  	  : upgradeLevelUp,
		isUpgradeUnLock       : isUpgradeUnLock,
		isUpgradePurchaseable : isUpgradePurchaseable,
		isUpgradeEligible	  : isUpgradeEligible,


		//========================
		// GAME - SAVE STATISTIC
		//========================
		saveTimeRan : saveTimeRan,
		savePoo     : savePoo,
		saveUpgrade : saveUpgrade,

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
		add  	 : addEventRegistry,
		remove 	 : removeEventRegistry,
		getEvent : getEventRegistry
	}

	return registryAPI;
}