//=======================================================
// SessionState
// Keeps track of the play's overall progression.
//
// Information currently holds.
//		1 - Current window that a player is at.
//		2 - Character Data
//=======================================================
var SessionState  = new AppSessionState( );
var EventRegistry = new AppEventRegistry( );
var SaveData      = new ED_SaveState( );

//=======================================================
// EndlessDungeon.js
// Entire Game Object that contains everything about the
// game.
//=======================================================
function EndlessDungeon( ) {
	ED_Stage_Setup( );
}


function ED( dataRequest, option ) {
	let GameData = {
		nameList : ["Frankie", "Johnny", "Matthew", "Jessica", "Gandulf"]
	};

	let upgradeList = {
		"Shovel" : { "factor" : 0.20, "base" : 100 },
		"Baby"   : { "factor" : 0.20, "base" : 500 }
	};

	let Data = {
		randomName : function( ) {
			let index = Math.floor( Math.random( ) * GameData["nameList"].length );
			return GameData["nameList"][index];
		},

		upgradeItem : function( item ) {
			return upgradeList[item];
		}
	}

	switch( dataRequest ) {
		case "randomName":
			return Data[dataRequest]( );
		break;

		case "upgradeItem":
			//return Data[dataRequest]( option );
			return upgradeList;
		break;

		default:
			console.warn( "Parameter '" + dataRequest + "' does not exist" );
			return "no good";
		break;
	}	
}