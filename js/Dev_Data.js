function Notes( ) {
    const devNotes = [
        `<dl class="note">
            <dt class="date">November 19, 2019</dt>
            <dd class="definition story">
                I can't believe this game is growing so steadily. :D
                <br />
                There is a lot of things to do before I can say that I have a complete DEMO.
                First, I have to finish off adding content to what I have first.
            </dd>
            <dd class="definition fixed">
                Fixed: Timer is rebuilt to work more efficiently.<br />
                Fixed: Adjusted all the upgrade multiplier, so they are a little bit more powerful.<br />
            </dd>
            <dd class="definition added">
                Added: Self Destruct timer on achievement.  Now the achievement will disappear off the screen after 10 second of not closing.<br />
                Added: Sound effects whenever you pick up some poo.<br />
                Updated: Statistic is now decorated with more stats.<br />
                Updated: New Game, Load Game now transition into a different game instead of instant jump.
            </dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">November 14, 2019</dt>
            <dd class="definition story">
                I have been working on this none stop,
                because I think I just finished all the ground work for this game,
                and I am super excited to fill in all the content.  
                <br />
                Then I still got all the artwork to do.
            </dd>
            <dd class="definition fixed">
                Fixed: Reorganized my code!!<br />
                Fixed: Upgrades now shows correct PPS(Poo Per Second) amount.<br />
                Fixed: Saving Data, Loading Data all now show correct information.
            </dd>
            <dd class="definition added">Added: Random Name Generator when you start a new game.</dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">November 9, 2019</dt>
            <dd class="definition story">
                Wow!! This game is turning out better than I expected. 
                Although it is not perfect and no new features added since September.  
                I had been fixing the game flow issues before this project gets too big.
            </dd>

            <dd class="definition fixed">
                Fixed: Game flow issues.<br />
                Fixed: Achievement Icons will load properly after loading a game.<br />
                Fixed: Poo Store now load all the tools properly during new game and load game.
            </dd>

            <dd class="definition added">
                Updated: Redo all the game HUD/UI.<br />
                Updated: No more splash screen or load screen, you immedately start in a new game.<br />
                Updated: New game | load game | save game will all appear in the settings.
            </dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">November 5, 2019</dt>
            <dd class="definition story">
                Replaced all the icon in Tech and Achievement.  
                Now everything looks a bit more unique and not with the same icon. 
                I am thinking about changing up the display a bit.  
                That's gonna be a lot of moving things around.
            </dd>
            <dd class="definition fixed">
                Fixed: minor visual presentation.
            </dd>
        </dl>`, 
        
        `<dl class="note">
            <dt class="date">October 26, 2019</dt>
            <dd class="definition story">
                It's been a month since my last update?! I am just that busy sigh...
            </dd>
            <dd class="definition fixed">
                Fixed: Tech Upgrade couldn't be detected after loading a game.
            </dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">September 28, 2019</dt>
            <dd class="definition story">
                I stop adding features and started adding content.  
                Getting ready to launch a DEMO!!!
                This is going to be interesting.
            </dd>
            <dd class="definition added">
                Updated: and added new tech for Hand.<br />
                Updated: and added achievements for Hand.<br />
                Updated: and balance cost for Hand upgrade.<br />
                Updated: Hand Storyboard.
            </dd>						
        </dl>`,

        `<dl class="note">
            <dt class="date">September 14, 2019</dt>
            <dd class="definition story">
                Been away for some time coding a system that I didn't need.  
                Wasted time, but good learning experience. <i class="fas fa-thumbs-up"></i>
            </dd>

            <dd class="definition added">
                Updated: Number Notation - very large number don't appear unledgable anymore.
                Updated: Mouse over upgrades will give pop up a description of what it does.  
                It also tells a little bit of the game's intent and story. :P
            </dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">August 30, 2019</dt>
            <dd class="definition added">
                Updated: Random Story board message, now this game looks unique. :D
            </dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">August 24, 2019</dt>
            <dd class="definition story">Started working on the Tech Tree.</dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">August 18, 2019</dt>
            <dd class="definition story">
                Poopy issues happened, I took a break.
            </dd>
            <dd class="definition added">
                Updated: You can now buy and sell your upgrades.<br />
                Updated: Allow to purchase 10x or 100x the upgrade if you have the poo...<br />
                Updated: Allow to sell 10x or 100x if you have the upgrades.<br />
                Updated: Added more fun statistics :)
            </dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">July 23, 2019</dt>
            <dd class="definition added">
                Updated: Added Poo per second.  No longer do we have to pick up poo.<br />
                Updated: Added more upgrades Baby!!  Get it? :P<br />
                Updated: Also added a bunch of statistical nerdy stuff.
            </dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">July 20, 2019</dt>
            <dd class="definition added">
                Updated: Self Regulate Pop-Up Number whenever you dig up some poo.<br />
                Updated: Added my first Poo upgrade!!  Da Shovel! Argh Poo~~ :P
            </dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">July 14, 2019</dt>
            <dd class="definition story">
                This game is Awesome!
            </dd>
            <dd class="definition added">
                Updated: Background added.<br />
                Updated: Game Data can be save and load from local storage.<br />
                Updated: Clickable Poo.
            </dd>
        </dl>`,

        `<dl class="note">
            <dt class="date">July 1, 2019</dt>
            <dd class="definition story">
                Life was kinda crappy.<br />
                So I started making this game.
            </dd>
        </dl>`
    ];

    Object.freeze( devNotes );

    return {
        getDNotes : devNotes
    };
}

