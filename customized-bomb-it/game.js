
"use strict"; // Do NOT remove this directive!

const DeveloperSetting = false; // Do NOT change the value of this setting!

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

const CHAR_TOWER = 0x2656;
const CHAR_MAIN_TOWER = 0x1F5FC;
const CHAR_RITUAL = 0x26E9;
const CHAR_LABORATORY = 0x21D1;
const CHAR_POWERUP_STUN = 0x1F4A5;

const COLOR_RED = 0xDE7378;
const COLOR_BLUE = 0x73DED9;
const COLOR_GRAY = 0xDDDDDD;

const COLOR_DARK_RED = 0x811E23;
const COLOR_DARK_BLUE = 0x1E817D;

const COLOR_BLACK = 0x000000;
const COLOR_WHITE = 0xFFFFFF;

const COLOR_BOMB_0 = 0xffee9f;
const COLOR_BOMB_1 = 0xffd61c;
const COLOR_BOMB_2 = 0xff4000;

const COLOR_BOMB_INDICATOR = 0xfff2b6;

/**
 * Generated from the website: https://pinetools.com/monochromatic-colors-generator
 * 
 * The default color used is COLOR_DARK_BLUE (0x1E817D).
 */
const COLOR_P1_SERIES = [
    0xffffff, 0xedfafa, 0xdbf6f5, 0xc9f2f0, 0xb7eeec, 0xa5eae7,
    0x93e5e2, 0x81e1dd, 0x6fddd9, 0x5dd9d4, 0x4bd5cf, 0x39d0ca
];

/**
 * Generated from the website: https://pinetools.com/monochromatic-colors-generator
 * 
 * The default color used is COLOR_DARK_RED (0x811E23).
 */
const COLOR_P2_SERIES = [
    0xffffff, 0xfaeded, 0xf6dbdc, 0xf2c9cb, 0xeeb7b9, 0xeeb7b9,
    0xe59397, 0xe18185, 0xdd6f74, 0xd95d63, 0xd54b52, 0xd03940
]

// Tile indicators.
const USE_MAP_VALUE = -100;

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

const POWERUP_STUN = 20;

/**
 * Layer used to set all exteral settings. Not interactive part for the game.
 */
const LAYER_DEFAULT = 60;

/**
 * Layer used to store the position of all the walls, cannot be override.
 */
const LAYER_WALL = 50;

/**
 * Layer used to place all the bombs.
 */
const LAYER_BOMB = 40;

/**
 * Animation layer. Used to display the illustration when the bomb is aboutt to explode.
 */
const LAYER_BOMB_INDICATOR = 30;

/**
 * Animation layer. Used to display the animation when occupying towers.
 */
const LAYER_OCCUPY_INDICATOR = 20;

/**
 * Layer used to store all the obstacles.
 */
const LAYER_OBSTACLE = 10;

const LAYER_LIST = [60, 50, 40, 30, 20, 10];

const DIRECTION_PAIRS = [[0, 1], [0, -1], [1, 0], [-1, 0]];

/**
 * About the tower occupation.
 */
const TOWER_OCCUPATION_DURATION = 100; // Time required to occupy a tower, unit: 0.05 seconds.

/**
 * About the powerups and props.
 */
const POWERUP_TOTAL_CHANCE = 10;
const POWERUP_REFRESH_RATE = 200; // Rate of generating powerups, unit: 0.05 seconds.

const STUN_DURATION = 30; // Stunning time, unit: 0.1 seconds.
const STUN_APPEAR_CHANCE = 10;

/**
 * Class to monitor and update the battle page status.
 */
class BattleField
{
    p1movex = 0;
    p1movey = 0;
    p2movex = 0;
    p2movey = 0;

    /**
     * If the game has ended.
     */
    gameEndIndicator = false;

    /**
     * If the player 1 is going to use the action button next turn.
     */
    p1action = false;

    /**
     * If the player 2 is going to use the action button next turn.
     */
    p2action = false;

    /**
     * The current x coordinate of player 1.
     */
    p1x;
    
    /**
     * The current y coordinate of player 1.
     */
    p1y;
    
    /**
     * The current x coordinate of player 2.
     */
    p2x;

    /**
     * The current y coordinate of player 2.
     */
    p2y;

    /**
     * Showing the health of the player 1.
     */
    p1health;

    /**
     * Showing the health of the player 2.
     */
    p2health;

    /**
     * Showing the count of player 1 base.
     */
    p1base = 3;

    /**
     * Showing the count of player 2 base.
     */
    p2base = 3;

    /**
     * The remaining countdown time.
     */
    countdown = 0;

    /**
     * If player 1 is stunned, and the remaining time.
     */
    p1stunDuration = 0;

    /**
     * If player 2 is stunned, and the remaining time.
     * 
     * Unit: 100 milliseconds.
     */
    p2stunDuration = 0;

    map;

    bomb_map;
    tower_map;

    bomb_indicator_map;

    tower_list;

    p1recordedHealth;
    p2recordedHealth;

    constructor()
    {
        this.p1x = 4, this.p1y = 8;
        this.p2x = 16, this.p2y = 8;

        this.p1movex = this.p2movex = 0;
        this.p1movey = this.p2movey = 0;

        this.p1health = this.p2health = 5;

        this.map = new Array(21).fill(0).map(() => new Array(15).fill(0));
        this.default_map = new Array(21).fill(0).map(() => new Array(15).fill(0));
        this.health = new Array(21).fill(0).map(() => new Array(15).fill(0));
        this.bomb_map = new Array(21).fill(0).map(() => new Array(15).fill(0));
        this.tower_map = new Array(21).fill(0).map(() => new Array(15).fill(0).map(() => new Array(2).fill(0)));
        this.bomb_indicator_map = new Array(21).fill(0).map(() => new Array(15).fill(0));

        this.tower_list = [[10, 2], [10, 8], [10, 14], [9, 4], [11, 4], [9, 12], [11, 12]];

        this.p1base = this.p2base = 3;

        this.mapSetup();
    }

    /**
     * Initialize this.map to its default value set.
     */
    mapSetup()
    {
        for(let i=0; i<=20; i++)
            for(let j=0; j<=14; j++)
                this.map[i][j] = OUT_OF_BOUNDARY;

        for(let i=4; i<=16; i++)
            for(let j=2; j<=14; j++)
                this.map[i][j] = PATH;
        for(let i=17; i<=19; i++)
            for(let j=7; j<=9; j++)
                this.map[i][j] = this.map[i-16][j] = PATH;

        for(let i=8; i<=12; i++)
            this.map[i][3] = this.map[i][13] = WALL;
        for(let i=5; i<=11; i++)
            this.map[8][i] = this.map[12][i] = WALL;
        this.map[9][8] = this.map[11][8] = WALL;
        for(let i=4; i<=6; i++)
            this.map[i][5] = this.map[i][11] = this.map[10+i][5] = this.map[10+i][11] = WALL;

        this.map[3][8] = this.map[17][8] = this.map[5][7] = this.map[5][9] = this.map[15][7] = this.map[15][9] = WALL;

        for(let i=8; i<=12; i++)
            this.map[i][4] = this.map[i][12] = OBSTACLE;
        for(let i=4; i<=6; i++)
            this.map[i][6] = this.map[i][10] = this.map[10+i][6] = this.map[10+i][10] = OBSTACLE;
        for(let j=7; j<=9; j++)
            this.map[2][j] = this.map[6][j] = this.map[14][j] = this.map[18][j] = OBSTACLE;
        this.map[3][7] = this.map[3][9] = this.map[17][7] = this.map[17][9] = OBSTACLE;

        this.map[2][8] = this.map[18][8] = WALL;

        // this.map[5][3] = this.map[5][13] = this.map[15][3] = this.map[15][13] = EMPTY_TOWER;

        for(let j=7; j<=9; j++)
            this.map[1][j] = LABORATORY_PLAYER_ONE, this.map[19][j] = LABORATORY_PLAYER_TWO;

        // this.map[10][2] = this.map[10][8] = this.map[10][14] = RITUAL;
        // this.map[10][2] = this.map[10][8] = this.map[10][14] = EMPTY_TOWER;
        for(let i=0; i<this.tower_list.length; i++)
            this.map[this.tower_list[i][0]][this.tower_list[i][1]] = EMPTY_TOWER;

        // this.map[10][6] = this.map[10][10] = EMPTY_MAIN_TOWER;
    }

    drawGlyph(i, j, op=USE_MAP_VALUE)
    {
        PS.glyph(i, j, '');

        if(op == USE_MAP_VALUE)
            op = this.map[i][j];
        
        if(op == WALL)
        {
            PS.gridPlane(LAYER_WALL);

            PS.alpha(i, j, 255);
            PS.color(i, j, COLOR_BLACK);
        }
        if(op == OBSTACLE)
        {
            PS.gridPlane(LAYER_OBSTACLE);

            PS.alpha(i, j, 255);
            PS.color(i, j, COLOR_GRAY);
        }
        if(op == EMPTY_TOWER)
        {
            PS.glyphColor(i, j, COLOR_BLACK);
            PS.glyph(i, j, 0x2656);
        }
        if(op == EMPTY_MAIN_TOWER)
        {
            PS.glyphColor(i, j, COLOR_BLACK);
            PS.glyph(i, j, 0x1F5FC);
        }
        if(op == RITUAL)
        {
            PS.glyphColor(i, j, COLOR_BLACK);
            PS.glyph(i, j, 0x26E9);
        }
        if(op == LABORATORY_PLAYER_ONE)
        {
            PS.glyphColor(i, j, COLOR_DARK_BLUE);
            PS.glyph(i, j, 0x21D1);
        }
        if(op == LABORATORY_PLAYER_TWO)
        {
            PS.glyphColor(i, j, COLOR_DARK_RED);
            PS.glyph(i, j, 0x21D1);
        }
        if(op == TOWER_PLAYER_ONE)
        {
            PS.glyphColor(i, j, COLOR_DARK_BLUE);
            PS.glyph(i, j, CHAR_TOWER);
        }
        if(op == TOWER_PLAYER_TWO)
        {
            PS.glyphColor(i, j, COLOR_DARK_RED);
            PS.glyph(i, j, CHAR_TOWER);
        }
        if(op == POWERUP_STUN)
        {
            PS.glyphColor(i, j, COLOR_BLACK);
            PS.glyph(i, j, CHAR_POWERUP_STUN);
        }
    }

    /**
     * Draw the map in the grid, based on the assigned values from this.map.
     */ 
    drawMapSetup()
    {
        // Clear everything.
        for(let i=0; i<=20; i++)
            for(let j=0; j<=14; j++)
                PS.border(i, j, empty_tile);

        for(let i=4; i<=16; i++)
            for(let j=2; j<=14; j++)
                PS.border(i, j, general_tile);
        for(let i=17; i<=19; i++)
            for(let j=7; j<=9; j++)
            {
                PS.border(i, j, general_tile);
                PS.border(i-16, j, general_tile);
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

        for(let i=0; i<=20; i++)
            for(let j=0; j<=14; j++)
                this.drawGlyph(i, j, this.map[i][j]);

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

        PS.gridPlane(LAYER_DEFAULT);

        PS.alpha(0, 0, 255);
        PS.color(0, 0, COLOR_BLUE);

        PS.alpha(20, 0, 255);
        PS.color(20, 0, COLOR_RED);
        // for(let i=1; i<=5; i++)
        //     PS.color(i, 0, COLOR_BLUE);
        // for(let i=1; i<=5; i++)
        //     PS.color(20-i, 0, COLOR_RED);

        // PS.glyph()
    }

    /**
     * Query if a player can enter another tile, based on the current game setup.
     * @param {int} pl The player that's trying to enter the new tile, can only be either 1 or 2.
     * @param {int} x X coordinate of the new tile. 
     * @param {int} y Y coordinate of the new tile.
     */
    queryEnterTile(pl, x, y)
    {
        if(pl != 1 && pl != 2)
        {
            PS.debug("BattleField.queryEnterTile(): player can only be 1 or 2.");
            return -1;
        }

        if(pl == 1 && x == this.p2x && y == this.p2y)
            return 0;
        if(pl == 2 && x == this.p1x && y == this.p1y)
            return 0;
        if(y > 14 || y < 2 || x < 1 || x > 19)
            return 0;

        if(this.bomb_map[x][y] != 0 && DeveloperSetting == false)
            return 0;
        
        switch(this.map[x][y])
        {
            case OUT_OF_BOUNDARY:
                return 0;
            case WALL:
                return 0;
            case OBSTACLE:
                if(DeveloperSetting == true)
                    return 1;
                else
                    return 0;
            case EMPTY_TOWER:
                return 1;
            case EMPTY_MAIN_TOWER:
                return 0;
            case PATH:
                return 1;
            case TOWER_PLAYER_ONE:
                if(pl == 2)
                    return 0;
                else
                    return 1;
            case TOWER_PLAYER_TWO:
                if(pl == 1)
                    return 0;
                else
                    return 1;
            case MAIN_TOWER_PLAYER_ONE:
                if(pl == 2)
                    return 0;
                else
                    return 1;
            case MAIN_TOWER_PLAYER_TWO:
                if(pl == 1)
                    return 0;
                else
                    return 1;
            case LABORATORY_PLAYER_ONE:
                if(pl == 2)
                    return 0;
                else
                    return 1;
            case LABORATORY_PLAYER_TWO:
                if(pl == 1)
                    return 0;
                else
                    return 1;
            case RITUAL:
                return 1;
            case POWERUP_STUN:
                return 1;
        }
        
        PS.debug("BattleField.queryEnterTile(): tile status error.");
        return -1;
    }

    /**
     * Get a random empty tile in the map, and return NULL if failed.
     * @returns the [x, y] coordinates of the tile.
     */
    getRandomEmptyTile()
    {
        for(let i=1; i<=100; i++)
        {
            let x = PS.random(13) + 3;
            let y = PS.random(13) + 1;
            
            if(this.map[x][y] == PATH && (x != this.p1x || y != this.p1y) && (x != this.p2x || y != this.p2y))
                return [x, y];
        }
        
        PS.debug("Failed to obtain a random empty tile!");
        return null;
    }

    /**
     * Get a random empty center tile in the map, and return NULL if failed.
     * 
     * @returns the [x, y] coordinates of the tile.
     */
    getRandomCenterTile()
    {
        for(let i=1; i<=100; i++)
        {
            let x = PS.random(5) + 7;
            let y = PS.random(9) + 3;
            
            if(this.map[x][y] == PATH && (x != this.p1x || y != this.p1y) && (x != this.p2x || y != this.p2y))
                return [x, y];
        }
        
        PS.debug("Failed to obtain a random empty tile!");
        return null;
    }

    /**
     * Player pl has placed a bomb in the tile (x, y).
     * @param {int} pl The player.
     * @param {int} x X coordinate of the new tile.
     * @param {int} y Y coordinate of the new tile.
     */
    placeBomb(pl, x, y)
    {
        if(pl != 1 && pl != 2)
        {
            PS.debug("Warning from placeBomb(): Invalid player id");
            return;
        }
        if(this.map[x][y] != PATH)
        {
            PS.debug("Warning from placeBomb(): The current tile cannot place a bomb");
            return;
        }
        if(this.bomb_map[x][y] != 0)
        {
            PS.debug("Warning from placeBomb(): The current tile already has a bomb");
            return;
        }

        this.bomb_map[x][y] = 15;
    }

    occupyTower(pl, x, y)
    {
        if(pl != 1 && pl != 2)
        {
            PS.debug("Warning from occupyTower(): invalid player.");
            return;
        }

        if(this.tower_map[x][y][0] != 0)
        {
            PS.debug("Warning from occupyTower(): occupation in progress.");
            return;
        }

        this.tower_map[x][y][0] = pl;
        this.tower_map[x][y][1] = TOWER_OCCUPATION_DURATION;

        if(pl == 1)
            this.p1recordedHealth = this.p1health;
        if(pl == 2)
            this.p2recordedHealth = this.p2health;
    }

    /**
     * Deal with the operations about detonating a bomb.
     * @param {int} x X coordinate of the bomb.
     * @param {int} y Y coordinate of the bomb.
     * @param {int} r radius of the bomb detonation, default value is 1.
     */
    detonateBomb(x, y, r=1)
    {
        // PS.debug("A bomb at (" + x + ", " + y + ") is detonated.\n");

        if(this.p1x == x && this.p1y == y)
        {
            this.p1health -= 2;
            return;
        }
        if(this.p2x == x && this.p2y == y)
        {
            this.p2health -= 2;
            return;
        }
        
        for(let k=0; k<=3; k++)
        {
            for(let i=1; i<=r; i++)
            {
                let newx = x + i*DIRECTION_PAIRS[k][0];
                let newy = y + i*DIRECTION_PAIRS[k][1];

                // PS.debug("F" + newx + ", " + newy + "\n");

                if(this.p1x == newx && this.p1y == newy)
                {
                    this.p1health--;
                    break;
                }
                if(this.p2x == newx && this.p2y == newy)
                {
                    this.p2health--;
                    break;
                }

                if(this.map[newx][newy] == OUT_OF_BOUNDARY)
                    break;
                if(this.map[newx][newy] == WALL)
                    break;
                if(this.map[newx][newy] == PATH)
                {
                    this.bomb_indicator_map[newx][newy] = 15;
                    continue;
                }
                if(this.map[newx][newy] == OBSTACLE)
                {
                    this.map[newx][newy] = PATH;

                    PS.gridPlane(LAYER_OBSTACLE);
                    PS.alpha(newx, newy, 0);
                    PS.color(newx, newy, COLOR_WHITE);

                    break;
                }
                if(this.map[newx][newy] == LABORATORY_PLAYER_ONE)
                {
                    this.map[newx][newy] = OBSTACLE;

                    PS.gridPlane(LAYER_OBSTACLE);
                    PS.alpha(newx, newy, 255);
                    PS.color(newx, newy, COLOR_GRAY);

                    PS.glyph(newx, newy, '');

                    this.p1base--;

                    this.onTowerTakedown();

                    break;
                }
                if(this.map[newx][newy] == LABORATORY_PLAYER_TWO)
                {
                    this.map[newx][newy] = OBSTACLE;

                    PS.gridPlane(LAYER_OBSTACLE);
                    PS.alpha(newx, newy, 255);
                    PS.color(newx, newy, COLOR_GRAY);

                    PS.glyph(newx, newy, '');

                    this.p2base--;

                    this.onTowerTakedown();

                    break;
                }
            }
        }
    }

    /**
     * Update the operation of players based on the input.
     */
    updatePlayerOperation()
    {
        // Update the map environment.

        var flag1 = false;
        var flag2 = false;

        // PS.glyph(this.p1x, this.p1y, this.default_map[this.p1x][this.p1y]);
        // PS.glyph(this.p2x, this.p2y, this.default_map[this.p2x][this.p2y]);

        if(this.p1movex + this.p1movey != 0)
            this.drawGlyph(this.p1x, this.p1y, this.map[this.p1x][this.p1y]);
        if(this.p2movex + this.p2movey != 0)
            this.drawGlyph(this.p2x, this.p2y, this.map[this.p2x][this.p2y]);

        flag1 = this.queryEnterTile(1, this.p1x+this.p1movex, this.p1y+this.p1movey);
        flag2 = this.queryEnterTile(2, this.p2x+this.p2movex, this.p2y+this.p2movey);

        if(this.p1x + this.p1movex == this.p2x + this.p2movex && this.p1y + this.p1movey == this.p2y + this.p2movey)
        {
            var rndid = PS.random(2);
            if(rndid == 1)
                flag1 = false;
            else
                flag2 = false;
        }
        
        if(flag1 == 1)
        {
            this.p1x += this.p1movex;
            this.p1y += this.p1movey;
        }
        if(flag2 == 1)
        {
            this.p2x += this.p2movex;
            this.p2y += this.p2movey;
        }

        PS.glyph(this.p1x, this.p1y, 'O');
        // PS.glyphColor(this.p1x, this.p1y, COLOR_DARK_BLUE);

        PS.glyph(this.p2x, this.p2y, 'X');
        // PS.glyphColor(this.p2x, this.p2y, COLOR_DARK_RED);

        this.p1movex = this.p1movey = this.p2movex = this.p2movey = 0;

        if(this.map[this.p1x][this.p1y] == POWERUP_STUN)
        {
            this.map[this.p1x][this.p1y] = PATH;
            this.drawGlyph(this.p1x, this.p1y, PATH);

            this.p2stunDuration = STUN_DURATION;

            beginTextDisplay("Player 2 is now stunned for " + (STUN_DURATION/10) + " seconds!");
        }
        if(this.map[this.p2x][this.p2y] == POWERUP_STUN)
        {
            this.map[this.p2x][this.p2y] = PATH;
            this.drawGlyph(this.p2x, this.p2y, PATH);
            
            this.p1stunDuration = STUN_DURATION;

            beginTextDisplay("Player 1 is now stunned for " + (STUN_DURATION/10) + " seconds!");
        }

        if(this.p1action == true)
        {
            if(this.map[this.p1x][this.p1y] == PATH)
                this.placeBomb(1, this.p1x, this.p1y);
            else if(this.map[this.p1x][this.p1y] == EMPTY_TOWER)
                this.occupyTower(1, this.p1x, this.p1y);
        }
        if(this.p2action == true)
        {
            if(this.map[this.p2x][this.p2y] == PATH)
                this.placeBomb(2, this.p2x, this.p2y);
            else if(this.map[this.p2x][this.p2y] == EMPTY_TOWER)
                this.occupyTower(2, this.p2x, this.p2y);
        }
        
        this.p1action = this.p2action = 0;
    }

    /**
     * Update the status of all the bombs.
     */
    updateBombStatus()
    {
        for(let i=0; i<=20; i++)
            for(let j=0; j<=14; j++)
                if(this.bomb_map[i][j] != 0)
                {
                    this.bomb_map[i][j]--;
                    if(this.bomb_map[i][j] >= 10)
                    {
                        PS.gridPlane(LAYER_BOMB);
                        PS.alpha(i, j, 255);
                        PS.color(i, j, COLOR_BOMB_0);
                    }
                    else if(this.bomb_map[i][j] >= 5)
                    {
                        PS.gridPlane(LAYER_BOMB);
                        PS.alpha(i, j, 255);
                        PS.color(i, j, COLOR_BOMB_1);
                    }
                    else if(this.bomb_map[i][j] >= 1)
                    {
                        PS.gridPlane(LAYER_BOMB);
                        PS.alpha(i, j, 255);
                        PS.color(i, j, COLOR_BOMB_2);
                    }
                    else
                    {
                        this.detonateBomb(i, j);

                        PS.gridPlane(LAYER_BOMB);
                        PS.alpha(i, j, 0);
                        PS.color(i, j, COLOR_WHITE);
                    }
                }
    }

    updateBombIndicatorStatus()
    {
        for(let i=0; i<=20; i++)
            for(let j=0; j<=14; j++)
                if(this.bomb_indicator_map[i][j] != 0)
                {
                    let val = this.bomb_indicator_map[i][j]--;

                    if((13 <= val && val <= 15) || (7 <= val && val <= 9) || (1 <= val && val <= 3))
                    {
                        PS.gridPlane(LAYER_BOMB_INDICATOR);
                        PS.alpha(i, j, 255);
                        PS.color(i, j, COLOR_BOMB_INDICATOR);
                    }
                    else
                    {
                        PS.gridPlane(LAYER_BOMB_INDICATOR);
                        PS.alpha(i, j, 0);
                        PS.color(i, j, COLOR_WHITE);
                    }
                }
                else
                {
                    PS.gridPlane(LAYER_BOMB_INDICATOR);
                    PS.alpha(i, j, 0);
                    PS.color(i, j, COLOR_WHITE);
                }
    }

    /**
     * Update the status of tower occupation.
     */
    updateOccupationStatus()
    {
        for(let i=0; i<this.tower_list.length; i++)
        {
            let x = this.tower_list[i][0];
            let y = this.tower_list[i][1];

            if(this.tower_map[x][y][0] == 0)
                continue;

            if(this.tower_map[x][y][0] == 1)
            {
                if(this.tower_map[x][y][1] == 0)
                {
                    this.tower_map[x][y][0] = 0;
                    this.map[x][y] = TOWER_PLAYER_ONE;

                    PS.glyphColor(x, y, COLOR_DARK_BLUE);

                    PS.gridPlane(LAYER_OCCUPY_INDICATOR);
                    PS.alpha(x, y, 0);
                    PS.color(x, y, COLOR_WHITE);
                }
                else if((this.p1health != this.p1recordedHealth) || this.p1stunDuration != 0)
                {
                    this.tower_map[x][y] = [0, 0];
                    
                    PS.gridPlane(LAYER_OCCUPY_INDICATOR);
                    PS.alpha(x, y, 0);
                    PS.color(x, y, COLOR_WHITE);

                    if(this.p1stunDuration == 0)
                        this.p1stunDuration = 20;
                }
                else if(this.p1x == x && this.p1y == y)
                {
                    this.tower_map[x][y][1]--;
                    
                    PS.gridPlane(LAYER_OCCUPY_INDICATOR);
                    PS.alpha(x, y, 255);
                    PS.color(x, y, COLOR_P1_SERIES[11-Math.floor(this.tower_map[x][y][1]/5)]);
                }
                else
                {
                    this.tower_map[x][y] = [0, 0];
                    
                    PS.gridPlane(LAYER_OCCUPY_INDICATOR);
                    PS.alpha(x, y, 0);
                    PS.color(x, y, COLOR_WHITE);
                }
            }

            if(this.tower_map[x][y][0] == 2)
            {
                if(this.tower_map[x][y][1] == 0)
                {
                    this.tower_map[x][y][0] = 0;
                    this.map[x][y] = TOWER_PLAYER_TWO;
                    
                    PS.glyphColor(x, y, COLOR_DARK_RED);

                    PS.gridPlane(LAYER_OCCUPY_INDICATOR);
                    PS.alpha(x, y, 0);
                    PS.color(x, y, COLOR_WHITE);
                }
                else if((this.p2health != this.p2recordedHealth) || this.p2stunDuration != 0)
                {
                    this.tower_map[x][y] = [0, 0];
                    
                    PS.gridPlane(LAYER_OCCUPY_INDICATOR);
                    PS.alpha(x, y, 0);
                    PS.color(x, y, COLOR_WHITE);

                    if(this.p2stunDuration == 0)
                        this.p2stunDuration = 20;
                }
                else if(this.p2x == x && this.p2y == y)
                {
                    this.tower_map[x][y][1]--;
                    
                    PS.gridPlane(LAYER_OCCUPY_INDICATOR);
                    PS.alpha(x, y, 255);
                    PS.color(x, y, COLOR_P2_SERIES[11-Math.floor(this.tower_map[x][y][1]/5)]);
                }
                else
                {
                    this.tower_map[x][y] = [0, 0];

                    PS.gridPlane(LAYER_OCCUPY_INDICATOR);
                    PS.alpha(x, y, 0);
                    PS.color(x, y, COLOR_WHITE);
                }
            }
        }
    }

    /**
     * Update the health status of the two players, and end the game when detected.
     */
    updateHealthStatus()
    {
        if(this.p1health <= 0)
            this.p1health = 0;
        if(this.p2health <= 0)
            this.p2health = 0;

        if(this.p1base == 0)
            PS.statusText("Congradulations to player 2!");
        if(this.p2base == 0)
            PS.statusText("Congradulations to player 1!");

        if(this.p1base * this.p2base == 0)
            this.gameEndIndicator = true;

        PS.gridPlane(LAYER_DEFAULT);
        for(let i=1; i<=this.p1health; i++)
        {
            PS.alpha(i, 0, 255);
            PS.color(i, 0, COLOR_BLUE);
        }
        for(let i=this.p1health+1; i<=5; i++)
        {
            PS.alpha(i, 0, 0);
            PS.color(i, 0, COLOR_WHITE);
        }

        for(let i=1; i<=this.p2health; i++)
        {
            PS.alpha(20-i, 0, 255);
            PS.color(20-i, 0, COLOR_RED);
        }
        for(let i=this.p2health+1; i<=5; i++)
        {
            PS.alpha(20-i, 0, 0);
            PS.color(20-i, 0, COLOR_WHITE);
        }

        if(this.p1health == 0 && this.p2health == 0)
            PS.statusText("The game ends with a tie.");
        else if(this.p1health == 0)
            PS.statusText("Congradulations to player 2!");
        else if(this.p2health == 0)
            PS.statusText("Congradulations to player 1!");

        if(this.p1health * this.p2health == 0)
            this.gameEndIndicator = true;
    }

    /**
     * Update the stunning status of the two players.
     * 
     * Frequency: 6 ticks (10 times per second).
     */
    updateStunStatus()
    {
        if(this.p1stunDuration != 0)
        {
            this.p1stunDuration--;
            PS.glyphColor(this.p1x, this.p1y, COLOR_BLUE);

            if(this.p1stunDuration % 10 >= 5)
                PS.glyph(this.p1x, this.p1y, '');
            else
                PS.glyph(this.p1x, this.p1y, 'O');
        }
        else
            PS.glyphColor(this.p1x, this.p1y, COLOR_BLACK);

        if(this.p2stunDuration != 0)
        {
            this.p2stunDuration--;
            PS.glyphColor(this.p2x, this.p2y, COLOR_RED);

            if(this.p2stunDuration % 10 >= 5)
                PS.glyph(this.p2x, this.p2y, '');
            else
                PS.glyph(this.p2x, this.p2y, 'X');
        }
        else
            PS.glyphColor(this.p2x, this.p2y, COLOR_BLACK);
    }

    /**
     * Called whenever a home base has being takedown.
     */
    onTowerTakedown()
    {
        this.updateHealthStatus();

        if(this.gameEndIndicator == true)
            return;

        this.drawGlyph(this.p1x, this.p1y);
        this.drawGlyph(this.p2x, this.p2y);

        this.p1x = 4, this.p2x = 16;
        this.p1y = this.p2y = 8;

        for(let i=1; i<=19; i++)
            for(let j=2; j<=14; j++)
            {
                this.bomb_map[i][j] = 0;

                PS.gridPlane(LAYER_BOMB);
                PS.alpha(i, j, 0);
                PS.color(i, j, COLOR_WHITE);
            }
        
        beginCountdown();
    }

    /**
     * Generate several random powerups on the map.
     * @param {int} count shows the amount of random powerups to be generated.
     */
    generateRandomPowerups(count=1)
    {
        for(let i=1; i<=count; i++)
        {
            var coords = this.getRandomEmptyTile();

            this.map[coords[0]][coords[1]] = POWERUP_STUN;
            this.drawGlyph(coords[0], coords[1], POWERUP_STUN);
        }
    }

    /**
     * Generate several random powerups, but raise chance for central tiles.
     * 
     * @param {int} count amount of powerups to generate.
     */
    generateCenteredRandomPowerups(count)
    {
        for(let i=1; i<=count; i++)
        {
            var rnd = PS.random(2), coords;

            if(rnd == 1)
                coords = this.getRandomCenterTile();
            else
                coords = this.getRandomEmptyTile();

            this.map[coords[0]][coords[1]] = POWERUP_STUN;
            this.drawGlyph(coords[0], coords[1], POWERUP_STUN);
        }
    }
}

var battle = new BattleField();
var globalTick = 0;

/**
 * Timer related to the countdown.
 */
var countDownTimer, originalText;
function Tcountdown()
{
    battle.countdown--;

    if(battle.countdown == 3)
        PS.statusText("3...");
    else if(battle.countdown == 2)
        PS.statusText("2...");
    else if(battle.countdown == 1)
        PS.statusText("1...");
    else if(battle.countdown == 0)
    {
        PS.statusText(originalText);
        PS.timerStop(countDownTimer);

        return;
    }
}
function beginCountdown()
{
    if(battle.countdown != 0)
        return;
    battle.countdown = 4;

    originalText = PS.statusText();

    countDownTimer = PS.timerStart(50, Tcountdown);
}

/**
 * Timer related to displaying text for a certain period.
 */
var displayTextTimer = null;
function TdisplayText()
{
    PS.statusText("Bomb It!");
    PS.timerStop(displayTextTimer);

    displayTextTimer = null;
}
function beginTextDisplay(targetText)
{
    // Erase the previous display if it's not ended yet.
    if(displayTextTimer != null)
        TdisplayText();

    PS.statusText(targetText);
    displayTextTimer = PS.timerStart(180, TdisplayText);
}

PS.init = function( system, options ) {

    // battle.initialize();
    
    PS.gridSize(21, 15);
    PS.statusText("Bomb It!");

    if(DeveloperSetting == true)
        PS.debug("WARNING: the game is running in debugging mode.");

    // PS.debug(battle.p2x);
    battle.drawMapSetup();

    beginCountdown();

    PS.timerStart(3, function(){
        if(battle.gameEndIndicator == true)
            return;

        globalTick++;

        battle.updateHealthStatus();
        battle.updateOccupationStatus();

        if(globalTick % 2 == 0)
        {
            battle.updatePlayerOperation();
            battle.updateBombStatus();
            battle.updateStunStatus();
        }
        if(globalTick % POWERUP_REFRESH_RATE == 0)
            battle.generateCenteredRandomPowerups(1);
        
        battle.updateBombIndicatorStatus();
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

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

    if(battle.countdown != 0)
        return;

    if(battle.p1stunDuration == 0)
    {
        if(key == 119) // W
            battle.p1movey = -1, battle.p1movex = 0;
        if(key == 115) // S
            battle.p1movey = 1, battle.p1movex = 0;
        if(key == 97) // A
            battle.p1movex = -1, battle.p1movey = 0;
        if(key == 100) // D
            battle.p1movex = 1, battle.p1movey = 0;
        if(key == 32) // space.
            battle.p1action = true;
    }

    if(battle.p2stunDuration == 0)
    {
        if(key == 1008) // downward arrow key.
            battle.p2movey = 1, battle.p2movex = 0;
        if(key == 1006) // upward arrow key.
            battle.p2movey = -1, battle.p2movex = 0;
        if(key == 1005) // leftward arrow key.
            battle.p2movex = -1, battle.p2movey = 0;
        if(key == 1007) // rightward arrow key.
            battle.p2movex = 1, battle.p2movey = 0;
        if(key == 13) // enter.
            battle.p2action = true;
    }

    if(DeveloperSetting == true)
    {
        if(key == 49)
            battle.p1health--;
        if(key == 50)
            battle.p2health--;
    }
};

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};


PS.input = function( sensors, options ) {
	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

