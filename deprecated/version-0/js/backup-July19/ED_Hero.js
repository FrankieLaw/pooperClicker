//===========================================
// Contains only the blue print of the hero
// If more features are to be added
// The attribute of the hero will reflect
// accordingly.
//
// ED_Hero is basically a container that 
// holds a bunch of other attribute object
// in the future.
//===========================================

function ED_Hero( ) {

	//===========================================
	// HERO's Attributes
	//===========================================
	var name              = ED( "randomName" );
	var age 		      = 0;
	var exp 			  = 0;
	var totalPooCollected = 0;
	

	//=======================================================
	// HERO's Constructor
	// Use for loading character information
	// Or creating a new character with information
	//=======================================================
	// function construct( newName ) {
	// 	name 				= newName;
	// 	age  				= 0;
	// 	exp 			 	= 0;
	// 	totalPooCollected	= 0;
	// }

	function createFromJSON( storageObj ) {
		name 			  = (storageObj.name 			  == undefined ? "" : storageObj.name);	
		age  			  = (storageObj.age  			  == undefined ? 0  : storageObj.age);
		exp  			  = (storageObj.exp  			  == undefined ? 0  : storageObj.exp);	
		totalPooCollected = (storageObj.totalPooCollected == undefined ? 0  : storageObj.totalPooCollected);	
	}


	//=======================================================
	// HERO's Methods
	//=======================================================
	function getName( ) { return name;	}			// Return the Hero's Name
	function getAge( )  { return age }				// Return the Hero's Age

	function addPoo( quantity ) {
		totalPooCollected += quantity;
	}

	//=======================================================
	// TURNING ALL OF THE HERO VARIABLE INTO 
	// JSON OBJECT AND PREPARES TO BE SAVED INTO LOCALSTORAGE
	//=======================================================
	function toJSON( ) {
		return {
			"name" 				: name,
			"age"  				: age,
			"exp"  				: exp,
			"totalPooCollected" : totalPooCollected
		};
	}

	//=======================================================
	// HERO's API (Data Hiding)
	//=======================================================
	let HeroClassAPI = {
		getName 	: getName,
		getAge 		: getAge,

		addPoo		: addPoo,
		toJSON   	: toJSON,

		createFromJSON : createFromJSON
	};

	return HeroClassAPI;
};