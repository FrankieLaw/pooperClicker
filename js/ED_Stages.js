var hackMode     = false;
var hackClickAmt = 250000;

var loopTimer    = 10;		//RECORDED AS MILLISECONDS
var msgTimer     = 12500;	//RECORDED AS MILLISECONDS

// console.log( String( hackClickAmt ) );

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
			SessionState.changeStageTo( "page1" );	//Change Screen None-Block


			//=======================================================
			// Endless Dungeon Button Controls
			//=======================================================
			function p1_mouseOver( e ) { e.srcElement.style.cursor = "Pointer";	}

			function p1_onClick( e ) {
				//===============================================
				// Automatically Create a Hero for the game
				// Player can customize the Hero during gameplay
				//===============================================
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
				SessionState.changeStageTo( e.srcElement.attributes["data-target"].value );
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
				SessionState.changeStageTo( e.srcElement.attributes["data-target"].value );
				SaveData.unload( );
			}
		}, //END OF - PAGE2 - Load Screen



		//==================================
		// START OF PAGE 4 - In Game Screen
		//==================================
		page4 : function( ) {
			SessionState.debug( );	//DELETE ME

			//=================================================
			// Add Navigation and Action control to the window.
			//=================================================
			var p4_saveBtn        = document.getElementById( "p4-saveBtn" );
			var p4_endBtn         = document.getElementById( "p4-endBtn" );
			var upgradeTabBtn     = document.getElementById( "upgradeTabBtn" );
			var techTabBtn        = document.getElementById( "techTabBtn" );
			var statisticTabBtn   = document.getElementById( "statisticTabBtn" );
			var achievementTabBtn = document.getElementById( "achievementTabBtn" );
			var buyBtn            = document.getElementById( "buyBtn" );
			var sellBtn			  = document.getElementById( "sellBtn" );
			var _1xBtn 		      = document.getElementById( "1x" );
			var _10xBtn           = document.getElementById( "10x" );
			var _100xBtn          = document.getElementById( "100x" );
			var giantPoo          = document.getElementById( "pooClicker" );
			var worldNameInput    = document.getElementById( "worldNameBlock" );


			p4_saveBtn.addEventListener( "click", 	  p4_onClick_Save );	//GAME NAVIGATION CONTROL
			p4_saveBtn.addEventListener( "mouseover", p4_mouseOver );		//GAME NAVIGATION CONTROL

			p4_endBtn.addEventListener( "click", 	 p4_onClick_End );		//GAME NAVIGATION CONTROL
			p4_endBtn.addEventListener( "mouseover", p4_mouseOver );		//GAME NAVIGATION CONTROL

			upgradeTabBtn.addEventListener( "click", switchTab );			//DISPLAY TAB CONTROL
			techTabBtn.addEventListener( "click", switchTab );				//DISPLAY TAB CONTROL
			statisticTabBtn.addEventListener( "click", switchTab );			//DISPLAY TAB CONTROL
			achievementTabBtn.addEventListener( "click", switchTab );		//DISPLAY TAB CONTROL

			buyBtn.addEventListener(  "click", buyBtnPress );				//QUANTITY CONTROL
			sellBtn.addEventListener( "click", sellBtnPress );				//QUANTITY CONTROL

			_1xBtn.addEventListener(  "click", quantityOne );				//QUANTITY CONTROL
			_10xBtn.addEventListener( "click", quantityTen );				//QUANTITY CONTROL
			_100xBtn.addEventListener( "click", quantityHundred );			//QUANTITY CONTROL

			giantPoo.addEventListener( "mousedown", giantPoo_mouseDown );
			giantPoo.addEventListener( "mouseup", giantPoo_mouseUp );

			worldNameInput.addEventListener( "click", changeInputClicked );


			//THIS LINE WILL RESET THE ANIMATION ON THE RANDOM MESSAGE BOARD
			document.getElementById( "randomMessage" ).className = "randomMessage";

			//THIS WILLS SET THE INITIAL NAME OF THE WORLD
			document.getElementById( "nameInput" ).value = SessionState.getWorldName( );


			//=======================================================
			// Endless Dungeon Page4 Button Action
			//=======================================================
			function p4_mouseOver( e )    { e.srcElement.style.cursor = "Pointer"; }

			function p4_onClick_Save( e ) {	
				SaveData.saveToLocalStorage( );	

				pooArea = document.getElementById( "pooClickerBody" );

				//Add div element with the number pop up
				//Div moves up over 1 seconds and disappears after 1 seconds
				//absolute position it.
				let tempDiv = document.createElement( "div" );
				let txtNode = document.createTextNode( "GAME SAVED!" );

				tempDiv.setAttribute( "class", "SaveMsgBox" );
				tempDiv.style.opacity = 1.0;

				tempDiv.appendChild( txtNode );
				pooArea.appendChild( tempDiv );

				var tempTimer = new StatusTimer( tempDiv );
				tempTimer.start( );
			}

			function p4_onClick_End( e ) {
				//====================================
				// REMOVE ALL LISTENENERS ON THE PAGE
				//====================================
				p4_saveBtn.removeEventListener(        "click", 	p4_onClick_Save );
				p4_endBtn.removeEventListener(         "click", 	p4_onClick_End );
				p4_saveBtn.removeEventListener(        "mouseover", p4_mouseOver );
				p4_endBtn.removeEventListener(         "mouseover", p4_mouseOver );
				
				pooClicker.removeEventListener(        "click", 	poo_onClick );

				upgradeTabBtn.removeEventListener(     "click", 	switchTab );
				techTabBtn.removeEventListener(        "click", 	switchTab );
				statisticTabBtn.removeEventListener(   "click", 	switchTab );
				achievementTabBtn.removeEventListener( "click", 	switchTab );

				buyBtn.removeEventListener(  		   "click", 	buyBtnPress );
				sellBtn.removeEventListener( 		   "click", 	sellBtnPress );

				_1xBtn.removeEventListener(  		   "click", 	quantityOne );
				_10xBtn.removeEventListener( 		   "click", 	quantityTen );
				_100xBtn.removeEventListener( 		   "click", 	quantityHundred );

				giantPoo.removeEventListener( 		   "mousedown", giantPoo_mouseDown );
				giantPoo.removeEventListener( 		   "mouseup",   giantPoo_mouseUp );

				worldNameInput.removeEventListener(    "click",     changeInputClicked );

				document.getElementById( "randomMessage" ).className = "";
				document.getElementById( "randomMessage" ).innerHTML = "There is a piece of poo laying around on our beautiful planes...";


				//====================================
				// STAGE SETUP & SWITCH TO PAGE1
				//====================================
				ED_Stages( ).setStage( e.srcElement.attributes["data-target"].value );
				SessionState.changeStageTo( e.srcElement.attributes["data-target"].value );


				//END GAME TIMER
				SessionState.getTimer( ).end( );
				clearInterval( updateTimer );
				clearInterval( messageTimer );

				//SAVE PROGRESS
				SaveData.saveToLocalStorage( );

				//RESET SESSION STATE FOR THE NEXT GAME
				SessionState.reset( );
				resetTab( );
				resetQuantity( );
				resetTechTree( );
			}



			//=================================================================
			// WORLD NAME CONTROL - UTILITY METHODS
			//=================================================================
			function changeInputClicked( e ) {
				let input = document.getElementById( "nameInput" );
					input.disabled = false;
					input.select( );

				input.addEventListener( "change", nameEntered );
			}

			function nameEntered( e ) {
				this.removeEventListener( "change", nameEntered );
				this.disabled = true;

				SessionState.setWorldName( this.value + " World" );
				this.value += " World";
			}


			//=================================================================
			// RESET CONTROL - UTILITY METHODS
			//=================================================================
			function resetQuantity( ) {
				PooClickerData.getQuantity( ).forEach( function( element ) {
					document.getElementById( element ).className = "quantityBtn";
				});

				document.getElementById( "1x" ).className      = "quantityBtn active";
				document.getElementById( "buyBtn" ).className  = "optionBtn active";
				document.getElementById( "sellBtn" ).className = "optionBtn";
			}

			function resetTab( ) {
				PooClickerData.getUpgradeTabs( ).forEach( function(element) {
					let header = element + "Btn";
					let title = document.getElementById( header ).innerHTML;

					document.getElementById( element ).style.display = "block";
					document.getElementById( header ).innerHTML = title.replace( "-", "+" );
				});
			}

			function resetTechTree( ) {
				document.getElementById( "techList" ).innerHTML = "";
			}


			//=================================================================
			// QUANTITY CONTROL - UTILITY METHODS
			//=================================================================
			function quantityOne( e ) {
				removeAllActiveQuantity( );
				e.srcElement.className = e.srcElement.className + " active";
				SessionState.setBuyOrSellQuantity( 1 );
				updateQuantityCost( );
			}

			function quantityTen( e ) {
				removeAllActiveQuantity( );
				e.srcElement.className = e.srcElement.className + " active";
				SessionState.setBuyOrSellQuantity( 10 );
				updateQuantityCost( );
			}

			function quantityHundred( e ) {
				removeAllActiveQuantity( );
				e.srcElement.className = e.srcElement.className + " active";
				SessionState.setBuyOrSellQuantity( 100 );
				updateQuantityCost( );
			}

			function buyBtnPress( e ) {
				sellBtn.className = "optionBtn";
				buyBtn.className  = "optionBtn active";
				SessionState.buyOrSellToggle( true );
				updateQuantityCost( );
			}

			function sellBtnPress( e ) {
				buyBtn.className  = "optionBtn";
				sellBtn.className = "optionBtn active";
				SessionState.buyOrSellToggle( false );
				updateQuantityCost( );
			}

			function removeAllActiveQuantity( ) {
				PooClickerData.getQuantity( ).forEach( function(element) {
					let quantity = document.getElementById( element );
					quantity.className = "quantityBtn";
				});
			}

			function updateQuantityCost( ) {
				//=====================================================
				// GET ALL THE UPGRADABLE ELEMENTS ON THE UPGRADELIST
				//=====================================================
				let upgradeListElement = document.getElementById( "upgradeList").childNodes;

				//=====================================================
				// UPDATE ALL THE PRICES ON THE LIST - BUY
				//=====================================================
				if( SessionState.getBuyOrSell( ) ) {
					upgradeListElement.forEach( function( element ) {
						let name 		   = (element.id).replace("Upgrade", "");	//Shovel
						let curLevel       = SessionState.getLevel( name );			//Level 43
						let increment      = SessionState.getBuyOrSellQuantity( );	//1 / 10 / 100

						let costId         = name + "Cost";							//ShovelCost
						let upgradeElement = document.getElementById( costId );		//Shovel Upgrade Element

						let sum            = PooClickerData.calcSumPrice( name, curLevel, increment );
						let newCost        = SessionState.getDisplayNotation( sum );
						
						upgradeElement.innerHTML = newCost;
					});
				}

				//=====================================================
				// UPDATE ALL THE PRICES ON THE LIST - SELL
				//=====================================================
				else {
					upgradeListElement.forEach( function( element ) {
						let name 		   = (element.id).replace("Upgrade", "");	//Shovel
						let curLevel       = SessionState.getLevel( name );			//Level 43
						let decrement      = SessionState.getBuyOrSellQuantity( );	//1 / 10 / 100

						let costId         = name + "Cost";							//ShovelCost
						let upgradeElement = document.getElementById( costId );		//Shovel Upgrade Element

						let sum            = PooClickerData.calcSellPrice( name, curLevel, decrement );
						let refundAmt      = SessionState.getDisplayNotation( sum );
						
						upgradeElement.innerHTML = refundAmt;
					});
				}
			}

			
			//=================================================================
			// RANDOM MESSAGE BOARD CONTROL
			//=================================================================
			function displayRandomMessage( ) {
				let messageBoard = document.getElementById( "randomMessage" );
				messageBoard.innerHTML = SessionState.getRandomMessage( );
			}



			//=================================================================
			// INITIALIZE GAME STATE
			//=================================================================
			{
				var pooClicker = document.getElementById( "pooClicker" );
				    pooClicker.addEventListener( "click", poo_onClick );
					
				//=========================================
				// Enter Main-Game [Stage]
				//=========================================
				var currentTime 	   = document.getElementById( "currentTime" );			//STATISTICS TAB
				var totalPooCol 	   = document.getElementById( "totalPooCollected" );	//STATISTICS TAB
				var totalClicks 	   = document.getElementById( "totalClicksMade" );		//STATISTICS TAB
				var totalPooSinceStart = document.getElementById( "totalPooSinceStart" );	//STATISTICS TAB
				var totalUpgrades      = document.getElementById( "totalUpgrades" );		//STATISTICS TAB

				var pooDisplay  	   = document.getElementById( "totalPooDisplay" );		//Center Stage
				var ppsDisplay  	   = document.getElementById( "ppsDisplay" );			//Center Stage
				
				var updateTimer 	   = setInterval( gameLoop, 10 );
				var messageTimer       = setInterval( displayRandomMessage, msgTimer );

				var chevoUpdateFreq    = 125;				//NUMBER OF FRAMES ELAPSED
				var chevoCurrentFreq   = 0;
				var achievementPopUp   = [];

				updateStatistics( );						//SET STATISTICS VISUAL
				generateList( );							//SET UPGRADE LIST VISUAL
				generateTechTreeIcon( ); 					//SET TECH TREE ICON VISUAL
				generateAchievementIcon( );					//GENERATE ACHIEVEMENTS
				PooClickerData.getMessageBoardUpdate( ); 	//SET RANDOM MESSAGE BOARD
				SessionState.getTimer( ).start( );			//START GAME TIMER


				function gameLoop( ) {
					//UPDATE POO ACCUMULATION
					SessionState.addPoo( SessionState.getPPS( ) / 100 );

					//UPDATE STATISTICS SCREEN
					updateStatistics( );


					//===================================================
					// IF YOU ARE BUYING - EXECUTE THE FOLLOWING CODE
					//===================================================
					if( SessionState.getBuyOrSell( ) ) {
						//TOGGLE "ANY" UPGRADE THAT IS PURCHASEABLE
						//CHANGE CSS ON UPGRADE THAT IS PURCHASEABLE
						SessionState.upgradeToggle( );
						let upgradeList = SessionState.getUpgradeList( );
						

						for( key in upgradeList ) {
							//IF IT IS NOT LOCKED - DO SOMETHING
							//ELSE - DO NOTHING
							if( upgradeList[key]["lock"] != false ) {
								if( upgradeList[key]["upgradeable"] ) {
									let tempTitle = document.getElementById( key + "Title" );
										tempTitle.setAttribute( "class", "label" );

									let tempCost  = document.getElementById( key + "Cost" );
										tempCost.setAttribute( "class", "cost purchaseable" );

								} else {
									let tempTitle = document.getElementById( key + "Title" );
										tempTitle.setAttribute( "class", "label notPurchaseable" );

									let tempCost  = document.getElementById( key + "Cost" );
										tempCost.setAttribute( "class", "cost notPurchaseable" );
								}
							}
						}
					}

					//===================================================
					// IF YOU ARE SELLING - EXECUTE THE FOLLOWING CODE
					//===================================================
					else {
						let upgradeList = SessionState.getUpgradeList( );

						for( key in upgradeList ) {

							//CHECK IF THE ELEMENT EXIST
							if( document.getElementById( key + "Upgrade" ) ) {
								document.getElementById( key + "Title" ).className = "label";
								document.getElementById( key + "Cost" ).className  = "cost purchaseable";
							}
						}
					}
					
					//CHECK IF NEXT TOOL IS AVAILABLE FOR UPGRADE
					if( SessionState.isUpgradeEligible( ) ) {
						generateList( );
					}

					//CHECK IF ACHIEVEMENT HAS BEEN UNLOCKED
					if( chevoCurrentFreq == chevoUpdateFreq ) {
						////POPUP RESET
						chevoCurrentFreq = 0;
						achievementPopUp = [];	

						//CHECK TO SEE IF NEW ACHIEVEMENT IS UNLOCKED.
						achievementPopUp = PooClickerData.checkAchievement( SessionState.getAchievement( ) );

						//==========================================================
						// UPDATE ACHIEVEMENT NOTIFICATION
						//==========================================================
						achievementPopUp.forEach( function( element ) {
							let chevoContainer = document.getElementById( "chevoContainer" );
							let chevoClone     = document.getElementById( "tempAchievement" ).cloneNode( true );
							let chevoData      = PooClickerData.getAchievementById( element );

							let chevoClose     = chevoClone.children[0];                //Close Button
							let chevoTitle     = chevoClone.children[2].children[0];    //Chevo Title
							let chevoIcon      = chevoClone.children[1].children[0];    //Chevo Icon Link
							let chevoDesc      = chevoClone.children[2].children[1];    //Chevo Description

							chevoTitle.innerHTML            = chevoData["title"];
							chevoIcon.style.backgroundImage = "url('img/" + chevoData["sprite"] + "')";
							chevoDesc.innerHTML             = chevoData["desc"];
							chevoClone.style.display        = "block";

							//SETUP ONCLICK EVENT FOR THE X BUTTON
							chevoClose.addEventListener( "click", function( e ) {
								let container = document.getElementById( "chevoContainer" );
								container.removeChild( this.parentNode );
							});

							//ATTACH IT TO THE ALLOCATED SPOT
							chevoContainer.appendChild( chevoClone );
						});


						//==========================================================
						// ALSO UPDATE ACHIEVEMENT TAB TO REFLECT RECENT UNLOCK
						//==========================================================
						if( achievementPopUp.length >= 1 ) {
							generateAchievementIcon( );
						}
					}

					chevoCurrentFreq++;		//CONTROL HOW FREQUENT ACHIEVEMENT UPDATE GETS CHECKED
				}
			}

			
			//=================================================================
			// GAME CONTROLS
			//=================================================================
			function giantPoo_mouseDown( e ) {
				e.srcElement.className = "cursorGrabbing";
			}

			function giantPoo_mouseUp( e ) {
				e.srcElement.className = "cursorOpen";
			}

			function poo_onClick( e ) {
				let manualPooGenerated = SessionState.calcPooPerClick( );

				var pooArea = document.getElementById( "pooArea" );

				//Add div element with the number pop up
				//Div moves up over 1 seconds and disappears after 1 seconds
				//absolute position it.
				let tempDiv = document.createElement( "div" );
				let txtNode = document.createTextNode( "+" + SessionState.getDisplayNotation( manualPooGenerated ) );

				tempDiv.setAttribute( "class", "pooClicked" );
				tempDiv.style.left = GameUtility.between(e.offsetX - 120, e.offsetX + 12) + "px";
				tempDiv.style.top  = (e.offsetY-50) + "px";
				tempDiv.style.opacity = 1.0;

				tempDiv.appendChild( txtNode );
				pooArea.appendChild( tempDiv );

				var tempTimer = new PooNumber( tempDiv );
				tempTimer.start( );

				if( hackMode ) {
					SessionState.addPoo( hackClickAmt );
					SessionState.addPooSinceStart( hackClickAmt );
					SessionState.addClick( 1 );

				} else {
					SessionState.addPoo( manualPooGenerated );
					SessionState.addPooSinceStart( manualPooGenerated );

					SessionState.addClick( 1 );
				}
			}


			//=================================================================
			// UI DYNAMIC GENERATION 
			//=================================================================
			function generateAchievementIcon( ) {
				let chevoEarnedBox = document.getElementById( "achievementTab" );	//attachTo
				let allChevoKeys   = SessionState.getAchievementKeys( );			//[1][2][3]
				
				//RESET ACHIEVEMENT DISPLAY CASE
				chevoEarnedBox.innerHTML = "";	

				//UPDATE EVERY ICON ON THE LIST TO MAKE SURE NOTHING IS MISSING
				allChevoKeys.forEach( function( keys ) {
					let isNotLocked = SessionState.getAchievementById( keys );	//ONLY ADD THE ONE IS UNLOCKED									
					let chevoData   = PooClickerData.getAchievementById( keys );

					if( isNotLocked ) {
						//CLONE THE TECH ICON AS ACHIEVEMENT ICON
						let chevoDisplayClone = document.getElementById( "tempTechIcon" ).cloneNode( true );
							chevoDisplayClone.style.backgroundImage = "url('img/" + chevoData["sprite"] + "')";
							chevoDisplayClone.style.display         = "block";

						//ADD MOUSEOVER EVENT TO POP UP ACHIEVEMENT DETAILS
						chevoDisplayClone.addEventListener( "mouseover", function( e ) {
							//CLONE TEMP TECH DESCRIPTION BOX
							let container     = document.getElementById( "mainGame" );		//CONTAINER FOR TIP BOX
							let chevoBoxClone = document.getElementById( "tempAchievement" ).cloneNode( true );
							let panelWidth    = document.getElementById( "contentArea" ).getBoundingClientRect( ).width;

							let chevoBoxClose  = chevoBoxClone.children[0];                //Close Button
							let chevoBoxTitle  = chevoBoxClone.children[2].children[0];    //Chevo Title
							let chevoBoxIcon   = chevoBoxClone.children[1].children[0];    //Chevo Icon Link
							let chevoBoxDesc   = chevoBoxClone.children[2].children[1];    //Chevo Description

							//PLACEMENT OF THE CHEVO BOX
							chevoBoxClone.id                   = "chevoClone";
							chevoBoxClone.style.display        = "block";
							chevoBoxClone.style.left           = panelWidth + 10;
							chevoBoxClone.style.top            = e.clientY - 30;

							//ATTRIBUTES AND DETAIL OF THE CHEVO BOX
							chevoBoxClose.style.display        = "none";
							chevoBoxTitle.innerHTML            = chevoData["title"];
							chevoBoxIcon.style.backgroundImage = "url('img/" + chevoData["sprite"] + "')";
							chevoBoxDesc.innerHTML             = chevoData["desc"];

							container.appendChild( chevoBoxClone );
						});

						chevoDisplayClone.addEventListener( "mouseout", function( e ) {
							let clone = document.getElementById( "chevoClone" );
							( clone.parentNode ).removeChild( clone );
						});

						chevoEarnedBox.appendChild( chevoDisplayClone );
					}
				});
			}

			//CONTROL FOR SWITCHING TABS
			function switchTab( e ) {
				let txt = ( e.srcElement.innerHTML ).replace( "+", "-" );
				let id = ( e.srcElement.id ).replace( "Btn", "" );
				let element = document.getElementById( id );

				if( element.style.display == "block" ) {
					element.style.display = "none";
					e.srcElement.innerHTML = ( e.srcElement.innerHTML ).replace( "+", "-" );

				} else {
					element.style.display = "block";
					e.srcElement.innerHTML = ( e.srcElement.innerHTML ).replace( "-", "+" );
				}
			}

			//UPDATE THE NUMBERS WITHIN STATISTICS
			function updateStatistics( ) {
				let totalPooText  = SessionState.getDisplayNotation( "totalPoo" );
				let pooSinceStart = SessionState.getDisplayNotation( "pooSinceStart" );


				//TIMER
				currentTime.innerHTML 		 = SessionState.getTimer( ).elapsedToString( );
				
				//PLAYER'S ACTION SCORE
				totalClicks.innerHTML        = SessionState.getTotalClicks( );

				//UPGRADE SCORES
				totalUpgrades.innerHTML      = SessionState.getTotalUpgrade( );

				//PLAYER'S POO SCORES
				totalPooCollected.innerHTML  = totalPooText;
				totalPooSinceStart.innerHTML = pooSinceStart;

				//SCORE DISPLAY
				pooDisplay.innerHTML         = totalPooText + " POOPS";


				if( SessionState.getPPS( ) == 0 ) { 
					ppsDisplay.innerHTML = "per second: " + 0; 

				} else if( SessionState.getPPS( ) < 100 ) {
					let pps = (SessionState.getPPS( )).toFixed(2);
					ppsDisplay.innerHTML = "per second: " + pps; 
				} else {
					ppsDisplay.innerHTML = "per second: " + Math.round( SessionState.getPPS( ) );
				}
			}

			//GENERATE UPGRADE LIST [HANDS][SHOVEL][ETC]
			//ONLY CALL WHEN SOMETHING NEW IS UNLOCK
			function generateList( ) {
				var upgradeContainer = document.getElementById( "upgradeList" );
				    upgradeContainer.innerHTML = "";

				SessionState.upgradeToggle( );
				SessionState.isUpgradeEligible( );

				for( key in PooClickerData.upgrade ) {
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

						    switch( key ) {
						    	case "Hand":
						    		img.setAttribute( "src", "img/handOpen128x128.png" );	
						    	break;

						    	case "Shovel":
						    		img.setAttribute( "src", "img/shovel128x128.png" );	
						    	break;

						    	case "Baby":
						    		img.setAttribute( "src", "img/baby128x128.png" );	
						    	break;

						    	case "Animal Farm":
						    		img.setAttribute( "src", "img/moomoofarm128x128.png" );	
						    	break;

						    	case "Toilet":
						    		img.setAttribute( "src", "img/toilet128x128.png" );	
						    	break;

						    	default:
						    		img.setAttribute( "src", "img/shovel128x128.png" );	
						    	break;
						    }
						    

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

						let sum = PooClickerData.calcPrice( key, SessionState.getLevel( key ) );
							cost.innerHTML = SessionState.getDisplayNotation( sum );

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

							//===========================================
							// Check Clicked Upgrade Afforadability - Buy
							//===========================================
							if( SessionState.getBuyOrSell( ) ) {
								if( SessionState.isUpgradePurchaseable( id ) ) {
									//-Poo from Total Collected
									let pooStats  = document.getElementById( "totalPooCollected" );
									SessionState.subtractPoo( PooClickerData.calcSumPrice( id, SessionState.getLevel( id ), SessionState.getBuyOrSellQuantity( ) ) );
									pooStats.innerHTML = SessionState.getDisplayNotation( "totalPoo");

									//Increase Level +Quantity
									SessionState.upgradeLevelUp( id, SessionState.getBuyOrSellQuantity( ) );
									let level = document.getElementById( id + "Level" );
									level.innerHTML = SessionState.getLevel( id );

									//Recalculate Cost
									let cost  = document.getElementById( id + "Cost" );	
									let sum   = PooClickerData.calcSumPrice( id, SessionState.getLevel( id ), SessionState.getBuyOrSellQuantity( ) );			
									cost.innerHTML = SessionState.getDisplayNotation( sum );

									//Calculate the new PPS
									SessionState.calcPPS( );

									//Calculate if you have enough Poo for next upgrade
									SessionState.isUpgradePurchaseable( id )
								}
							}
							

							//=============================================
							// Check Clicked Upgrade Afforadability - Sell
							//=============================================
							else {
								// SELL UPGRADE AND ADD ONTO TOTAL POO
								let pooStats = document.getElementById( "totalPooCollected" );
								SessionState.addPoo( PooClickerData.calcSellPrice( id, SessionState.getLevel( id ), SessionState.getBuyOrSellQuantity( ) ) );
								pooStats.innerHTML = SessionState.getTotalPoo( );

								//===============================
								// Decrease Level -Quantity
								//===============================
								//IF QUANTITY AMOUNT IS GREATER THAN CURRENT LEVEL
								//SET LEVEL TO 0
								if( SessionState.getBuyOrSellQuantity( ) > SessionState.getLevel( id ) ) {
									SessionState.upgradeLevelDown( id, SessionState.getLevel( id ) );
								}

								//ELSE -QUANTITY
								else {
									SessionState.upgradeLevelDown( id, SessionState.getBuyOrSellQuantity( ) );
								}

								let level = document.getElementById( id + "Level" );
								level.innerHTML = SessionState.getLevel( id );
								
								//===============================
								// Recalculate Cost
								//===============================
								let cost  = document.getElementById( id + "Cost" );	
								cost.innerHTML = PooClickerData.calcSellPrice( id, SessionState.getLevel( id ), SessionState.getBuyOrSellQuantity( ) );


								//Calculate the new PPS
								SessionState.calcPPS( );

								//Calculate if you have enough Poo for next upgrade
								SessionState.isUpgradePurchaseable( id )
							}

							generateTechTreeIcon( );
							PooClickerData.getMessageBoardUpdate( );
						}
					}
				}
			}
			
			//GENERATE TECH TREE ICON BASED ON UPGRADE THAT IS RECENTLY
			//UNLOCK. 
			function generateTechTreeIcon( ) {
				let techTreeContainer = document.getElementById( "techList" );
				let techTreeArray     = PooClickerData.getPurchasbleTechTreeUpgrade( );

				//CLEAR TECH TREE ICONS
				techTreeContainer.innerHTML = "";

				//CONSTRUCT ICONS WITH UPGRADES THAT YOU DON'T HAVE.
				techTreeArray.forEach( function(element) {
					//CLONE TEMP TECHTREE ICON
					let clone = document.getElementById( "tempTechIcon" ).cloneNode( true );

					//ASSIGN CLONES WITH NEW INFORMATION
					clone.id               = "tech" + element;
					clone.style.background = "url('img/" + PooClickerData.getTechSprite( element ) + "')";
					clone.style.display    = "block";

					//ADD EVENTLISTENERS TO RESPONDE TO CLICKING
					//ADD EVENTREGISTRY IF NEEDED TO REMOVE EVENTLISTENER
					clone.addEventListener( "click", function( ) {
						let id       = (this.id).replace("tech", "" );
						let techCost = PooClickerData.getTechCost( id );

						//MAKE SURE THAT THE TECH IS PURCHASEABLE
						if( SessionState.getTotalPoo( ) >= techCost ) {
							let techTipBoxClone = document.getElementById( "clone" );

							SessionState.setTechPurchased( id );	//MARK TECHTREE PURCHASED (TRUE)
							SessionState.subtractPoo( techCost );	//SUBTRACT THE COST FROM TOTAL POO POOL

							SessionState.calcTechPPSBonus( );		//RECALCULATE ALL THE PPS BONUS

							techTreeContainer.removeChild( this );	//REMOVE TECH ICON FROM THE TECH LIST

							if( techTipBoxClone ) {
								techTipBoxClone.parentNode.removeChild( techTipBoxClone );
							}

							//Calculate the new PPS
							SessionState.calcPPS( );
						}
					});

					//WHEN PLAYER MOVE MOUSE OVER AN TECH UPGRADE
					//POP UP DISPLAY WILL TELL THE PLAYER WHAT THE TECH DOES.
					clone.addEventListener( "mouseover", function( e ) {
						let attachTo    = document.getElementById( "mainGame" );
						let panelWidth  = document.getElementById( "upgrades" ).getBoundingClientRect( ).width;
						let bodyWidth   = document.body.clientWidth;

						//CLONE TEMP TECH DESCRIPTION BOX
						let techBoxClone = document.getElementById( "tempTechDescBox" ).cloneNode( true );
						let techDescBox = techBoxClone.children[0];
						let techTipBox  = techBoxClone.children[1];

						//ASSIGN CLONES WITH NEW INFORMATION
						let techData    = PooClickerData.getTechById( ( e.srcElement.id ).replace( "tech", "" ) );

							techBoxClone.id                   = "clone";
							techDescBox.children[0].innerHTML = techData["title"];
							techDescBox.children[1].innerHTML = techData["effect"];

							techTipBox.children[0].innerHTML  = techData["desc"];


							//NEED TO KNOW IF THIS IS PURCHASEABLE
							if( SessionState.getTotalPoo( ) > techData["cost"] ) {
								techTipBox.children[1].innerHTML  = "Cost: " + 
								"<span class='purchaseable'>" + SessionState.getDisplayNotation( techData["cost"] ) + "</span>" + " poo";
							}

							else {
								techTipBox.children[1].innerHTML  = "Cost: " + 
								"<span class='notPurchaseable'>" + SessionState.getDisplayNotation( techData["cost"] ) + "</span>" + " poo";
							}

						//ASSIGN CLONES WITH NEW POSITION
							techBoxClone.style.display = "block";
							techBoxClone.style.left    = bodyWidth - panelWidth - 370;
							techBoxClone.style.top     = e.clientY - 75;

							//TOP MIGHT REQUIRE EXTRA ATTENTION BECAUSE THE ICON COULD BE SOMEWHERE REALLY LOW.
						attachTo.appendChild( techBoxClone );
					});

					clone.addEventListener( "mouseout", function( ) {
						let attachFrom   = document.getElementById( "mainGame" );
						let techBoxClone = document.getElementById( "clone" );

						attachFrom.removeChild( techBoxClone );
					});

					//ADD THEM TO THE TECH TREE CONTAINER.
					techTreeContainer.appendChild( clone );
				});	
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

