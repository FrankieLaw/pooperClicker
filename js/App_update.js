//=================================================================
// UPDATE THE NUMBERS WITHIN STATISTICS
//=================================================================
function updateStatistics( ) {
    updateMainStats( );
    updateStatistisScreen( );
}

function reduceTime( dataTime ) {
    let tmpTime = dataTime;
    let time = { "d" : 0, "h" : 0, "m" : 0, "s" : 0 };

    if( tmpTime >= 86400 ) {
        time["d"] = Math.floor( tmpTime / 86400 );
        tmpTime -= 86400 * time["d"];
    }   

    if( tmpTime >= 3600 ) {
        time["h"] = Math.floor( tmpTime / 3600 );
        tmpTime -= 3600 * time["h"];
    }

    if( tmpTime >= 60 ) {
        time["m"] = Math.floor( tmpTime / 60 );
        tmpTime -= 60 * time["m"];
    }

    time["s"] = tmpTime;
    tmpTime -= time["s"];

    return time;
}

function formatStatisticalGameTime( time ) {
    return (
    `${time["d"] == 0 ? "" : time["d"] + "d: "}` + 
    `${time["h"] == 0 ? "" : time["h"] + "h: "}` + 
    `${time["m"] == 0 ? "" : time["m"] + "m: "}` + 
    `${Math.floor(time["s"])}s` );
}

function formatMinimalGameTime( time ) {
    if( time["d"] > 0 ) {
        return `${time["d"]}d`;
    }
    
    else if( time["h"] > 0 ) {
        return `${time["h"]}h`
    }

    else if( time["m"] > 0 ) {
        return `${time["m"]}m`;
    }

    else {
        return `${Math.round(time["s"])}s`;
    }
}

function updateMainStats( ) {
    const totalPooText     = $ST.getDisplayNotation( "totalPoo" );
    const ppsDisplay  	   = $D.id( "ppsDisplay" );			    //Center Stage
    const pooDisplay  	   = $D.id( "totalPooDisplay" );		//Center Stage

    //SCORE DISPLAY
    pooDisplay.innerHTML = totalPooText + " POOPS";
    ppsDisplay.innerHTML = `per second: ${ $ST.getDisplayNotation( ( $ST.calcAllTotalPPS( ) ).toFixed(2) ) }`;
}

function updateStatistisScreen( ) {
    const totalPooText  = $ST.getDisplayNotation( "totalPoo" );
    const pooSinceStart = $ST.getDisplayNotation( "pooSinceStart" );

    const currentTime 	       = $D.id( "currentTime" );		    //STATISTICS TAB
	const totalPooCol 	       = $D.id( "totalPooCollected" );	    //STATISTICS TAB
	const totalClicks 	       = $D.id( "totalClicksMade" );	    //STATISTICS TAB
	const totalPooSinceStart   = $D.id( "totalPooSinceStart" );	    //STATISTICS TAB
	const totalUpgrades        = $D.id( "totalUpgrades" );		    //STATISTICS TAB
    const totalUpgradeUnlocked = $D.id( "totalUpgradeUnlocked" );	//STATISTICS TAB
    const currentPPS           = $D.id( "currentPPS" );
    const ppsMultiplier        = $D.id( "ppsMultiplier" );
    const handStats            = $D.id( "handStats" );

    const s = reduceTime( $ST.getCurSessionTime( ) );

    //OVERALL STATS
    currentTime.innerHTML        = formatStatisticalGameTime( s );
    totalClicks.innerHTML        = $ST.getTotalClicks( );
    totalUpgrades.innerHTML      = $ST.getTotalUpgrade( );
    totalPooCollected.innerHTML  = totalPooText;
    totalPooSinceStart.innerHTML = $ST.getDisplayNotation( pooSinceStart );
    currentPPS.innerHTML         = $ST.getDisplayNotation( ( $ST.getPPS( ) ).toFixed( 2 ) );
    ppsMultiplier.innerHTML      = `+${$ST.getAllUnlockedChevo( ).length}%`;
    
    //UPGRADE STATISTICS
    totalUpgradeUnlocked.innerHTML = `${$ST.getAllOwnedTech( ).length} / ${$PC.getTechTreeLength( )}`;

    handStats.children[1].innerHTML = $ST.getUpgradeLevel( "Hand" );                    //level
    handStats.children[2].innerHTML = $ST.getMultiplierByName( "Hand" ).toFixed(2);     //multiplier
    handStats.children[3].innerHTML = $ST.getDisplayNotation( $ST.calcPooPerClick( ) ); //Clicking power


    //================================
    // DYNAMIC - UPGRADE STATISTICS
    //================================
    //FIND OUT WHICH UPGRADE IS UNLOCKED AND ONLY PROCESS THOSE UPGRADES
    Object.keys( $ST.getUpgradeList( ) ).forEach( (key) => {
        if( $ST.isUpgradeUnLock( key ) && key != "Hand" ) {

            const curRow = $D.id( key + "Row" ) == undefined ? undefined : $D.id( key + "Row" );

            //RESET UPGRADE CHART
            if( $D.id( "upgradeHeader" ) == undefined ) {
                resetUpgradeChartHeader( );
            }            
            
            if( curRow == undefined ) {
                const container = $D.id( "upgradeChart" );
                const clone     = $D.clone( "tempUpgradeChartRow", true );

                //CLONE THE REST OF THE UPGRADES
                clone.setAttribute( "id", `${key}Row` );
                clone.children[0].children[0].setAttribute( "src", `./img/${$PC.getUpgradeShop(key)}` );
                clone.children[1].innerHTML = $ST.getUpgradeLevel(key);
                clone.children[2].innerHTML = $ST.getMultiplierByName(key).toFixed(2);
                clone.children[3].innerHTML = $ST.getDisplayNotation( $ST.calcPPSByName( key ).toFixed(2) );

                container.appendChild( clone );
            } 
            
            else {
                curRow.children[1].innerHTML = $ST.getUpgradeLevel(key);
                curRow.children[2].innerHTML = $ST.getMultiplierByName(key).toFixed(2);
                curRow.children[3].innerHTML = $ST.getDisplayNotation( $ST.calcPPSByName( key ).toFixed(2) );
            }
        }
    });

    function resetUpgradeChartHeader( ) {
        const container = $D.id( "upgradeChart" );
        const clone = $D.clone( "tempUpgradeChartRow", true );
        
        clone.setAttribute( "id", "upgradeHeader" );
        clone.className += " chartHeader";
        clone.children[1].innerHTML = "Lv";
        clone.children[2].innerHTML = "Multiplier";
        clone.children[3].innerHTML = "PPS";

        container.appendChild( clone );
    }
}

//=================================================================
// UPDATE ACHIEVEMENTS
//=================================================================
function updateAchievementScreen( ) {
    let chevoEarnedBox = $D.id( "achievementTab" );	//attachTo
    let allChevoKeys   = $ST.getAchievementKeys( );	//[1][2][3]
    
    let chevoUnlocked  = $ST.getAllUnlockedChevo( ).length;
    let chevoCountStr  = `${chevoUnlocked} / ${$ST.getAchievementLength( )}`;

    //RESET ACHIEVEMENT DISPLAY CASE
    chevoEarnedBox.innerHTML = "";	

    //SET ACHIEVEMENTS UNLOCKED
    $D.id( "chevoCount" ).innerHTML = `Achievements Unlocked: ${chevoCountStr}`;
    $D.id( "chevoNote" ).innerHTML  = `PPS Bonus: +${chevoUnlocked}%`;

    //UPDATE EVERY ICON ON THE LIST TO MAKE SURE NOTHING IS MISSING
    allChevoKeys.forEach( function( keys ) {

        //CLONE THE TECH ICON AS ACHIEVEMENT ICON
        if( $ST.getAchievementById( keys ) ) {
            let chevoData   = $PC.getAchievementById( keys );

            let chevoDisplayClone = $D.id( "tempTechIcon" ).cloneNode( true );
                chevoDisplayClone.style.backgroundImage = "url('img/" + chevoData["sprite"] + "')";
                chevoDisplayClone.style.display         = "block";

            //ADD MOUSEOVER EVENT TO POP UP ACHIEVEMENT DETAILS
            chevoDisplayClone.addEventListener( "mouseover", function( e ) {
                //CLONE TEMP TECH DESCRIPTION BOX
                let container     = $D.id( "statsScreen" );		//CONTAINER FOR TIP BOX
                let chevoBoxClone = $D.id( "tempAchievement" ).cloneNode( true );
                let panelWidth    = $D.id( "upgradeScreen" ).getBoundingClientRect( ).width;

                
                let chevoBoxClose  = chevoBoxClone.children[0];                //Close Button
                let chevoBoxTitle  = chevoBoxClone.children[2].children[0];    //Chevo Title
                let chevoBoxIcon   = chevoBoxClone.children[1].children[0];    //Chevo Icon Link
                let chevoBoxDesc   = chevoBoxClone.children[2].children[1];    //Chevo Description

                //PLACEMENT OF THE CHEVO BOX
                chevoBoxClone.id                   = "chevoClone";
                chevoBoxClone.style.position       = "absolute";
                chevoBoxClone.style.display        = "block"; 
                chevoBoxClone.style.left           = ( e.x - 400 ) + "px";  //panelWidth + 10;
                chevoBoxClone.style.top            = e.y + "px";  //e.clientY - 30;

                //ATTRIBUTES AND DETAIL OF THE CHEVO BOX
                chevoBoxClose.style.display        = "none";
                chevoBoxTitle.innerHTML            = chevoData["title"];
                chevoBoxIcon.style.backgroundImage = "url('img/" + chevoData["sprite"] + "')";
                chevoBoxDesc.innerHTML             = chevoData["desc"];

                container.appendChild( chevoBoxClone );
            });

            chevoDisplayClone.addEventListener( "mouseout", function( e ) {
                let clone = $D.id( "chevoClone" );
                ( clone.parentNode ).removeChild( clone );
            });

            chevoEarnedBox.appendChild( chevoDisplayClone );
        }
        
        else {
            let chevoDisplayClone = $D.id( "tempTechIcon" ).cloneNode( true );
                chevoDisplayClone.className = "chevoBlankIcon";
                chevoDisplayClone.style.backgroundImage = "url('img/chevo0.png')";
                chevoDisplayClone.style.backgroundColor = "";
                chevoDisplayClone.style.display         = "block";

            chevoEarnedBox.appendChild( chevoDisplayClone );
        }
    });
}

function updateAchievementNotification( ) {
    let achievementPopUp = $PC.checkAchievement( $ST.getAchievement( ) );

    //==========================================================
    // UPDATE ACHIEVEMENT NOTIFICATION
    //==========================================================
    achievementPopUp.forEach( function( element ) {
        let chevoContainer = $D.id( "chevoContainer" );
        let chevoClone     = $D.id( "tempAchievement" ).cloneNode( true );
        let chevoData      = $PC.getAchievementById( element );

        let chevoClose     = chevoClone.children[0];                //Close Button
        let chevoTitle     = chevoClone.children[2].children[0];    //Chevo Title
        let chevoIcon      = chevoClone.children[1].children[0];    //Chevo Icon Link
        let chevoDesc      = chevoClone.children[2].children[1];    //Chevo Description

        chevoTitle.innerHTML            = chevoData["title"];
        chevoIcon.style.backgroundImage = "url('img/" + chevoData["sprite"] + "')";
        chevoDesc.innerHTML             = chevoData["desc"];
        chevoClone.style.display        = "block";
        chevoClone.style.opacity        = 1.0;

        //SETUP ONCLICK EVENT FOR THE X BUTTON
        chevoClose.addEventListener( "click", function( e ) {
            let container = $D.id( "chevoContainer" );
            container.removeChild( this.parentNode );
        });

        const selfDestruct = new PooTimer( chevoClone, 18000, 35, "chevo", 10000 );
		selfDestruct.start( );

        //ATTACH IT TO THE ALLOCATED SPOT
        chevoContainer.appendChild( chevoClone );
    });

    return achievementPopUp.length;
}


//=================================================================
// GENERATE UPGRADE LIST [HANDS][SHOVEL][ETC]
// ONLY CALL WHEN SOMETHING NEW IS UNLOCK
//=================================================================
function updatePooStore( ) {
    let upgradeContainer = $D.id( "upgradeList" );
        upgradeContainer.innerHTML = "";

    $ST.upgradeToggle( );
    $ST.isUpgradeEligible( );

    $PC.getAllUpgradeName( ).forEach( (key) => {
        if( $ST.isUpgradeUnLock( key ) ) {
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

            if( $ST.isUpgradePurchaseable( key ) ) {
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

                if( $ST.isUpgradePurchaseable( key ) ) {
                    cost.setAttribute( "class", "cost purchaseable" );
                } else {
                    cost.setAttribute( "class", "cost notPurchaseable" );
                }

            let sum = $PC.calcPrice( key, $ST.getUpgradeLevel( key ) );
                cost.innerHTML = $ST.getDisplayNotation( sum );

            //=======================
            // SPAN ELEMENT - LEVEL
            //=======================
            let level = document.createElement( "span" );
                level.setAttribute( "id", key + "Level" );
                level.setAttribute( "class", "level" );
                level.innerHTML = $ST.getUpgradeLevel( key );

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
                if( $ST.getBuyOrSell( ) ) {
                    if( $ST.isUpgradePurchaseable( id ) ) {
                        //-Poo from Total Collected
                        let pooStats  = $D.id( "totalPooCollected" );
                        $ST.subtractPoo( $PC.calcSumPrice( id, $ST.getUpgradeLevel( id ), $ST.getBuyOrSellQuantity( ) ) );
                        pooStats.innerHTML = $ST.getDisplayNotation( "totalPoo");

                        //Increase Level +Quantity
                        $ST.upgradeLevelUp( id, $ST.getBuyOrSellQuantity( ) );
                        let level = $D.id( id + "Level" );
                        level.innerHTML = $ST.getUpgradeLevel( id );

                        //Recalculate Cost
                        let cost  = $D.id( id + "Cost" );	
                        let sum   = $PC.calcSumPrice( id, $ST.getUpgradeLevel( id ), $ST.getBuyOrSellQuantity( ) );			
                        cost.innerHTML = $ST.getDisplayNotation( sum );

                        //Calculate the new PPS
                        $ST.calcPPS( );

                        //Calculate if you have enough Poo for next upgrade
                        $ST.isUpgradePurchaseable( id )
                    }
                }
                

                //=============================================
                // Check Clicked Upgrade Afforadability - Sell
                //=============================================
                else {
                    // SELL UPGRADE AND ADD ONTO TOTAL POO
                    let pooStats = $D.id( "totalPooCollected" );
                    $ST.addPoo( $PC.calcSellPrice( id, $ST.getUpgradeLevel( id ), $ST.getBuyOrSellQuantity( ) ) );
                    pooStats.innerHTML = $ST.getTotalPoo( );

                    //===============================
                    // Decrease Level -Quantity
                    //===============================
                    //IF QUANTITY AMOUNT IS GREATER THAN CURRENT LEVEL
                    //SET LEVEL TO 0
                    if( $ST.getBuyOrSellQuantity( ) > $ST.getUpgradeLevel( id ) ) {
                        $ST.upgradeLevelDown( id, $ST.getUpgradeLevel( id ) );
                    }

                    //ELSE -QUANTITY
                    else {
                        $ST.upgradeLevelDown( id, $ST.getBuyOrSellQuantity( ) );
                    }

                    let level = $D.id( id + "Level" );
                    level.innerHTML = $ST.getUpgradeLevel( id );
                    
                    //===============================
                    // Recalculate Cost
                    //===============================
                    let cost  = $D.id( id + "Cost" );	
                    cost.innerHTML = $PC.calcSellPrice( id, $ST.getUpgradeLevel( id ), $ST.getBuyOrSellQuantity( ) );


                    //Calculate the new PPS
                    $ST.calcPPS( );

                    //Calculate if you have enough Poo for next upgrade
                    $ST.isUpgradePurchaseable( id )
                }

                updateTechTree( );
                $PC.getMessageBoardUpdate( );
            }
        }
    });
}

function updatePurchaseAvailability( ) {
	//===================================================
	// IF YOU ARE BUYING - EXECUTE THE FOLLOWING CODE
	//===================================================
	if( $ST.getBuyOrSell( ) ) {
		//TOGGLE "ANY" UPGRADE THAT IS PURCHASEABLE
		//CHANGE CSS ON UPGRADE THAT IS PURCHASEABLE
		$ST.upgradeToggle( );
		let upgradeList = $ST.getUpgradeList( );
		

		for( key in upgradeList ) {
			//IF IT IS NOT LOCKED - DO SOMETHING
			//ELSE - DO NOTHING
			if( upgradeList[key]["lock"] != false ) {
				if( upgradeList[key]["upgradeable"] ) {
					let tempTitle = $D.id( key + "Title" );
						tempTitle.setAttribute( "class", "label" );

					let tempCost  = $D.id( key + "Cost" );
						tempCost.setAttribute( "class", "cost purchaseable" );

				} else {
					let tempTitle = $D.id( key + "Title" );
						tempTitle.setAttribute( "class", "label notPurchaseable" );

					let tempCost  = $D.id( key + "Cost" );
						tempCost.setAttribute( "class", "cost notPurchaseable" );
				}
			}
		}
	}

	//===================================================
	// IF YOU ARE SELLING - EXECUTE THE FOLLOWING CODE
	//===================================================
	else {
    	const temp = Object.keys( $ST.getUpgradeList( ) );

		temp.forEach( ( key ) => {
			//CHECK IF THE ELEMENT EXIST
			if( $D.id( key + "Upgrade" ) ) {
				$D.id( key + "Title" ).className = "label";

				let el = $D.id( key + "Cost" );
				
				el.className = $ST.getUpgradeLevel( key ) === 0 ? "cost notPurchaseable" : "cost purchaseable";				
			}
		});
	}
}

//=================================================================
// GENERATE TECH TREE ICON BASED ON UPGRADE THAT IS RECENTLY UNLOCK.
//=================================================================
function updateTechTree( ) {
    let techTreeContainer = $D.id( "techList" );
    let techTreeArray     = $PC.getPurchasbleTechTreeUpgrade( );

    //CLEAR TECH TREE ICONS
    techTreeContainer.innerHTML = "";

    //CONSTRUCT ICONS WITH UPGRADES THAT YOU DON'T HAVE.
    techTreeArray.forEach( function(element) {
        //CLONE TEMP TECHTREE ICON
        let clone = $D.id( "tempTechIcon" ).cloneNode( true );

        //ASSIGN CLONES WITH NEW INFORMATION
        clone.id               			= "tech" + element;
        clone.style.background 			= "url('img/" + $PC.getTechSprite( element ) + "')";
        clone.style.backgroundRepeat  	= "no-repeat";
        clone.style.display    			= "block";

        //ADD EVENTLISTENERS TO RESPONDE TO CLICKING
        //ADD EVENTREGISTRY IF NEEDED TO REMOVE EVENTLISTENER
        clone.addEventListener( "click", function( ) {
            let id       = (this.id).replace("tech", "" );
            let techCost = $PC.getTechCost( id );

            //MAKE SURE THAT THE TECH IS PURCHASEABLE
            if( $ST.getTotalPoo( ) >= techCost ) {
                let techTipBoxClone = $D.id( "clone" );

                $ST.setTechPurchased( id );	    //MARK TECHTREE PURCHASED (TRUE)
                $ST.subtractPoo( techCost );	//SUBTRACT THE COST FROM TOTAL POO POOL

                techTreeContainer.removeChild( this );	//REMOVE TECH ICON FROM THE TECH LIST

                if( techTipBoxClone ) {
                    techTipBoxClone.parentNode.removeChild( techTipBoxClone );
                }

                //Calculate the new PPS
                $ST.calcPPS( );
                updateOwnedTechScreen( );
            }
        });

        //WHEN PLAYER MOVE MOUSE OVER AN TECH UPGRADE
        //POP UP DISPLAY WILL TELL THE PLAYER WHAT THE TECH DOES.
        clone.addEventListener( "mouseover", function( e ) {
            let attachTo    = $D.id( "mainGame" );
            let panelWidth  = $D.id( "upgradeScreen" ).getBoundingClientRect( ).width;
            let cmdPanelWid = $D.id( "commandPanel" ).getBoundingClientRect( ).width;
            let bodyWidth   = document.body.clientWidth;

            //CLONE TEMP TECH DESCRIPTION BOX
            let techBoxClone = $D.id( "tempTechDescBox" ).cloneNode( true );
            let techDescBox = techBoxClone.children[0];
            let techTipBox  = techBoxClone.children[1];


            //ASSIGN CLONES WITH NEW INFORMATION
            let techData    = $PC.getTechById( ( e.srcElement.id ).replace( "tech", "" ) );

                techBoxClone.id                   = "clone";
                techDescBox.children[0].innerHTML = techData["title"];
                techDescBox.children[1].innerHTML = techData["effect"];

                techTipBox.children[0].innerHTML  = techData["desc"];


                //NEED TO KNOW IF THIS IS PURCHASEABLE
                if( $ST.getTotalPoo( ) > techData["cost"] ) {
                    techTipBox.children[1].innerHTML  = "Cost: " + 
                    "<span class='purchaseable'>" + $ST.getDisplayNotation( techData["cost"] ) + "</span>" + " poo";
                }

                else {
                    techTipBox.children[1].innerHTML  = "Cost: " + 
                    "<span class='notPurchaseable'>" + $ST.getDisplayNotation( techData["cost"] ) + "</span>" + " poo";
                }

            //ASSIGN CLONES WITH NEW POSITION
                techBoxClone.style.display = "block";
                techBoxClone.style.left    = ( bodyWidth - panelWidth - cmdPanelWid - 360 ) + "px";
                techBoxClone.style.top     = ( e.y - 45 ) + "px";

                //TOP MIGHT REQUIRE EXTRA ATTENTION BECAUSE THE ICON COULD BE SOMEWHERE REALLY LOW.
            attachTo.appendChild( techBoxClone );
        });

        clone.addEventListener( "mouseout", function( ) {
            let attachFrom   = $D.id( "mainGame" );
            let techBoxClone = $D.id( "clone" );

            attachFrom.removeChild( techBoxClone );
        });

        //ADD THEM TO THE TECH TREE CONTAINER.
        techTreeContainer.appendChild( clone );
    });	
}

function updateOwnedTechScreen( callFrom ) {
    //GET ALL THE OWNED TECH FROM $ST
    //GET ID = upgradeOwnTab
    //CLONE THE ICONS -> REPLACE INFORMATION -> ATTACH TO CONTAINER
    const ownedTech = $ST.getAllOwnedTech( );
    const container = $D.id( "upgradeOwnTab" );
          
    //REST OWNED UPDATE CONTAINER
    container.innerHTML = "";   
    // $D.id( "techCount" ).innerHTML = `Tech Unlocked: ${ownedTech.length} / ${$PC.getTechTreeLength( )}`;

    ownedTech.forEach( ( key ) => {
        const techDetail = $PC.getTechById( key );
        const clone      = $D.id( "tempTechIcon" ).cloneNode( true );

        //ASSIGN CLONES WITH NEW INFORMATION
        clone.id               			= "tech" + key;
        clone.style.backgroundImage     = "url('img/" + techDetail["sprite"] + "')";
        clone.style.backgroundRepeat  	= "no-repeat";
        clone.style.display    			= "block";

        //WHEN PLAYER MOVE MOUSE OVER AN TECH UPGRADE
        //POP UP DISPLAY WILL TELL THE PLAYER WHAT THE TECH DOES.
        clone.addEventListener( "mouseover", function( e ) {
            let attachTo    = $D.id( "statsScreen" );

            //CLONE TEMP TECH DESCRIPTION BOX
            let techBoxClone = $D.id( "tempTechDescBox" ).cloneNode( true );
            let techDescBox  = techBoxClone.children[0];
            let techTipBox   = techBoxClone.children[1];


            //ASSIGN CLONES WITH NEW INFORMATION
            techBoxClone.id                   = "clone";
            techDescBox.children[0].innerHTML = techDetail["title"];
            techDescBox.children[1].innerHTML = techDetail["effect"];
            techTipBox.children[0].innerHTML  = techDetail["desc"];

            techTipBox.children[1].innerHTML  = "Cost: " + 
                "<span class='purchaseable'>" + $ST.getDisplayNotation( techDetail["cost"] ) + "</span>" + " poo";


            //ASSIGN CLONES WITH NEW POSITION
            techBoxClone.style.display = "block";
            techBoxClone.style.left    = e.x + "px";
            techBoxClone.style.top     = e.y + "px";

            //TOP MIGHT REQUIRE EXTRA ATTENTION BECAUSE THE ICON COULD BE SOMEWHERE REALLY LOW.
            attachTo.appendChild( techBoxClone );
        });

        clone.addEventListener( "mouseout", function( ) {
            let attachFrom   = $D.id( "statsScreen" );
            let techBoxClone = $D.id( "clone" );

            attachFrom.removeChild( techBoxClone );
        });

        container.appendChild( clone );
    });
}


//=================================================================
// UPDATE MESSAGE BOARD
//=================================================================
function updateMessageBoard( ) {
    enableMsg( );
}

function enableMsg( ) {
    let message = $D.id( "randomMessage" );
        message.className = "randomMessage";
        message.innerHTML = $ST.getRandomMessage( );
}

function disableMsg( ) {
    let message = $D.id( "randomMessage" );
        message.className = "staticMessage";
}


//=================================================================
// UPDATE GAME TIMER
//=================================================================
function updateGameTime( s ) {
    $ST.addCurSessionTime( s );
}


//=================================================================
// UPDATE GAME (IN FOCUS & OUT OF FOCUS)
//=================================================================
function updateBrowserTitle( userMsg = "", tm = `POOPER CLICKER &copy ${$ST.Copyright("dateTo")} | ${$ST.Copyright("version")}`) {
    const poo = $ST.getDisplayNotation( "totalPoo" );
    const prefix = ( poo == 0 ) ? "" : `${poo} POOS | `;
    const title = $D.id( "browserTitle" );

    title.innerHTML = prefix + userMsg + tm;
}

function updateWindowInFocus( frames ) {
    const secondsElapsed = Math.floor( frames / FPS );
    const ppsCollected   = secondsElapsed * $ST.getPPS( );
    
    $ST.addPoo( ppsCollected );
	updateGameTime( secondsElapsed );
}

function updateWindowOutofFocus( frames ) {
    const secondsElapsed = Math.floor( frames / FPS );
    $D.id( "browserTitle" ).innerHTML = `Away ${secondsElapsed}s | POOPER CLICKER &copy ${$ST.Copyright("dateTo")} | ${$ST.Copyright("version")}`;
}