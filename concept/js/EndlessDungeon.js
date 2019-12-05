/*\
|*| =======================================================
|*|  TODO LIST
|*| =======================================================
|*|    - CHANGE ENDLESS DUNGEON NAME
|*|	   - ADD JQUERY FEATURES
|*| =======================================================
\*/

/*\
|*| ====================================================================================
|*|  TABLE OF CONTENT - SHORTCUTS			[V]ARIABLES  ||  [F]UNCTION  ||  [D]ATA
|*| =======================================================
|*|    [V] - GLOBAL VARIABLES					
|*|
|*|	   [F] - MAIN
|*|	   [F] - devNoteControlSetup
|*|
|*|    [D] - GAMEDATA
|*| =======================================================
\*/





/*\
|*| =======================================================
|*|  GLOBAL VARIABLES - REQUIRED
|*| =======================================================
\*/
	var   SessionState    = new AppSessionState( );		//PLAYER'S CURRENT STATE
	var   SaveData        = new App_SaveState( );		//ACCESS TO SAVE/LOAD
	const PooClickerData  = new GameData( );

	var   EventRegistry   = new AppEventRegistry( );
/*\
\*/



/*\
|*| =======================================================
|*|  MAIN - START OF THE PROGRAM
|*| =======================================================
\*/
	function EndlessDungeon( ) {
		ED_Stage_Setup( );

		devNoteControlSetup( );		// DOCUMENTATION CONTROLS
	}
/*\
\*/



/*\
|*| =======================================================
|*|  FUNCTION 	devNoteControlSetup
|*|  TOGGLE DEVELOPMENT PAGE
|*| =======================================================
\*/
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
\*/




/*\
|*|=====================================================================
|*| GAMEDATA
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
			"Hand"         : { "name" : "Hand",        "factor" : 0.25, "base" :     15,   "PPS" :   0.00,  "refund" : 0.80 },
			"Shovel"       : { "name" : "Shovel",      "factor" : 0.20, "base" :    100,   "PPS" :   0.10,	"refund" : 0.20 },
			"Baby"         : { "name" : "Baby",        "factor" : 0.20, "base" :   1200,   "PPS" :   1.00,	"refund" : 0.20 },
			"Animal Farm"  : { "name" : "Animal Farm", "factor" : 0.20, "base" :  17000,   "PPS" :   3.00,	"refund" : 0.20 },
			"Toilet"       : { "name" : "Toilet",      "factor" : 0.20, "base" :  65000,   "PPS" :  14.00,	"refund" : 0.20 }
		};


		/*\
		|*|=======================================================================
		|*| UPGRADE - SEARCH METHODS
		|*|=======================================================================
		\*/
			function getUpgradeByName( name ) { return upgrade[name]; }				//RETRIEVE ALL INFORMATION ABOUT AN UPGRADE
			function getUpgradeFactor( name ) { return upgrade[name]["factor"]; } 	//RETRIEVE AN UPGRADE'S FACTOR ONLY
			function getUpgradeBase( name )   { return upgrade[name]["base"]; }		//RETRIEVE AN UPGRADE'S BASE COST ONLY
			function getUpgradePPS( name )    { return upgrade[name]["PPS"]; }		//RETRIEVE AN UPGRADE'S PPS ONLY
			function getUpgradeRefund( name ) { return upgrade[name]["refund"]; }	//RETRIEVE AN UPGRADE'S REFUND PERCENTAGE ONLY
			function getAllUpgradeName( )     { return Object.keys( upgrade );	}

			/*\
			|*|===================================================================
			|*| selectAllUpgradeByProperty
			|*| 	SPECIFICALLY PICK PROPERTIES FROM GAME DATA
			|*|===================================================================
			\*/
				function selectAllUpgradeByProperty( ...prop ) {
					let record = {};

					getAllUpgradeName( ).forEach( (element) => {
						record[element] = {};

						prop.forEach( (_p) => {
							record[element][_p] = upgrade[element][_p];
						});
					});

					return record;
				}
			/*\
			\*/
		/*\
		\*/


		/*\
		|*|=======================================================================
		|*| UPGRADE - CALCULATION METHODS
		|*|=======================================================================
		\*/
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
			\*/



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
			\*/



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

					for( let i = 0; i < increment; i++ ) {
						sum += calcPrice( name, curLevel + i );
					}
					
					return sum;
				}
			/*\
			\*/



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
							sum += calcPrice( name, i ) * getUpgradeRefund( name );
						}
					} 

					//============================================================
					// OTHERWISE SELL QUANTITY BASED ON SELECTION 1x | 10x | 100x
					//============================================================
					else {
						for( var i = 0; i < decrement; i++ ) {
							sum += calcPrice( name, curLevel - i ) * getUpgradeRefund( name );
						}
					}

					return Math.round( sum );
				}
			/*\
			\*/
		/*\
		\*/
	/*\
	\*/



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
	\*/



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

		function getQuantity( ) { return quantity; }
	/*\
	\*/



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
	|*|		change SessionState LOAD/RESET/HeroState
	|*|==============================================================================
	\*/	
		const techTree = {
		    1 : { "owner" : "Hand",			"title" : "Handy Handy",			"desc" : "- Clean them poo up with both your hands and twice as fast please. -",																		"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 1500,					"sprite" : "handTech1.png",			"require" : { "Hand" : 10  } },
		    2 : { "owner" : "Hand",			"title" : "All Hands on Deck",		"desc" : "- Embracing your destiny from here on out as professional janitor.  Better get ready. -",														"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 5000,					"sprite" : "handTech2.png",			"require" : { "Hand" : 20  } },
		    3 : { "owner" : "Hand",			"title" : "Dabby Hand",				"desc" : "- You're the only expert on this land, better be proud. -",																					"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 2.500e4,				"sprite" : "handTech3.png",			"require" : { "Hand" : 30  } },
		    4 : { "owner" : "Hand",			"title" : "Gimme a Hand",			"desc" : "- Pleading for help cleaning up other people's poo? Not many people will say yes, but a man gotta try. -",									"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 2.000e5,				"sprite" : "chevoIcon-04.png",		"require" : { "Hand" : 40  } },
		    5 : { "owner" : "Hand",			"title" : "It Goes Hand to Hand",	"desc" : "- Are you having fun playing with this?  Please say you are, I worked very hard to get this far. -",											"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 1.400e6,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 50  } },
		    6 : { "owner" : "Hand",			"title" : "Common Hand",			"desc" : "- You have inspired others around you and rewarded you with an identical hand to help pick up more poo, but they won't come help -",			"effect" : "Hand Multiplier +100.0",		"multiplier" : 100.00,		"cost" : 5.000e6,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 51  } },
		    7 : { "owner" : "Hand",			"title" : "A Helping Hand",			"desc" : "- Some compliments came through that says \"you are doing a great job\" althought you knew it was poo. -",									"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 2.000e7,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 60  } },
		    8 : { "owner" : "Hand",			"title" : "A Guiding Hand",			"desc" : "- Fellow animals walked by and you saw it as a sign of guidance but it turned out you are lead to poo. -",									"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 2.100e8,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 70  } },
		    9 : { "owner" : "Hand",			"title" : "The Upper Hand",			"desc" : "- You're finally catching on... You did right?  All these messages isn't as random as you think. -",											"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 1.300e9,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 80  } },
		   10 : { "owner" : "Hand",			"title" : "Get those Hand Dirty",	"desc" : "- Trying to figure out what these messages mean?  You're gonna have to get your hands dirty because that's a lot of poos to dig up. -",		"effect" : "Hand Multiplier +3.0",			"multiplier" :   3.00,		"cost" : 1.200e10,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 90  } },
		   11 : { "owner" : "Hand",			"title" : "The Holding of Hand",	"desc" : "- New martial art technique to help you pick up poo faster, it turns out that you smoosh them in your hand and poo multiplies. -",			"effect" : "Hand Multiplier +3.0",			"multiplier" :   3.00,		"cost" : 2.000e11,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 100 } },


		   12 : { "owner" : "Shovel",		"title" : "A Wooden Shovel",		"desc" : "- Not much of a shovel.  Just a piece of wood so you don't have to use your hands. -",														"effect" : "Shovel Multiplier +1.0",		"multiplier" :   1.00,		"cost" : 1500,					"sprite" : "shovelTech1.png",		"require" : { "Shovel" : 10  } },
		   13 : { "owner" : "Shovel",		"title" : "A Garden Shovel",		"desc" : "- Improvement from the wooden shovel.  It doesn't make a mess on you. -",																		"effect" : "Shovel Multiplier +1.0",		"multiplier" :   1.00,		"cost" : 9500,					"sprite" : "shovelTech2.png",		"require" : { "Shovel" : 20  } },
		   14 : { "owner" : "Shovel",		"title" : "Scoop Shovel",			"desc" : "- That's a load of poo you're going to shovel with that... -",																				"effect" : "Shovel Multiplier +1.0",		"multiplier" :   1.00,		"cost" : 5.900e4,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 30  } },
		   15 : { "owner" : "Shovel",		"title" : "MultiGrip Shovel",		"desc" : "- Sturdier handing, solid steel head, flexible handling, and state of the art all wheel drive.  Can't go wrong with that. -",					"effect" : "Shovel Multiplier +1.0",		"multiplier" :   1.00,		"cost" : 3.650e5,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 40  } },
		   16 : { "owner" : "Shovel",		"title" : "Trench Shovel",			"desc" : "- Poo had became so popular that fights break out in neighborhoods and nations is discussing how to secure this precious resources. -",		"effect" : "Shovel Multiplier +2.0",		"multiplier" :   2.00,		"cost" : 2.260e6,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 50  } },
		   17 : { "owner" : "Shovel",		"title" : "Power Shovel",			"desc" : "- Business recongized the necessity of owning a shovel, a shovel that can dig 10 feet deep. - ",												"effect" : "Shovel Multiplier +100.0",		"multiplier" : 100.00,		"cost" : 2.710e6,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 51  } },
		   18 : { "owner" : "Shovel",		"title" : "Flat Head Shovel",		"desc" : "- We don&apos;t want the poo to be deformed when you scoop them up, gently lay them on your shovel flat. -",									"effect" : "Shovel Multiplier +2.0",		"multiplier" :   2.00,		"cost" : 1.400e7,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 60  } },
		   19 : { "owner" : "Shovel",		"title" : "Edging Shovel",			"desc" : "- Gradually chipping off the lands for poo. -",																								"effect" : "Shovel Multiplier +2.0",		"multiplier" :   2.00,		"cost" : 8.600e7,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 70  } },
		   20 : { "owner" : "Shovel",		"title" : "Square Head Shovel",		"desc" : "- Shovel come in all shape and size.  Size is the most important part. Ka! Ching! -",															"effect" : "Shovel Multiplier +2.0",		"multiplier" :   2.00,		"cost" : 5.370e8,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 80  } },
		   21 : { "owner" : "Shovel",		"title" : "Pointy Shovel",			"desc" : "- School demanded shovels that is children friendly with speed and hostility. -",																"effect" : "Shovel Multiplier +3.0",		"multiplier" :   3.00,		"cost" : 3.300e9,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 90  } },
		   22 : { "owner" : "Shovel",		"title" : "Round Shovel",			"desc" : "- Not practical for use on land, but who said anything about digging the land?  We can find poos in waters too... -",							"effect" : "Shovel Multiplier +3.0",		"multiplier" :   3.00,		"cost" : 2.000e10,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 100 } },


		   23 : { "owner" : "Baby",			"title" : "Yea Baby!",				"desc" : "- Automatic 'Poo' Generator every minute of the day. Can't wait for them to grow up. -",														"effect" : "Baby Multiplier +1.0", 			"multiplier" :   1.00, 		"cost" : 1.800e4, 				"sprite" : "babyTech1.png", 		"require" : { "Baby" : 10  } },
		   24 : { "owner" : "Baby", 		"title" : "Eat Baby~~", 			"desc" : "- Got the baby to eat the veges, and the clean up is twices as bad. -", 																		"effect" : "Baby Multiplier +1.0", 			"multiplier" :   1.00, 		"cost" : 1.140e5, 				"sprite" : "babyTech2.png", 		"require" : { "Baby" : 20  } },
		   25 : { "owner" : "Baby", 		"title" : "Potty Pooper", 			"desc" : "- The babies is starting to have intelligence of their own, disturbing you every minute of the day. But we still love them. -",				"effect" : "Baby Multiplier +1.0", 			"multiplier" :   1.00, 		"cost" : 7.080e5, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 30  } },
		   26 : { "owner" : "Baby", 		"title" : "Meconium", 				"desc" : "- This is not what anyone would expect, but do expect them, is part of the job. -",															"effect" : "Baby Multiplier +1.0", 			"multiplier" :   1.00, 		"cost" : 4.400e6, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 40  } },
		   27 : { "owner" : "Baby", 		"title" : "Poopy Bottle", 			"desc" : "- Perfect tool to feed the baby, it reminds the parent that they are working for poo. -",														"effect" : "Baby Multiplier +2.0", 			"multiplier" :   2.00, 		"cost" : 2.720e7, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 50  } },
		   28 : { "owner" : "Baby", 		"title" : "Formula One", 			"desc" : "- Want the highest dosage of poo production? Feed them the Formula One baby powder, 0 - 60 in 1.42 seconds. -",								"effect" : "Baby Multiplier +100.0", 		"multiplier" : 100.00, 		"cost" : 3.250e7, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 51  } },
		   29 : { "owner" : "Baby", 		"title" : "XL Diapers", 			"desc" : "- Every household wish they can use this on their baby. -",																					"effect" : "Baby Multiplier +2.0", 			"multiplier" :   2.00, 		"cost" : 1.700e8, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 60  } },
		   30 : { "owner" : "Baby", 		"title" : "Vitamine ABC", 			"desc" : "- Start them young and get them on the habit of eating lots and lots of protein, is for the future. -",										"effect" : "Baby Multiplier +2.0", 			"multiplier" :   2.00, 		"cost" : 1.050e9, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 70  } },
		   31 : { "owner" : "Baby", 		"title" : "Baby Proteins", 			"desc" : "- A healthy diet is everything for the baby, especially if you want the poo. -",																"effect" : "Baby Multiplier +2.0", 			"multiplier" :   2.00, 		"cost" : 6.450e9, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 80  } },
		   32 : { "owner" : "Baby", 		"title" : "Potty Training", 		"desc" : "- Baby poo 13 times a day, if we help them work those muscles we can bump that up to 33 times a day. -",										"effect" : "Baby Multiplier +3.0", 			"multiplier" :   3.00, 		"cost" : 4.000e10, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 90  } },
		   33 : { "owner" : "Baby", 		"title" : "The name is Johnson", 	"desc" : "- Families worldwide is so excited for the their new baby pooping that they forgot to name them. -",											"effect" : "Baby Multiplier +3.0", 			"multiplier" :   3.00, 		"cost" : 2.500e11, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 100 } }

		//NEED TO UPDATE SESSION STATE
		//NEED TO UPDATE RESET
		//NEED TO UPDATE LOAD
		};


		/*\
		|*|=======================================================================
		|*| TECHTREE - SEARCH METHODS
		|*|=======================================================================
		\*/
			function getTechTreeLength( )       { return Object.keys( techTree ).length; }
			function getAllTechId( ) 			{ return Object.keys( techTree );	}

			function getTechTree( ) 			{ return techTree; }
			function getTechById( id )		    { return techTree[id]; }
			function getTechRequirement( id )   { return techTree[id]["require"]; }
			function getTechMultiplier( id )    { return techTree[id]["multiplier"]; }
			function getTechCost( id ) 			{ return techTree[id]["cost"]; }
			function getTechSprite( id )		{ return techTree[id]["sprite"]; }


			/*\
			|*|===================================================================
			|*| selectAllTechByProperty
			|*| 	SPECIFICALLY PICK PROPERTIES FROM GAME DATA
			|*|===================================================================
			\*/
				function selectAllTechByProperty( ...prop ) {
					let record = {};

					getAllTechId( ).forEach( (element) => {
						record[element] = {};

						prop.forEach( (_p) => {
							record[element][_p] = techTree[element][_p];
						});
					});

					return record;
				}
			/*\
			\*/
		/*\
		\*/



		/*\
		|*|=======================================================================
		|*| TECHTREE - VALIDATION METHODS
		|*|=======================================================================
		\*/

			/*\
			|*|=======================================================================
			|*| isTechEligible
			|*|		CHECK IF YOUR CURRENT UPGRADE LEVEL IS ELIGIBLE FOR UPGRADE
			|*|=======================================================================
			\*/
				function isTechEligible( ST_Upgrade, ST_TechID ) {
					let retValue = true; 	//Tech is default upgrade, please give logical reason for not.
					let techReq  = getTechRequirement( ST_TechID );

					for( key in techReq ) {
						let sessionLevel = ST_Upgrade[key]["level"];
						let requireLevel = techReq[key];

						if( sessionLevel < requireLevel ) {
							retValue = false;
							break;
						}
					}

					return retValue;	//If all requirement is met, it will return true	
				}
			/*\
			\*/



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
			/*\
			\*/
		/*\
		\*/
	/*\
	\*/



	/*\
	|*|==============================================================================
	|*| const message
	|*|		Random Message act as a storyboard that tells a story about the world
	|*|
	|*|		Data Type: 	Object
	|*|		Values: 	Message Object
	|*|==============================================================================
	\*/	
		const message = {
			1 : { "quote" : "I smell something funny on my hand...", 													"require" : { "Hand" :   0 } },
			2 : { "quote" : "Poo is beginning to emerge - reported by fellow humans",		        					"require" : { "Hand" :   0 } },
			3 : { "quote" : "I feel the urge to clean this up but I smeared it everywhere.",   							"require" : { "Hand" :   2 } },
			4 : { "quote" : "Rumor have been spreading that people is pooping at random places.",   					"require" : { "Hand" :  10 } },
			5 : { "quote" : "My kid found a dead plant but it turns out that it is only covered in poo.",   			"require" : { "Hand" :  20 } },
			6 : { "quote" : "Rumor is spreading that a mysterious person is responsible for the poo.",      			"require" : { "Hand" :  30 } },
			7 : { "quote" : "I looked into the distant land and saw that it is brown.",      							"require" : { "Hand" :  40 } },
			8 : { "quote" : "Animals have keen sense of smell and they don't like the smell of poo.",      				"require" : { "Hand" :  50 } },
			9 : { "quote" : "Researchers have found that the earth is turning into poo.",      	            			"require" : { "Hand" :  60 } },
		   10 : { "quote" : "Architecture discovered that building with poo makes a building sturdier.",    			"require" : { "Hand" :  70 } },
		   11 : { "quote" : "Government is declaring that poo will soon be the new currency.",      	    			"require" : { "Hand" :  80 } },
		   12 : { "quote" : "Science research made a breakthrough in turning silver into poo.",      	    			"require" : { "Hand" :  90 } },
		   13 : { "quote" : "Citizen reported that they are funnelling poo into the rivers, turning fish to poo.",      "require" : { "Hand" : 100 } }
		}

		/*\
		|*|==============================================================================
		|*| MESSAGE - SEACH METHODS
		|*|==============================================================================
		\*/	
			function getMessageID( id ) 		 { return message[ id ]; }
			function getMessageQuoteById( id )   { return message[ id ][ "quote" ]; }
			function getMessageRequireById( id ) { return message[ id ][ "require"]; }
			function getMessageLength( ) 		 { return Object.keys( message ).length; }
			function getAllMessageID( ) 		 { return Object.keys( message ); }

			function getMessageBoardUpdate( ) {
				SessionState.resetStoryBoard( );

				for( var id in message ) {
					if( checkRequirement( SessionState.getUpgradeList( ), getMessageRequireById( id ) ) ) {
						SessionState.addRandomMessage( message[id]["quote"] );
					}
				}
			}
		/*\
		\*/



		/*\
		|*|==============================================================================
		|*| MESSAGE - VALIDATION METHODS
		|*|==============================================================================
		\*/	
			function checkRequirement( sessionStateUpgrades, requirement ) {
				let retValue = true;	//Prove it wrong

				//GET EVERY SINGLE TOOLS INSIDE THE REQUIRMENT
				for( var tool in requirement ) {
					let curLevel = SessionState.getLevel( tool );

					if( curLevel < requirement[tool] ) { retValue = false; }
				}

				return retValue;
			}
		/*\
		\*/
	/*\
	\*/



	/*\
	|*|==============================================================================
	|*| const Achievements
	|*|		List of all the achivements that you can have in the game.
	|*|==============================================================================
	\*/	
		const achievement = {
		    1 : { "title" : "Try it First Hand", 	"desc" : "Who could've done this horrible deed?!", 												"sprite" : "shovelTech1.png",		"require" : { "Hand" : 1   } },
		    2 : { "title" : "Who Gives a Poo", 		"desc" : "People simply do whatever they want and they don't really care.", 					"sprite" : "shovelTech1.png",		"require" : { "Hand" : 10  } },
		    3 : { "title" : "Back Handed", 			"desc" : "I just cleaned this spot, now there is twice as much poo?!.", 						"sprite" : "shovelTech1.png",		"require" : { "Hand" : 25  } },
		    4 : { "title" : "Sleight of Hand", 		"desc" : "It looks like there is only 1 piece of poo, but there are actually hundreds!", 		"sprite" : "shovelTech1.png",		"require" : { "Hand" : 50  } },
		    5 : { "title" : "Filthy Hand", 			"desc" : "You really outdone yourself in this world. Someone gotta do the dirty work right?", 	"sprite" : "shovelTech1.png",		"require" : { "Hand" : 100 } },

		    6 : { "title" : "Poo Happens", 			"desc" : "Who could've done this horrible deed?!", 												"sprite" : "shovelTech1.png",		"require" : { "TotalPoo"    : 1             } },
		    7 : { "title" : "Brave Soul",  			"desc" : "Let's clean up this world.", 															"sprite" : "shovelTech2.png", 		"require" : { "TotalPoo"    : 1000000       } },
		    8 : { "title" : "Yea Baby!",   			"desc" : "Let us all welcome baby Thomas.", 													"sprite" : "babyTech1.png", 		"require" : { "Baby"        : 100, "Hand" : 1 } },
		    9 : { "title" : "Yea Baby!",   			"desc" : "Let us all welcome baby Thomas.", 													"sprite" : "babyTech1.png", 		"require" : { "Baby"        : 200, "Hand" : 1 } },
		   10 : { "title" : "Yea Baby!",   			"desc" : "Let us all welcome baby Thomas.", 													"sprite" : "babyTech1.png", 		"require" : { "Baby"        : 300, "Hand" : 1 } }
		};


		function getAchievementById( id )      { return achievement[ id ]; }
		function getAchievementReqById( id )   { return achievement[ id ]["require"]; }
		function getAchievementTitleById( id ) { return achievement[ id ]["title"]; }
		function getAchievementDescById( id )  { return achievement[ id ]["desc"];  }
		function getAchievementLength( )       { return Object.keys( achievement ).length; }

		function checkAchievement( currentAchievement ) {
			let retValue   = [];	//RETURNs WHICH ACHIEVEMENT HAD BEEN UNLOCKED
			
			for( chevoId in currentAchievement ) {
				if( currentAchievement[ chevoId ] == 0 ) {
					//FIND ALL THE ACHIEVEMENTS THAT IS LOCKED
					//IF IT IS LOCKED, CHECK TO SEE IF IT IS ELIGIBLE FOR UNLOCK
					let chevoEligible = true;	//FIND THE FIRST REQUIREMENT FALSE

					//LOOP THROUGH ALL THE ACHIEVEMENT IN THE DATABASE
					let chevoObj    = getAchievementReqById( chevoId );		// 1 : { "TotalPoo" : 1 }
					let requirement = Object.keys( chevoObj );

					requirement.forEach( function( element ) {
						switch( element ) {
							case "TotalPoo":
								let totalPoo = SessionState.getTotalPoo( );
								if( totalPoo < chevoObj["TotalPoo"]) { chevoEligible = false; }
							break;

							case "Click":
								let totalClick = SessionState.getTotalClicks( );
								if( totalClick < chevoObj["Click"] ) { chevoEligible = false; }
							break;

							case "Baby":
								let babyLevel  = SessionState.getLevel( "Baby" );
								if( babyLevel < chevoObj["Baby"] ) { chevoEligible = false; }
							break;

							case "Hand":
								let handLevel  = SessionState.getLevel( "Hand" );
								if( handLevel < chevoObj["Hand"] ) { chevoEligible = false; }
							break;

							default:
								chevoEligible = false;
							break;
						}
					});

					//IF ALL THE REQUIREMENT IS MEET, UNLOCK THE ACHIEVEMENT
					//POP UP ALL THE ACHIEVEMENT FOR THE PLAYER TO SEE
					if( chevoEligible ) { 
						SessionState.setAchievementById( chevoId, 1 );
						retValue.push( chevoId ); 
					}
				}
			}
			return retValue;
		}
	/*\
	\*/



	/*\
	|*|==============================================================================
	|*| RETURN
	|*|		return a series of methods that is allow to be publically access.
	|*|==============================================================================
	\*/	
		return {
			//==========================================
			// UPGRADES 										NEW - UPDATED CODE IS HERE
			//==========================================
			upgrade        				: upgrade,						// require delete when it is live

			getUpgradeByName 			: getUpgradeByName,
			getUpgradeFactor 			: getUpgradeFactor,
			getUpgradeBase   			: getUpgradeBase,
			getUpgradePPS    			: getUpgradePPS,
			getUpgradeRefund 			: getUpgradeRefund,
			getAllUpgradeName  			: getAllUpgradeName,

			selectAllUpgradeByProperty 	: selectAllUpgradeByProperty,

			calcPrice      				: calcPrice,
			calcSumPrice   				: calcSumPrice,
			calcSellPrice  				: calcSellPrice,
			calcAllPPS     				: calcAllPPS,



			//==========================================
			// TECH TREE
			//==========================================
			getTechTree   	   			 : getTechTree,					// require delete when it is live

			getTechTreeLength   		 : getTechTreeLength,
			getTechById	    			 : getTechById,
			getTechRequirement  		 : getTechRequirement,
			getTechMultiplier   		 : getTechMultiplier,
			getTechCost         		 : getTechCost,
			getTechSprite       		 : getTechSprite,
			getAllTechId				 : getAllTechId,
			
			selectAllTechByProperty		 : selectAllTechByProperty,

			isTechEligible 				 : isTechEligible,
			getPurchasbleTechTreeUpgrade : getPurchasbleTechTreeUpgrade,
			


			//==========================================
			// MISC
			//==========================================
			getUpgradeTabs : getUpgradeTabs,
			getQuantity    : getQuantity,


			//==========================================
			// MESSAGE BOARD
			//==========================================
			getMessageBoardUpdate : getMessageBoardUpdate,


			//==========================================
			// ACHIEVEMENTS
			//==========================================
			checkAchievement   		: checkAchievement,
			getAchievementById 		: getAchievementById,
			getAchievementLength 	: getAchievementLength
		};
	/*\
	\*/
	}
/*\
\*/





				




















var GameUtility = new GameUtilityAPI( );
function GameUtilityAPI( ) {
	//==================================================
	// RANDOMLY GRAB A NUMBER BETWEEN A RANGE
	//==================================================
	function between( low, high ) {
		return Math.round( low + Math.random( ) * (high-low) );
	}


	//==================================================
	// METHOD:
	//		getNotationWord( numArray )
	//
	// DESCRIPTION:
	//		CONVERT NUMBER TO HUMAN READABLE NUMBERS
	//		This method decides the exponential notation in word.
	//
	// PARAMETER:  		Data Type 		Description
	// 		@num			Number			A Number that represents the total 3 block
	//										group a number has.
	//
	// RETURN TYPE:
	//		String 			"BILLION"
	//
	// FOR EXAMPLE: 1,236,956
	//		1.236 MILLION
	//==================================================
	function getNotationWord( num ) {
		if( num > 35 ) {
			return "POOGOL";
		}

		let notation = {
			3  : "MILLION",
			4  : "BILLION",
			5  : "TRILLION",
			6  : "QUADRILLION",
			7  : "QUINTILLION",
			8  : "SEXTILLION",
			9  : "SEPTILLION",
			10 : "OCTILLION",
			11 : "NONILLION",
			12 : "DECILLION",
			13 : "UNDECILLION",
			14 : "DUODECILLION",
			15 : "TREDECILLION",
			16 : "QUATTUORDECILLION",
			17 : "QUINDECILLION",
			18 : "SEXDECILLION",
			19 : "SEPTEMDECILLION",
			20 : "OCTODECILLION",
			21 : "NOVEMDECILLION",
			22 : "VIGINTILLION",
			23 : "UNVIGINTILLION",
			24 : "DUOVIGINTILLION",
			25 : "TREVIGINTILLION",
			26 : "QUATTUORVIGINTILLION",
			27 : "QUINVIGINTILLION",
			28 : "SEXVIGINTILLION",
			29 : "SEPTVIGINTILLION",
			30 : "OCTOVIGINTILILLION",
			31 : "NONVIGINTILLION",
			32 : "TRIGINTILLION",
			33 : "UNTRIGINTILLION",
			34 : "DUOTRIGINTILLION",
			35 : "GOOGOL",
		};
		return notation[num];
	}


	//==================================================
	// CONVERT NUMBER TO HUMAN READABLE NUMBERS
	// FOR EXAMPLE: 1,236,956
	//		1.236 MILLION
	//
	// Parameter  		DataType
	// @textNumber		Text
	//==================================================
	function useExpNotation( num ) {
		let sNum 	 = num;
		let retValue = "";

		if( !Arithmetic.isValid( String( num ) ) ) {
			sNum = Arithmetic.expandENotation( String( num ) );
		}

		let numberArray = convertExponential( String( sNum ) ).split(",");		// [1] [000] [000] [000]

		//ANYTHING LESS THAN A MILLION WILL NOT GET CONVERTED
		if( numberArray.length <= 2 ) { return numberArray + ""; } 

		else {
			return (numberArray[0] + "." + numberArray[1] + " " + getNotationWord( numberArray.length ));
		}
	}

	function newNotation( num ) {
		let sNum = Arithmetic.expandENotation( String( num ) );
		return useExpNotation( sNum );
	}

	//==================================================
	// METHOD:
	//		convertExponential( text )
	//
	// 		THIS IS A SUPPORT FUNCTION ONLY
	//		NOT MEANT TO BE USE OUTSIDE OF THIS API
	//
	// DESCRIPTION:
	//		Convert a string of number into 3 block exponential sections.
	//
	// PARAMETER  		Data Type 		Description
	// 		@text			String			A Number that is represented by a string
	//
	// RETURN TYPE:
	//		ARAAY 		[1] [123] [456]
	//==================================================
	function convertExponential( text ) {
		let p1 = getSign( text );					//GET POSITIVE OR NEGATIVE
		let s1 = splitNumber( removeSign( text ) );	//REMOVE ALL THE SIGNS + - ,

		let maxLength = 0;
		let retValue  = [];

			s1[0] = removeLeadingZero( s1[0] );

		//================================================
		// CHECK IF THE NUMBER STRING IS ALL ZERO
		// THIS INCLUDES THE WHOLE & DECIMAL PART
		//================================================
		if( s1.length == 2 ) {
			// CHECK IF THE INPUT IS ALREADY 0
			if( isZero( s1[0] ) && isZero( s1[1] ) ) { return "0"; }
		}

		// ELSE TREAT IT AS A WHOLE NUMBER
		// CHECK IF THE INPUT IS ALREADY 0
		else {
			if( isZero( s1[0] ) ) { return "0"; }
		}

		// CONTINUE PARSING FOR EXPONENTIAL VALUE
		s1[0]        = removeLeadingZero( s1[0] );	//REMOVE ALL LEADING ZEROS
		maxLength    = s1[0].length;				//HOW MANY DIGITS?


		//================================================
		// SEPARATE THE NUMBERS BY 3 DIGITS INTO AN ARRAY
		//================================================
		do {
			if( maxLength >= 3 ) {
				retValue.unshift( s1[0].substr( maxLength - 3, 3 ) );
				maxLength -= 3;

			} else {
				retValue.unshift( s1[0].substr( 0, maxLength ) );
				maxLength = 0;

			}
		} while( maxLength != 0 );

		s1[0] = retValue;

		return p1 + s1.join( "." );
	}

	//==================================================
	// ERASE ALL LEADING 0 FROM A NUMBER STRING
	//
	// PARAMETER  		Data Type 		Description
	// 		@string			String			A Number that is represented by a string
	//										Must accept an string that have no [+] or [-]
	//
	// CASE STUDIES					RESULTS
	//		00156234					156234
	//==================================================
	function removeLeadingZero( string ) {
		let p1 = getSign( string );
		let s1 = splitNumber( removeSign( string ) );

		let i  = 0;
		while( s1[0].charAt(i) == "0" ) { i++; }

		s1[0] = ( i == s1[0].length ) ? "0" : ( s1[0].substr(i, s1[0].length - i ) );

		return p1 + s1.join( "." );
	}

	//FIND OUT IF A NUMBER IS POSITIVE OR A NEGATIVE
	function getSign( string ) {
		return string.charAt(0) == "-" ? "-" : "";
	}

	//REPLACE + - AND , PUNCTUATION FROM A NUMBER STRING
	function removeSign( string ) {
		return string.replace( /[+\-,]/g, "" );
	}

	//SEPARATE WHOLE NUMBER FROM DECIMAL NUMBER
	function splitNumber( string ) {
		return string.split(".");
	}

	//FIND OUT WHERE THE DECIMAL PLACE IS
	//REQUIRE ALL NUMERICAL PUNCTUATION REMOVED FIRST
	function getDecimalPlace( string ) {
		let d1 = splitNumber( string );

		return ( d1.length == 2 ) ? d1[1].length : 0;
	}

	//CHECK IF A NUMBER STRING IS ALL 0
	function isZero( string ) {
		let retValue = true;

		//  0   1   2   3   4   5   6   7   8   9   
		//[48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
		for( var i = 0; i < string.length; i++ ) {
			if( string.charCodeAt(i) >= 49 && string.charCodeAt(i) <= 57 ) {
				retValue = false;
				break;
			}
		}

		return retValue;
	}

	//CLEAN UP THE STRING TO ITS ENTIRETY
	//REMOVE POSITIVE & NEGATIVE & COMMAS (+ - ,)
	//REMOVE LEADING ZEROS
	function cleanUp( string ) {
		return removeLeadingZero( removeSign( string == undefined ? "0" : string ) );
	}




	return {
		//RANDOM GENERATOR METHODS
		between : between,

		//NUMBER STRING CONVERSION
		useExpNotation     : useExpNotation,
		newNotation        : newNotation
	};
}