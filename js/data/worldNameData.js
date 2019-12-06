function WorldNameData( ) {
    const prefix = [
		"Pre-Historic", "Stoned", "Medieval", "Atomic", "Iron", "Epic", "Mr", "Mrs",
		"Average", "Captain", "Grand Priest", "Uncle", "Aunty", "St."
	];

	const worldName = [
		"Fraise", "Schmitz", "Trump", "Duke", "Jinx", "Sparda", "Argentia", "Joe", "Dandy", "America",
		"Bob"
	]

	const subfix = [
		"the Ruler", "the Devastator", "the Dictator", "XXIII", "the Man", "the Troll", "the Destroyer"
	]

	Object.freeze( prefix );
	Object.freeze( worldName );
	Object.freeze( subfix );

	function getRandomName( ) {
		const a = GameUtility.between( 1, prefix.length ) - 1;
		const b = GameUtility.between( 1, worldName.length ) - 1;
		const c = GameUtility.between( 1, subfix.length ) - 1;

		return prefix[a] + " " + worldName[b] + " " + subfix[c];
	}

    return {
        getRandomName
    };
}