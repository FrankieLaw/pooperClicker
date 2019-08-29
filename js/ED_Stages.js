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

			giantPoo.addEventListener( "mousedown", function( ) {
				this.style.className = "handCloseCursor";
				console.log( this );
			})

//
//
//
//
//
//=================================================================
// QUANTITY CONTROL - METHODS
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

						let newCost        = PooClickerData.calcSumPrice( name, curLevel, increment );
						

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

						let refundAmt      = PooClickerData.calcSellPrice( name, curLevel, decrement );
						

						upgradeElement.innerHTML = refundAmt;
					});
				}
			}
//
//
//
//
//

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

				updateStatistics( );				//SET STATISTICS VISUAL
				generateList( );					//SET UPGRADE LIST VISUAL
				generateTechTreeIcon( ); 			//SET TECH TREE ICON VISUAL
				SessionState.getTimer( ).start( );	//START GAME TIMER

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
				}
			}


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


				//====================================
				// STAGE SETUP & SWITCH TO PAGE1
				//====================================
				ED_Stages( ).setStage( e.srcElement.attributes["data-target"].value );
				SessionState.changeStageTo( e.srcElement.attributes["data-target"].value );


				//END GAME TIMER
				SessionState.getTimer( ).end( );
				clearInterval( updateTimer );

				//SAVE PROGRESS
				SaveData.saveToLocalStorage( );

				//RESET SESSION STATE FOR THE NEXT GAME
				SessionState.reset( );
				resetTab( );
				resetQuantity( );
				resetTechTree( );
			}


//=================================================================
// RESET CONTROLS - METHODS
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


			function updateStatistics( ) {
				currentTime.innerHTML 		 = SessionState.getTimer( ).elapsedToString( );
				totalPooCollected.innerHTML  = Math.round( SessionState.getTotalPoo( ) );
				totalClicks.innerHTML        = SessionState.getTotalClicks( );
				totalPooSinceStart.innerHTML = SessionState.getPooSinceStart( );
				totalUpgrades.innerHTML      = SessionState.getTotalUpgrade( );

				pooDisplay.innerHTML         = Math.round( SessionState.getTotalPoo( ) ) + " POOPS";

				if( SessionState.getPPS( ) == 0 ) { 
					ppsDisplay.innerHTML = "per second: " + 0; 

				} else if( SessionState.getPPS( ) < 100 ) {
					let pps = (SessionState.getPPS( )).toFixed(2);
					ppsDisplay.innerHTML = "per second: " + pps; 
				} else {
					ppsDisplay.innerHTML = "per second: " + Math.round( SessionState.getPPS( ) );
				}
			}

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

							cost.innerHTML = PooClickerData.calcPrice( key, SessionState.getLevel( key ) );

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
									pooStats.innerHTML = SessionState.getTotalPoo( );

									//Increase Level +Quantity
									SessionState.upgradeLevelUp( id, SessionState.getBuyOrSellQuantity( ) );
									let level = document.getElementById( id + "Level" );
									level.innerHTML = SessionState.getLevel( id );

									//Recalculate Cost
									let cost  = document.getElementById( id + "Cost" );					
									cost.innerHTML = PooClickerData.calcSumPrice( id, SessionState.getLevel( id ), SessionState.getBuyOrSellQuantity( ) );

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
						}
					}
				}
			}

			/*\
			|*|==========================================================
			|*| Method: generateTechTreeIcon( )
			|*| Return: Nothing
			|*|
			|*| Description: To construct a TechTree Icon list
			|*| 			 everytime the player purchases or
			|*|              sells an upgrade.
			|*|==========================================================
			\*/		
			function generateTechTreeIcon( ) {
				let techTreeContainer = document.getElementById( "techList" );
				let techTreeArray = PooClickerData.getPurchasbleTechTreeUpgrade( );

				//CLEAR TECH TREE ICONS
				techTreeContainer.innerHTML = "";

				//CONSTRUCT ICONS WITH UPGRADES THAT YOU DON'T HAVE.
				techTreeArray.forEach( function(element) {
					//CLONE TEMP TECHTREE ICON
					let clone = document.getElementById( "tempTechIcon" ).cloneNode( true );

					//ASSIGN CLONES WITH NEW INFORMATION
					clone.id               = "tech" + element;
					clone.style.background = "url('img/" + PooClickerData.getTechSprite( element ) + "')";

					//ADD EVENTLISTENERS TO RESPONDE TO CLICKING
					//ADD EVENTREGISTRY IF NEEDED TO REMOVE EVENTLISTENER
					clone.addEventListener( "click", function( ) {
						let id       = (this.id).replace("tech", "" );
						let techCost = PooClickerData.getTechCost( id );

						//MAKE SURE THAT THE TECH IS PURCHASEABLE
						if( SessionState.getTotalPoo( ) >= techCost ) {
							SessionState.setTechPurchased( id );	//MARK TECHTREE PURCHASED (TRUE)
							SessionState.subtractPoo( techCost );	//SUBTRACT THE COST FROM TOTAL POO POOL

							SessionState.calcTechPPSBonus( );		//RECALCULATE ALL THE PPS BONUS

							techTreeContainer.removeChild( this );	//REMOVE TECH ICON FROM THE TECH LIST

							//Calculate the new PPS
							SessionState.calcPPS( );
						}
					});

					//ADD THEM TO THE TECH TREE CONTAINER.
					techTreeContainer.appendChild( clone );
				});
				
			}

			function poo_onClick( e ) {
				var pooArea = document.getElementById( "pooArea" );

				//Add div element with the number pop up
				//Div moves up over 1 seconds and disappears after 1 seconds
				//absolute position it.
				let tempDiv = document.createElement( "div" );
				let txtNode = document.createTextNode( "+1" );

				tempDiv.setAttribute( "class", "pooClicked" );
				tempDiv.style.left = between(e.offsetX - 24, e.offsetX + 56) + "px";
				tempDiv.style.top  = (e.offsetY-50) + "px";
				tempDiv.style.opacity = 1.0;

				tempDiv.appendChild( txtNode );
				pooArea.appendChild( tempDiv );

				var tempTimer = new PooNumber( tempDiv );
				tempTimer.start( );

				SessionState.addPoo( 1000 );
				SessionState.addClick( 1 );
				SessionState.addPooSinceStart( 1 );
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

