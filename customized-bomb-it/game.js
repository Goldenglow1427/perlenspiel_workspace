
"use strict"; // Do NOT remove this directive!

const EdgeThickness = 2;
const DefaultThickness = 1;

// About the edges definition.
const thick_top_edge = {
    top: EdgeThickness+DefaultThickness
};
const thick_left_edge = {
    left: EdgeThickness+DefaultThickness
};
const thick_bot_edge = {
    bottom: EdgeThickness+DefaultThickness
};
const thick_right_edge = {
    right: EdgeThickness+DefaultThickness
};
const top_edge = {
    top: EdgeThickness
};
const left_edge = {
    left: EdgeThickness
};
const bot_edge = {
    bottom: EdgeThickness
};
const right_edge = {
    right: EdgeThickness
};
const general_tile = {
    top: DefaultThickness,
    left: DefaultThickness,
    bottom: DefaultThickness,
    right: DefaultThickness
};
const empty_tile = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
};
const empty_right_tile = {
    right: 0
};
const empty_left_tile = {
    left: 0
};

const COLOR_RED = 0xDE7378;
const COLOR_BLUE = 0x73DED9;
const COLOR_GRAY = 0xABABAB;

const COLOR_DARK_RED = 0x811E23;
const COLOR_DARK_BLUE = 0x1E817D;

const COLOR_BOMB_0 = 0xffee9f;
const COLOR_BOMB_1 = 0xffd61c;
const COLOR_BOMB_2 = 0xff4000;

const OUT_OF_BOUNDARY = -2;
const WALL = -1;
const PATH = 0;
const OBSTACLE = 1;
const EMPTY_TOWER = 2;
const TOWER_PLAYER_ONE = 3;
const TOWER_PLAYER_TWO = 4;
const EMPTY_MAIN_TOWER = 5;
const MAIN_TOWER_PLAYER_ONE = 6;
const MAIN_TOWER_PLAYER_TWO = 7;
const LABORATORY_PLAYER_ONE = 8;
const LABORATORY_PLAYER_TWO = 9;
const RITUAL = 10;

class BattleField
{
    p1movex = 0;
    p1movey = 0;
    p2movex = 0;
    p2movey = 0;

    p1space = false;
    p2space = false;

    p1x;
    p1y;
    p2x;
    p2y;

    map;
    health;

    bomb_list;

    constructor()
    {
        this.p1x = 4, this.p1y = 8;
        this.p2x = 16, this.p2y = 8;

        this.p1movex = this.p2movex = 0;
        this.p1movey = this.p2movey = 0;

        this.map = new Array(21).fill(0).map(() => new Array(15).fill(0));
        this.health = new Array(21).fill(0).map(() => new Array(15).fill(0));
        
        this.bomb_list = [];
    }

    resetDirections()
    {
        this.p1movex = this.p1movey = this.p2movex = this.p2movey = 0;
    }

    checkspace(pl, x, y)
    {
        // this.bomb_list.push(x);
    }

    updateBomb()
    {
        for(let i=this.bomb_list.length-1; i>=0; i--)
        {
            PS.debug(this.bomb_list[i][0]);
        }
    }

    drawMapSetup()
    {
        // Clear everything.
        for(let i=0; i<=20; i++)
            for(let j=0; j<=14; j++)
            {
                PS.border(i, j, empty_tile);
                this.map[i][j] = OUT_OF_BOUNDARY;
            }

        for(let i=4; i<=16; i++)
            for(let j=2; j<=14; j++)
            {
                PS.border(i, j, general_tile);
                this.map[i][j] = PATH;
            }
        for(let i=17; i<=19; i++)
            for(let j=7; j<=9; j++)
            {
                PS.border(i, j, general_tile);
                PS.border(i-16, j, general_tile);

                this.map[i][j] = this.map[i-16][j] = PATH;
            }
        // Main battlefield.
        for(let i=2; i<=14; i++)
        {
            PS.border(4, i, thick_left_edge);
            PS.border(16, i, thick_right_edge);
            PS.border(i+2, 2, thick_top_edge);
            PS.border(i+2, 14, thick_bot_edge);
        }
        for(let i=7; i<=9; i++)
        {
            PS.border(4, i, general_tile);
            PS.border(16, i, general_tile);

            PS.border(19, i, thick_right_edge);
            PS.border(1, i, thick_left_edge);
        }

        // Lab.
        for(let i=17; i<=19; i++)
        {
            PS.border(i, 7, thick_top_edge);
            PS.border(i, 9, thick_bot_edge);

            PS.border(i-16, 7, thick_top_edge);
            PS.border(i-16, 9, thick_bot_edge);
        }

        PS.glyph(20, 0, 'X');
        PS.glyphColor(20, 0, COLOR_DARK_RED);

        PS.glyph(0, 0, 'O');
        PS.glyphColor(0, 0, COLOR_DARK_BLUE);

        for(let i=0; i<=5; i++)
        {
            PS.border(i, 0, top_edge);
            PS.border(i, 0, bot_edge);

            PS.border(i+15, 0, top_edge);
            PS.border(i+15, 0, bot_edge);
        }

        PS.border(0, 0, left_edge);
        PS.border(0, 0, right_edge);
        PS.border(5, 0, right_edge);
        PS.border(20, 0, left_edge);
        PS.border(20, 0, right_edge);
        PS.border(15, 0, left_edge);

        PS.color(0, 0, COLOR_BLUE);
        PS.color(20, 0, COLOR_RED);
        // for(let i=1; i<=5; i++)
        //     PS.color(i, 0, COLOR_BLUE);
        // for(let i=1; i<=5; i++)
        //     PS.color(20-i, 0, COLOR_RED);

        // PS.glyph()
    }

    stepUpdate()
    {
        PS.glyph(this.p1x, this.p1y, '');
        PS.glyph(this.p2x, this.p2y, '');
        
        if(this.map[this.p1x+this.p1movex][this.p1y+this.p1movey] == PATH)
        {
            this.p1x += this.p1movex;
            this.p1y += this.p1movey;
        }
        if(this.map[this.p2x+this.p2movex][this.p2y+this.p2movey] == PATH)
        {
            this.p2x += this.p2movex;
            this.p2y += this.p2movey;
        }

        PS.glyph(this.p1x, this.p1y, 'O');
        PS.glyph(this.p2x, this.p2y, 'X');
        // PS.debug(this.p2x);
        // PS.debug(this.p2y);
        // PS.debug("\n");

        PS.statusText("(" + this.p2x + ", " + this.p2y + ")");

        this.checkspace(1, 4, 10);
        // this.updateBomb();

        this.resetDirections();
    }
}

var battle = new BattleField();

PS.init = function( system, options ) {

    // battle.initialize();
    
    PS.gridSize(21, 15);

    // PS.debug(battle.p2x);
    battle.drawMapSetup();

    PS.timerStart(6, function(){
        battle.stepUpdate();
    });

};


PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
};


PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

    

	// Add code here for when the mouse button/touch is released over a bead.
};

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

    if(key == 1008) // upward.
        battle.p2movey = 1;
    if(key == 1006)
        battle.p2movey = -1;
    if(key == 1005)
        battle.p2movex = -1;
    if(key == 1007)
        battle.p2movex = 1;

    if(key == 119) // W
        battle.p1movey = -1;
    if(key == 115) // A
        battle.p1movey = 1;
    if(key == 97) // S
        battle.p1movex = -1;
    if(key == 100) // D
        battle.p1movex = 1;

	// Add code here for when a key is pressed.
};

/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

