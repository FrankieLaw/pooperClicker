function UpgradeData( ) {
    const upgrade = {
        "Hand"         : { "name" : "Hand",        "factor" : 0.25, "base" :     15,   "PPS" :   0.00,  "refund" : 0.80,	"shop" : "handOpen32x32.png"   },
        "Shovel"       : { "name" : "Shovel",      "factor" : 0.20, "base" :    100,   "PPS" :   0.10,	"refund" : 0.20,	"shop" : "shovel32x32.png"     },
        "Baby"         : { "name" : "Baby",        "factor" : 0.20, "base" :   1200,   "PPS" :   1.00,	"refund" : 0.20,	"shop" : "baby32x32.png"       },
        "Animal Farm"  : { "name" : "Animal Farm", "factor" : 0.20, "base" :  17000,   "PPS" :   3.00,	"refund" : 0.20,	"shop" : "moomoofarm32x32.png" },
        "Toilet"       : { "name" : "Toilet",      "factor" : 0.20, "base" :  65000,   "PPS" :  14.00,	"refund" : 0.20,	"shop" : "toilet32x32.png"     }
    };
    Object.freeze( upgrade );
    
    
    //=======================================================================
    // UPGRADE - SEARCH METHODS
    //=======================================================================
    function getUpgradeByName( name ) { return upgrade[name]; }				//RETRIEVE ALL INFORMATION ABOUT AN UPGRADE
    function getUpgradeFactor( name ) { return upgrade[name]["factor"]; } 	//RETRIEVE AN UPGRADE'S FACTOR ONLY
    function getUpgradeBase( name )   { return upgrade[name]["base"]; }		//RETRIEVE AN UPGRADE'S BASE COST ONLY
    function getUpgradePPS( name )    { return upgrade[name]["PPS"]; }		//RETRIEVE AN UPGRADE'S PPS ONLY
    function getUpgradeRefund( name ) { return upgrade[name]["refund"]; }	//RETRIEVE AN UPGRADE'S REFUND PERCENTAGE ONLY
    function getUpgradeShop( name )   { return upgrade[name]["shop"]; }
    function getAllUpgradeName( )     { return Object.keys( upgrade );	}
    
    
    //===================================================================
    // selectAllUpgradeByProperty
    // 	SPECIFICALLY PICK PROPERTIES FROM GAME DATA
    //===================================================================
    function selectAllUpgradeByProperties( ...prop ) {
        let record = {};
    
        getAllUpgradeName( ).forEach( (element) => {
            record[element] = {};
    
            prop.forEach( (_p) => {
                record[element][_p] = upgrade[element][_p];
            });
        });
    
        return record;
    }
    
    
    //===================================================================
    // Method		: calcPrice( name, level )
    // Description : Calculate the current price of a particular upgrade
    //				  based on the level that the player currently 
    //				  accumulated.
    //
    // Parameters  :
    // 	@name 	: Upgrade Name [Shovel, Baby, Animal Farm ...]
    //	    @level  : Current level of the upgrade from SessionState
    //===================================================================
    function calcPrice( name, level ) {
        return Math.round( Math.pow( 1 + getUpgradeFactor(name), level ) * getUpgradeBase(name) );
    }
    
    
    //===================================================================
    // Method		: calcAllPPS( sessionStateUpgradeList )
    // Description : Calculate [Poop Per Second] based on accumulative
    //				  upgrade purchased inside $ST.
    //
    // Parameters  :
    // 	@sessionStateUpgradeList : SessionState upgradeList {Obj}
    //===================================================================
    function calcAllPPS( ) {
        //CALCULATE ALL TECH MULTIPLIER AGAIN
        calcTechMultiplier( );
        return $ST.calcAllTotalPPS( );
    
        function calcTechMultiplier( ) {
            let result = {};
    
            //INITIAL ALL THE UPGRADE BY NAME WITH MULTIPLIER OF 0.0
            Object.keys( $ST.getUpgradeList( ) ).map( (el) => {
                return result[el] = { "m" : 1.0, "a" : 0.0 };
            });
    
            //GET ALL UNLOCKED TECH FROM $ST
            const techUnlocked = Object.keys( $ST.getTechTree( ) ).filter( ( id ) => {
                return $ST.getTechById( id ) === 1;
            });
    
            //GET MULTIPLIER & AMPLIFIER FROM GAMEDATA
            techUnlocked.forEach( ( id ) => {
                const { owner, multiplier, amp } = $PC.getTechById( id );
    
                result[owner].m += multiplier;
                result[owner].a += amp;
            });
    
            //CALCULATE THE FINAL MULTIPLIER
            Object.keys( result ).forEach( (key) => {
                $ST.setMultiplierByName( key, result[key].m * ( Math.pow( 2, result[key].a ) ) );
            });
        }
    }
    
    
    //===================================================================
    // Method		: calcSumPrice( name, curLevel, increment )
    // Description : Calculate the total purchase cost for an upgrade.
    //				  This method can also calculate the sum of multi-level
    //				  upgrade. For example: Purchase 10x of Shovel
    //
    // Parameters  :
    // 	@name   	: Upgrade name [Shovel, Baby, Animal Farm...]
    //		@curLevel	: The current level of an upgrade based on
    //					  SessionState
    // 	@increment	: How many level increase will it be.
    //===================================================================
    function calcSumPrice( name, curLevel, increment ) {
        let sum = 0;
    
        for( let i = 0; i < increment; i++ ) {
            sum += calcPrice( name, curLevel + i );
        }
        
        return sum;
    }
    
    
    //===================================================================
    // Method		: calcSellPrice( name, curLevel, decrement )
    // Description : Calculate the total refund of an upgrade.
    //			      This method can also refund the sum of multi-level
    //				  upgrade.  For example: Sell 10x of Shovel
    //
    // Parameters  :
    // 	@name   	: Upgrade name [Shovel, Baby, Animal Farm...]
    //		@curLevel	: The current level of an upgrade based on
    //					  SessionState
    // 	@increment	: How many level decrease will it be.
    //===================================================================
    function calcSellPrice( name, curLevel, decrement ) {
        let sum = 0;
    
        //========================================================
        // IF REQUESTED SELL AMOUNT IS LARGER THAN CURRENT LEVEL
        // THEN USE CURRENT LEVEL AND SELL EVERYTHING
        //========================================================
        if( decrement > curLevel ) {
            for( let i = 1; i <= curLevel; i++ ) {
                sum += calcPrice( name, i ) * getUpgradeRefund( name );
            }
        } 
    
        //============================================================
        // OTHERWISE SELL QUANTITY BASED ON SELECTION 1x | 10x | 100x
        //============================================================
        else {
            for( let i = 0; i < decrement; i++ ) {
                sum += calcPrice( name, curLevel - i ) * getUpgradeRefund( name );
            }
        }
    
        return Math.round( sum );
    }


    return {
        getUpgradeByName,
        getUpgradeFactor,
        getUpgradeBase,
        getUpgradePPS,
        getUpgradeRefund,
        getUpgradeShop,
        getAllUpgradeName,

        selectAllUpgradeByProperties,
        calcPrice,
        calcAllPPS,
        calcSumPrice,
        calcSellPrice
    };
}