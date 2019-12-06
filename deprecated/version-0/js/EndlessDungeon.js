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

const UpgradeData   = new UpgradeList( );

//=======================================================
// EndlessDungeon.js
// Entire Game Object that contains everything about the
// game.
//=======================================================
function EndlessDungeon( ) {
	ED_Stage_Setup( );
}

//Factor - Price increment  
//Base - Base price 		Base increase by 5x   price as previous
//PPS - Poo Per Second      PPS  increase by 1.5x than previous
function UpgradeList( ) {
	const upgrade = {
		"Shovel"       : { "factor" : 0.20, "base" :   100,   "PPS" :   0.10 },
		"Baby"         : { "factor" : 0.20, "base" :   500,   "PPS" :   1.50 },
		"Moo Moo Farm" : { "factor" : 0.20, "base" :  3000,   "PPS" :  22.50 },
		"Bathroom"     : { "factor" : 0.20, "base" : 15000,   "PPS" : 337.50 }
	};

	function calcPrice( name, level ) {
		let key = upgrade[name];
		return Math.round( Math.pow((1 + key["factor"]), level ) * key["base"] );
	}

	function generateList( ) {
		var upgradeContainer = document.getElementById( "upgradeList" );
		    upgradeContainer.innerHTML = "";

		for( key in upgrade ) {
			if( SessionState.isUpgradeUnLock( key ) ) {
				//===================
				// DIV ELEMENT
				//===================
				let cell = document.createElement( "div" );
				    cell.setAttribute( "class", "upgradeCell" );
				    cell.setAttribute( "id", key + "Upgrade" );

				//===================
				// IMG ELEMENT
				//===================
				let img = document.createElement( "img" );
				    img.setAttribute( "id", key + "Img" );
				    img.setAttribute( "src", "img/shovel.png" ); 	console.warn( "Upgrade Icon: Needs new image" );

				//=======================
				// SPAN ELEMENT - TITLE
				//=======================
				let title = document.createElement( "span" );
				    title.setAttribute( "id", key + "Title" );

				if( SessionState.isUpgradePurchaseable( key ) ) {
					title.setAttribute( "class", "label" );
				} else {
					title.setAttribute( "class", "label notPurchaseable" );
				}
				
				title.innerHTML = key;


				//=======================
				// SPAN ELEMENT - COST
				//=======================
				let cost = document.createElement( "span" );
					cost.setAttribute( "id", key + "Cost" );

					if( SessionState.isUpgradePurchaseable( key ) ) {
						cost.setAttribute( "class", "cost purchaseable" );
					} else {
						cost.setAttribute( "class", "cost notPurchaseable" );
					}

					cost.innerHTML = calcPrice( key, SessionState.getLevel( key ) );

				//=======================
				// SPAN ELEMENT - LEVEL
				//=======================
				let level = document.createElement( "span" );
					level.setAttribute( "id", key + "Level" );
					level.setAttribute( "class", "level" );
					level.innerHTML = SessionState.getLevel( key );

				//=======================
				// DIV ELEMENT - Overlay
				//=======================
				let overlay = document.createElement( "div" );
					overlay.setAttribute( "id", key );
					overlay.setAttribute( "class", "overlay" );

				//=======================
				// CREATE CELL
				//=======================
				cell.appendChild( img );
				cell.appendChild( title );
				cell.appendChild( cost );
				cell.appendChild( level );
				cell.appendChild( overlay );
				upgradeContainer.appendChild( cell );


				//=======================
				// ADD EVENT LISTENER
				//=======================
				cell.addEventListener( "click", upgradeLevel );				


				//=======================
				// EVENT METHOD
				//=======================
				function upgradeLevel( e ) {
					let id    = e.srcElement.id

					//Check Afforadability
					if( SessionState.isUpgradePurchaseable( id ) ) {
						//-Poo from Total Collected
						let pooStats  = document.getElementById( "totalPooCollected" );
						SessionState.subtractPoo( calcPrice( id, SessionState.getLevel( id ) ) );
						pooStats.innerHTML = SessionState.getTotalPoo( );

						//Increase Level +1
						SessionState.upgradeLevelUp( id );
						let level = document.getElementById( id + "Level" );
						level.innerHTML = SessionState.getLevel( id );

						//Recalculate Cost
						let cost  = document.getElementById( id + "Cost" );					
						cost.innerHTML = calcPrice( id, SessionState.getLevel( id ) );

						//Check Next Level upgrade eligible
						SessionState.isUpgradeEligible( );
						generateList( );
					}
				}
			}
		}
	}

	return {
		upgrade      : upgrade,
		calcPrice    : calcPrice,
		generateList : generateList
	}
}