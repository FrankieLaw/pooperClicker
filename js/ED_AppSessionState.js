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
	var _buyOrSell  = { current : true };						//True = Buy | False = Sell
	var _quantity   = { current : 1 };

	

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
			1:0,	2:0,	3:0,	4:0,	5:0,	6:0
		},


		//======================================================
		// Message Database
		//   Random display of messages
		//	 Message will be added as more upgrades unlocked
		//======================================================
		"StoryBoard" : { }
	}

	//GET A RANDOM MESSAGE
	function getStoryBoardLength( ) { return Object.keys( _playerState["StoryBoard"] ).length; }
	function getRandomMessage( )    { return _playerState[ "StoryBoard" ][ between( 1, getStoryBoardLength( ) ) ]; }

	function addRandomMessage( msg ) {
		let length = getStoryBoardLength( );	//Get Current Length
		length++;								//Set next length

		_playerState[ "StoryBoard" ][ length ] = msg;
	}

	//GET ALL TECH THAT IS NOT PURCHASED YET
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
			_storageKey 	 	= "tempSlot";
			_quickKey   	 	= "quickSlot";
			_window     	    = { current : "page1", previous : "" };
			_buyOrSell          = { current : true };
			_quantity           = { current : 1 };

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
					"Shovel"       : { "level" : 0, "lock" : false , "upgradeable" : false, "multiplier" : 1.0 },
					"Baby"         : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0 },
					"Animal Farm"  : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0 },
					"Toilet"       : { "level" : 0, "lock" : false, "upgradeable" : false, "multiplier" : 1.0 }
				},

				"TechTree" : {
					1:0,	2:0,	3:0,	4:0,	5:0,	6:0
				},

				"StoryBoard" : {

				}
			}

			console.clear( );
		}

		function setFromSaveSlot( slotID, slotData ) {
			_storageKey = slotID;
			_quickKey   = "quickSlot";
			_window     = { current : "page2", previous : "" };

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
			_playerState["TechTree"] = slotData["TechTree"];
		}

		function savePlayerState( ) {
			return {
				"GameTime" : {													
					"seconds" : _playerState["GameTime"]["seconds"].toJSON( )
				},

				"Statistics" : _playerState["Statistics"],
				"Upgrades"   : _playerState["Upgrades"],

				"TechTree"   : _playerState["TechTree"]
			}
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




	/*\
	|*|================================================
	|*| GAME - UPGRADE STATISTIC
	|*|================================================
	|M| > getUpgradeList( )
	|M| > getLevel( )
	|M| > getMultiplierByName( );
	|M| > upgradeLevelUp( )
	|M| > upgradeLevelDown( )
	|M| > isUpgradeUnLock( )
	|M| > isUpgradePurchaseable( )
	|M| > isUpgradeEligible( )
	|M| > upgradeToggle( )
	|*|================================================
	\*/
		function getUpgradeList( ) { return _playerState["Upgrades"]; }
		function getLevel( name )       { return _playerState["Upgrades"][name]["level"]; }
		function getMultiplierByName( name ) { return _playerState["Upgrades"][name]["multiplier"]; }
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

			//CHECK IF NEXT TIRE UPGRADE IS ELIGIBLE
			for( key in PooClickerData.upgrade ) {
				if( _playerState["Upgrades"][key]["lock"] != true 
					&& _playerState["Statistics"]["TotalPooCollect"] >= ( 0.9 * PooClickerData.getUpgradeBase(key) ) ) {
					_playerState["Upgrades"][key]["lock"] = true;
					retValue = true;
				}
			}

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
		console.group( "Session State Condition" );
			console.log( "Storage Key: " + _storageKey );
			console.log( "Quick Key: "   + _quickKey );

			console.group( "Window Page" );
				console.log( _window );
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
				console.log( _playerState["StoryBoard"] );
			console.groupEnd( );
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
		addPoo           : addPoo,
		getTotalPoo      : getTotalPoo,
		subtractPoo      : subtractPoo,
		addClick         : addClick,
		getTotalClicks   : getTotalClicks,
		addPooSinceStart : addPooSinceStart,
		getPooSinceStart : getPooSinceStart,
		getPPS 			 : getPPS,
		calcPPS          : calcPPS,
		getTotalUpgrade  : getTotalUpgrade,

		//==========================
		// GAME - UPGRADE STATISTIC
		//==========================
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

		//========================
		// GAME - DEBUGGING
		//========================
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