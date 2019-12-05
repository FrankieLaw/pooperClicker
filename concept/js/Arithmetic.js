/*\
|*| ==================================================
|*|  Author:  Cowwy
|*|  Website: cowwy.github.io
|*| ==================================================
|*|  Arithmetic
|*|		A need to use a very large number with the highest precision.
|*|
|*|
|*|  Test Cases (NUMBER)
|*| ==================================================
|*|      0.0
|*|      0.50
|*|      0.0059
|*|      0.0059e0
|*|      0.0059e70
|*|      0.0059e-70
|*|      
|*|     32.0
|*|     32.50
|*|     32.0059
|*|     32.0059e0
|*|     32.0059e70
|*|     32.0059e-70
|*|      
|*|     -0.0
|*|     -0.50
|*|     -0.0059
|*|     -0.0059e0
|*|     -0.0059e70
|*|     -0.0059e-70
|*|      
|*|     -32.0
|*|     -32.50
|*|     -32.0059
|*|     -32.0059e0
|*|     -32.0059e70
|*|     -32.0059e-70
|*|     
|*|     100200300400.0059
|*|     100200300400.0059e0
|*|     100200300400.0059e70
|*|     100200300400.0059e-70
|*|
|*|    -100200300400.0059
|*|    -100200300400.0059e0
|*|    -100200300400.0059e70
|*|    -100200300400.0059e-70
|*|
|*|      32.100200300400
|*|      32.100200300400e0
|*|      32.100200300400e70
|*|      32.100200300400e-70
|*|     
|*|  Test Cases (STRING)
|*| ==================================================
|*|      "0.0"
|*|      "0.50"
|*|      "0.0059"
|*|      "0.0059e0"
|*|      "0.0059e70"
|*|      "0.0059e-70"
|*|      "00.0059e-70"
|*|
|*|      "32.0"
|*|      "32.50"
|*|      "32.0059"
|*|      "32.0059e0"
|*|      "32.0059e70"
|*|      "32.0059e-70"
|*|      "0032.0059e-70"
|*|     
|*|      "-0.0"
|*|      "-0.50"
|*|      "-0.0059"
|*|      "-0.0059e0"
|*|      "-0.0059e70"
|*|      "-0.0059e-70"
|*|      "-00.0059e-70"
|*|
|*|      "-32.0"
|*|      "-32.50"
|*|      "-32.0059"
|*|      "-32.0059e0"
|*|      "-32.0059e70"
|*|      "-32.0059e-70"
|*|      "-0032.0059e-70"
|*|     
|*|      "100200300400.0059"
|*|      "100200300400.0059e0"
|*|      "100200300400.0059e70"
|*|      "100200300400.0059e-70"
|*|      "00100200300400.0059e-70"
|*|
|*|      "-100200300400.0059"
|*|      "-100200300400.0059e0"
|*|      "-100200300400.0059e70"
|*|      "-100200300400.0059e-70"
|*|      "-00100200300400.0059e-70"
|*|
|*|      "32.100200300400"
|*|      "32.100200300400e0"
|*|      "32.100200300400e70"
|*|      "32.100200300400e-70"
|*|      "0032.100200300400e-70"
|*|
|*|
|*|
|*|
|*|
|*|
|*|
|*| ==================================================
\*/

var Arithmetic = new ARITHMETIC( );

function ARITHMETIC( ) {
	

/*\
|*| ==================================================
|*|  METHOD:
|*|		 _subtract( string1, string2 )
|*|
|*|		 SUBTRACT TWO NUMBER STRINGS TOGETHER AS IF
|*|	     IT IS A POSITIVE NUMBER.  THIS IS A SUPPORT FUNCTION
|*|      THAT WILL SUBTRACT TWO NUMBERS TOGETHER
|*|      WITHOUT CONTEXT.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string1				STRING				A NUMBER STRING THAT IS PROCESSED AND EXPANDED FROM THE E NOTATION
|*|		 @string2				STRING				A NUMBER STRING THAT IS PROCESSED AND EXPANDED FROM THE E NOTATION
|*|								
|*|  CASE STUDIES				RETURN
|*|      25.36    15.28   ==>   "10.08"
|*|          2    2.004   ==>   "0.004"
|*|      2.004        2   ==>   "0.004"
|*| ==================================================
\*/
	function _subtract( string1, string2 ) {
		//============================
		// PRE PROCESS
		//============================
		//MAX DECIMAL LENGTH
		let _maxDecLength = 0;

		if( _isDecimal( string1 ) || _isDecimal( string2 ) ) {
			_maxDecLength = _maxDecimalLength( string1, string2 );
		}

		//============================
		// NUMBER STRING PROCESS
		//============================
		let sNum1 = string1;
		let sNum2 = string2;

		if( !isValid( string1 ) ) { sNum1 = expandENotation( string1 ); }
		if( !isValid( string2 ) ) { sNum2 = expandENotation( string2 ); }

			sNum1 = ABS( _fillDecimal( sNum1, _maxDecLength ) ); //FILL DECIMAL PLACES
			sNum2 = ABS( _fillDecimal( sNum2, _maxDecLength ) ); //20.698 ==> 20.698

		// FIND LARGEST && SMALLEST
		let large = sNum1;
		let small = sNum2;

		if( largest( sNum1, sNum2 ) == 1 ) {
			large = sNum2;
			small = sNum1;
		}
			
		//SPLIT TO ARRAY
			large = large.replace( "." , "" ).split(""); //1.23 ==> [1][2][3]
			small = small.replace( "." , "" ).split(""); //58.1 ==> [5][8][1]

		//============================
		// CALCULATION
		//============================
		let decrement = [];  //VALUE BORROWED
		let retValue  = [];  //FINAL ANSWER

		let o1, o2, o3;	     //OPERANDS

		do {
			o1 = parseInt( large.pop( ) );
			o2 = parseInt( small.pop( ) );
			o3 = parseInt( decrement.pop( ) );

			o1 = ( Number.isNaN( o1 ) || o1 == undefined ) ? 0 : o1;
			o2 = ( Number.isNaN( o2 ) || o2 == undefined ) ? 0 : o2;
			o3 = ( Number.isNaN( o3 ) || o3 == undefined ) ? 0 : o3;

			// DO I NEED TO BORROW A NUMBER TO COMPLETE THE SUBTRACTION?
			if( o1 < ( o2 + o3 ) ) {
				o1 = 10 + o1;
				decrement.unshift(1);
			}

			temp = o1 - o2 - o3;

			retValue.unshift( temp );
		} while( large.length != 0 || small.length != 0 || decrement.length != 0 );

		//============================
		// FINAL RECONSTRUCTION
		//============================
		if( _maxDecLength > 0 ) {
			retValue.splice( -_maxDecLength, 0, "." );
		}

		return retValue.join("");
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 _add( string1, string2 )
|*|
|*|		 ADDING TWO NUMBER STRINGS TOGETHER AS IF
|*|	     IT IS A NUMBER.  THIS IS A SUPPORT FUNCTION
|*|      THAT WILL ADD TWO NUMBERS TOGETHER WITHOUT
|*|      WITHOUT CONTEXT.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string1				STRING				A NUMBER STRING THAT IS PROCESSED AND EXPANDED FROM THE E NOTATION
|*|		 @string2				STRING				A NUMBER STRING THAT IS PROCESSED AND EXPANDED FROM THE E NOTATION
|*|								
|*|  CASE STUDIES				RETURN
|*|      25.36    15.28   ==>   "40.64"
|*| ==================================================
\*/
	function _add( string1, string2 ) {
		//============================
		// PRE PROCESS
		//============================
		//MAX DECIMAL LENGTH
		let _maxDecLength = 0;

		if( _isDecimal( string1 ) || _isDecimal( string2 ) ) {
			_maxDecLength = _maxDecimalLength( string1, string2 );
		}

		//============================
		// NUMBER STRING PROCESS
		//============================
		let sNum1 = string1;
		let sNum2 = string2;

		if( !isValid( string1 ) ) { sNum1 = expandENotation( string1 ); }	//EXPAND E NOTATION 
		if( !isValid( string2 ) ) { sNum1 = expandENotation( string2 ); }		

			sNum1 = ABS( sNum1 );	//REMOVE SIGN
			sNum2 = ABS( sNum2 );

		    sNum1 = _fillDecimal( sNum1, _maxDecLength );	//MAKE EQUAL LENGTH DECIMAL PLACES
		    sNum2 = _fillDecimal( sNum2, _maxDecLength );
		
			sNum1 = sNum1.replace( "." , "" ).split("");	//SPLIT TO ARRAY
			sNum2 = sNum2.replace( "." , "" ).split("");	

		//============================
		// CALCULATION
		//============================
		let increment = [];  //VALUE CARRIED
		let retValue  = [];  //FINAL ANSWER

		let o1, o2, o3;		//OPERANDS NEEDED

		do {
			o1 = parseInt( sNum1.pop( ) );
			o2 = parseInt( sNum2.pop( ) );
			o3 = parseInt( increment.pop( ) );

			o1 = Number.isNaN( o1 ) ? 0 : o1;
			o2 = Number.isNaN( o2 ) ? 0 : o2;
			o3 = Number.isNaN( o3 ) ? 0 : o3;

			//ADD EVERYTHING TOGETHER
			temp = o1 + o2 + o3;

			//IF THE RESULT IS HIGHER THAN 10
			//AND NEED TO CARRY NUMBER
			if( temp >= 10 ) {
				increment.unshift(1);
				retValue.unshift( temp - 10 );
			}

			//IF THE RESULT IS LESS THAN 10
			else {
				retValue.unshift( temp );
			}
		} while( sNum1.length != 0 || sNum2.length != 0 || increment.length != 0 );

		//============================
		// FINAL RECONSTRUCTION
		//============================
		if( _maxDecLength > 0 ) {
			retValue.splice( -_maxDecLength, 0, "." );
		}

		return retValue.join("");
	}



/*\
|*| ==================================================
|*|  METHOD:
|*|		  _fillDecimal( string, maxLength )
|*|
|*|		 FILL A NUMBER STRING WITH TRAILING 0 IN THE
|*|		 DECIMAL POSITION.  IF THE DECIMAL POSITION
|*|      IS GREATER THAN MAXLENGTH PROVIDED IN THE 
|*|      PARAMETER, IT WILL RETURN STRING.  OTHERWISE
|*|      IT WILL PROCEED TO ADDING TRAILING 0.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string				STRING				A NUMBER STRING THAT IS PROCESSED AND EXPANDED FROM THE E NOTATION
|*|		 @maxLength				NUMBER				MAXIMUM NUMBER OF DECIMAL PLACES YOU WANT ON THE STRING
|*|								
|*|  CASE STUDIES				RETURN
|*|      0.061     7   ==>      0.0610000
|*| ==================================================
\*/
	function _fillDecimal( string, maxLength ) {
		let decimal = 0;

		//IF THERE IS A MAXIMUM LENGTH
		if( maxLength > 0 ) {
			if( _isDecimal( string ) ) {
				decimal = _extractDecimal( string );

				if( decimal.length >= maxLength ) { return string; }
				if( decimal.length <  maxLength ) { return string + addTrailingZero( maxLength - decimal.length ); }

			} else {
				return string + "." + addTrailingZero( maxLength );
			}
		}

		return string;
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		  _isDecimal( string )
|*|
|*|		 DETERMINE IF A NUMBER HAS ANY DECIMAL PLACES.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string				STRING				A NUMBER STRING THAT IS PROCESSED AND EXPANDED FROM THE E NOTATION
|*|								
|*|  CASE STUDIES			RETURN
|*|      0.061       ==>        TRUE
|*|          7       ==>        FALSE
|*| ==================================================
\*/
	function _isDecimal( string ) {
		return string.indexOf( "." ) == -1 ? false : true;
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		  _maxDecimalLength( string1, string2 )
|*|
|*|		 DETERMINE THE MAXIMUM DECIMAL LENGTH
|*|      BETWEEN TWO NUMBER STRINGS.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string1				STRING				A NUMBER STRING THAT IS PROCESSED AND EXPANDED FROM THE E NOTATION
|*|		 @string2				STRING				A NUMBER STRING THAT IS PROCESSED AND EXPANDED FROM THE E NOTATION
|*|								
|*|  CASE STUDIES				RETURN
|*|      0.06986     0.114585     6
|*| ==================================================
\*/
	function _maxDecimalLength( string1, string2 ) {
		return Math.max( _extractDecimal( string1 ).length, _extractDecimal( string2 ).length );
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 sNumToArray( string )
|*|
|*|		 CONVERT A NUMBER STRING TO AN ARRAY
|*|      BY SPLITTING EACH CHARACTER.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string				STRING				A NUMBER STRING THAT IS PROCESSED AND EXPANDED FROM THE E NOTATION
|*|								
|*|  CASE STUDIES
|*|        521.23		[5][2][1][.][2][3]
|*| ==================================================
\*/
	function sNumToArray( string ) {
		return string.split("");
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 largest( string1, string2 )
|*|
|*|		 DETERMINES WHICH OF THE TWO NUMBER STRING PROVIDED
|*|      IN THE PARAMETER IS THE LARGEST.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string1				STRING				A Number String
|*|		 @string2				STRING				A Number String
|*|								
|*|  CASE STUDIES			STRING1 |  EQUAL | STRING2		
|*|        RETURN 			  -1         0        1
|*|
|*|   STIRNG1    STRING2    RETURN
|*| ==========================================
|*|   -175.20    -175.20	  0
|*|   -175.20     200.50	  1
|*|    175.20    -100.00	 -1
|*| ==================================================
\*/
	function largest( string1, string2 ) {
		//GET POLARITY OF THE NUMBER STRING [+][-]
		let s1 = getSign( string1 );
		let s2 = getSign( string2 );

		let num1 = string1;
		let num2 = string2;
		
		//EXPAND THE ENTIRE NUMBER (IF NEEDED BE)
		if( !isValid( string1 ) ) { num1 = expandENotation( string1 ); }
		if( !isValid( string2 ) ) { num2 = expandENotation( string1 ); }
		// let num1 = expandENotation( string1 );
		// let num2 = expandENotation( string2 );

		//WHO IS THE LARGEST?  AND...
		//WHO IS THE LARGEST BASED ON THEIR POLARITY CONTEXT?
		let largeW = _largestWhole( num1, num2 );
		let largeD = _largestDecimal( num1, num2 );

		//CONTEXT #1: IF OPPOSITE POLARITY
		if( s1 == ""  && s2 == "-" ) { return -1; }
		if( s1 == "-" && s2 == ""  ) { return  1; }

		//CONTEXT #2: IF BOTH POSITIVE NUMBER
		if( s1 == "" && s2 == "" ) {
			if( largeW ==  0 && largeD ==  0 ) { return  0; } //IDENTICAL NUMBER
			if( largeW ==  1 && largeD ==  1 ) { return  1; } //STRING2 IS LARGER ENTIRELY
			if( largeW == -1 && largeD == -1 ) { return -1; } //STRING1 IS LARGER ENTIRELY

			if( largeW == 0  && largeD == -1 ) { return -1; } //STRING1 IS LARGER BY DECIMAL
			if( largeW == 0  && largeD ==  1 ) { return  1; } //STRING2 IS LARGER BY DECIMAL

			if( largeW == -1 ) { return -1; } //STRING1 AS A WHOLE IS LARGER
			if( largeW ==  1 ) { return  1; } //STRING2 AS A WHOLE IS LARGER
		}

		//CONTEXT #3: IF BOTH NEGATIVE NUMBER
		if( s1 == "-" && s2 == "-" ) {
			if( largeW ==  0 && largeD ==  0 ) { return  0; } //IDENTICAL NUMBER
			if( largeW ==  1 && largeD ==  1 ) { return -1; } //STRING1 IS LARGER ENTIRELY
			if( largeW == -1 && largeD == -1 ) { return  1; } //STRING2 IS LARGER ENTIRELY

			if( largeW == 0  && largeD == -1 ) { return  1; }	//STRING2 IS LARGER BY DECIMAL
			if( largeW == 0  && largeD ==  1 ) { return -1; } //STRING1 IS LARGER BY DECIMAL

			if( largeW == -1 ) { return  1; } //STRING2 WHOLE IS LARGER
			if( largeW ==  1 ) { return -1; } //STRING1 WHOLE IS LARGER
		}
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 _largestByChar( string1, string2 )
|*|
|*|		 DETERMINES WHICH OF THE TWO NUMBER STRING PROVIDED
|*|      IN THE PARAMETER IS THE LARGEST REGARDLESS OF POLARITY
|*|
|*|  REQUIRE
|*|      THIS REQUIRES THE NUMBERS STRING IN THE PARAMETER
|*|      TO BE PROCESSED ALREADY.
|*|	        1 - EQUAL LENGTH
|*|         2 - NO DECIMAL PLACES
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string1				STRING				A Number String
|*|		 @string2				STRING				A Number String
|*|								
|*|  CASE STUDIES			STRING1 |  EQUAL | STRING2		
|*|        RETURN 			  -1         0        1
|*|
|*|   STIRNG1    STRING2    RETURN
|*| ==========================================
|*|   -175.20    -175.20	  0
|*|   -175.20     200.50	  1
|*|    175.20    -100.00	 -1
|*| ==================================================
\*/
	function _largestByChar( string1, string2 ) {
		//  .   0   1   2   3   4   5   6   7   8   9   
		//[46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
		for( var i = 0; i < string1.length; i++ ) {
			let c1 = string1.charAt(i);
			let c2 = string2.charAt(i);

			if( c1 == c2 )     { continue;  }
			else if( c1 > c2 ) { return -1; }
			else if( c2 > c1 ) { return  1; }
		}

		return 0; //IT IS EQUAL
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 smallest( string1, string2 )
|*|
|*|		 DETERMINES WHICH OF THE TWO NUMBER STRING PROVIDED
|*|      IN THE PARAMETER IS THE SMALLEST.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string1				STRING				A Number String
|*|		 @string2				STRING				A Number String
|*|								
|*|  CASE STUDIES			STRING1 |  EQUAL | STRING2		
|*|        RETURN 			  -1         0        1
|*|
|*|   STIRNG1    STRING2    RETURN
|*| ==========================================
|*|   -175.20    -175.20	  0
|*|   -175.20     200.50	 -1
|*|    175.20    -100.00	  1
|*| ==================================================
\*/
	function smallest( string1, string2 ) {
		let retValue = largest( string1, string2 );

		if( retValue ==  0 ) { return  0; }
		if( retValue == -1 ) { return  1; }
		if( retValue ==  1 ) { return -1; }
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 between( low, high )
|*|
|*|		 RANDOM GENERATE A NUMBER DETERMINED BY THE
|*|		 NUMBER PASSED IN THE PARAMETERS.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @low					Number				A Number / Integer
|*|		 @high					Number				A Number / Integer
|*|								
|*|  RETURN TYPE
|*|		 RANDOM NUMBER BETWEEN LOW & HIGH
|*|		
|*|  CASE STUDIES	
|*|		  0, 10		==>		  6
|*|      50, 90		==>		 10
|*|     -95, 95		==>     -52
|*| ==================================================
\*/
	function between( low, high ) {
		return Math.round( low + Math.random( ) * (high-low) );
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 _smallestDecimal( string1, string2 )
|*|
|*|		 DETERMINE THE SMALLEST DECIMAL NUMBER IN A
|*|		 NUMBER STRING
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string1				String				A Number String
|*|		 @string2				String				A Number String
|*|								
|*|  RETURN TYPE
|*|		 -1	= @string1 is smallest
|*|       0 = Both string is equal
|*|       1 = @string2 is smallest
|*|		
|*|  CASE STUDIES			STRING1 |  EQUAL | STRING2		
|*|        RETURN 			  -1         0        1
|*|		
|*|		 0.000123, 0.193	==>		"-1"
|*|      0.193, 0.000123	==>		 "1"
|*|       983.36,  32.36    ==>      "0"
|*| ==================================================
\*/
	function _smallestDecimal( string1, string2 ) {
		let retValue = _largestDecimal( string1, string2 );

		if( retValue == 0 )  { return 0;  }	//IDENTICIAL VALUE
		if( retValue == -1 ) { return 1;  }	//STRING2 IS SMALLEST
		if( retValue == 1 )  { return -1; }	//STRING1 IS SMALLEST
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 _largestDecimal( string1, string2 )
|*|
|*|		 DETERMINE THE LARGEST DECIMAL NUMBER IN A
|*|		 NUMBER STRING
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string1				String				A Number String
|*|		 @string2				String				A Number String
|*|								
|*|  RETURN TYPE
|*|		 -1	= @string1 is largest
|*|       0 = Both string is equal
|*|       1 = @string2 is largest
|*|		
|*|  CASE STUDIES			STRING1 |  EQUAL | STRING2		
|*|        RETURN 			  -1         0        1
|*|		
|*|		 0.000123, 0.193	==>		 "1"
|*|      0.193, 0.000123	==>		"-1"
|*|       983.36,  32.36    ==>      "0"
|*|             7, 7.004    ==>      "1"
|*| ==================================================
\*/
	function _largestDecimal( string1, string2 ) {
		let maxLength = _maxDecimalLength( string1, string2 );

		let s1 = _fillDecimal( string1, maxLength ).split(".")[1];
		let s2 = _fillDecimal( string2, maxLength ).split(".")[1];
		
		return _largestByChar( s1, s2 );
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 _countLeadingZero( numString )
|*|
|*|		 COUNT HOW MANY LEADING ZEROS ARE IN A NUMBER STRING
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @numString				String				A Number String
|*|								
|*|  RETURN TYPE
|*|		 RETURN THE NUMBER OF LEADING ZEROS IN A NUMBER STRING
|*|      IF THERE IS NONE, IT WILL RETURN 0
|*|		
|*|  CASE STUDIES
|*|		  00005		==>		"4"
|*|        0012 	==>		"2"
|*|    723.45e3     ==>     "0"
|*| ==================================================
\*/
	function _countLeadingZero( numString ) {
		let retValue = numString.match( /^0{1,}/ );
		return retValue == null ? "0" : retValue[0].length;
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 _extractDecimal( numString )
|*|
|*|		 PROCESS A NUMBER STRING FOR DECIMAL NUMBER.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @numString				String				A Number String
|*|								
|*|  RETURN TYPE
|*|		 PROCESSED NUMBER STRING WITH ONLY THE DECIMAL NUMBER
|*|		
|*|  CASE STUDIES
|*|		 0.2435		==>		"2435"
|*|      125.84 	==>		"84"
|*|    723.45e3     ==>     "0"
|*| ==================================================
\*/
	function _extractDecimal( numString ) {
		// let retValue = "";	/expandENotation( numString );
		// retValue = "";    	//ABS( filterLeadingZero( retValue ) );
		let	retValue = ABS( numString ).split(".")[1];
		if( !retValue ) { retValue = "0"; }

		return retValue;
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 _extractWhole( numString )
|*|
|*|		 PROCESS A NUMBER STRING FOR WHOLE NUMBER.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @numString				String				A Number String
|*|								
|*|  RETURN TYPE
|*|		 PROCESSED NUMBER STRING WITH ONLY THE WHOLE NUMBER
|*|		
|*|  CASE STUDIES
|*|		 0.2435		==>		"0"
|*|      125.84 	==>		"125"
|*|    723.45e3     ==>     "723450"
|*| ==================================================
\*/
	function _extractWhole( numString ) {
		// let retValue = ""; 						//expandENotation( numString );
		// 	retValue = ABS( numString );    	//ABS( filterLeadingZero( numString ) );
		// 	retValue = retValue.split(".")[0];

		return ABS( numString ).split( "." )[0];
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 _smallestWhole( string1, string2 )
|*|
|*|		 STRICTLY COMPARES AND FINDS THE LOWEST
|*|      VALUE BETWEEEN 2 POSITIVE NUMBER STRINGS.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string1				String				A Number String
|*|      @string2				String				A Number String
|*|								
|*|  RETURN TYPE
|*|		 -1	= @string1 is smaller
|*|       0 = Both string is equal
|*|       1 = @string2 is smaller
|*|		
|*|  CASE STUDIES			STRING1 |  EQUAL | STRING2		
|*|        RETURN 			  -1         0        1
|*|
|*|		 0, 193		==>		"1"
|*|      0,   0 	==>		"0"
|*|    983,  32     ==>    "-1"
|*| ==================================================
\*/
	function _smallestWhole( string1, string2 ) {
		let result = Arithmetic._largestWhole( string1, string2 );

		if( result == 0 )  { return  0; }
		if( result == -1 ) { return  1; }
		if( result == 1 )  { return -1; }
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 _largestWhole( string1, string2 )
|*|
|*|		 STRICTLY COMPARES AND FINDS THE LARGEST
|*|      VALUE BETWEEEN 2 POSITIVE NUMBER STRINGS.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string1				String				A Number String
|*|      @string2				String				A Number String
|*|								
|*|  RETURN TYPE
|*|		 -1	= @string1 is larger
|*|       0 = Both string is equal
|*|       1 = @string2 is larger
|*|		
|*|  CASE STUDIES			STRING1 |  EQUAL | STRING2		
|*|        RETURN 			  -1         0        1
|*|
|*|		 0, 193		==>		"1"
|*|      0,   0 	==>		"0"
|*|    983,  32     ==>    "-1"
|*| ==================================================
\*/
	function _largestWhole( string1, string2 ) {
		let s1 = _extractWhole( string1 );	//938
		let s2 = _extractWhole( string2 );	//0

		if( s1 == s2 )              { return 0;  }	//SAME NUMBER
		if( s1.length > s2.length ) { return -1; }	//STRING1 LARGER
		if( s2.length > s1.length ) { return  1; }	//STRING2 LARGER

		//CHECK CHARACTER BY CHARACTER TO SEE WHICH NUMBER IS LARGER
		//THE FIRST NUMBER THAT IS SMALLER WILL LOSE
		if( s1.length == s2.length ) {
			let retValue = -1;		//ASSUMING STRING1 IS LARGER

			//  0   1   2   3   4   5   6   7   8   9   
			//[48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
			for( var i = 0; i < s1.length; i++ ) {
				let c1 = s1.charAt(i);
				let c2 = s2.charAt(i);

				//SAME CHARACTER
				if( c1 == c2 ) { 
					continue; 
				}

				//c1 LARGER THAN c2
				if( c1 > c2 ) {
					retValue = -1;
					break;
				}

				//c2 LARGER THAN c1
				if( c2 > c1 ) { 
					retValue = 1;
					break;
				}
			}

			return retValue;
			
		}
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 ABS( numString )
|*|
|*|		 CONVERT ALL STRING NUMBER TO A NON-NEGATIVE
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @numString				String				A Number String
|*|										
|*|  CASE STUDIES			RETURN
|*|		 -12345		==>			"12345"
|*| ==================================================
\*/
	function ABS( numString ) {
		return numString.replace( /[+\-]/, "" );
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 isZero( string )
|*|
|*|		 A UTILITY FUNCTION THAT CHECKS IF A NUMBER
|*|      STRING IS ZERO.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string				String				A Number String
|*|										
|*|  CASE STUDIES			RETURN
|*|		 12345		==>			"false"
|*|	    -1.2345e-15 ==>  		" "	//needs work
|*| ==================================================
\*/
	function isZero( string ) {
		let retValue = true;

		//  0   1   2   3   4   5   6   7   8   9   
		//[48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
		for( var i = 0; i < string.length; i++ ) {
			if( string.charCodeAt(i) >= 49 && string.charCodeAt(i) <= 57 ) {
				retValue = false;
				break;
			}
		}

		return retValue;
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 isValid( string )
|*|
|*|		 CHECK IF A NUMBER STRING IS A NUMBER STRING
|*|      AND NOT A COLLAPSED VERSION.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @string				String				A Number String
|*|										
|*|  CASE STUDIES			RETURN
|*|		 12345		==>			TRUE
|*|	    -1.2345e-15 ==>  		FALSE
|*|          00     ==>         FALSE
|*|        0.0003   ==>         TRUE
|*| ==================================================
\*/
	function isValid( string ) {
		let pattern = /(^0{2,}|^0{2,}[\d]*\.|[eE][+\-]{0,1}.*)/g;
		return string.match( pattern ) ? false : true;
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		numToString( num )
|*|
|*|		 A UTILITY FUNCTION THAT CONVERTS A NUMBER
|*|      TO A NUMBER STRING
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @num					Number				A Number Object
|*|										
|*|  CASE STUDIES			RETURN
|*|		 12345		==>			"12345"
|*|	    -1.2345e-15 ==>  		"-1.2345e-15"
|*| ==================================================
\*/
	function numToString( num ) { 
		return "" + num; 
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		getSign( numString )
|*|
|*|		 A UTILITY FUNCTION THAT EXTRACTS THE SIGN
|*|		 POSITIVE OR NEGATIVE IN A NUMBER STRING
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @numString				String				A Number String
|*|										
|*|  CASE STUDIES			RETURN
|*|		 1.2345e+5	==>			""
|*|	    -1.2345e-15 ==>  		"-"
|*| ==================================================
\*/
	function getSign( numString ) {
		let sign = numString.charAt(0);

		if( sign == "+" || sign != "-" ) { 
			sign = ""; 
		}

		return sign;
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		getESign( numString )
|*|
|*|		 A UTILITY FUNCTION THAT EXTRACTS THE EXPONENT POLARITY
|*|		 IN A NUMBER STRING
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @numString				String				A Number String
|*|										
|*|  CASE STUDIES			RETURN
|*|		 1.2345e+5	==>			"e+"
|*|	    -1.2345e-15 ==>  		"e-"
|*|      1.2345     ==>         ""
|*|      1.2345e30  ==>         "e"
|*| ==================================================
\*/
	function getESign( numString ) {
		return numString.match( /e[+\-]{0,1}/ );
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		getExponent( numString )
|*|
|*|		 A UTILITY FUNCTION THAT EXTRACTS THE EXPONENT VALUE
|*|		 IN A NUMBER STRING
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @numString				String				A Number String
|*|										
|*|  CASE STUDIES			RETURN
|*|		 1.2345e+5	==>			"5"
|*|	    -1.2345e-15 ==>  		"15"
|*|      1.2345     ==>         ""
|*| ==================================================
\*/
	function getExponent( numString ) {
		let regEx = /e[+\-]{0,1}/;
		return ( numString.split( regEx ) ).length > 1 ? 
			( numString.split( regEx ) ).pop( ) : "";
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		filterLeadingZero( numString )
|*|
|*|		 A UTILITY FUNCTION THAT ELIMINATES ALL
|*|	     LEADING "0" PROVIDED IN [numString] PARAMETER
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @numString				String				A Number String
|*|										
|*|  CASE STUDIES			RETURN
|*|		 000.568	==>			"0.568"
|*|	   -017.5420    ==>  		"17.5420"
|*| ==================================================
\*/
	function filterLeadingZero( numString ) {
		let p1       = getSign( numString );
		let retValue = numString.replace( /[+\-]/, "" );
			retValue = retValue.replace( /^0{1,}/, "" );

		//PLACE BACK THE 0 TAKEN AWAY
		if( retValue.charAt(0) == "." ) { 
			retValue = "0" + retValue; 
		}

		//IF RETURN VALUE IS NOTHING
		else if( retValue == "" ) {
			retValue = "0";
		}

		return p1 + retValue;
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 addTrailingZero( exponent )
|*|
|*|		 A UTILITY FUNCTION THAT ALLOWS YOU TO ADD TRAILING "0"
|*|      AT THE END OF YOUR NUMBER STRING.
|*|
|*|  PARAMETER  			Data Type 			Description
|*|		 @exponent				Number				A Number of 0 you wish to add.
|*|										
|*|  CASE STUDIES			RETURN
|*|		 5			==>			"00000"
|*|		-5  	    ==>  		""
|*| ==================================================
\*/
	function addTrailingZero( exponent ) {
		let retValue = "";

		for( var i = 0; i < exponent; i++ ) {
			retValue += "0";
		}

		return retValue;
	}
/*\
\*/



/*\
|*| ==================================================
|*|  METHOD:
|*|		 expandENotation( numString )
|*|
|*|		 EXPAND A NUMBER STRING'S E NOTATION THAT IS OTHERWISE
|*|		 DISPLAY AS 1.2345e10
|*|
|*|  PARAMETER  		Data Type 		Description
|*|		 @numString		String			A Number that is represented by a string
|*|										
|*|  CASE STUDIES
|*|		 1.2345e10  ==>  12345000000
|*|		 0.0098e-8  ==>  0.000000000098
|*|     -1.2322e15  ==> -1232200000000000
|*| ==================================================
\*/
	function expandENotation( numString ) {
		//REGULAR EXPRESSION THAT FILTERS [+] [-] [e#] [e+#] [e-#]
		let regExPat = /([+\-]|e[+\-]{0,1}.*)/g;

		//FILTER & SEPARATING INFORMATION FOR A NUMBER
		let sign     = getSign( numString );								// [+] [-]
		let eSign    = getESign( numString )								// [e] [e+] [e-]
		let exponent = getExponent( numString );							// 12345.50e[28]

		//SEPARATE THE NUMBER BY DECIMAL
		let numArray = 
			filterLeadingZero( numString.replace( regExPat, "" ) ).split( "." );

		//CANNOT HAVE NO NUMBERS IN THE FIRST ELEMENT OF THE ARRAY
		if( numArray[0] == "" ) { 
			numArray[0] = "0"; 
		}

		//SINGLE WHOLE NUMBER AND NO EXPONENTIAL
		//	CASE1 : [ 111 222 333 ]
		//  CASE2 : [-111 222 333 ]
		if( numArray.length == 1 && !eSign ) {
			return sign + filterLeadingZero( numArray.join( "" ) );
		}


		//SINGLE LARGE WHOLE NUMBER WITH EXPONENTIAL
		//	CASE3 : [111 222 333 444 555 666 777 888 e0]
		//	CASE4 : [111 222 333 444 555 666 777 888 e17]
		else if( numArray.length == 1 && eSign ) {
			return ( exponent == 0 ) ? 
				( sign + numArray ) :
				( sign + numArray + addTrailingZero( exponent ) );
		}


		//NUMBER WHOLE && DECIMAL AND NO EXPONENTIAL
		//  CASE 5 : [12345.50] [-12345.50]
		else if( numArray.length == 2 && !eSign ) {
			return sign + filterLeadingZero( numArray.join( "." ) );
		}


		//NUMBER WHOLE && DECIMAL WITH [e+] TOO LARGE  0.0003235e28
		//  CASE 6 : [12345.50e26] [-12345.50e26]
		else if( numArray.length == 2 && ( eSign == "e+" || eSign == "e" ) ) {

			let zeroToAdd = exponent - numArray[1].length;
			let result    = filterLeadingZero( numArray.join( "" ) );

			//LARGE WHOLE && DECIMAL WITH [e0]
			if( exponent == "0" ) {
				return sign + numArray.join( "." );
			}

			//MOVE THE DECIMAL FORWARD - MORE DECIMAL THAN EXPONENT NEED
			//  [11222.456789e3]
			else if( numArray[1].length > exponent ) {
				result = numArray[0] + 
						 ( numArray[1].substr(0, exponent ) ) + "." + 
						 numArray[1].substr(exponent);

				result = filterLeadingZero( result );

			//ADD ZEROS TO COMPENSATE FOR THE EXTRA DIGITS
			} else {
				result += addTrailingZero( zeroToAdd );
			}

			return sign + result;
		}

		//NUMBER WITH E TOO LARGE WITH EXPONENTIAL e-
		else if( numArray.length == 2 && eSign == "e-" ) {
			let result = "0.";
				result += addTrailingZero( exponent - 1 );

			return sign + result + numArray.join( "" );
		}
	}
/*\
\*/



/*\
|*| ==================================================
|*|  API RETURNS
|*| ==================================================
\*/
	return {
	//=================================
	// ARITHMETIC SUPPORT METHODS						//TO BE COMMENT OUT
	//=================================
		_add               : _add,						//NEW - ADD      WITHOUT CONTEXT
		_subtract          : _subtract,                 //NEW - SUBTRACT WITHOUT CONTEXT

		_largestWhole      : _largestWhole,				//NEW - WITHOUT CONTEXT
		_smallestWhole     : _smallestWhole,			//NEW - WITHOUT CONTEXT
		_extractWhole      : _extractWhole,				//NEW 

		_largestDecimal    : _largestDecimal,			//NEW - WITHOUT CONTEXT
		_smallestDecimal   : _smallestDecimal,			//NEW - WITHOUT CONTEXT
		_extractDecimal    : _extractDecimal,			//NEW

		_largestByChar      : _largestByChar,           //NEW - GET THE LARGEST NUMBER REGARDLESS OF CONTEXT

		_isDecimal         : _isDecimal,				//NEW - CHECK IF A NUMBER IS A DECIMAL

		_maxDecimalLength  : _maxDecimalLength,         //NEW 
		_fillDecimal       : _fillDecimal,              //NEW - FIXED

		_countLeadingZero  : _countLeadingZero,			//NEW
		

	//=================================
	// NUMERICAL COMPARISON METHODS
	//=================================
		largest            : largest,                   //NEW - LARGEST  NUMBER BASED ON THEIR CONTEXT
		smallest           : smallest,                  //NEW - SMALLEST NUMBER BASED ON THEIR CONTEXT
		
		


	//=================================
	// NUMERICAL PROCESSING METHODS
	//=================================
		//ARITHMETIC - VALIDATION
		isZero             : isZero,
		isValid            : isValid,					//NEW - CHECK IF NUMBER STRING IS VALID
		

		//ARITHMETIC - FILTER
		filterLeadingZero  : filterLeadingZero,			//NEW - REMOVE ALL LEADING ZEROS
		

		//ARITHMETIC - MODIFICATION
		addTrailingZero    : addTrailingZero,			//NEW - ADD TRAILING ZEROS

		
		//ARITHMETIC - CONVERSION
		numToString        : numToString,				//NEW
		expandENotation    : expandENotation,			//NEW
		ABS                : ABS,						//OPT <- NEW


		//ARITHMETIC - PATTERN SEARCH
		getExponent        : getExponent,				//OPT <- NEW
		getESign           : getESign,                  //OPT <- NEW
		getSign            : getSign,					//OPT <- NEW


	//=================================
	// OTHER NUMERICAL METHODS
	//=================================
		between            : between,


	//====================================
	// TESTING ZONE & METHOD IN QUESTION
	//====================================
	};
/*\
\*/

}	//END OF ARITHMETIC OBJECT





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
		else {
			// CHECK IF THE INPUT IS ALREADY 0
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

	function descendingOrder(n){
		let s1       = "" + n;
		let numArray = [];
		  
		for( var i = 0; i < s1.length; i++ ) {
			numArray.push( s1[i] );
		}
		  
		numArray.sort( function( a, b ) {
			return b-a;
		});
		  
		return numArray.join("");
	}