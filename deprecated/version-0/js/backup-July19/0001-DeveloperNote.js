//=======================================================
// Build Version 1.0 - July 1, 2019
//=======================================================
// The system develop current operating based on web
// logic.  However this imposes a problem with function
// trace stack unable to finish a function before the
// next part of the game begin.
// Over a long period of time function call will slowly
// drains of the memory available for the browser.
//
// The game is required to be switched to web based logic
// to Frame based logic allowing function to complete
// entirely.
//=======================================================


//=======================================================
// Build Version 1.0 - July 6, 2019
//=======================================================
// There is an issue with the AppSessionState object.
// Currently it is taking on too many role of taking
// care of how in game object is interacting with another
//
// Another dilemma is that, if I were to separate them
// I cannot keep AppSessionState information private.
//
//
// LocalStorage Data Sample
//		DataSlot1 : {
//			"HeroList" : { 
//				"hero1" : { "name" : "Frankie" },
//				"hero2" : { "name" : "Marly" }
//			}
//		}
//=======================================================


//=======================================================
// Build Version 1.0 - July 14, 2019
//=======================================================
// COMPLETED:
// 		Completed page Transition
// 		Added Background
// 		Added Poop - Not Clickable Yet
// 		Data can be save and loaded
// 		Multiple save game can be saved.
// 		Navigation, Footer and Statistic Panel (page4) added
//
// FUTURE DEVELOPMENT:
//	 [ ] - Clicking the Poo will accumulate Poo
//   [ ] - Change cursor to tiny shovel
//=======================================================