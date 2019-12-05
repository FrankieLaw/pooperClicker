//=======================================================
// Procedure for Adding content into the game
//	Add attribute [_upgrade]
//  	Edit Reset									   (Reset Game)
//		Edit debug									   (Debug Game)
//		Edit setFromSaveSlot 						   (Load Game)
//		Edit App_SaveState.js    -> saveToLocalStorage (Save Game)
//		Edit App_SessionState.js -> savePlayerState    (Save Game)
//		Edit App_Update.js       -> updateStatistics   (Statistic Update)
//=======================================================


function AppSessionState( ) {
//=======================================================
// [x] Session State - Variables
//=======================================================
	const copyright = {
		"gameName" : "Pooper Clicker",
		"version"  : "DEMO",
		"dateFrom" : 2019,
		"dateTo"   : 2019,
		"Author"   : "Cowwy"
	};

	function Copyright( prop ) { return copyright[ prop ]; }

	//=======================================================
	// Required Variables about SaveGame
	//=======================================================
	let _storageKey = `pc-${copyright.version}-tempSlot`;	//Use for permentant save
	let _quickKey   = `pc-${copyright.version}-quickSlot`;	//Use for quickSave

	//=======================================================
	// Required Variables about Windows
	//=======================================================
	let _window     = { current : "page1", previous : "" };
	let _buyOrSell  = { current : true };						//True = Buy | False = Sell
	let _quantity   = { current : 1 };
	let _curMsg     = -1;										//-1 Is the initial message set in HTML
	
	let _activeScreen = "";


	//=======================================================
	// [v1] Required Variables about Current Game Run State
	//=======================================================
	let _playerState = {
		//==============================
		// GAME TIMER Variables
		//==============================
		"Time" : {
			"sessionRunTime" : 0
		},

		//==============================
		// STATISTICS Variables
		//   _playerState["Statistics"]["TotalPooCollect"]
		//==============================
		"Statistics" : {
			"TotalPooCollect"    : 0,
			"TotalClicksMade"    : 0,
			"TotalPooSinceStart" : 0,
			"PPS"                : 0
		},

		//==============================
		// STATISTICS Variables
		//   _playerState["Upgrades"]["Shovel"]["upgradeable"]
		//==============================
		"Upgrades" : {
			"Hand"		   : { "level" : 0, "lock" : true , "upgradeable" : false, "multiplier" : 1.0  },				
			"Shovel"       : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0  },
			"Baby"         : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0  },
			"Animal Farm"  : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0  },
			"Toilet"       : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0  }
		},


		//======================================================
		// TechTree Database
		//   Display all the upgrade that has been unlocked
		//	 Each upgrade is identify by their id(key) for
		//	 easy storage.
		//======================================================
		"TechTree" : {
			1:0,	2:0,	3:0,	4:0,	5:0,	6:0,	7:0,	8:0,	9:0,	10:0,
		   11:0,   12:0,   13:0,   14:0,   15:0,   16:0,   17:0,   18:0,   19:0,    20:0,
		   21:0,   22:0,   23:0,   24:0,   25:0,   26:0,   27:0,   28:0,   29:0,    30:0,
		   31:0,   32:0,   33:0
		},


		//======================================================
		// Message Database
		//   Random display of messages
		//	 Message will be added as more upgrades unlocked
		//======================================================
		"StoryBoard" : { },


		//======================================================
		// Name of this world
		//======================================================
		"WorldName" : "",


		//======================================================
		// Achievement Database
		//	Unlocked Achievement goes in here
		//======================================================
		"Achievement" : {
			1:0,	2:0,	3:0,	4:0,	5:0,	6:0,	7:0,	8:0,	9:0,	10:0,
		   11:0,   12:0,   13:0,   14:0,   15:0,   16:0,   17:0
		}
	}

	function reset( ) {
		_storageKey 	 	= `pc-${copyright.version}-tempSlot`;
		_quickKey   	 	= `pc-${copyright.version}-quickSlot`;
		_window     	    = { current : "page1", previous : "" };
		_buyOrSell          = { current : true };
		_quantity           = { current : 1 };
		_curMsg             = -1;

		_playerState = {
			"Time" : {
				"sessionRunTime" : 0
			},

			"Statistics" : {
				"TotalPooCollect"    : 0,
				"TotalClicksMade"    : 0,
				"TotalPooSinceStart" : 0,
				"PPS"                : 0
			},

			"Upgrades" : {
				"Hand"		   : { "level" : 0, "lock" : true , "upgradeable" : false, "multiplier" : 1.0 },
				"Shovel"       : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0 },
				"Baby"         : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0 },
				"Animal Farm"  : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0 },
				"Toilet"       : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0 }
			},

			"TechTree" : {
				1:0,	2:0,	3:0,	4:0,	5:0,	6:0,	7:0,	8:0,	9:0,	10:0,
			   11:0,   12:0,   13:0,   14:0,   15:0,   16:0,   17:0,   18:0,   19:0,    20:0,
			   21:0,   22:0,   23:0,   24:0,   25:0,   26:0,   27:0,   28:0,   29:0,    30:0,
			   31:0,   32:0,   33:0
			},

			"StoryBoard" : { },

			"WorldName" : "",

			"Achievement" : {
				1:0,	2:0,	3:0,	4:0,	5:0,	6:0,	7:0,	8:0,	9:0,	10:0,
			   11:0,   12:0,   13:0,   14:0,   15:0,   16:0,   17:0
			}
		};
	}
	
	

	//================================================
	// [v1] UPGRADE
	// "Hand" : { "level" : 0, "lock" : true , "upgradeable" : false, "multiplier" : 0.0  },	
	//================================================
	function getUpgradeList( )                  { return _playerState["Upgrades"]; }
	function getUpgradeByName( name )           { return _playerState["Upgrades"][name]; }
	function getUpgradeLevel( name )            { return _playerState["Upgrades"][name]["level"]; }
	function getMultiplierByName( name )        { return _playerState["Upgrades"][name]["multiplier"]; }
	function calcAllTotalPPS( ) {
		let totalPPS = 0.0;

		//CALCULATE ALL THE PPS FROM EACH UPGRADE
		$PC.getAllUpgradeName( ).forEach( (key) => {
			totalPPS += calcPPSByName( key )
		});

		return totalPPS;
	}

	function calcPooPerClick( ) {
		const multiplier = getMultiplierByName( "Hand" ) === 0 ? 1 : getMultiplierByName( "Hand" );
		return ( 1 + getUpgradeLevel( "Hand" ) ) * multiplier;
	}

	function calcPPSByName( name ) {
		const chevoBonus = 1 + ( $ST.getAllUnlockedChevo( ).length / 100 );
		const { level, multiplier } = getUpgradeByName( name );
		const { PPS }               = $PC.getUpgradeByName( name );

		return ( ( level * PPS ) * multiplier ) * chevoBonus;
	}

	function calcPPS( ) { 
		_playerState["Statistics"]["PPS"] = $PC.calcAllPPS( ); 
	}

	function upgradeLevelUp( name, quantity )   { _playerState["Upgrades"][name]["level"] += quantity; }
	function upgradeLevelDown( name, quantity ) { _playerState["Upgrades"][name]["level"] -= quantity; }

	function isUpgradeUnLock( name ) 			{ return _playerState["Upgrades"][name]["lock"]; }

	function isUpgradePurchaseable( name ) {
		let upgradeCost = $PC.calcSumPrice( name, _playerState["Upgrades"][name]["level"], _quantity.current );
		const totalPoo  = _playerState["Statistics"]["TotalPooCollect"];

		_playerState["Upgrades"][name]["upgradeable"] = upgradeCost <= totalPoo ? true : false;

		return _playerState["Upgrades"][name]["upgradeable"];
	}
	
	function isUpgradeEligible( ) {
		let retValue    = false;

		// CHECK IF NEXT TIRE UPGRADE IS ELIGIBLE
		$PC.getAllUpgradeName( ).forEach( ( el ) => {
			if( _playerState["Upgrades"][el]["lock"] != true 
				&& _playerState["Statistics"]["TotalPooCollect"] >= ( 0.9 * $PC.getUpgradeBase(el) ) ) {
				_playerState["Upgrades"][el]["lock"] = true;
				retValue = true;					
			}
		});

		return retValue;
	}

	function upgradeToggle( ) {
		for( key in _playerState["Upgrades"] ) {
			isUpgradePurchaseable( key );
		}
	}


	//=======================================
	// [v1] ACHIEVEMENT METHODS
	//=======================================
	function getAchievement( )               { return _playerState["Achievement"]; }
	function getAchievementLength( )         { return Object.keys( _playerState["Achievement"] ).length; }
	function getAchievementKeys( )           { return Object.keys( _playerState["Achievement"] ); }
	function getAchievementById( id )        { return _playerState["Achievement"][id]; }

	function setAchievementById( id, value ) { _playerState["Achievement"][id] = value; }
	function getAllUnlockedChevo( ) {
		return Object.keys( _playerState["Achievement"] ).filter( ( index ) => {
			return _playerState["Achievement"][index] == 1;
		});
	}

	//=======================================
	// CHANGING WORLD NAME
	//=======================================
	function getWorldName( ) { return _playerState["WorldName"]; }
	function setWorldName( name ) { _playerState["WorldName"] = name; }


	//=======================================
	// GAME - MESSAGE BOARD
	//=======================================
	function resetStoryBoard( )     { _playerState[ "StoryBoard"] = {}; }
	function getStoryBoardLength( ) { return Object.keys( _playerState["StoryBoard"] ).length; }
	
	function getRandomMessage( )    { 
		let messageIDPick = GameUtility.between( 1, getStoryBoardLength( ) );

		//PREVENT DUPLICATE MESSAGE BEING DISPLAY
		while( messageIDPick == _curMsg ) {
			messageIDPick = GameUtility.between( 1, getStoryBoardLength( ) );
		}

		//NOTIFY SESSION STATE THE CURRENT MESSAGE
		_curMsg = messageIDPick;

		return _playerState[ "StoryBoard" ][ messageIDPick ]; 
	}

	//THIS FUNCTION WILL INCREMENTALLY ADD NEW MESSAGES IN SEQUENTIAL ORDER
	function addRandomMessage( msg ) {
		let length = getStoryBoardLength( );	//Get Current Length
		length++;								//Set next length

		_playerState[ "StoryBoard" ][ length ] = msg;
	}


	//=======================================
	// [v1] GAME - TECH
	//=======================================
	function getAllLockedTech( ) {
		let retValue = {};

		//GETTING ALL THE KEYS IN _playerState
		for( let key in _playerState["TechTree"] ) {
			if( !_playerState["TechTree"][key] ) {
				retValue[key] = _playerState["TechTree"][key];
			}
		}

		return retValue;
	}
	
	function getAllOwnedTech( ) {
		return Object.keys( _playerState["TechTree"] ).filter( (techID) => {
			return _playerState["TechTree"][techID] === 1;
		});
	}

	//remove this function when it is all done.
	function getTechTree( )    { return _playerState["TechTree"]; }
	function getTechById( id ) { return _playerState["TechTree"][ id ]; }

	function setTechPurchased( id )             { _playerState["TechTree"][id] = 1; }
	function setMultiplierByName( name, value ) { _playerState["Upgrades"][name]["multiplier"] = value; }

	//CALCULATE ALL THE TECH BONUS
	function calcTechPPSBonus( )                { $PC.calcAllPPS( ); }



	//================================================
	// [v1] GAME - SAVE/LOAD/RESET
	//================================================
	function setFromSaveSlot( slotID, slotData ) {
		reset( );

		_storageKey = slotID;
		_quickKey   = `pc-${copyright.version}-quickSlot`;
		_window     = { current : "page2", previous : "" };
		_curMsg     = -1;

		//==============================================
		// LOADING TIMER
		//==============================================
		try {
			_playerState["Time"]["sessionRunTime"] = slotData["Time"]["sessionRunTime"];
		} catch( err ) {
			_playerState["Time"]["sessionRunTime"] = 0;
		}


		//==============================================
		// LOADING UPGRADES
		//==============================================
		_playerState["Upgrades"] = slotData["Upgrades"];
		upgradeToggle( );
		isUpgradeEligible( );
		updatePooStore( );


		//==============================================
		// LOADING STATISTICS
		//==============================================
		_playerState["Statistics"]        = slotData["Statistics"];
		_playerState["Statistics"]["PPS"] = slotData["Statistics"]["PPS"];


		//==============================================
		// LOADING TECH TREE
		//==============================================
		_playerState["TechTree"] = checkTechSlotData( slotData["TechTree"] );


		//==============================================
		// LOADING WORLD NAME
		//==============================================
		_playerState["WorldName"] = slotData["WorldName"];


		//==============================================
		// LOADING ACHIEVEMENT
		//==============================================
		_playerState["Achievement"] = checkAchievementSlotData( slotData["Achievement"] );


		//==============================================
		// LOADING MESSAGE BOARD DATA
		//==============================================
		$PC.getMessageBoardUpdate( );
	}

	function checkAchievementSlotData( slotData ) {
		let totalChevoLength = $PC.getAchievementLength( );
		let retObj           = {};

		if( Object.keys( slotData ).length < totalChevoLength ) {
			for( let i = 0; i < totalChevoLength; i++ ) {
				if( slotData[ i + 1 ] != undefined ) {
					retObj[ i + 1 ] = slotData[ i + 1 ];
				} else {
					retObj[ i + 1 ] = 0;
				}
			} 
		} else {
			return slotData;
		}

		return retObj;
	}

	function checkTechSlotData( slotData ) {
		let totalTechLength = $PC.getTechTreeLength( );
		let retObj          = {};

		//RECONSTRUCT TECH TREE DATA &
		//TRANSFER NEW TECH DATA WITH OLD DATA
		if( Object.keys( slotData ).length < totalTechLength ) {
			for( let i = 0; i < totalTechLength; i++ ) {

				if( slotData[ i + 1 ] != undefined ) {
					retObj[ i + 1 ] = slotData[ i + 1 ];	
				} else {
					retObj[ i + 1 ] = 0;
				}
			}

		} else {
			return slotData;
		}

		return retObj;
	}

	function savePlayerState( ) {
		return {
			"Time" : {
				"sessionRunTime" : _playerState["Time"]["sessionRunTime"]
			},

			"Statistics" : _playerState["Statistics"],
			"Upgrades"   : _playerState["Upgrades"],

			"TechTree"   : _playerState["TechTree"],
			"WorldName"  : _playerState["WorldName"],
			"Achievement": _playerState["Achievement"]
		};
	}

	function newSlot( newSlot ) { _storageKey = newSlot; }
	function saveSlot( )        { return _storageKey; }	



	//================================================
	// [v1] GAME - TIMER
	//================================================
	function addCurSessionTime( _s ) { _playerState["Time"]["sessionRunTime"] += _s; }
	function getCurSessionTime( )    { return _playerState["Time"]["sessionRunTime"]; }



	//================================================
	// [v1] GAME - POO STATISTIC
	//================================================
	function getTotalPoo( )               { return _playerState["Statistics"]["TotalPooCollect"]; }
	function getTotalClicks( )            { return _playerState["Statistics"]["TotalClicksMade"]; }
	function getPooSinceStart( )          { return _playerState["Statistics"]["TotalPooSinceStart"]; }
	function getPPS( )                    { return _playerState["Statistics"]["PPS"]; }

	function addPoo( quantity )           { _playerState["Statistics"]["TotalPooCollect"] += quantity; }
	function addClick( quantity )         { _playerState["Statistics"]["TotalClicksMade"] += quantity; }
	function addPooSinceStart( quantity ) { _playerState["Statistics"]["TotalPooSinceStart"] += quantity; }
	
	function subtractPoo( quantity )      { _playerState["Statistics"]["TotalPooCollect"] -= quantity; }
	

	

	function getTotalUpgrade( ) {
		let sum = 0;

		for( key in _playerState["Upgrades"] ) {
			sum += getUpgradeLevel( key );
		}
		
		return sum;
	}

	function getDisplayNotation( statistic ) {
		let retValue = "";

		switch( statistic ) {
			case "totalPoo":
				retValue = GameUtility.useExpNotation( Math.round( getTotalPoo( ) ) );
			break;

			case "pooSinceStart":
				retValue = GameUtility.useExpNotation( Math.round( getPooSinceStart( ) ) );
			break;

			default:
				retValue = GameUtility.useExpNotation( Math.round( statistic ) );
			break;
		}

		return retValue;
	}
	
	//================================================
	// [v1] GAME - PURCHASE CONTROL
	//================================================
	function buyOrSell( state ) 			{ _buyOrSell.current = state; }
	function getBuyOrSell( )    			{ return _buyOrSell.current; }

	function setBuyOrSellQuantity( num ) 	{ _quantity.current = num; }
	function getBuyOrSellQuantity( ) 		{ return _quantity.current; }



	//================================================
	// [v1] GAME - WINDOW TOGGLE CONTROLS
	//================================================
	function toggleActiveScreen( id ) {
		_activeScreen = _activeScreen == id  ? "" : id;
	}

	function getActiveScreen( ) { return _activeScreen; }



	//================================================
	// [v1] GAME - DEBUGGING
	//================================================
	function debug( loc ) {
		console.groupCollapsed( `Debug from ${loc}` );
			console.log( "Storage Key: " + _storageKey );
			console.log( "Quick Key: "   + _quickKey );

			console.group( "Window Page" );
				console.log( _window );
				console.log( "Message Board ID: " + _curMsg );
			console.groupEnd( );

			console.group( "buyOrSell" );
				console.log( _buyOrSell );
				console.log( _quantity );
			console.groupEnd( );

			console.group( "Statistics" );
				console.log( "Time -> SessionRunTime: "    + _playerState["Time"]["sessionRunTime"] );
				console.log( "T. Poo Collect: "            + _playerState["Statistics"]["TotalPooCollect"] );
				console.log( "Total Clicks: "              + _playerState["Statistics"]["TotalClicksMade"] );
				console.log( "Poo Collected since Start: " + _playerState["Statistics"]["TotalPooSinceStart"] );
				console.log( "Poo Per Second: "            + _playerState["Statistics"]["PPS"] );
			console.groupEnd( );

			console.group( "Upgrades" );
				console.log(  _playerState["Upgrades"] );
				console.log( _playerState["TechTree"] );
			console.groupEnd( );

			console.group( "Message Board" );
				console.log( _playerState["WorldName"] );
				console.log( _playerState["StoryBoard"] );
			console.groupEnd( );

			console.group( "Achievement" );
				console.log( _playerState["Achievement"] );
			console.groupEnd( );
		console.groupEnd( );
	}

	function _hackPooCount( num ) {
		addPoo( num );
	}



	//=======================================================
	// [x] API Return
	//=======================================================
	const AppSessionStateAPI = {
		//========================
		// Copyright Details
		//========================
		Copyright : Copyright,


		//========================
		// GAME - SAVE/LOAD/RESET
		//========================
		reset    : reset,
		makeGame : setFromSaveSlot,
		saveSlot : saveSlot,
		newSlot  : newSlot,
		savePlayerState : savePlayerState,


		//========================
		// GAME - TIMER
		//========================
		addCurSessionTime : addCurSessionTime,
		getCurSessionTime : getCurSessionTime,


		//========================
		// GAME - POO STATISTIC
		//========================
		calcPPS             : calcPPS,
		subtractPoo         : subtractPoo,

		addPoo              : addPoo,
		addClick            : addClick,
		addPooSinceStart    : addPooSinceStart,

		getTotalPoo         : getTotalPoo,
		getTotalClicks      : getTotalClicks,
		getPooSinceStart    : getPooSinceStart,
		getPPS 			    : getPPS,
		getTotalUpgrade     : getTotalUpgrade,
		getDisplayNotation  : getDisplayNotation,


		//==========================
		// GAME - UPGRADE STATISTIC
		//==========================
		getUpgradeList	      : getUpgradeList,
		getUpgradeByName      : getUpgradeByName,
		getUpgradeLevel       : getUpgradeLevel,
		getMultiplierByName   : getMultiplierByName,

		calcPooPerClick       : calcPooPerClick,
		calcAllTotalPPS       : calcAllTotalPPS,
		calcPPSByName         : calcPPSByName,

		upgradeLevelUp  	  : upgradeLevelUp,
		upgradeLevelDown      : upgradeLevelDown,

		isUpgradeUnLock       : isUpgradeUnLock,
		isUpgradePurchaseable : isUpgradePurchaseable,
		isUpgradeEligible	  : isUpgradeEligible,
		upgradeToggle         : upgradeToggle,


		//==========================
		// GAME - PURCHASE CONTROL
		//==========================
		buyOrSellToggle      : buyOrSell,
		getBuyOrSell         : getBuyOrSell,
		setBuyOrSellQuantity : setBuyOrSellQuantity,
		getBuyOrSellQuantity : getBuyOrSellQuantity,


		//==========================
		// GAME - TECH TREE CONTROL
		//==========================
		getTechTree         : getTechTree,
		getTechById         : getTechById,
		getAllLockedTech    : getAllLockedTech,
		getAllOwnedTech     : getAllOwnedTech,

		setMultiplierByName : setMultiplierByName,
		setTechPurchased    : setTechPurchased,

		calcTechPPSBonus    : calcTechPPSBonus,
		
		
		//==========================
		// GAME - RANDOM MESSAGE
		//==========================
		getRandomMessage : getRandomMessage,
		addRandomMessage : addRandomMessage,
		resetStoryBoard  : resetStoryBoard,


		//==========================
		// GAME - WORLD NAME
		//==========================
		getWorldName : getWorldName,
		setWorldName : setWorldName,


		//==========================
		// GAME - ACHIEVEMENT
		//==========================
		getAchievement       : getAchievement,
		getAchievementKeys   : getAchievementKeys,
		getAchievementById   : getAchievementById,
		getAchievementLength : getAchievementLength,
		setAchievementById   : setAchievementById,
		getAllUnlockedChevo  : getAllUnlockedChevo,

		toggleActiveScreen   : toggleActiveScreen,
		getActiveScreen      : getActiveScreen,

		//========================
		// GAME - DEBUGGING
		//========================
		debug         : debug,
		_hackPooCount : _hackPooCount
	};

	return AppSessionStateAPI;
};