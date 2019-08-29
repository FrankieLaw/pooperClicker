//=======================================================
// SessionState
// Keeps track of the play's overall progression.
//
// Information currently holds.
//		1 - Current window that a player is at.
//		2 - Character Data
//=======================================================
var SessionState    = new AppSessionState( );
var EventRegistry   = new AppEventRegistry( );
var SaveData        = new App_SaveState( );

const PooClickerData  	= new GameData( );

//=======================================================
// EndlessDungeon.js
// Entire Game Object that contains everything about the
// game.
//=======================================================
function EndlessDungeon( ) {
	ED_Stage_Setup( );

	
	//=============================
	// DOCUMENTATION CONTROLS
	//=============================
	devNoteControlSetup( );
}


function devNoteControlSetup( ) {
	document.getElementById( "devNoteToggle" ).addEventListener( "click", function( ) {
		document.getElementById( "devNote" ).style.display = "block";
	});

	document.getElementById( "closeDevNote" ).addEventListener( "click", function( ) {
		var devNote = document.getElementById( "devNote" );

		devNote.scrollTop = 0;
		devNote.style.display = "none";
	});
}


/*\
|*|=====================================================================
|*| [GameData Object]
|*| 	Hard Code Game Data for PooperClicker
|*| 	Contains all the upgrades, screen activity information.
|*|
|*| Change this section if you want the game
|*| to run a little different.  This is use for
|*| tweeking game mechanics and fun factor of the
|*| game.
|*|=====================================================================
\*/
	function GameData( ) {


	/*\
	|*|=======================================================================
	|*| const upgrade
	|*|		Describes all the upgrades that is purchasable in the game.
	|*|
	|*| Factor - Percentage that price will increase with each upgrade.
	|*| Base   - Base price for an upgrade
	|*| PPS    - Poo per second that an upgrade will accumulate in levels.
	|*| Refund - Percentage of poo return if an upgrade were to be sold.
	|*|=======================================================================
	\*/
		const upgrade = {
			"Hand"         : { "name" : "Hand",        "factor" : 0.10, "base" :     15,   "PPS" :   0.00,  "refund" : 0.80 },
			"Shovel"       : { "name" : "Shovel",      "factor" : 0.20, "base" :    100,   "PPS" :   0.10,	"refund" : 0.20 },
			"Baby"         : { "name" : "Baby",        "factor" : 0.20, "base" :   2500,   "PPS" :   1.00,	"refund" : 0.20 },
			"Animal Farm"  : { "name" : "Animal Farm", "factor" : 0.20, "base" :  12000,   "PPS" :   3.00,	"refund" : 0.20 },
			"Toilet"       : { "name" : "Toilet",      "factor" : 0.20, "base" :  75000,   "PPS" :  14.00,	"refund" : 0.20 }
		};


		function getUpgradeByName( name ) { return upgrade[name]; }
		function getUpgradeFactor( name ) { return upgrade[name]["factor"]; }
		function getUpgradeBase( name )   { return upgrade[name]["base"]; }
		function getUpgradePPS( name )    { return upgrade[name]["PPS"]; }
		function getUpgradeRefund( name ) { return upgrade[name]["refund"]; }


		/*\
		|*|===================================================================
		|*| Method		: calcPrice( name, level )
		|*| Description : Calculate the current price of a particular upgrade
		|*|				  based on the level that the player currently 
		|*|				  accumulated.
		|*|
		|*| Parameters  :
		|*| 	@name 	: Upgrade Name [Shovel, Baby, Animal Farm ...]
		|*|	    @level  : Current level of the upgrade from SessionState
		|*|===================================================================
		\*/ 
			function calcPrice( name, level ) {
				return Math.round( Math.pow( 1 + getUpgradeFactor(name), level ) * getUpgradeBase(name) );
			}


		/*\
		|*|===================================================================
		|*| Method		: calcAllPPS( sessionStateUpgradeList )
		|*| Description : Calculate [Poop Per Second] based on accumulative
		|*|				  upgrade purchased inside SessionState.
		|*|
		|*| Parameters  :
		|*| 	@sessionStateUpgradeList : SessionState upgradeList {Obj}
		|*|===================================================================
		\*/ 
			function calcAllPPS( sessionStateUpgradeList ) {
				let totalPPS = 0.0;

				for( key in sessionStateUpgradeList ) {
					totalPPS += ( sessionStateUpgradeList[key]["level"] * getUpgradePPS( key ) ) * ( 1 + sessionStateUpgradeList[key]["multiplier"] );
				}

				return totalPPS;
			}


		/*\
		|*|===================================================================
		|*| Method		: calcSumPrice( name, curLevel, increment )
		|*| Description : Calculate the total purchase cost for an upgrade.
		|*|				  This method can also calculate the sum of multi-level
		|*|				  upgrade. For example: Purchase 10x of Shovel
		|*|
		|*| Parameters  :
		|*| 	@name   	: Upgrade name [Shovel, Baby, Animal Farm...]
		|*|		@curLevel	: The current level of an upgrade based on
		|*|					  SessionState
		|*| 	@increment	: How many level increase will it be.
		|*|===================================================================
		\*/ 
			function calcSumPrice( name, curLevel, increment ) {
				let sum = 0;

				for( var i = 0; i < increment; i++ ) {
					sum += calcPrice( name, curLevel + i );
				}
				
				return sum;
			}


		/*\
		|*|===================================================================
		|*| Method		: calcSellPrice( name, curLevel, decrement )
		|*| Description : Calculate the total refund of an upgrade.
		|*|			      This method can also refund the sum of multi-level
		|*|				  upgrade.  For example: Sell 10x of Shovel
		|*|
		|*| Parameters  :
		|*| 	@name   	: Upgrade name [Shovel, Baby, Animal Farm...]
		|*|		@curLevel	: The current level of an upgrade based on
		|*|					  SessionState
		|*| 	@increment	: How many level decrease will it be.
		|*|===================================================================
		\*/ 
			function calcSellPrice( name, curLevel, decrement ) {
				let sum = 0;

				//========================================================
				// IF REQUESTED SELL AMOUNT IS LARGER THAN CURRENT LEVEL
				// THEN USE CURRENT LEVEL AND SELL EVERYTHING
				//========================================================
				if( decrement > curLevel ) {
					for( var i = 1; i <= curLevel; i++ ) {
						sum += calcPrice( name, i ) * upgrade[name]["refund"];
					}
				} 

				//============================================================
				// OTHERWISE SELL QUANTITY BASED ON SELECTION 1x | 10x | 100x
				//============================================================
				else {
					for( var i = 0; i < decrement; i++ ) {
						sum += calcPrice( name, curLevel - i ) * upgrade[name]["refund"];
					}
				}

				return Math.round( sum );
			}



	/*\
	|*|==============================================================================
	|*| const upgradeTabs
	|*|		A structural way of organizing the panels within the game without
	|*|		the need to use DOM to track all my panels in the game.
	|*|
	|*|		Data Type: 		Array
	|*|		Value: 			[Element ID]
	|*| 		upgradeTab 		- Tab that contains all the upgrades - Shovel - Baby - etc
	|*| 		techTab    		- Not implemented yet will contain tech tree to enhance game experience.
	|*| 		statisticTab    - Hows all the fun facts about your current run of the game.
	|*| 		aboutchievementTab  - Not implemented yet.
	|*|==============================================================================
	\*/
		const upgradeTabs = ["upgradeTab", "techTab", "statisticTab", "achievementTab"];

		function getUpgradeTabs( ) { return upgradeTabs; }



	/*\
	|*|==============================================================================
	|*| const quantity
	|*|		Controls the the quantity of upgrade that a player can purchase.
	|*|		There is an option to sell the upgrade as well.
	|*|		1x (Default) | 10x | 100x
	|*|
	|*|		Data Type: 	Array
	|*|		Values: 	[Element ID]
	|*|==============================================================================
	\*/	
		const quantity    = ["1x", "10x", "100x"];

		function getQuantity( )    { return quantity; }


	/*\
	|*|==============================================================================
	|*| const techTree
	|*|		Holds all the tech upgrades for each upgrade.
	|*|
	|*|		Data Type: 	Object
	|*|		Values: 	Upgrade Object
	|*|
	|*|		require 	Required level to unlock
	|*|		multiplier  Poo Per SEcond Multiplier
	|*|==============================================================================
	\*/	
		const techTree = {
			1 : { 
				"owner"      : "Shovel",
				"title"      : "Dig It",
				"require"    : { "Shovel" : 15 }, 
				"multiplier" : 1.00,
				"cost"		 : 150,
				"sprite"	 : "shovelTech1.png"
			},


			2 : { 
				"owner"      : "Shovel",
				"title"      : "Dig It 2",
				"require"    : { "Shovel" : 25 },
				"multiplier" : 1.00,
				"cost"		 : 500,
				"sprite"	 : "shovelTech2.png"
			},

			3 : { 
				"owner"      : "Shovel",
				"title"      : "Dig It 3",
				"require"    : { "Shovel" : 35 },
				"multiplier" : 1.00,
				"cost"		 : 15000,
				"sprite"	 : "shovelTech3.png"
			},

			4 : { 
				"owner"      : "Baby",
				"title"      : "Yea Baby!",
				"require"    : { "Baby" : 15 },
				"multiplier" : 1.00,
				"cost"		 : 150,
				"sprite"	 : "babyTech1.png"
			},

			5 : { 
				"owner"      : "Baby",
				"title"      : "Yea Baby!",
				"require"    : { "Baby" : 25 },
				"multiplier" : 1.00,
				"cost"		 : 150,
				"sprite"	 : "babyTech2.png"
			},

			6 : { 
				"owner"      : "Baby",
				"title"      : "Yea Baby!",
				"require"    : { "Baby" : 35 },
				"multiplier" : 1.00,
				"cost"		 : 150,
				"sprite"	 : "babyTech3.png"
			}
		};

		function getTechTree( ) 			{ return techTree; }
		function getTechById( id )		    { return techTree[id]; }
		function getTechRequirement( id )   { return techTree[id]["require"]; }
		function getTechMultiplier( id )    { return techTree[id]["multiplier"]; }
		function getTechCost( id ) 			{ return techTree[id]["cost"]; }
		function getTechSprite( id )		{ return techTree[id]["sprite"]; }

		//This will check a single tech requirement based on ID
		//The SessionStateTechId will know 
		function isTechEligible( sessionStateUpgrade, sessionStateTechId ) {
			let retValue = true; 	//Tech is default upgrade, please give logical reason for not.
			let tech     = getTechById( sessionStateTechId );

			for( key in tech["require"] ) {
				let sessionLevel = sessionStateUpgrade[key]["level"];	//Get SessionState Upgrade Level
				let requireLevel = tech["require"][key];				//Get required techTree levelf

				if( sessionLevel < requireLevel ) {
					retValue = false;
					break;
				}
			}

			return retValue;	//If all requirement is met, it will return true
		}


		/*\
		|*|===================================================================
		|*| Method		: getPurchasbleTechTreeUpgrade( ) 
		|*| Description : get All the TechTree upgrade that passes
		|*|				  purchase requirement.  This is done by comparing
		|*|				  SessionState._playerState["TechTree"] with 
		|*|				  GameData._techTree.
		|*|
		|*| Return Type  : Array of Keys
		|*|				   Keys inserted within the array have passed the
		|*|				   test.  It can be use to process and dynamically
		|*|				   add techIcons.
		|*|===================================================================
		\*/ 
		function getPurchasbleTechTreeUpgrade( ) {
			let retValue = [];

			//GET ALL LOCKED TECH FROM THE PLAYER
			let sessionStatTech = SessionState.getAllLockedTech( );

			//CHECK EACH LOCKED TECH TO SEE WHICH IS PURCHASABLE
			for( var key in sessionStatTech ) {
				if( isTechEligible( SessionState.getUpgradeList( ), key ) ) {
					retValue.push( key );
				}
			}

			return retValue;
		}




		const message = {
			1 : { "quote" : "The world is becoming shit. That's all there is to it", 					"require" : { "Hand" :  0               } },
			2 : { "quote" : "It all began with a unique scent of foul smell",        					"require" : { "Hand" :  0               } },
			3 : { "quote" : "Poo beginning to emerge - reported by fellow humans",   					"require" : { "Hand" :  0               } },
			4 : { "quote" : "Rumor have been spreading that human is made to pick up poo",   			"require" : { "Hand" : 10, "Baby" :  10 } },
			5 : { "quote" : "Rumor is spread that a mysterious person is responsible for the poo",   	"require" : { "Hand" : 10, "Baby" : 100 } },
		}

		function getMessageID( id ) 		 { return message[ id ]; }
		function getMessageQuoteById( id )   { return message[ id ][ "quote" ]; }
		function getMessageRequireById( id ) { return message[ id ][ "require"]; }
		function getMessageLength( ) 		 { return Object.keys( message ).length; }

		function getMessageBoardUpdate( ) {
			for( var id in message ) {
				if( checkRequirement( SessionState.getUpgradeList( ), getMessageRequireById( id ) ) ) {
					SessionState.addRandomMessage( message[id]["quote"] );
				}
			}
		}

		function checkRequirement( sessionStateUpgrades, requirement ) {
			let retValue = true;	//Prove it wrong

			//GET EVERY SINGLE TOOLS INSIDE THE REQUIRMENT
			for( var tool in requirement ) {
				let curLevel = SessionState.getLevel( tool );

				if( curLevel < requirement[tool] ) { retValue = false; }
			}

			return retValue;
		}


		return {
			upgrade        : upgrade,
			calcPrice      : calcPrice,
			calcSumPrice   : calcSumPrice,
			calcSellPrice  : calcSellPrice,
			calcAllPPS     : calcAllPPS,
			getUpgradeTabs : getUpgradeTabs,
			getQuantity    : getQuantity,

			getUpgradeByName : getUpgradeByName,
			getUpgradeFactor : getUpgradeFactor,
			getUpgradeBase   : getUpgradeBase,
			getUpgradePPS    : getUpgradePPS,
			getUpgradeRefund : getUpgradeRefund,

			getTechTree   	    : getTechTree,
			getTechById	    	: getTechById,
			getTechRequirement  : getTechRequirement,
			getTechMultiplier   : getTechMultiplier,
			getTechCost         : getTechCost,
			getTechSprite       : getTechSprite,

			isTechEligible 				 : isTechEligible,
			getPurchasbleTechTreeUpgrade : getPurchasbleTechTreeUpgrade,

			getMessageBoardUpdate : getMessageBoardUpdate
		}
	}

function between( low, high ) {
	return Math.round( low + Math.random( ) * (high-low) );
}