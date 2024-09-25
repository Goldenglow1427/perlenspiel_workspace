/**
 * Features to add:
 * - record(): mostly for debug, record the steps in local file for further check;
 * - Bottom status bar for team color, team scores, and restart the game;
 * - Toggle for the color hinting;
 * - Add a tutorial for the game, so it's easier for the beginners to play;
 * - Modify the cover image (cover.png);
 */


// Constants used.

"use strict"; // Do NOT remove this directive!

const CreditMessage = "Special thanks to Tom Geng'25 for helping with designing the artistic elements in this game :)\n";

// Color codes.
const COLOR_WHITE = 0xFFFFFF;

const COLOR_RED = 0xDE7378;
const COLOR_BLUE = 0x73DED9;
const COLOR_GRAY = 0xABABAB;

const COLOR_DARK_RED = 0x811E23;
const COLOR_DARK_BLUE = 0x1E817D;

const COLOR_YELLOW = 0xFFFB6F;
const COLOR_DARK_YELLOW = 0xFFDF98;

const COLOR_LIGHT_GRAY = 0xDCDCDC;
const COLOR_DARK_GRAY = 0x979797;

const STEP_DEBUG = false; // Yield debugging message in each steps in the procedure.
const FUNCTION_DEBUG = false; // Yield debugging message for the return value of functions.

const WARN_INVALID_MOVE = -1;
const SUCCESS = 1;
const GAME_END = 2;

const OverallWidth = 9;
const OverallHeight = 9;

const EdgeThickness = 2;
const DefaultThickness = 1;

// About the edges definition.
const thick_top_edge = {
    top: 2*EdgeThickness
};
const thick_left_edge = {
    left: 2*EdgeThickness
};
const thick_bot_edge = {
    bottom: 2*EdgeThickness
};
const thick_right_edge = {
    right: 2*EdgeThickness
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
const empty_right_tile = {
    right: 0
};
const empty_left_tile = {
    left: 0
};

const check = function(v1, v2, v3)
{
    if(v1 == v2 && v2 == v3 && v3 != 0)
        return v1;
    else
        return 0;
};

var controller = {
    stage: 0
    /*
    0 means in the default screen.
    1 means in the game.
    2 means in the setting page.
    */
}

const HOME = 10;
const IN_GAME = 20;

class GraphicsClass
{
    constructor()
    {
        this.mode = HOME;
    }

    findColor(x, y)
    {
        return PS.color(y, x);
    };
    
    // Setup the game interface.
    setupGame()
    {
        PS.gridSize(9, 10);
        for(let i=0; i<9; i++)
        {
            for(let j=0; j<=6; j+=3)
            {
                PS.border(i, j, top_edge);
                PS.border(j, i, left_edge);
            }

            for(let j=2; j<=8; j+=3)
            {
                PS.border(j, i, right_edge);
                PS.border(i, j, bot_edge);
            }
            // PS.border(0, i, left_edge);
        }

        for(let i=0; i<9; i++)
        {
            PS.border(i, 0, thick_top_edge);
            PS.border(i, 9, thick_bot_edge);
            PS.border(i, 9, top_edge);
        }
        for(let i=0; i<10; i++)
        {
            PS.border(0, i, thick_left_edge);
            PS.border(8, i, thick_right_edge);
        }

        PS.color(0, 9, COLOR_BLUE);
        PS.glyph(0, 9, 'O');
        PS.glyphColor(0, 9, COLOR_DARK_BLUE);

        PS.color(8, 9, COLOR_RED);
        PS.glyph(8, 9, 'X');
        PS.glyphColor(8, 9, COLOR_DARK_RED);

        PS.glyph(1, 9, String(stat.score1));
        PS.glyphColor(1, 9, COLOR_DARK_BLUE);

        PS.glyph(7, 9, String(stat.score2));
        PS.glyphColor(7, 9, COLOR_DARK_RED);

        PS.glyph(4, 9, 0x2699);
    }
};

var graphicControl = new GraphicsClass();

var stat = {
    player: 0,
    map: [],
    result: [],
    curx: -1,
    cury: -1,
    winner: 0,
    score1: 0,
    score2: 0,

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
        stat.curx = stat.cury = -1;

        stat.score1 = stat.score2 = 0;

        PS.statusText("Ultimate Tic-Tac-Toe");        
    },

    paint: function(x, y, value)
    {
        x *= 3, y *= 3;

        var color = PS.COLOR_WHITE;
        if(value == 1)
            color = COLOR_BLUE;
        else if(value == 2)
            color = COLOR_RED;
        else if(value == 3)
            color = COLOR_GRAY;

        for(let i=0; i<=2; i++)
            for(let j=0; j<=2; j++)
                PS.color(x+i, y+j, color);
    },

    paintall: function()
    {
        for(let i=0; i<3; i++)
            for(let j=0; j<3; j++)
                stat.paint(i, j, stat.result[i][j]);
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

        var cnt = 0;
        for(let i=0; i<3; i++)
            for(let j=0; j<3; j++)
                if(stat.map[X+i][Y+j] != 0)
                    cnt++;

        if(cnt == 9 && stat.result[x][y] == 0)
            stat.result[x][y] = 3;

        if(stat.result[x][y] == 1)
            stat.score1++;
        else if(stat.result[x][y] == 2)
            stat.score2++;

        stat.paint(x, y, stat.result[x][y]);

        return stat.result[x][y];
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

        var cnt = 0;
        for(let i=0; i<3; i++)
            for(let j=0; j<3; j++)
                if(stat.result[i][j] != 0)
                    cnt++;
        if(cnt == 9)
            return 3;

        return 0;
    },

    paintHint: function(x, y)
    {
        if(stat.result[x][y] != 0)
            return;

        x *= 3, y *= 3;

        for(let i=0; i<=2; i++)
            for(let j=0; j<=2; j++)
                if(stat.map[x+i][y+j] == 0)
                {
                    if(stat.result[i][j] == 0)
                        PS.color(x+i, y+j, COLOR_YELLOW);
                    else
                        PS.color(x+i, y+j, COLOR_DARK_YELLOW);
                }
    },

    paintHintAll: function()
    {
        for(let i=0; i<3; i++)
            for(let j=0; j<3; j++)
                stat.paintHint(i, j);
    },

    isValidCell: function(x, y)
    {
        if(stat.result[x][y] != 0)
            return false;
        var cnt = 0;

        for(let i=0; i<3; i++)
            for(let j=0; j<3; j++)
                if(stat.map[3*x+i][3*y+j] == 0)
                    cnt++;
        
        if(cnt > 0)
            return true;
        else
            return false;
    },

    switchToPlayer: function(x)
    {
        PS.color(0, 9, COLOR_LIGHT_GRAY);
        PS.color(8, 9, COLOR_LIGHT_GRAY);

        PS.glyphColor(0, 9, COLOR_DARK_GRAY);
        PS.glyphColor(8, 9, COLOR_DARK_GRAY);
        
        if(x == 1)
        {
            PS.color(0, 9, COLOR_BLUE);
            // PS.glyph(0, 9, 'O');
            PS.glyphColor(0, 9, COLOR_DARK_BLUE);
        }
        if(x == 2)
        {
            PS.color(8, 9, COLOR_RED);
            // PS.glyph(8, 9, 'X');
            PS.glyphColor(8, 9, COLOR_DARK_RED);
        }
    },

    /*
    The onClick(x, y) function updates a click on a tile.
    */
    onClick: function(x, y)
    {
        if(stat.map[x][y] != 0)
        {
            PS.debug("Warning from onClick(x, y): Invalid move - tile occupied.\n");
            return WARN_INVALID_MOVE; // Not successful - already occupied.
        }
        if(stat.result[Math.floor(x/3)][Math.floor(y/3)] != 0)
        {
            PS.debug("Warning from onClick(x, y): Invalid move - cell already has a winner.\n");
            return WARN_INVALID_MOVE;
        }
        if(stat.winner != 0)
        {
            PS.debug("Warning from onClick(x, y): Invalid move - game already ended with a winner.\n");
            return WARN_INVALID_MOVE;
        }
        
        if(stat.curx != -1 && stat.cury != -1)
        {
            if(Math.floor(x/3) != stat.curx || Math.floor(y/3) != stat.cury)
            {
                PS.debug("Warning from onClick(x, y): Invalid move - wrong cell.");
                return WARN_INVALID_MOVE;
            }
        }

        // Recolor the previous information.
        if(stat.curx == -1 || stat.cury == -1)
            stat.paintall();
        else
            stat.paint(stat.curx, stat.cury);

        
        // Update the game results.
        stat.map[x][y] = stat.player;
        stat.checkwin(Math.floor(x/3), Math.floor(y/3));
        stat.winner = stat.checkoverallwin();

        // Update the graphical display.
        if(stat.player == 1)
        {
            PS.glyph(x, y, "O");
            PS.glyphColor(x, y, COLOR_DARK_BLUE);
        }
        else
        {
            PS.glyph(x, y, "X");
            PS.glyphColor(x, y, COLOR_DARK_RED);
        }

        PS.glyph(1, 9, String(stat.score1));
        PS.glyph(7, 9, String(stat.score2));

        if(stat.isValidCell(x%3, y%3))
            stat.curx = x%3, stat.cury = y%3;
        else
            stat.curx = stat.cury = -1;

        // Check if the game ends.
        if(stat.winner == 3)
        {
            PS.statusText("The game is ending with a tie.");
            return GAME_END;
        }
        else if(stat.winner != 0)
        {
            PS.statusText("Congradulations to player " + stat.winner + " for winning!");

            winDisplay();

            return GAME_END;
        }

        if(stat.curx == -1 || stat.cury == -1)
            stat.paintHintAll();
        else
            stat.paintHint(stat.curx, stat.cury);
        stat.player = 3 - stat.player;

        // PS.statusText("It's player "+ stat.player + "'s turn");
        stat.switchToPlayer(stat.player);

        return SUCCESS;
    }
}

function checkWinningStatus()
{
    if(check(stat.result[0][0], stat.result[0][1], stat.result[0][2]))
        return 210;
    if(check(stat.result[1][0], stat.result[1][1], stat.result[1][2]))
        return 543;
    if(check(stat.result[2][0], stat.result[2][1], stat.result[2][2]))
        return 876;

    if(check(stat.result[0][0], stat.result[1][0], stat.result[2][0]))
        return 630;
    if(check(stat.result[0][1], stat.result[1][1], stat.result[2][1]))
        return 741;
    if(check(stat.result[0][2], stat.result[1][2], stat.result[2][2]))
        return 852;

    if(check(stat.result[0][0], stat.result[1][1], stat.result[2][2]))
        return 840;
    if(check(stat.result[0][2], stat.result[1][1], stat.result[2][0]))
        return 642;

    return 0;
}

var targetTiles = 0;
var remainingTimes = 0;

var tileShineTimer = PS.DEFAULT;

var currentColor = 0;
var defaultColor = COLOR_WHITE;

function winDisplay()
{
    targetTiles = checkWinningStatus();
    // targetTiles = 210;
    remainingTimes = 7;

    currentColor = 0;

    for(let i=targetTiles, j=0; j<3; j++, i=Math.floor(i/10))
    {
        let cury = (i%10)%3, curx = Math.floor((i%10)/3);

        defaultColor = PS.color(curx*3, cury*3);

        for(let xi=0; xi<=2; xi++)
            for(let yi=0; yi<=2; yi++)
                PS.fade(curx*3+xi, cury*3+yi, 30);
    }

    // defaultColor = COLOR_DARK_BLUE;

    tileShineTimer = PS.timerStart(60, displayShine);
}
function displayShine()
{
    PS.debug("Check");

    if(remainingTimes == 0)
    {
        PS.timerStop(tileShineTimer);
        return;
    }
    
    for(let i=targetTiles, j=0; j<3; j++, i=Math.floor(i/10))
    {
        let cury = (i%10)%3, curx = Math.floor((i%10)/3);
        for(let xi=0; xi<=2; xi++)
            for(let yi=0; yi<=2; yi++)
                if(currentColor == 0)
                    PS.color(curx*3+xi, cury*3+yi, defaultColor);
                else
                    PS.color(curx*3+xi, cury*3+yi, COLOR_WHITE);
    }

    currentColor = 1 - currentColor;

    remainingTimes--;
}

function setupGame() {

    graphicControl.setupGame();

    stat.setup();
    stat.switchToPlayer(1);

    // winDisplay();
};

function setupHomePage()
{
    // paintLine("Tutorial", 1, 1);
    // PS.glyph(16, 1, 0x2386);

    paintLine("New Game       ", 1, 1);
    PS.glyph(18, 1, 0x2386);
};

function paintLine(st, x, y)
{
    for(let i=0; i<st.length; i++)
    {
        PS.glyph(x, y, st[i]);
        if(i != 0)
            PS.border(x, y, empty_left_tile);
        if(i != st.length-1)
            PS.border(x, y, empty_right_tile);
        x++;
    }
}

PS.init = function( system, options ) {
    // PS.glyphScale(4, 9, 100000);
    PS.debug(CreditMessage);
    PS.statusText("Ultimate Tic-Tac-Toe");
    
    PS.audioLoad("fx_click");
    PS.debug("Finish loading audios!");

    PS.gridSize(20, 3);

    setupHomePage();
};


PS.touch = function( x, y, data, options )
{
    if(controller.stage == 0)
    {
        if(x == 18 && y == 1)
        {
            setupGame();

            controller.stage = 1;
        }
    }
    else if(controller.stage == 1)
    {
        PS.audioPlay("fx_click");

        if(y <= 8)
            stat.onClick(x, y);
        else
        {
            PS.debug("Warning from PS.touch: Invalid move - on settings bar.");
        }
    }
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

