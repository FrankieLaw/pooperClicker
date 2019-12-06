function AchievementData( ) {
    //==============================================================================
	// const Achievements
	//		List of all the achivements that you can have in the game.
	//==============================================================================	
	const achievement = {
		1 : { "title" : "Try it First Hand", 	"desc" : "Who could've done this horrible deed?!", 												"sprite" : "chevo1.png",			"require" : { "Hand" : 1   } },
		2 : { "title" : "Who Gives a Poo", 		"desc" : "People simply do whatever they want and they don't really care.", 					"sprite" : "chevo2.png",			"require" : { "Hand" : 10  } },
		3 : { "title" : "Back Handed", 			"desc" : "I just cleaned this spot, now there is twice as much poo?!.", 						"sprite" : "chevo3.png",			"require" : { "Hand" : 25  } },
		4 : { "title" : "Sleight of Hand", 		"desc" : "It looks like there is only 1 piece of poo, but there are actually hundreds!", 		"sprite" : "chevo4.png",			"require" : { "Hand" : 50  } },
		5 : { "title" : "Filthy Hand", 			"desc" : "You really outdone yourself in this world. Someone gotta do the dirty work right?", 	"sprite" : "chevo5.png",			"require" : { "Hand" : 100 } },

		6 : { "title" : "Ya Dig?",   			"desc" : "I am digging the smell of poo", 														"sprite" : "chevo6.png", 			"require" : { "Shovel" : 1   } },
		7 : { "title" : "Dig right in~",   		"desc" : "Yea know you want them poo", 															"sprite" : "chevo7.png", 			"require" : { "Shovel" : 10  } },
		8 : { "title" : "What's the scoop?",   	"desc" : "Spreading the news how wonderfully happy you are looking for poo.", 					"sprite" : "chevo8.png", 			"require" : { "Shovel" : 25  } },
		9 : { "title" : "Define Muck",   		"desc" : "Dictionary meaning now defines muck as poo since all we think about is poo.", 		"sprite" : "chevo9.png", 			"require" : { "Shovel" : 50  } },
	   10 : { "title" : "Dig Deep",   			"desc" : "There is no depth in the world that would satisfy human curiosity about poo.", 		"sprite" : "chevo10.png", 			"require" : { "Shovel" : 100 } },

	   11 : { "title" : "Yea Baby!",   			"desc" : "Let us all welcome baby Thomas!!", 													"sprite" : "chevo11.png", 			"require" : { "Baby" : 1   } },
	   12 : { "title" : "I am born to Poo",   	"desc" : "It feels like this is all I am doing, cleaning poo.", 								"sprite" : "chevo12.png", 			"require" : { "Baby" : 10  } },
	   13 : { "title" : "Day Care Center",   	"desc" : "There is never enough babies in one room - Ka$hing -", 								"sprite" : "chevo13.png", 			"require" : { "Baby" : 25  } },
	   14 : { "title" : "Growing Pain",   		"desc" : "My children have this problem... he likes to throw poo around...", 					"sprite" : "chevo14.png", 			"require" : { "Baby" : 50  } },
	   15 : { "title" : "Baby keeps giving",   	"desc" : "Baby's poo is a gift that keeps on giving.", 											"sprite" : "chevo15.png", 			"require" : { "Baby" : 100 } },

	   16 : { "title" : "Poo Happens", 			"desc" : "Something fell on my face, I wonder what it is?", 									"sprite" : "chevo16.png",			"require" : { "TotalPoo"    : 1       } },
	   17 : { "title" : "Brave Soul",  			"desc" : "Let's clean up this world.", 															"sprite" : "chevo17.png", 			"require" : { "TotalPoo"    : 1.000e7 } }
	};

	Object.freeze( achievement );

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
							let totalPoo = $ST.getTotalPoo( );
							if( totalPoo < chevoObj["TotalPoo"]) { chevoEligible = false; }
						break;

						case "Click":
							let totalClick = $ST.getTotalClicks( );
							if( totalClick < chevoObj["Click"] ) { chevoEligible = false; }
						break;

						case "Hand":
							let handLevel  = $ST.getUpgradeLevel( "Hand" );
							if( handLevel < chevoObj["Hand"] ) { chevoEligible = false; }
						break;

						case "Baby":
							let babyLevel  = $ST.getUpgradeLevel( "Baby" );
							if( babyLevel < chevoObj["Baby"] ) { chevoEligible = false; }
						break;

						case "Shovel":
							let shovelLevel  = $ST.getUpgradeLevel( "Shovel" );
							if( shovelLevel < chevoObj["Shovel"] ) { chevoEligible = false; }
						break;

						default:
							chevoEligible = false;
						break;
					}
				});

				//IF ALL THE REQUIREMENT IS MEET, UNLOCK THE ACHIEVEMENT
				//POP UP ALL THE ACHIEVEMENT FOR THE PLAYER TO SEE
				if( chevoEligible ) { 
					$ST.setAchievementById( chevoId, 1 );
					retValue.push( chevoId ); 
				}
			}
		}
		return retValue;
	}


	function getAllChevoId( ) {
		return Object.keys( achievement );
	}

	//===================================================================
	// selectAllChevoByProperty
	// 	SPECIFICALLY PICK PROPERTIES FROM GAME DATA
	//===================================================================
	function selectAllChevoByProperty( ...prop ) {
		let record = {};

		getAllChevoId( ).forEach( (element) => {
			record[element] = {};

			prop.forEach( (_p) => {
				record[element][_p] = achievement[element][_p];
			});
		});

		return record;
	}

    return {
        getAchievementById,
        getAchievementReqById,
        getAchievementTitleById,
        getAchievementDescById,
        getAchievementLength,

        checkAchievement,
        getAllChevoId,

        selectAllChevoByProperty
    };
}