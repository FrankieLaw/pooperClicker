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
	var _storageKey = "pc-v1-tempSlot";		//Use for permentant save
	var _quickKey   = "pc-v1-quickSlot";	//Use for quickSave



	//=======================================================
	// Required Variables about Windows
	//=======================================================
	var _window     = { current : "page1", previous : "" };
	var _buyOrSell  = { current : true };						//True = Buy | False = Sell
	var _quantity   = { current : 1 };
	var _curMsg     = -1;										//-1 Is the initial message set in HTML
	

	//=======================================================
	// Required Variables about Current Game Run State
	//=======================================================
	var _playerState = {
		//==============================
		// GAME TIMER Variables
		//==============================
		"GameTime" : {					
			"seconds" : {}				
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
			"Hand"		   : { "level" : 0, "lock" : true , "upgradeable" : false, "multiplier" : 0.0  },				
			"Shovel"       : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 0.0  },
			"Baby"         : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 0.0  },
			"Animal Farm"  : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 0.0  },
			"Toilet"       : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 0.0  }
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
		"WorldName" : "Poopy World",


		//======================================================
		// Achievement Database
		//	Unlocked Achievement goes in here
		//======================================================
		"Achievement" : {
			1:0,	2:0,	3:0,	4:0,	5:0,	6:0,	7:0,	8:0,	9:0,	10:0
		}
	}


	//=======================================
	// GAME CONTROL METHODS
	//=======================================
	function calcPooPerClick( ) { 
		return ( 1 + getLevel( "Hand" ) ) * ( 1 + getMultiplierByName( "Hand" ) );
	}
	

	//=======================================
	// ACHIEVEMENT METHODS
	//=======================================
	function getAchievement( )               { return _playerState["Achievement"]; }
	function getAchievementLength( )         { return Object.keys( _playerState["Achievement"] ).length; }
	function getAchievementKeys( )           { return Object.keys( _playerState["Achievement"] ); }
	function getAchievementById( id )        { return _playerState["Achievement"][id]; }

	function setAchievementById( id, value ) { _playerState["Achievement"][id] = value; }


	//=======================================
	// CHANGING WORLD NAME
	//=======================================
	function getWorldName( ) { return _playerState["WorldName"]; }
	function setWorldName( name ) { _playerState["WorldName"] = name; }


	//=======================================
	// GET A RANDOM MESSAGE
	//=======================================
	function resetStoryBoard( ) { _playerState[ "StoryBoard"] = {}; }
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
	// GET ALL TECH THAT IS NOT PURCHASED YET
	//=======================================
	function getAllLockedTech( ) {
		let retValue = {};

		//GETTING ALL THE KEYS IN _playerState
		for( var key in _playerState["TechTree"] ) {
			if( !_playerState["TechTree"][key] ) {
				retValue[key] = _playerState["TechTree"][key];
			}
		}

		return retValue;
	}

	//SPECIFIC CHANGE A TECH TO PURCHASE
	function setTechPurchased( id ) {
		_playerState["TechTree"][id] = 1;
	}

	//CALCULATE ALL THE TECH BONUS
	function calcTechPPSBonus( ) {
		//SUM WILL HOLD THE SUMMATION OF ALL THE UPGRADES
		//INITIAL ALL THE UPGRADE BY NAME WITH MULTIPLIER OF 0.0
		let sum = {};	
		for( var key in _playerState["Upgrades"] ) { sum[key] = 0.0; }

		//GET ALL THE TECH THAT IS UNLOCKED
		for( var key in _playerState["TechTree"] ) {

			if( _playerState["TechTree"][key] ) {
				//GET TECH INFORMATION FROM GameData
				let techInfo = PooClickerData.getTechById( key );

				switch( techInfo["owner"] ) {
					case "Hand":
						sum["Hand"] += techInfo["multiplier"];
					break;

					case "Shovel":
						sum["Shovel"] += techInfo["multiplier"];
					break;

					case "Baby":
						sum["Baby"] += techInfo["multiplier"];
					break;

					case "Animal Farm":
						sum["Animal Farm"] += techInfo["multiplier"];
					break;

					case "Toilet":
						sum["Toilet"] += techInfo["multiplier"];
					break;
				}
			}
		}

		//TRANSFER THE ACCUMULATIVE SUM into SessionState
		for( var key in sum ) {
			_playerState["Upgrades"][key]["multiplier"] = sum[key];
		}

		console.group("Sum");
			console.log( sum );
			console.log( _playerState["Upgrades"] );
		console.groupEnd( );
	}

	function setMultiplerByName( name, value ) {
		_playerState["Upgrades"][name]["multiplier"] = value;
	}


	//remove this function when it is all done.
	function getTechTree( ) {
		console.log( _playerState["TechTree"] );
	}





	/*\
	|*|================================================
	|*| GAME - SAVE/LOAD/RESET
	|*|================================================
	|M| > reset( )
	|M| > setFromSaveSlot( )
	|M| > saveSlot( )
	|M| > newSlot( ) 
	|*|================================================
	\*/
		function reset( ) {
			_storageKey 	 	= "pc-v1-tempSlot";
			_quickKey   	 	= "pc-v1-quickSlot";
			_window     	    = { current : "page1", previous : "" };
			_buyOrSell          = { current : true };
			_quantity           = { current : 1 };
			_curMsg             = -1;

			_playerState = {
				"GameTime" : {
					"seconds" : {}
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

				"WorldName" : "Name this World",

				"Achievement" : {
					1:0,	2:0,	3:0,	4:0,	5:0,	6:0,	7:0,	8:0,	9:0,	10:0
				}
			};

			console.clear( );
		}

		function setFromSaveSlot( slotID, slotData ) {
			_storageKey = slotID;
			_quickKey   = "pc-v1-quickSlot";
			_window     = { current : "page2", previous : "" };
			_curMsg     = -1;

			//==============================================
			// LOADING TIMER
			//==============================================
			let temp = new ED_Timer( );
			temp.createFromJSON( slotData["GameTime"]["seconds"] );
			_playerState["GameTime"]["seconds"] = temp;


			//==============================================
			// LOADING UPGRADES
			//==============================================
			_playerState["Upgrades"] = slotData["Upgrades"];
			upgradeToggle( );
			isUpgradeEligible( );


			//==============================================
			// LOADING STATISTICS
			//==============================================
			_playerState["Statistics"]        = slotData["Statistics"];
			_playerState["Statistics"]["PPS"] = PooClickerData.calcAllPPS( _playerState["Upgrades"] );


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
		}


		function checkAchievementSlotData( slotData ) {
			let totalChevoLength = PooClickerData.getAchievementLength( );
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
			let totalTechLength = PooClickerData.getTechTreeLength( );
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
				"GameTime" : {													
					"seconds" : _playerState["GameTime"]["seconds"].toJSON( )
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




	/*\
	|*|================================================
	|*| GAME - WINDOW
	|*|================================================
	|M| > curWindow( )
	|M| > changeStageTo( )
	|*|================================================
	\*/
		function changeStageTo( newWindow ) {
			_window.previous = _window.current;
			_window.current  = newWindow;

			if( _window.previous != "" ) {
				document.getElementById( _window.previous ).style.display = "none";
			}

			document.getElementById( _window.current ).style.display = "block";
		}

		function curWindow( ) { return _window.current; }




	/*\
	|*|================================================
	|*| GAME - TIMER
	|*|================================================
	|M| > getTimer( )
	|M| > addTimer( )
	|*|================================================
	\*/
		function getTimer( ) { return _playerState["GameTime"]["seconds"]; }
		function addTimer( ) { _playerState["GameTime"]["seconds"] = new ED_Timer( ); }




	/*\
	|*|================================================
	|*| GAME - POO STATISTIC
	|*|================================================
	|M| > addPoo( )
	|M| > subtractPoo( )
	|M| > getTotalPoo( )
	|M| > addClick( )
	|M| > getTotalClicks( )
	|M| > addPooSinceStart( )
	|M| > getPooSinceStart( )
	|M| > getPPS( )
	|M| > calcPPS( )
	|M| > getTotalUpgrade( )
	|*|================================================
	\*/
		function addPoo( quantity )      { _playerState["Statistics"]["TotalPooCollect"] += quantity; }
		function subtractPoo( quantity ) { _playerState["Statistics"]["TotalPooCollect"] -= quantity; }
		function getTotalPoo( )          { return _playerState["Statistics"]["TotalPooCollect"]; }

		function addClick( quantity )    { _playerState["Statistics"]["TotalClicksMade"] += quantity; }
		function getTotalClicks( )       { return _playerState["Statistics"]["TotalClicksMade"]; }

		function addPooSinceStart( quantity ) { _playerState["Statistics"]["TotalPooSinceStart"] += quantity; }
		function getPooSinceStart( )          { return _playerState["Statistics"]["TotalPooSinceStart"]; }
		function getPPS( )                    { return _playerState["Statistics"]["PPS"]; }
		
		function calcPPS( ) { 
			_playerState["Statistics"]["PPS"] = PooClickerData.calcAllPPS( _playerState["Upgrades"] ); 
		}

		function getTotalUpgrade( ) {
			let sum = 0;

			for( key in _playerState["Upgrades"] ) {
				sum += getLevel( key );
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

		function getNotationByValue( value ) {
			
		}


	/*\
	|*|================================================
	|*| GAME - UPGRADE STATISTIC
	|*|================================================
	|M| > getUpgradeByName( )
	|M| > getUpgradeList( )
	|M| > getLevel( )
	|M| > getMultiplierByName( )
	|M| > upgradeLevelUp( )
	|M| > upgradeLevelDown( )
	|M| > isUpgradeUnLock( )
	|M| > isUpgradePurchaseable( )
	|M| > isUpgradeEligible( )
	|M| > upgradeToggle( )
	|*|================================================
	\*/
		function getUpgradeByName( name )           { return _playerState["Upgrades"][name]; }
		function getUpgradeList( )                  { return _playerState["Upgrades"]; }
		function getLevel( name )                   { return _playerState["Upgrades"][name]["level"]; }
		function getMultiplierByName( name )        { return _playerState["Upgrades"][name]["multiplier"]; }
		function upgradeLevelUp( name, quantity )   { _playerState["Upgrades"][name]["level"] += quantity; }
		function upgradeLevelDown( name, quantity ) { _playerState["Upgrades"][name]["level"] -= quantity; }

		function isUpgradeUnLock( name ) { 
			return _playerState["Upgrades"][name]["lock"]; 
		}

		function isUpgradePurchaseable( name ) {
			let upgradeCost = PooClickerData.calcSumPrice( name, _playerState["Upgrades"][name]["level"], _quantity.current );

			if( upgradeCost <= _playerState["Statistics"]["TotalPooCollect"] ) {
				_playerState["Upgrades"][name]["upgradeable"] = true;
			} else {
				_playerState["Upgrades"][name]["upgradeable"] = false;
			}

			return _playerState["Upgrades"][name]["upgradeable"];
		}
		
		function isUpgradeEligible( ) {
			let retValue    = false;

			// CHECK IF NEXT TIRE UPGRADE IS ELIGIBLE
			PooClickerData.getAllUpgradeName( ).forEach( ( el ) => {
				if( _playerState["Upgrades"][el]["lock"] != true 
					&& _playerState["Statistics"]["TotalPooCollect"] >= ( 0.9 * PooClickerData.getUpgradeBase(el) ) ) {
					_playerState["Upgrades"][el]["lock"] = true;
					retValue = true;					
				}
			});

			// for( key in PooClickerData.upgrade ) {
			// 	if( _playerState["Upgrades"][key]["lock"] != true 
			// 		&& _playerState["Statistics"]["TotalPooCollect"] >= ( 0.9 * PooClickerData.getUpgradeBase(key) ) ) {
			// 		_playerState["Upgrades"][key]["lock"] = true;
			// 		retValue = true;
			// 	}
			// }

			return retValue;
		}

		function upgradeToggle( ) {
			for( key in _playerState["Upgrades"] ) {
				isUpgradePurchaseable( key );
			}
		}


	

	/*\
	|*|================================================
	|*| GAME - PURCHASE CONTROL
	|*|================================================
	|M| > buyOrSell( )
	|M| > getBuyOrSell( )
	|M| > setBuyOrSellQuantity( )
	|M| > getBuyOrSellQuantity( )
	|*|================================================
	\*/
		function buyOrSell( state ) 			{ _buyOrSell.current = state; }
		function getBuyOrSell( )    			{ return _buyOrSell.current; }

		function setBuyOrSellQuantity( num ) 	{ _quantity.current = num; }
		function getBuyOrSellQuantity( ) 		{ return _quantity.current; }
	







	/*\
	|*|================================================
	|*| GAME - DEBUGGING
	|*|================================================
	|M| > debug( )
	|*|================================================
	\*/
	function debug( ) {
		console.groupCollapsed( "Session State Condition" );
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
				console.log( "Seconds: "                   + _playerState["GameTime"]["seconds"] );
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
	let AppSessionStateAPI = {
		//========================
		// GAME - SAVE/LOAD/RESET
		//========================
		reset    : reset,
		makeGame : setFromSaveSlot,
		saveSlot : saveSlot,
		newSlot  : newSlot,
		savePlayerState : savePlayerState,


		//========================
		// GAME - WINDOW
		//========================
		getCurWindow   : curWindow,
		changeStageTo  : changeStageTo,


		//========================
		// GAME - TIMER
		//========================
		getTimer    : getTimer,
		addTimer    : addTimer,


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
		getUpgradeByName      : getUpgradeByName,
		getUpgradeList	      : getUpgradeList,
		getLevel       	      : getLevel,
		getMultiplierByName   : getMultiplierByName,
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
		getAllLockedTech : getAllLockedTech,
		setTechPurchased : setTechPurchased,
		calcTechPPSBonus : calcTechPPSBonus,

		
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


		//==========================
		// GAME - CALCULATIONS
		//==========================
		calcPooPerClick      : calcPooPerClick,


		//========================
		// GAME - DEBUGGING
		//========================
		debug         : debug,
		_hackPooCount : _hackPooCount
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