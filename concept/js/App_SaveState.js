function App_SaveState( ) {

	//=============================================================
	// Game Data Structure
	//	-> Data Slot Name
	//	     -> Hero Info (Save the entire object, it must be consistent)
	//
	//		 -> Map Info (To Be Determine how to add additional
	//					  information as the game becomes more complex. )
	//=============================================================



	//=============================================================
	// Save Method - Required Game Slot Name
	//				 Otherwise it will save over other save games.
	//=============================================================
	function saveToLocalStorage( ) {
		//=============================================
		// IF IT IS USING A TEMPORARY SLOT
		// FIND A NEW SLOT FOR IT AUTOMATICALLY
		//=============================================
		if( SessionState.saveSlot( ) == "pc-v1-tempSlot" ) {
			var length = Object.getOwnPropertyNames( localStorage ).length;

			//Check if the SlotName already Exist
			while( localStorage.getItem( "pc-v1-Slot" + length ) != null ) {
				length++;
			};

			SessionState.newSlot( "pc-v1-Slot" + length );	
		}


		//==========================================
		//	Final Data that will be saved
		//==========================================
		let saveData = {};									//blank save data
		saveData[SessionState.saveSlot( )] = {};			//create save data slot = empty {}

		var playerState = SessionState.savePlayerState( );	//Get _playerState
		saveData[SessionState.saveSlot( )] = playerState;	//Put everything inside localStorage

		console.group( "Inside PlayerState" );
			console.log( playerState );
		console.groupEnd( );


		//==========================================
		//	Encryption Data
		//==========================================
		var temp = JSON.stringify( saveData[SessionState.saveSlot( )] );
		var encrypted = Encrypt( temp );

		console.group( "What is being Saved" );
			console.log( temp );
		console.groupEnd( );

		//==========================================
		//	Transfer Encrypted Data to localStorage
		//==========================================
		localStorage.setItem( SessionState.saveSlot( ), encrypted );


		//==========================================
		//	Quick Save Feature
		//==========================================
		localStorage.setItem( "pc-v1-quickSave", SessionState.saveSlot( ) );


		//==========================================
		//	Basic Encryption Algorithm
		//==========================================
		function Encrypt( value ) {
			let output = "";

			for( var i = 0; i < value.length; i++ ) {
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
		var count = 0;
		
		//Filter Local Storage Data
		//Retrieve all Save Slots, except quickSave
		let keyArray        = Object.getOwnPropertyNames( localStorage );
		let saveSlotPattern = /^pc-v1-Slot\d{0,2}$/g;

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
			//let saveTxt = "crap";

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
				SessionState.makeGame( slot, JSON.parse( Decrypt( localStorage.getItem( slot ) ) ) );

			//Delete me//
				console.groupCollapsed( "Loaded Data" );
					console.log( JSON.parse( Decrypt( localStorage.getItem( slot ) ) ) );
				console.groupEnd( );

				//Setup the next stage[P4 - In Game]
				ED_Stages( ).setStage( e.srcElement.attributes["data-target"].value );

				//Change the stage screen from [P1 -> P4]
				SessionState.changeStageTo( e.srcElement.attributes["data-target"].value );
	    	}
		}

		function Decrypt( value ) {
			let output = "";

			for( var i = 0; i < value.length; i++ ) {
				output += String.fromCharCode(value.charCodeAt(i) - 5);
			}
			return output;
		}
	};


	function removeSaveSlotEvents( ) {
		let saveSlots = document.getElementById( "saveSlotContainer" ).children;

		for( var i = 0; i < saveSlots.length; i++ ) {
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

	let GameDataAPI = {
		//curGame : curGameData,
		saveToLocalStorage   : saveToLocalStorage,
		loadFromLocalStorage : loadFromLocalStorage,
		unload               : removeSaveSlotEvents
	};

	return GameDataAPI;
}