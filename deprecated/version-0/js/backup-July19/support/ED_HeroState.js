function ED_HeroState( ) {
	function createHero( ) {
		let newHero = new ED_Hero( );
		return newHero;
	}

	return {
		createHero : createHero
	};
}