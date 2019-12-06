function TechData( ) {
    const techTree = {
        1 : { "owner" : "Hand",			"title" : "Handy Handy",			"desc" : "- Clean them poo up with both your hands and twice as fast please. -",																		"effect" : "Hand Ampliifer  x2.0",			"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 1500,					"sprite" : "handTech1.png",			"require" : { "Hand" : 10  } },
        2 : { "owner" : "Hand",			"title" : "All Hands on Deck",		"desc" : "- Embracing your destiny from here on out as professional janitor.  Better get ready. -",														"effect" : "Hand Amplifier  x2.0",			"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 5000,					"sprite" : "handTech2.png",			"require" : { "Hand" : 20  } },
        3 : { "owner" : "Hand",			"title" : "Dabby Hand",				"desc" : "- You're the only expert on this land, better be proud. -",																					"effect" : "Hand Ampliifer  x2.0",			"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 2.500e4,				"sprite" : "handTech3.png",			"require" : { "Hand" : 30  } },
        4 : { "owner" : "Hand",			"title" : "Gimme a Hand",			"desc" : "- Pleading for help cleaning up other people's poo? Not many people will say yes, but a man gotta try. -",									"effect" : "Hand Ampliifer  x2.0",			"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 2.000e5,				"sprite" : "handTech4.png",			"require" : { "Hand" : 40  } },
        5 : { "owner" : "Hand",			"title" : "It Goes Hand to Hand",	"desc" : "- Are you having fun playing with this?  Please say you are, I worked very hard to get this far. -",											"effect" : "Hand Ampliifer  x2.0",			"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 1.400e6,				"sprite" : "handTech5.png",			"require" : { "Hand" : 50  } },
        6 : { "owner" : "Hand",			"title" : "Common Hand",			"desc" : "- You have inspired others around you and rewarded you with an identical hand to help pick up more poo, but they won't come help -",			"effect" : "Hand Amplifier  x2.0",			"multiplier" : 	 0.00,		"amp" : 1.0, 		"cost" : 5.000e6,				"sprite" : "handTech6.png",			"require" : { "Hand" : 51  } },
        7 : { "owner" : "Hand",			"title" : "A Helping Hand",			"desc" : "- Some compliments came through that says \"you are doing a great job\" althought you knew it was poo. -",									"effect" : "Hand Ampliifer  x2.0",			"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 2.000e7,				"sprite" : "handTech7.png",			"require" : { "Hand" : 60  } },
        8 : { "owner" : "Hand",			"title" : "A Guiding Hand",			"desc" : "- Fellow animals walked by and you saw it as a sign of guidance but it turned out you are lead to poo. -",									"effect" : "Hand Ampliifer  x2.0",			"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 2.100e8,				"sprite" : "handTech8.png",			"require" : { "Hand" : 70  } },
        9 : { "owner" : "Hand",			"title" : "The Upper Hand",			"desc" : "- You're finally catching on... You did right?  All these messages isn't as random as you think. -",											"effect" : "Hand Ampliifer  x2.0",			"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 1.300e9,				"sprite" : "handTech9.png",			"require" : { "Hand" : 80  } },
       10 : { "owner" : "Hand",			"title" : "Get those Hand Dirty",	"desc" : "- Trying to figure out what these messages mean?  You're gonna have to get your hands dirty because that's a lot of poos to dig up. -",		"effect" : "Hand Ampliifer  x2.0",			"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 1.200e10,				"sprite" : "handTech10.png",		"require" : { "Hand" : 90  } },
       11 : { "owner" : "Hand",			"title" : "The Holding of Hand",	"desc" : "- New martial art technique to help you pick up poo faster, it turns out that you smoosh them in your hand and poo multiplies. -",			"effect" : "Hand Ampliifer  x2.0",			"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 2.000e11,				"sprite" : "handTech11.png",		"require" : { "Hand" : 100 } },
    
    
       12 : { "owner" : "Shovel",		"title" : "A Wooden Shovel",		"desc" : "- Not much of a shovel.  Just a piece of wood so you don't have to use your hands. -",														"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 1500,					"sprite" : "shovelTech1.png",		"require" : { "Shovel" : 10  } },
       13 : { "owner" : "Shovel",		"title" : "A Garden Shovel",		"desc" : "- Improvement from the wooden shovel.  It doesn't make a mess on you. -",																		"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 9500,					"sprite" : "shovelTech2.png",		"require" : { "Shovel" : 20  } },
       14 : { "owner" : "Shovel",		"title" : "Scoop Shovel",			"desc" : "- That's a load of poo you're going to shovel with that... -",																				"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 5.900e4,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 30  } },
       15 : { "owner" : "Shovel",		"title" : "MultiGrip Shovel",		"desc" : "- Sturdier handing, solid steel head, flexible handling, and state of the art all wheel drive.  Can't go wrong with that. -",					"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 3.650e5,				"sprite" : "shovelTech4.png",		"require" : { "Shovel" : 40  } },
       16 : { "owner" : "Shovel",		"title" : "Trench Shovel",			"desc" : "- Poo had became so popular that fights break out in neighborhoods and nations is discussing how to secure this precious resources. -",		"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 2.260e6,				"sprite" : "shovelTech5.png",		"require" : { "Shovel" : 50  } },
       17 : { "owner" : "Shovel",		"title" : "Power Shovel",			"desc" : "- Business recongized the necessity of owning a shovel, a shovel that can dig 10 feet deep. - ",												"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 2.710e6,				"sprite" : "shovelTech6.png",		"require" : { "Shovel" : 51  } },
       18 : { "owner" : "Shovel",		"title" : "Flat Head Shovel",		"desc" : "- We don&apos;t want the poo to be deformed when you scoop them up, gently lay them on your shovel flat. -",									"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 1.400e7,				"sprite" : "shovelTech7.png",		"require" : { "Shovel" : 60  } },
       19 : { "owner" : "Shovel",		"title" : "Edging Shovel",			"desc" : "- Gradually chipping off the lands for poo. -",																								"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 8.600e7,				"sprite" : "shovelTech8.png",		"require" : { "Shovel" : 70  } },
       20 : { "owner" : "Shovel",		"title" : "Square Head Shovel",		"desc" : "- Shovel come in all shape and size.  Size is the most important part. Ka! Ching! -",															"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 5.370e8,				"sprite" : "shovelTech9.png",		"require" : { "Shovel" : 80  } },
       21 : { "owner" : "Shovel",		"title" : "Pointy Shovel",			"desc" : "- School demanded shovels that is children friendly with speed and hostility. -",																"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 3.300e9,				"sprite" : "shovelTech10.png",		"require" : { "Shovel" : 90  } },
       22 : { "owner" : "Shovel",		"title" : "Round Shovel",			"desc" : "- Not practical for use on land, but who said anything about digging the land?  We can find poos in waters too... -",							"effect" : "Shovel Amplifier  x2.0",		"multiplier" :   0.00,		"amp" : 1.0, 		"cost" : 2.000e10,				"sprite" : "shovelTech11.png",		"require" : { "Shovel" : 100 } },
    
    
       23 : { "owner" : "Baby",			"title" : "Yea Baby!",				"desc" : "- Automatic 'Poo' Generator every minute of the day. Can't wait for them to grow up. -",														"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 1.800e4, 				"sprite" : "babyTech1.png", 		"require" : { "Baby" : 10  } },
       24 : { "owner" : "Baby", 		"title" : "Eat Baby~~", 			"desc" : "- Got the baby to eat the veges, and the clean up is twices as bad. -", 																		"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 1.140e5, 				"sprite" : "babyTech2.png", 		"require" : { "Baby" : 20  } },
       25 : { "owner" : "Baby", 		"title" : "Potty Pooper", 			"desc" : "- The babies is starting to have intelligence of their own, disturbing you every minute of the day. But we still love them. -",				"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 7.080e5, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 30  } },
       26 : { "owner" : "Baby", 		"title" : "Meconium", 				"desc" : "- This is not what anyone would expect, but do expect them, is part of the job. -",															"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 4.400e6, 				"sprite" : "babyTech4.png", 		"require" : { "Baby" : 40  } },
       27 : { "owner" : "Baby", 		"title" : "Poopy Bottle", 			"desc" : "- Perfect tool to feed the baby, it reminds the parent that they are working for poo. -",														"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 2.720e7, 				"sprite" : "babyTech5.png", 		"require" : { "Baby" : 50  } },
       28 : { "owner" : "Baby", 		"title" : "Formula One", 			"desc" : "- Want the highest dosage of poo production? Feed them the Formula One baby powder, 0 - 60 in 1.42 seconds. -",								"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 3.250e7, 				"sprite" : "babyTech6.png", 		"require" : { "Baby" : 51  } },
       29 : { "owner" : "Baby", 		"title" : "XL Diapers", 			"desc" : "- Every household wish they can use this on their baby. -",																					"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 1.700e8, 				"sprite" : "babyTech7.png", 		"require" : { "Baby" : 60  } },
       30 : { "owner" : "Baby", 		"title" : "Vitamine ABC", 			"desc" : "- Start them young and get them on the habit of eating lots and lots of protein, is for the future. -",										"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 1.050e9, 				"sprite" : "babyTech8.png", 		"require" : { "Baby" : 70  } },
       31 : { "owner" : "Baby", 		"title" : "Baby Proteins", 			"desc" : "- A healthy diet is everything for the baby, especially if you want the poo. -",																"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 6.450e9, 				"sprite" : "babyTech9.png", 		"require" : { "Baby" : 80  } },
       32 : { "owner" : "Baby", 		"title" : "Potty Training", 		"desc" : "- Baby poo 13 times a day, if we help them work those muscles we can bump that up to 33 times a day. -",										"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 4.000e10, 				"sprite" : "babyTech10.png", 		"require" : { "Baby" : 90  } },
       33 : { "owner" : "Baby", 		"title" : "The name is Johnson", 	"desc" : "- Families worldwide is so excited for the their new baby pooping that they forgot to name them. -",											"effect" : "Baby Amplifier  x2.0", 			"multiplier" :   0.00, 		"amp" : 1.0, 		"cost" : 2.500e11, 				"sprite" : "babyTech11.png", 		"require" : { "Baby" : 100 } }
    
    //NEED TO UPDATE SESSION STATE
    //NEED TO UPDATE RESET
    //NEED TO UPDATE LOAD
    };
    
    Object.freeze( techTree );
    
    //=======================================================================
    // TECHTREE - SEARCH METHODS
    //=======================================================================
    function getTechTreeLength( )       { return Object.keys( techTree ).length; }
    function getAllTechId( ) 			{ return Object.keys( techTree );	}

    function getTechTree( ) 			{ return techTree; }
    function getTechById( id )		    { return techTree[id]; }
    function getTechRequirement( id )   { return techTree[id]["require"]; }
    function getTechMultiplier( id )    { return techTree[id]["multiplier"]; }
    function getTechCost( id ) 			{ return techTree[id]["cost"]; }
    function getTechSprite( id )		{ return techTree[id]["sprite"]; }



    //===================================================================
    // selectAllTechByProperty
    // 	SPECIFICALLY PICK PROPERTIES FROM GAME DATA
    //===================================================================
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
    
    
    //=======================================================================
    // isTechEligible
    //		CHECK IF YOUR CURRENT UPGRADE LEVEL IS ELIGIBLE FOR UPGRADE
    //=======================================================================
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

    //===================================================================
    // Method		: getPurchasbleTechTreeUpgrade( ) 
    // Description : get All the TechTree upgrade that passes
    //				  purchase requirement.  This is done by comparing
    //				  $ST._playerState["TechTree"] with 
    //				  GameData._techTree.
    //
    // Return Type  : Array of Keys
    //				   Keys inserted within the array have passed the
    //				   test.  It can be use to process and dynamically
    //				   add techIcons.
    //===================================================================
    function getPurchasbleTechTreeUpgrade( ) {
        let retValue = [];

        //GET ALL LOCKED TECH FROM THE PLAYER
        let sessionStatTech = $ST.getAllLockedTech( );

        //CHECK EACH LOCKED TECH TO SEE WHICH IS PURCHASABLE
        for( let key in sessionStatTech ) {
            if( isTechEligible( $ST.getUpgradeList( ), key ) ) {
                retValue.push( key );
            }
        }

        return retValue;
    }


    return {
        getTechTree,

        getTechTreeLength,
        getTechById,
        getTechRequirement,
        getTechMultiplier,
        getTechCost,
        getTechSprite,
        getAllTechId,
        getPurchasbleTechTreeUpgrade,

        selectAllTechByProperty,

        isTechEligible
    }
}