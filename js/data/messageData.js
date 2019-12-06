function MessageData( ) {
    //==============================================================================
	// const message
	//		Random Message act as a storyboard that tells a story about the world
	//
	//		Data Type: 	Object
	//		Values: 	Message Object
	//==============================================================================	
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

	Object.freeze( message );

	//==============================================================================
	// MESSAGE - SEACH METHODS
	//==============================================================================
    function getMessageID( id ) 		 { return message[ id ]; }
    function getMessageQuoteById( id )   { return message[ id ][ "quote" ]; }
    function getMessageRequireById( id ) { return message[ id ][ "require"]; }
    function getMessageLength( ) 		 { return Object.keys( message ).length; }
    function getAllMessageID( ) 		 { return Object.keys( message ); }

    function getMessageBoardUpdate( ) {
        $ST.resetStoryBoard( );

        for( let id in message ) {
            if( checkRequirement( $ST.getUpgradeList( ), getMessageRequireById( id ) ) ) {
                $ST.addRandomMessage( message[id]["quote"] );
            }
        }
    }

	//==============================================================================
	// MESSAGE - VALIDATION METHODS
	//==============================================================================
    function checkRequirement( requirement ) {
        let retValue = true;	//Prove it wrong

        //GET EVERY SINGLE TOOLS INSIDE THE REQUIRMENT
        for( let tool in requirement ) {
            let curLevel = $ST.getUpgradeLevel( tool );

            if( curLevel < requirement[tool] ) { retValue = false; }
        }

        return retValue;
    }

    return {
        getMessageID,
        getMessageQuoteById,
        getMessageRequireById,
        getMessageLength,
        getAllMessageID,

        getMessageBoardUpdate
    };
}