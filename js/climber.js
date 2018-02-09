define(
    [
        'physicsjs'
    ],
    function (
        Physics
    ) {

        // extend the circle body
        Physics.body('climber', 'rectangle', function (parent) {

            // private helpers


            //what type of options can we imagine passing our climbers upon init?

            //What properties and methods will a climber need?

            //What do climbers do?
            /*
            -They grow in one direction until they collide with either a ball, a viewport boundary, 
            a dead climber, or another live climber.
            -Need to remove the climber if hit by a ball
            -Need to detect live climber collision, and prevent growth, or set it back X pixels
            -Need to detect boundary and dead climber collisions. Could just be the default case.
            -Create indestructable head region using another static img with slightly smaller
            dimensions to ensure that no climber collisions are prevented. The climber bodies 
            should update its position at the same time as its own.
            -Their top half*unit**2 need to remain indestructable and distinguished
            -They need a direction. This determines whether their position changes constantly, what direction
            they grow in, and their color.
            -They need a die method that removes their event listeners and head region, sets their growth to 0,
            and makes them translucent.
            -Need a method to get ball coordinates and pass to flood-fill
            -Need a flood-fill method 
            */

            //extension definition
            return {

                init: function (options) {
                    parent.init.call(this, options);
                    this.dir = options.dir;
                    this.live = true;
                    this.growth = .5;
                    this.gameType = "climber";
                    view = new Image();
                    switch (this.dir) {
                        case 'N': // North
                            view.src = ('./images/red.svg');
                            break;
                        case 'E': // East
                            break;
                        case 'S': // South
                            view.src = ('./images/blue.svg');
                            break;
                        case 'W': // West
                            break;
                    }
                    view.width = this.geometry.width;
                    this.view = view;
                    this.cellLoc = options.cell;
                },

                // Makes climber grow
                grow: function () {

                    //need view to be updated each time growth occurs...
                    this.geometry.height += this.growth;
                    $(this.view).attr('height', this.geometry.height);
                    //this.state.pos = this.state.pos.add(-this.growth/2);

                    return this;
                },

                die: function () {
                    
                    var world = this._world,
                        //cell = cells[this.cellLoc[0]][this.cellLoc[1]],
                        cell_num = this.geometry.height / unit;

                    //depends on dir
                    switch (this.dir) {
                        case 'N':
                            for (var i = 0; i <= cell_num; i++) {
                                $(cells[ this.cellLoc[ 0 ] ][ this.cellLoc[ 1 ] - i ]).detach();
                            }
                            var dead_copy = Physics.body('rectangle', {
                                x: this.aabb().x
                                , y: this.aabb().y + unit / 4
                                , height: this.geometry.height + unit / 2
                                , width: this.geometry.width
                                , restitution: 1
                                , cof: 0
                                , treatment: 'static'
                                //, mass: 100000
                                , styles: {
                                    fillStyle: 'rgba(0,0,0,0)'
                                }
                            });
                            break;
                        case 'S':
                            for (var i = 0; i <= cell_num; i++) {
                                $(cells[this.cellLoc[0]][this.cellLoc[1] + i]).detach();
                            }
                            var dead_copy = Physics.body('rectangle', {
                                x: this.aabb().x
                                , y: this.aabb().y - unit / 4
                                , height: this.geometry.height + unit / 2
                                , width: this.geometry.width
                                , restitution: 1
                                , cof: 0
                                , treatment: 'static'
                                //, mass: 100000
                                , styles: {
                                    fillStyle: 'rgba(0,0,0,0)'
                                }
                            });
                            break;
                        default:
                            console.log('You need to code switch in climber.die()');
                            break;
                    }
                    
                    dead_copy.gameType = 'dead_climber';
                    world.removeBody(this);
                    world.addBody(dead_copy)

                    return;
                },

            };

        });
    });