// Constants used.

"use strict"; // Do NOT remove this directive!

const STEP_DEBUG = true; // Yield debugging message in each steps in the procedure.
const FUNCTION_DEBUG = true; // Yield debugging message for the return value of functions.

const OverallWidth = 9;
const OverallHeight = 9;

const EdgeThickness = 5;
const DefaultThickness = 1;

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

const check = function(v1, v2, v3)
{
    if(v1 == v2 && v2 == v3 && v3 != 0)
        return v1;
    else
        return 0;
};

var stat = {
    player: 0,
    map: [],
    result: [],
    curx: -1,
    cury: -1,

    // Functions

    /*
    The setup() function is for setting up the environment.
    */
    setup: function()
    {
        "use strict";

        stat.player = 1;
        stat.map = new Array(9).fill(0).map(() => new Array(9).fill(0));
        stat.result = new Array(3).fill(0).map(() => new Array(3).fill(0));

        // PS.debug(stat.map[8][8]);
    },

    paint: function(x, y, value)
    {
        x *= 3, y *= 3;

        var color = PS.COLOR_WHITE;
        if(value == 1)
            color = PS.COLOR_RED;
        else if(value == 2)
            color = PS.COLOR_BLUE;

        for(let i=0; i<=2; i++)
            for(let j=0; j<=2; j++)
                PS.color(x+i, y+j, color);
    },

    checkoverallwin: function()
    {
        if(check(stat.result[0][0], stat.result[0][1], stat.result[0][2]))
            return stat.result[0][0];
        if(check(stat.result[1][0], stat.result[1][1], stat.result[1][2]))
            return stat.result[1][0];
        if(check(stat.result[2][0], stat.result[2][1], stat.result[2][2]))
            return stat.result[2][0];

        if(check(stat.result[0][0], stat.result[1][0], stat.result[2][0]))
            return stat.result[0][0];
        if(check(stat.result[0][1], stat.result[1][1], stat.result[2][1]))
            return stat.result[0][1];
        if(check(stat.result[0][2], stat.result[1][2], stat.result[2][2]))
            return stat.result[0][2];

        if(check(stat.result[0][0], stat.result[1][1], stat.result[2][2]))
            return stat.result[0][0];
        if(check(stat.result[0][2], stat.result[1][1], stat.result[2][0]))
            return stat.result[0][2];

        return 0;
    },

    clearColor: function(x, y)
    {
        if(x == -1 || y == -1)
            return;

        x *= 3, y *= 3;

        for(let i=0; i<=2; i++)
            for(let j=0; j<=2; j++)
                PS.color(x+i, y+j, PS.COLOR_WHITE);
    },

    paintHint: function(x, y)
    {
        stat.curx = x, stat.cury = y;

        if(stat.result[x][y] != 0)
            return;

        x *= 3, y *= 3;

        for(let i=0; i<=2; i++)
            for(let j=0; j<=2; j++)
                if(stat.map[x+i][y+j] == 0)
                    PS.color(x+i, y+j, PS.COLOR_YELLOW);
    },

    /*
    The checkwin() function checks if a cell has a winner, and update the results.
    */
    checkwin: function(x, y)
    {
        if(stat.result[x][y] != 0)
            return stat.result[x][y];

        var X = 3*x, Y = 3*y;

        if(check(stat.map[X][Y], stat.map[X][Y+1], stat.map[X][Y+2]))
            stat.result[x][y] = stat.map[X][Y];
        if(check(stat.map[X+1][Y], stat.map[X+1][Y+1], stat.map[X+1][Y+2]))
            stat.result[x][y] = stat.map[X+1][Y];
        if(check(stat.map[X+2][Y], stat.map[X+2][Y+1], stat.map[X+2][Y+2]))
            stat.result[x][y] = stat.map[X+2][Y];

        if(check(stat.map[X][Y], stat.map[X+1][Y], stat.map[X+2][Y]))
            stat.result[x][y] = stat.map[X][Y];
        if(check(stat.map[X][Y+1], stat.map[X+1][Y+1], stat.map[X+2][Y+1]))
            stat.result[x][y] = stat.map[X][Y+1];
        if(check(stat.map[X][Y+2], stat.map[X+1][Y+2], stat.map[X+2][Y+2]))
            stat.result[x][y] = stat.map[X][Y+2];

        if(check(stat.map[X][Y], stat.map[X+1][Y+1], stat.map[X+2][Y+2]))
            stat.result[x][y] = stat.map[X][Y];
        if(check(stat.map[X+2][Y], stat.map[X+1][Y+1], stat.map[X][Y+2]))
            stat.result[x][y] = stat.map[X+2][Y];

        stat.paint(x, y, stat.result[x][y]);

        return stat.result[x][y];
    },

    /*
    The click(x, y) function updates a click on a tile.
    */
    click: function(x, y)
    {
        if(stat.map[x][y] != 0)
            return 0; // Not successful - already occupied.

        stat.map[x][y] = stat.player;
        if(stat.player == 1)
            PS.glyph(x, y, "O");
        else
            PS.glyph(x, y, "X");

        stat.player = 3 - stat.player;

        if(FUNCTION_DEBUG)
            PS.debug(stat.checkwin(Math.floor(x/3), Math.floor(y/3)));
        else
            stat.checkwin(Math.floor(x/3), Math.floor(y/3));

        var res = stat.checkoverallwin();

        if(res != 0)
        {
            PS.statusText("Congradulations to player " + res + " for winning!");
        }

        stat.clearColor(stat.curx, stat.cury);
        stat.paintHint(x%3, y%3);

        return 1;
    }
}

PS.init = function( system, options ) {
	PS.gridSize(9, 9);

    for(let i=0; i<9; i++)
    {
        for(let j=0; j<=6; j+=3)
            PS.border(i, j, top_edge);
        PS.border(i, 8, bot_edge);

        for(let j=2; j<=8; j+=3)
            PS.border(j, i, right_edge);
        PS.border(0, i, left_edge);
    }

    if(STEP_DEBUG)
        PS.debug("Successfully built the border!");

    stat.setup();
};


PS.touch = function( x, y, data, options ) {
	stat.click(x, y);
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

    

	// Add code here for when the mouse button/touch is released over a bead.
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exit = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.exitGrid = function( options ) {
	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

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

