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
			"Hand"         : { "name" : "Hand",        "factor" : 0.25, "base" :     15,   "PPS" :   0.00,  "refund" : 0.80 },
			"Shovel"       : { "name" : "Shovel",      "factor" : 0.20, "base" :    100,   "PPS" :   0.10,	"refund" : 0.20 },
			"Baby"         : { "name" : "Baby",        "factor" : 0.20, "base" :   1200,   "PPS" :   1.00,	"refund" : 0.20 },
			"Animal Farm"  : { "name" : "Animal Farm", "factor" : 0.20, "base" :  17000,   "PPS" :   3.00,	"refund" : 0.20 },
			"Toilet"       : { "name" : "Toilet",      "factor" : 0.20, "base" :  65000,   "PPS" :  14.00,	"refund" : 0.20 }
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
	|*|		change SessionState LOAD/RESET/HeroState
	|*|==============================================================================
	\*/	
		const techTree = {
		    1 : { "owner" : "Hand",			"title" : "Handy Handy",			"desc" : "- Clean them poo up with both your hands and twice as fast please. -",																		"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 1500,					"sprite" : "shovelTech1.png",		"require" : { "Hand" : 10  } },
		    2 : { "owner" : "Hand",			"title" : "All Hands on Deck",		"desc" : "- Embracing your destiny from here on out as professional janitor.  Better get ready. -",														"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 5000,					"sprite" : "shovelTech1.png",		"require" : { "Hand" : 20  } },
		    3 : { "owner" : "Hand",			"title" : "Dabby Hand",				"desc" : "- You're the only expert on this land, better be proud. -",																					"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 25000,					"sprite" : "shovelTech1.png",		"require" : { "Hand" : 30  } },
		    4 : { "owner" : "Hand",			"title" : "Gimme a Hand",			"desc" : "- Pleading for help cleaning up other people's poo? Not many people will say yes, but a man gotta try. -",									"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 200000,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 40  } },
		    5 : { "owner" : "Hand",			"title" : "It Goes Hand to Hand",	"desc" : "- Are you having fun playing with this?  Please say you are, I worked very hard to get this far. -",											"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 1400000,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 50  } },
		    6 : { "owner" : "Hand",			"title" : "Common Hand",			"desc" : "- You have inspired others around you and rewarded you with an identical hand to help pick up more poo, but they won't come help -",			"effect" : "Hand Multiplier +100.0",		"multiplier" : 100.00,		"cost" : 5000000,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 51  } },
		    7 : { "owner" : "Hand",			"title" : "A Helping Hand",			"desc" : "- Some advice came through that says \"you are doing a great job\" althought you knew it was poo. -",											"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 20000000,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 60  } },
		    8 : { "owner" : "Hand",			"title" : "A Guiding Hand",			"desc" : "- Fellow animals walked by and you saw it as a sign of guidance but it turned out you are lead to poo. -",									"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 210000000,				"sprite" : "shovelTech1.png",		"require" : { "Hand" : 70  } },
		    9 : { "owner" : "Hand",			"title" : "The Upper Hand",			"desc" : "- You're finally catching on... You did right?  All these messages isn't as random as you think. -",											"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 1300000000,			"sprite" : "shovelTech1.png",		"require" : { "Hand" : 80  } },
		   10 : { "owner" : "Hand",			"title" : "Get those Hand Dirty",	"desc" : "- Trying to figure out what these messages mean?  You're gonna have to get your hands dirty because that's a lot of poos to dig up. -",		"effect" : "Hand Multiplier +3.0",			"multiplier" :   3.00,		"cost" : 12000000000,			"sprite" : "shovelTech1.png",		"require" : { "Hand" : 90  } },
		   11 : { "owner" : "Hand",			"title" : "The Holding of Hand",	"desc" : "- New martial art technique to help you pick up poo faster, it turns out that you smoosh them in your hand and multiply. -",					"effect" : "Hand Multiplier +3.0",			"multiplier" :   3.00,		"cost" : 200000000000,			"sprite" : "shovelTech1.png",		"require" : { "Hand" : 100 } },


		   12 : { "owner" : "Shovel",		"title" : "A Wooden Shovel",		"desc" : "- Not much of a shovel.  Just a piece of wood so you don't have to use your hands. -",														"effect" : "Shovel Multiplier +1.0",		"multiplier" : 1.00,		"cost" : 1500,					"sprite" : "shovelTech1.png",		"require" : { "Shovel" : 10 } },
		   13 : { "owner" : "Shovel",		"title" : "A Garden Shovel",		"desc" : "- Improvement from the wooden shovel.  It doesn't make a mess on you. -",																		"effect" : "Shovel Multiplier +1.0",		"multiplier" : 1.00,		"cost" : 8000,					"sprite" : "shovelTech2.png",		"require" : { "Shovel" : 20 } },
		   14 : { "owner" : "Shovel",		"title" : "Scoop Shovel",			"desc" : "- That's a load of poo you're going to shovel with that... -",																				"effect" : "Shovel Multiplier +1.0",		"multiplier" : 1.00,		"cost" : 40000,					"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 30 } },


		   15 : { "owner" : "Baby",			"title" : "Yea Baby!",				"desc" : "- Automatic 'Poo' Generator every minute of the day. Can't wait for them to grow up. -",														"effect" : "Baby Multiplier +1.0", 			"multiplier" : 1.00, 		"cost" : 150, 					"sprite" : "babyTech1.png", 		"require" : { "Baby" : 10 } },
		   16 : { "owner" : "Baby", 		"title" : "Eat Baby~~", 			"desc" : "- Got the baby to eat the veges, and the clean up is twices as bad. -", 																		"effect" : "Baby Multiplier +1.0", 			"multiplier" : 1.00, 		"cost" : 3000, 					"sprite" : "babyTech2.png", 		"require" : { "Baby" : 20 } },
		   17 : { "owner" : "Baby", 		"title" : "Potty Pooper", 			"desc" : "- The babies is starting to have intelligence of their own, disturbing you every minute of the day. But we still love them. -",				"effect" : "Baby Multiplier +1.0", 			"multiplier" : 1.00, 		"cost" : 12095000000000, 		"sprite" : "babyTech3.png", 		"require" : { "Baby" : 30 } }

				
				
				
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
			2 : { "quote" : "Poo is beginning to emerge - reported by fellow humans",		        					"require" : { "Hand" :   1 } },
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

		function getMessageID( id ) 		 { return message[ id ]; }
		function getMessageQuoteById( id )   { return message[ id ][ "quote" ]; }
		function getMessageRequireById( id ) { return message[ id ][ "require"]; }
		function getMessageLength( ) 		 { return Object.keys( message ).length; }

		function getMessageBoardUpdate( ) {
			SessionState.resetStoryBoard( );

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

	/*\
	|*|==============================================================================
	|*| const Achievements
	|*|		List of all the achivements that you can have in the game.
	|*|==============================================================================
	\*/	
		const achievement = {
			1 : { "title" : "Try it First Hand", 	"desc" : "Who could've done this horrible deed?!", 												"sprite" : "shovelTech1.png",		"require" : { "Hand" : 1  } },
			2 : { "title" : "Who Gives a Poo", 		"desc" : "People simply do whatever they want and they don't really care.", 					"sprite" : "shovelTech1.png",		"require" : { "Hand" : 10 } },
			3 : { "title" : "Back Handed", 			"desc" : "I just cleaned this spot, now there is twice as much poo?!.", 						"sprite" : "shovelTech1.png",		"require" : { "Hand" : 25 } },
			4 : { "title" : "Sleight of Hand", 		"desc" : "It looks like there is only 1 piece of poo, but there are actually hundreds!", 		"sprite" : "shovelTech1.png",		"require" : { "Hand" : 50 } },
			5 : { "title" : "Filthy Hand", 			"desc" : "You really outdone yourself in this world. Someone gotta do the dirty work right?", 	"sprite" : "shovelTech1.png",		"require" : { "Hand" : 100 } },


			6 : { "title" : "Poo Happens", 			"desc" : "Who could've done this horrible deed?!", 								"sprite" : "shovelTech1.png",		"require" : { "TotalPoo"    : 1             } },
			7 : { "title" : "Brave Soul",  			"desc" : "Let's clean up this world.", 											"sprite" : "shovelTech2.png", 		"require" : { "TotalPoo"    : 1000000       } },

			8 : { "title" : "Yea Baby!",   			"desc" : "Let us all welcome baby Thomas.", 									"sprite" : "babyTech1.png", 		"require" : { "Baby"        : 1, "Hand" : 1 } }
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
	|*|==============================================================================
	|*| RETURN
	|*|		return a series of methods that is allow to be publically access.
	|*|==============================================================================
	\*/	
		return {
			upgrade        : upgrade,
			calcPrice      : calcPrice,
			calcSumPrice   : calcSumPrice,
			calcSellPrice  : calcSellPrice,
			calcAllPPS     : calcAllPPS,
			getUpgradeTabs : getUpgradeTabs,
			getQuantity    : getQuantity,

			//==========================================
			// UPGRADES
			//==========================================
			getUpgradeByName : getUpgradeByName,
			getUpgradeFactor : getUpgradeFactor,
			getUpgradeBase   : getUpgradeBase,
			getUpgradePPS    : getUpgradePPS,
			getUpgradeRefund : getUpgradeRefund,

			//==========================================
			// TECH TREE
			//==========================================
			getTechTree   	    : getTechTree,
			getTechById	    	: getTechById,
			getTechRequirement  : getTechRequirement,
			getTechMultiplier   : getTechMultiplier,
			getTechCost         : getTechCost,
			getTechSprite       : getTechSprite,

			isTechEligible 				 : isTechEligible,
			getPurchasbleTechTreeUpgrade : getPurchasbleTechTreeUpgrade,

			//==========================================
			// MESSAGE BOARD
			//==========================================
			getMessageBoardUpdate : getMessageBoardUpdate,


			//==========================================
			// ACHIEVEMENTS
			//==========================================
			checkAchievement   : checkAchievement,
			getAchievementById : getAchievementById
		};
	}






				




















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
		let numberArray = convertExponential( String( num ) ).split(",");		// [1] [000] [000] [000]
		let retValue = "";

		//ANYTHING LESS THAN A MILLION WILL NOT GET CONVERTED
		if( numberArray.length <= 2 ) { return numberArray + ""; } 

		else {
			return (numberArray[0] + "." + numberArray[1] + " " + getNotationWord( numberArray.length ));
		}
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
		useExpNotation     : useExpNotation
	};
}