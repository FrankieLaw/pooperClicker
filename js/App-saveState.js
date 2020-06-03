function App_SaveState( ) {
	//=============================================================
	// Save Method - Required Game Slot Name
	//				 Otherwise it will save over other save games.
	//=============================================================
	function saveToLocalStorage( ) {
		//=============================================
		// IF IT IS USING A TEMPORARY SLOT
		// FIND A NEW SLOT FOR IT AUTOMATICALLY
		//=============================================
		if( $ST.saveSlot( ) == `pc-${$ST.Copyright("version")}-tempSlot` ) {
			let length = Object.getOwnPropertyNames( localStorage ).length;

			//Check if the SlotName already Exist
			while( localStorage.getItem( `pc-${$ST.Copyright("version")}-Slot` + length ) != null ) {
				length++;
			};

			$ST.newSlot( `pc-${$ST.Copyright("version")}-Slot` + length );	
		}


		//==========================================
		//	Final Data that will be saved
		//==========================================
		let saveData = {};							//blank save data
		saveData[$ST.saveSlot( )] = {};				//create save data slot = empty {}

		let playerState = $ST.savePlayerState( );	//Get _playerState
		saveData[$ST.saveSlot( )] = playerState;	//Put everything inside localStorage

		console.group( "Inside PlayerState" );
			console.log( playerState );
		console.groupEnd( );


		//==========================================
		//	Encryption Data
		//==========================================
		let temp = JSON.stringify( saveData[$ST.saveSlot( )] );
		let encrypted = Encrypt( temp );

		console.group( "What is being Saved" );
			console.log( temp );
		console.groupEnd( );

		//==========================================
		//	Transfer Encrypted Data to localStorage
		//==========================================
		localStorage.setItem( $ST.saveSlot( ), encrypted );


		//==========================================
		//	Quick Save Feature
		//==========================================
		localStorage.setItem( `pc-${$ST.Copyright("version")}-quickSave`, $ST.saveSlot( ) );


		//==========================================
		//	Basic Encryption Algorithm
		//==========================================
		function Encrypt( value ) {
			let output = "";

			for( let i = 0; i < value.length; i++ ) {
				output += String.fromCharCode(value.charCodeAt(i) + 5);
			}

		  	return output;
		}
	};

	//=============================================================
	// Load Method - Required Game Slot Name
	//				 Otherwise it will not know which game to load.
	//=============================================================
	function loadFromLocalStorage( ) {
		let count = 0;
		
		//Filter Local Storage Data
		//Retrieve all Save Slots, except quickSave
		let keyArray        = Object.getOwnPropertyNames( localStorage );
		let saveSlotPattern = new RegExp( "^pc-" + $ST.Copyright("version") + "-Slot\\d{0,2}$", "g" );

		keyArray = keyArray.filter( function( data ) {
			return data.match( saveSlotPattern );
		});


		//Slot Container ID "saveSlotContainer"
		let container = document.getElementById( "saveSlotContainer" );

		//Each Slot found have their own click box
		//that player can select their characters from.
		for( let i = 0; i < keyArray.length; i++ ) {
			let saveDat = JSON.parse( Decrypt( localStorage.getItem( keyArray[i] ) ) );
			let saveTxt = saveDat["WorldName"];
				saveTxt += " > Run Time: " + saveDat["GameTime"]["seconds"];

			let tempDiv = document.createElement( "div" );
	    	let txtNode = document.createTextNode( saveTxt );
	    	
	    	//Set Class Attribute
	    	tempDiv.setAttribute( "class", "saveBlock" );
	    	tempDiv.setAttribute( "id", ("p2-" + keyArray[i]) );
	    	tempDiv.setAttribute( "data-target", "page4" );


	    	//Dynamically create event listeners
	    	tempDiv.addEventListener( "click", onClick );
	    	tempDiv.addEventListener( "mouseover", onMouseOver );

	    	EventRegistry.add( ("p2-" + keyArray[i]), "click", onClick );
	    	EventRegistry.add( ("p2-" + keyArray[i]), "mouseover", onMouseOver );

	    	//Attach SaveSlot Element to Container
	    	tempDiv.appendChild( txtNode );
	    	container.appendChild( tempDiv );

	    	//=========================================
	    	//Click Box Methods - mouseOver and Click
	    	//=========================================
	    	function onMouseOver( e ) { e.srcElement.style.cursor = "Pointer"; }

	    	function onClick( e ) {
	    		//=======================================
	    		// REMOVE EVENTLISTENER FROM save Slots
	    		// CLEAR SAVE SLOT ELEMENTS
	    		//=======================================
	    		removeSaveSlotEvents( );
	    		
	    		//===================================
	    		// REMOVE EVENTLISTENER FROM PAGE2
	    		//===================================	    		
	    		let p2Elem = document.getElementById( "p2-backBtn" );
	    		let bMover = EventRegistry.getEvent( "p2-backBtn", "click" );
	    		let bClick = EventRegistry.getEvent( "p2-backBtn", "mouseover" );

	    		EventRegistry.remove( "p2-backBtn", "mouseover" );
	    		EventRegistry.remove( "p2-backBtn", "click" );

	    		p2Elem.removeEventListener( bMover.eventType, bMover.callback );
	    		p2Elem.removeEventListener( bClick.eventType, bClick.callback );


	    		//===================================
	    		// LOAD DATA FROM LOCAL STORAGE
	    		// SET DATA TO SESSION STATE
	    		//===================================
				let slot = ( e.srcElement.id ).replace( "p2-", "" );
				$ST.makeGame( slot, JSON.parse( Decrypt( localStorage.getItem( slot ) ) ) );

			//Delete me//
				console.groupCollapsed( "Loaded Data" );
					console.log( JSON.parse( Decrypt( localStorage.getItem( slot ) ) ) );
				console.groupEnd( );

				//Setup the next stage[P4 - In Game]
				ED_Stages( ).setStage( e.srcElement.attributes["data-target"].value );

				//Change the stage screen from [P1 -> P4]
				$ST.changeStageTo( e.srcElement.attributes["data-target"].value );
	    	}
		}

		function Decrypt( value ) {
			let output = "";

			for( let i = 0; i < value.length; i++ ) {
				output += String.fromCharCode(value.charCodeAt(i) - 5);
			}
			return output;
		}
	};

	function localStorageToSetting( ) {
		//Filter Local Storage Data
		//Retrieve all Save Slots, except quickSave
		let   keyArray        = Object.getOwnPropertyNames( localStorage );
		const saveSlotPattern = new RegExp( "^pc-" + $ST.Copyright("version") + "-Slot\\d{0,2}$", "g" );
		const container = document.getElementById( "setting-saveData" );

		let result = [];

		keyArray = keyArray.filter( function( data ) {
			return data.match( saveSlotPattern );
		});

		keyArray.forEach( (gameData) => {
			const saveDat = JSON.parse( Decrypt( localStorage.getItem( gameData ) ) );
			result.push( [gameData, saveDat] );
		});

		return result;
		function Decrypt( value ) {
			let output = "";

			for( let i = 0; i < value.length; i++ ) {
				output += String.fromCharCode(value.charCodeAt(i) - 5);
			}
			return output;
		}
	}

	function removeSaveSlotEvents( ) {
		let saveSlots = document.getElementById( "saveSlotContainer" ).children;

		for( let i = 0; i < saveSlots.length; i++ ) {
			let id = saveSlots[i].id;
    		let slotEl = document.getElementById( id );
    		let aMover = EventRegistry.getEvent( id, "mouseover" )
    		let aClick = EventRegistry.getEvent( id, "click" )

    		EventRegistry.remove( id, "mouseover" );
    		EventRegistry.remove( id, "click" );

    		slotEl.removeEventListener( aMover.eventType, aMover.callback );
    		slotEl.removeEventListener( aClick.eventType, aClick.callback );
		}

		document.getElementById( "saveSlotContainer" ).innerHTML = "";
	}

	function saveGame( e ) { 
        //FINAL CLEAN UP OF THE GAME
        $ST.calcPPS( );                 //RECALCULATE PPS INCASE IT IS NOT MATCHING.

        SaveData.saveToLocalStorage( );	

        pooArea = $D.id( "mainScreen" );

        //Add div element with the number pop up
        //Div moves up over 1 seconds and disappears after 1 seconds
        //absolute position it.
        let tempDiv = document.createElement( "div" );
        let txtNode = document.createTextNode( "GAME SAVED!" );

        tempDiv.setAttribute( "class", "SaveMsgBox" );
        tempDiv.style.opacity = 1.0;

        tempDiv.appendChild( txtNode );
        pooArea.appendChild( tempDiv );

		const selfDestruct = new PooTimer( tempDiv, 3000, 15, "save" );
		selfDestruct.start( );
	}
	
	let GameDataAPI = {
		saveToLocalStorage    : saveToLocalStorage,
		loadFromLocalStorage  : loadFromLocalStorage,
		unload                : removeSaveSlotEvents,
		localStorageToSetting : localStorageToSetting,

		saveGame : saveGame
	};

	return GameDataAPI;
}