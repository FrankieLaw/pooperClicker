//=======================================================
// Build Version 1.0 - Junly 1, 2019
//=======================================================
// -> Added ED_Stage_Setup( ) function.
// -> Added ED_Navigation** function.
//=======================================================

//=======================================================
// Build Version 1.0 - Junly 6, 2019
//=======================================================
// All Pages are connected.  It can dyanmically
// add controls and remove controls.
//
// [TO DO] - Hero Object
// [TO DO] - Translate Hero Data to JSON
//=======================================================



//=======================================================
// ED_Stage_Setup( )
// Responsible for staging all the button controls 
// within each screen or window.
//=======================================================
function ED_Stage_Setup( ) {
	ED_Stages( ).setStage( SessionState.getCurWindow( ) );
}




//=======================================================
// ED_Stages( )
//	-> ED_Stages( ).setStage( [stageID] )		//Sets up the stage with controls
//
// Information about all the stages will be recorded
// here.  To construct each individual stage with their
// appropriate controls.  A function call to a specific
// page is all is needed.
//=======================================================
function ED_Stages( ) {
	let stage = {
		//=================================
		// START OF PAGE 1 - Splash Screen
		//=================================
		page1 : function( ) {
			let p1_newGameBtn  = document.getElementById( "p1-newGameBtn" );
			let p1_loadGameBtn = document.getElementById( "p1-loadGameBtn" );

			//=================================================================
			// Add & Register Navigation and Action control to the window.
			//=================================================================
			p1_newGameBtn.addEventListener(  "click", 	  p1_onClick );
			p1_loadGameBtn.addEventListener( "click",     p1_onClick );
			p1_newGameBtn.addEventListener(  "mouseover", p1_mouseOver );
			p1_loadGameBtn.addEventListener( "mouseover", p1_mouseOver );


			//==================================
			// Change to Stage1 - Splash Screen
			// REQUIRE!! All stage is display non
			// Only P1 needs this line of code.
			//==================================
			SessionState.ED_StageChange( "page1" );	//Change Screen None-Block


			//=======================================================
			// Endless Dungeon Button Controls
			//=======================================================
			function p1_mouseOver( e ) { e.srcElement.style.cursor = "Pointer";	}

			function p1_onClick( e ) {
				//===============================================
				// Automatically Create a Hero for the game
				// Player can customize the Hero during gameplay
				//===============================================
				//SessionState.addHero( ED_HeroState( ).createHero( ) );
				SessionState.addTimer( );

				//====================================
				// Remove all the controls from Page1
				//====================================
				p1_newGameBtn.removeEventListener(  "click", 	 p1_onClick );
				p1_loadGameBtn.removeEventListener( "click", 	 p1_onClick );
				p1_newGameBtn.removeEventListener(  "mouseover", p1_mouseOver );
				p1_loadGameBtn.removeEventListener( "mouseover", p1_mouseOver );

				//======================
				// Setup page4 controls
				//======================
				ED_Stages( ).setStage( e.srcElement.attributes["data-target"].value );

				//====================================
				// Change window from Page1 to Page4
				//====================================
				SessionState.ED_StageChange( e.srcElement.attributes["data-target"].value );
			}
		},	//END OF - PAGE1 - Object



		//=================================
		// START OF PAGE 2 - Load Screen
		//=================================
		page2 : function( ) {
			var p2_backBtn = document.getElementById( "p2-backBtn" );

			//=========================================================
			// Add Navigation and Action control to the window.
			//=========================================================
			p2_backBtn.addEventListener( "click", 	  p2_onClick );
			p2_backBtn.addEventListener( "mouseover", p2_mouseOver );

			//=========================================================
			// EventRegistry is necessary to remove the eventListener
			// outside of this function.
			//=========================================================
			EventRegistry.add( "p2-backBtn", "click", p2_onClick );
	    	EventRegistry.add( "p2-backBtn", "mouseover", p2_mouseOver );


			//=========================================
			// Search Local Storage for all save data &
			// Add elements to the load screen
			//=========================================
			SaveData.loadFromLocalStorage( );

			//=======================================================
			// Endless Dungeon Button Controls
			//=======================================================
			function p2_mouseOver( e ) { e.srcElement.style.cursor = "Pointer";	}

			function p2_onClick( e ) {
				p2_backBtn.removeEventListener( "click", 	 p2_onClick );
				p2_backBtn.removeEventListener( "mouseover", p2_mouseOver );
				
				ED_Stages( ).setStage( e.srcElement.attributes["data-target"].value );
				SessionState.ED_StageChange( e.srcElement.attributes["data-target"].value );
				SaveData.unload( );
			}
		}, //END OF - PAGE2 - Load Screen


		page4 : function( ) {
			SessionState.debug( );	//DELETE ME

			//=================================================
			// Add Navigation and Action control to the window.
			//=================================================
			var p4_saveBtn = document.getElementById( "p4-saveBtn" );
			var p4_endBtn  = document.getElementById( "p4-endBtn" );

			p4_saveBtn.addEventListener( "click", 	  p4_onClick_Save );
			p4_saveBtn.addEventListener( "mouseover", p4_mouseOver );

			p4_endBtn.addEventListener( "click", 	 p4_onClick_End );
			p4_endBtn.addEventListener( "mouseover", p4_mouseOver );


			//=================================================
			// Initialize Game State
			//=================================================
			var pooClicker = document.getElementById( "pooClicker" );
			pooClicker.addEventListener( "click", poo_onClick );


				var upgradeList = document.getElementById( "shovelUpgrade" );
				upgradeList.addEventListener( "click", function( ) {
					SessionState.subtractPoo( ED("upgradeItem")["Shovel"].base );
				});
				//upgrade1.addEventListener

			//=========================================
			// Enter Main-Game [Stage]
			//=========================================
			var currentTime = document.getElementById( "currentTime" );
			var totalPooCol = document.getElementById( "totalPooCollected" );
			
			setInitialState( );


			//=========================================
			// Game Loop Starts Here
			//=========================================
			var updateTimer = setInterval( gameLoop, 1000 );
			SessionState.getTimer( ).start( );

			function gameLoop( ) {
				currentTime.innerHTML = SessionState.getTimer( ).elapsedToString( );
				totalPooCollected.innerHTML = SessionState.getTotalPoo( );
			}


			//=======================================================
			// Endless Dungeon Page3 Button Action
			//=======================================================
			function p4_mouseOver( e ) { e.srcElement.style.cursor = "Pointer"; }

			function p4_onClick_Save( e ) {	SaveData.saveToLocalStorage( ); }

			function p4_onClick_End( e ) {
				//====================================
				// REMOVE ALL LISTENENERS ON THE PAGE
				//====================================
				p4_saveBtn.removeEventListener( "click", 	 p4_onClick_Save );
				p4_endBtn.removeEventListener(  "click", 	 p4_onClick_End );
				p4_saveBtn.removeEventListener( "mouseover", p4_mouseOver );
				p4_endBtn.removeEventListener(  "mouseover", p4_mouseOver );
				pooClicker.removeEventListener( "click", poo_onClick );


				ED_Stages( ).setStage( e.srcElement.attributes["data-target"].value );
				SessionState.ED_StageChange( e.srcElement.attributes["data-target"].value );

				
				

				//END GAME TIMER
				SessionState.getTimer( ).end( );
				clearInterval( updateTimer );

				//SAVE PROGRESS
				SaveData.saveToLocalStorage( );

				//RESET STATISTIC DISPLAY
				setInitialState( );

				//RESET SESSION STATE FOR THE NEXT GAME
				SessionState.reset( );
			}

			function setInitialState( ) {			
				currentTime.innerHTML       = "It Begins";
				totalPooCollected.innerHTML = 0;
			}

			function poo_onClick( e ) {
				var pooArea = document.getElementById( "pooArea" );

				//Add div element with the number pop up
				//Div moves up over 1 seconds and disappears after 1 seconds
				//absolute position it.
				let tempDiv = document.createElement( "div" );
				let txtNode = document.createTextNode( "+1" );

				tempDiv.setAttribute( "class", "pooClicked" );
				tempDiv.style.left = (e.offsetX) + "px";
				tempDiv.style.top  = (e.offsetY-50) + "px";
				tempDiv.style.opacity = 1.0;

				tempDiv.appendChild( txtNode );
				pooArea.appendChild( tempDiv );

				var tempTimer = new PooNumber( tempDiv );
				tempTimer.start( );

				SessionState.addPoo( 1 );
				totalPooCollected.innerHTML = SessionState.getTotalPoo( );
			}
		} // END OF PAGE 4 - IN GAME SCREEN
	}


	function setStage( stageID ) {
		stage[ stageID ]( );
	}

	return {
		setStage : setStage
	};
}

