// =======================================================
//  GLOBAL letIABLES - REQUIRED
// =======================================================
const $ST    		  = new AppSessionState( );		//PLAYER'S CURRENT STATE
const $D 			  = new DOM( );					//LIKE JQUERY
const $PC 			  = new GameData( );
const SaveData        = new App_SaveState( );		//ACCESS TO SAVE/LOAD
const GameUtility 	  = new GameUtilityAPI( );
const dNote           = new Notes( );

const hackMode        = false;
const hackClickAmt    = 25;
const FPS             = 10;

let	  updateTimer     = null;

Object.freeze( GameUtility );
Object.freeze( $D );
Object.freeze( $PC );
Object.freeze( dNote );


// =======================================================
//  MAIN - START OF THE PROGRAM
// =======================================================
function AppInit( ) {
	headerSetup( );			// Setting up header information
	devNoteControlSetup( );	// DOCUMENTATION CONTROLS

	initPanelControl( );	// PANEL CONTROLS
	initPooStoreContorl( );	// POO STORE
	initSettingControl( );	// SETTING
	initGameControls( );	// MAIN GAME AREA
	initSessionState( );	// Session State

	enterGame( );
}


function enterGame( ) {
	//=========================================
	// Enter Main-Game [Stage]
	//=========================================
	let chevoUpdateFreq    = FPS * 1;		//NUMBER OF FRAMES ELAPSED
	let chevoCurrentFreq   = 0;

	let msgUpdateFreq      = FPS * 12.5;	//Every 12.5 Seconds
	let msgCurrentFreq     = 0;

	let sessionTimeFreq    = FPS * 1;  		//Every 1.0 Seconds
	let sessionCurFreq     = 0;

	let windowIsFocus      = true;			//DETECT IF PAGE IS FOCUS
	let notFocusTimer      = null;			//FRAME SYSTEM WHEN PLAYER IS NOT FOCUS

	//START GAME TIMER | MESSAGE BOARD | WORLD NAME 
	//POO STORE | TECH TREE | STATISTICS | CHEVO
	startGame( );


	window.onblur = ( ) => {
		let browserUpdateFreq = FPS * 5;
		let browserCurFrame   = 0;

		let saveFreq          = FPS * 30;
		let saveCurFrame      = 0;

		let cycleStart = null;
		let cycleEnd   = null;

		windowIsFocus = false; 
		disableMsg( );	//DISABLE RANDOM MESSAGE
		
		
		//START CYCLE
		cycleStart = Date.now( );

		notFocusTimer = setInterval( ( e ) => {
			cycleEnd   = Date.now( );

			//UPDATE CYCLE
			const elapsedTime = ( cycleEnd - cycleStart ) / 1000;
			
			$ST.addPoo( $ST.getPPS( ) * elapsedTime );	//update POO collected
			updateGameTime( elapsedTime );				//update Timer

			updateMainStats( );

			//UPDATE POO STORE LIST - ONLY IF SOMETHING NEW IS AVAILABLE
			if( $ST.getActiveScreen( ) == "upgradeScreen" ) {
				updatePurchaseAvailability( );
				$ST.isUpgradeEligible( ) && updatePooStore( );
			}

			//UPDATE STATISTICS SCREEN
			if( $ST.getActiveScreen( ) == "statsScreen" ) {
				updateStatistisScreen( );
			}

			if( $D.id( "autoSaveInput" ).checked ) {
				if( saveCurFrame === saveFreq ) {
					SaveData.saveGame( );
				}
			}

			$ST.isUpgradeEligible( ) && updatePooStore( );

			if( browserCurFrame === browserUpdateFreq ) {
				updateBrowserTitle( );
				browserCurFrame = 0;
			}

			browserCurFrame++;
			cycleStart = cycleEnd;	//READY FOR THE NEXT CYCLE
		}, 1000/FPS );
	}

	window.onfocus = ( ) => { 
		clearInterval( notFocusTimer );
		enableMsg( ); 

		windowIsFocus    = true;
		sessionCurFreq   = 0;
		msgCurrentFreq   = 0;
		chevoCurrentFreq = 0;
		outOfFocusFrame  = 0;
	}

	//ENTERED GAME LOOP
	updateTimer = setInterval( ( ) => {
		if( windowIsFocus ) {
			//POOP PER SECOND ADDED
			$ST.addPoo( $ST.getPPS( ) / FPS );
			updateMainStats( );

			//UPDATE POO STORE LIST - ONLY IF SOMETHING NEW IS AVAILABLE
			if( $ST.getActiveScreen( ) == "upgradeScreen" ) {
				updatePurchaseAvailability( );
				$ST.isUpgradeEligible( ) && updatePooStore( );
			}

			//UPDATE STATISTICS SCREEN
			if( $ST.getActiveScreen( ) == "statsScreen" ) {
				updateStatistisScreen( );
			}

			
			//CHECK IF ACHIEVEMENT HAS BEEN UNLOCKED
			//ONLY UPDATE ONCE EVERY 1.0 sec
			if( chevoCurrentFreq === chevoUpdateFreq ) {
				const chevoUnlocked = updateAchievementNotification( );

				if( chevoUnlocked >= 1 ) { updateAchievementScreen( ); }
				chevoCurrentFreq = 0;
			}

			//UPDATE WORLD MESSAGE / 12.5 sec
			if( msgCurrentFreq === msgUpdateFreq ) {
				msgCurrentFreq = 0;
				updateMessageBoard( );
				updateBrowserTitle( );
				
				if( $D.id( "autoSaveInput" ).checked ) {
					SaveData.saveGame( );
				}
			}

			//UPDATE CURRENT GAME RUN TIME / 1.0 sec
			if( sessionCurFreq === sessionTimeFreq ) {
				updateGameTime( 1 );
				sessionCurFreq = 0;
			}

			chevoCurrentFreq++;		//CONTROL HOW FREQUENT ACHIEVEMENT UPDATE GETS CHECKED
			msgCurrentFreq++;
			sessionCurFreq++;	
		}
	}, 1000/FPS );
}


// =======================================================
//  FUNCTION 	startGame
//  Initial Game Setup - Before game can start
// =======================================================
function startGame( ) {
	const newName = $PC.getRandomName( );

	if( $ST.getWorldName( ) === "" ) {
		$D.id( "nameInput" ).value = newName;
		$ST.setWorldName( newName );
	} else {
		$D.id( "nameInput" ).value = $ST.getWorldName( );	//SET WORLD NAME
	}

    //Initial Update => Upgrade | Tech | Achievement | Statistics
    updatePooStore( );			//SET UPGRADE LIST VISUAL
    updateTechTree( ); 			//SET TECH TREE ICON VISUAL
	
	updateMainStats( );			//STATISTICS -> MAIN SCREEN
	updateStatistisScreen( );	//STATISTICS -> ALL THE NUMBERS
	updateAchievementScreen( );	//STATISTICS -> UNLOCKED ACHIEVEMENT
	updateOwnedTechScreen( "startGame( )" );			//STATISTICS -> OWNED TECH UPGRADES
	
	runTransition( );
	$ST.calcPPS( );             //RECALCULATE PPS INCASE IT IS NOT MATCHING.

	$ST.debug( "startGame( )" );
}