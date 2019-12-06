function SoundData( ) {
    const pooClickSFX = [
		new Audio( "../audio/shovel_sfx_4.mp4" ),
		new Audio( "../audio/shovel_sfx_2.mp4" )
	];
	Object.freeze( pooClickSFX );

	function playPooClickSFX( ) {
		const audio = pooClickSFX[ GameUtility.between( 1, pooClickSFX.length ) - 1 ];
		audio.volume = 0.5;
		audio.play( );
    }
    
    return {
        playPooClickSFX
    };
}