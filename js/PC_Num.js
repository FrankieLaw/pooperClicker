
function GameUtilityAPI( ) {
	//==================================================
	// RANDOMLY GRAB A NUMBER BETWEEN A RANGE
	//==================================================
	function between( low, high ) {
		return Math.round( low + Math.random( ) * (high-low) );
	}


	//==================================================
	// METHOD:
	//		getNotationWord( numArray )
	//
	// DESCRIPTION:
	//		CONVERT NUMBER TO HUMAN READABLE NUMBERS
	//		This method decides the exponential notation in word.
	//
	// PARAMETER:  		Data Type 		Description
	// 		@num			Number			A Number that represents the total 3 block
	//										group a number has.
	//
	// RETURN TYPE:
	//		String 			"BILLION"
	//
	// FOR EXAMPLE: 1,236,956
	//		1.236 MILLION
	//==================================================
	function getNotationWord( num ) {
		if( num > 35 ) {
			return "POOGOL";
		}

		let notation = {
			3  : "MILLION",
			4  : "BILLION",
			5  : "TRILLION",
			6  : "QUADRILLION",
			7  : "QUINTILLION",
			8  : "SEXTILLION",
			9  : "SEPTILLION",
			10 : "OCTILLION",
			11 : "NONILLION",
			12 : "DECILLION",
			13 : "UNDECILLION",
			14 : "DUODECILLION",
			15 : "TREDECILLION",
			16 : "QUATTUORDECILLION",
			17 : "QUINDECILLION",
			18 : "SEXDECILLION",
			19 : "SEPTEMDECILLION",
			20 : "OCTODECILLION",
			21 : "NOVEMDECILLION",
			22 : "VIGINTILLION",
			23 : "UNVIGINTILLION",
			24 : "DUOVIGINTILLION",
			25 : "TREVIGINTILLION",
			26 : "QUATTUORVIGINTILLION",
			27 : "QUINVIGINTILLION",
			28 : "SEXVIGINTILLION",
			29 : "SEPTVIGINTILLION",
			30 : "OCTOVIGINTILILLION",
			31 : "NONVIGINTILLION",
			32 : "TRIGINTILLION",
			33 : "UNTRIGINTILLION",
			34 : "DUOTRIGINTILLION",
			35 : "GOOGOL",
		};
		return notation[num];
	}


	//==================================================
	// CONVERT NUMBER TO HUMAN READABLE NUMBERS
	// FOR EXAMPLE: 1,236,956
	//		1.236 MILLION
	//
	// Parameter  		DataType
	// @textNumber		Text
	//==================================================
	function useExpNotation( num ) {
		let sNum 	 = num;
		let retValue = "";

		if( !Arithmetic.isValid( String( num ) ) ) {
			sNum = Arithmetic.expandENotation( String( num ) );
		}

		let numberArray = convertExponential( String( sNum ) ).split(",");		// [1] [000] [000] [000]

		//ANYTHING LESS THAN A MILLION WILL NOT GET CONVERTED
		if( numberArray.length <= 2 ) { return numberArray + ""; } 

		else {
			return (numberArray[0] + "." + numberArray[1] + " " + getNotationWord( numberArray.length ));
		}
	}

	function newNotation( num ) {
		let sNum = Arithmetic.expandENotation( String( num ) );
		return useExpNotation( sNum );
	}

	//==================================================
	// METHOD:
	//		convertExponential( text )
	//
	// 		THIS IS A SUPPORT FUNCTION ONLY
	//		NOT MEANT TO BE USE OUTSIDE OF THIS API
	//
	// DESCRIPTION:
	//		Convert a string of number into 3 block exponential sections.
	//
	// PARAMETER  		Data Type 		Description
	// 		@text			String			A Number that is represented by a string
	//
	// RETURN TYPE:
	//		ARAAY 		[1] [123] [456]
	//==================================================
	function convertExponential( text ) {
		let p1 = getSign( text );					//GET POSITIVE OR NEGATIVE
		let s1 = splitNumber( removeSign( text ) );	//REMOVE ALL THE SIGNS + - ,

		let maxLength = 0;
		let retValue  = [];

			s1[0] = removeLeadingZero( s1[0] );

		//================================================
		// CHECK IF THE NUMBER STRING IS ALL ZERO
		// THIS INCLUDES THE WHOLE & DECIMAL PART
		//================================================
		if( s1.length == 2 ) {
			// CHECK IF THE INPUT IS ALREADY 0
			if( isZero( s1[0] ) && isZero( s1[1] ) ) { return "0"; }
		}

		// ELSE TREAT IT AS A WHOLE NUMBER
		// CHECK IF THE INPUT IS ALREADY 0
		else {
			if( isZero( s1[0] ) ) { return "0"; }
		}

		// CONTINUE PARSING FOR EXPONENTIAL VALUE
		s1[0]        = removeLeadingZero( s1[0] );	//REMOVE ALL LEADING ZEROS
		maxLength    = s1[0].length;				//HOW MANY DIGITS?


		//================================================
		// SEPARATE THE NUMBERS BY 3 DIGITS INTO AN ARRAY
		//================================================
		do {
			if( maxLength >= 3 ) {
				retValue.unshift( s1[0].substr( maxLength - 3, 3 ) );
				maxLength -= 3;

			} else {
				retValue.unshift( s1[0].substr( 0, maxLength ) );
				maxLength = 0;

			}
		} while( maxLength != 0 );

		s1[0] = retValue;

		return p1 + s1.join( "." );
	}

	//==================================================
	// ERASE ALL LEADING 0 FROM A NUMBER STRING
	//
	// PARAMETER  		Data Type 		Description
	// 		@string			String			A Number that is represented by a string
	//										Must accept an string that have no [+] or [-]
	//
	// CASE STUDIES					RESULTS
	//		00156234					156234
	//==================================================
	function removeLeadingZero( string ) {
		let p1 = getSign( string );
		let s1 = splitNumber( removeSign( string ) );

		let i  = 0;
		while( s1[0].charAt(i) == "0" ) { i++; }

		s1[0] = ( i == s1[0].length ) ? "0" : ( s1[0].substr(i, s1[0].length - i ) );

		return p1 + s1.join( "." );
	}

	//FIND OUT IF A NUMBER IS POSITIVE OR A NEGATIVE
	function getSign( string ) {
		return string.charAt(0) == "-" ? "-" : "";
	}

	//REPLACE + - AND , PUNCTUATION FROM A NUMBER STRING
	function removeSign( string ) {
		return string.replace( /[+\-,]/g, "" );
	}

	//SEPARATE WHOLE NUMBER FROM DECIMAL NUMBER
	function splitNumber( string ) {
		return string.split(".");
	}

	//FIND OUT WHERE THE DECIMAL PLACE IS
	//REQUIRE ALL NUMERICAL PUNCTUATION REMOVED FIRST
	function getDecimalPlace( string ) {
		let d1 = splitNumber( string );

		return ( d1.length == 2 ) ? d1[1].length : 0;
	}

	//CHECK IF A NUMBER STRING IS ALL 0
	function isZero( string ) {
		let retValue = true;

		//  0   1   2   3   4   5   6   7   8   9   
		//[48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
		for( let i = 0; i < string.length; i++ ) {
			if( string.charCodeAt(i) >= 49 && string.charCodeAt(i) <= 57 ) {
				retValue = false;
				break;
			}
		}

		return retValue;
	}

	//CLEAN UP THE STRING TO ITS ENTIRETY
	//REMOVE POSITIVE & NEGATIVE & COMMAS (+ - ,)
	//REMOVE LEADING ZEROS
	function cleanUp( string ) {
		return removeLeadingZero( removeSign( string == undefined ? "0" : string ) );
	}




	return {
		//RANDOM GENERATOR METHODS
		between : between,

		//NUMBER STRING CONVERSION
		useExpNotation     : useExpNotation,
		newNotation        : newNotation
	};
}