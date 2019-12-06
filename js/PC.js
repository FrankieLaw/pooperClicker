// =====================================================================
//  GAMEDATA
// 	   Hard Code Game Data for PooperClicker
// 	   Contains all the upgrades, screen activity information.
//
//  Change this section if you want the game to run a little different.  
//  This is use for tweeking game mechanics and fun factor of the game.
//
//	CP Const => upgrade | techTree | techTree | message | achievement | random name
//  UI Const => quantity | screens
// =====================================================================

function GameData( ) {
	const _upgrade     = UpgradeData( );
	const _tech        = TechData( );
	const _quantity    = Quantity( );
	const _message     = MessageData( );
	const _chevo       = AchievementData( );
	const _worldName   = WorldNameData( );
	const _screenPanel = ScreenPanel( );
	const _sound       = SoundData( );

	Object.freeze( _upgrade );
	Object.freeze( _tech );
	Object.freeze( _quantity );
	Object.freeze( _message );
	Object.freeze( _chevo );
	Object.freeze( _worldName );
	Object.freeze( _screenPanel );
	Object.freeze( _sound );

	return {
		//==========================================
		// UPGRADES 										NEW - UPDATED CODE IS HERE
		//==========================================
		getUpgradeByName 			: _upgrade.getUpgradeByName,
		getUpgradeFactor 			: _upgrade.getUpgradeFactor,
		getUpgradeBase   			: _upgrade.getUpgradeBase,
		getUpgradePPS    			: _upgrade.getUpgradePPS,
		getUpgradeRefund 			: _upgrade.getUpgradeRefund,
		getAllUpgradeName  			: _upgrade.getAllUpgradeName,
		getUpgradeShop              : _upgrade.getUpgradeShop,
		
		selectAllUpgradeByProperty 	: _upgrade.selectAllUpgradeByProperties,

		calcPrice      				: _upgrade.calcPrice,
		calcSumPrice   				: _upgrade.calcSumPrice,
		calcSellPrice  				: _upgrade.calcSellPrice,
		calcAllPPS     				: _upgrade.calcAllPPS,

		
		//==========================================
		// TECH TREE
		//==========================================
		getTechTree   	   			 : _tech.getTechTree,					// require delete when it is live

		getTechTreeLength   		 : _tech.getTechTreeLength,
		getTechById	    			 : _tech.getTechById,
		getTechRequirement  		 : _tech.getTechRequirement,
		getTechMultiplier   		 : _tech.getTechMultiplier,
		getTechCost         		 : _tech.getTechCost,
		getTechSprite       		 : _tech.getTechSprite,
		getAllTechId				 : _tech.getAllTechId,
		
		selectAllTechByProperty		 : _tech.selectAllTechByProperty,

		isTechEligible 				 : _tech.isTechEligible,
		getPurchasbleTechTreeUpgrade : _tech.getPurchasbleTechTreeUpgrade,
		

		//==========================================
		// POO STORE
		//==========================================
		getQuantity    : _quantity.getQuantity,


		//==========================================
		// MESSAGE BOARD
		//==========================================
		getMessageBoardUpdate : _message.getMessageBoardUpdate,


		//==========================================
		// ACHIEVEMENTS
		//==========================================
		checkAchievement   		 : _chevo.checkAchievement,
		getAchievementById 		 : _chevo.getAchievementById,
		getAchievementLength 	 : _chevo.getAchievementLength,
		selectAllChevoByProperty : _chevo.selectAllChevoByProperty,


		//==========================================
		// RANDOM NAME
		//==========================================
		getRandomName : _worldName.getRandomName,


		//==========================================
		// PANEL CONTROLS
		//==========================================
		toggleScreen  : _screenPanel.toggleScreen,


		//==========================================
		// SOUND
		//==========================================
		playPooClickSFX : _sound.playPooClickSFX

	};
}