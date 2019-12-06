function ScreenPanel( ) {
    //==============================================================================
	// const panelState = State of the Panel, use for resetting
	//==============================================================================
	const screenID = [ "upgradeScreen", "statsScreen", "settingScreen" ];
	const panelID  = [ "upgradeBtn", "statsBtn", "settingBtn" ];

	Object.freeze( screenID );
	Object.freeze( panelID );

	function toggleScreen( exception ) {
		const i         = screenID.indexOf( exception );
		const newPanel  = panelID.filter( (el, index) => { return index != i; });
		const newScreen = screenID.filter( (el, index) => {	return index != i; });

		newScreen.forEach( (screen) => { $D.id( screen ).style.display = "none"; });
		newPanel.forEach( (btn) => { $D.id( btn ).className = "cmdBtn";	});

		// SHOW OR HIDE
        //  IF SCREEN IS BLOCK -> TURN IT OFF
        //  IF SCREEN IS NONE  -> TURN IT ON
		const selected = $D.id( screenID[i] );
		selected.style.display = ( selected.style.display == "block" ) ? "none" : "block";
		
		const btnSelected = $D.id( panelID[i] );
		if( ( btnSelected.className ).match( "selected" ) ) {
			btnSelected.className = "cmdBtn";
		} else {
			btnSelected.className = "cmdBtn selected";
		}
    }
    
    return {
        toggleScreen
    };
}