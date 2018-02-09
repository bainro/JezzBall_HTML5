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
                                , y: this.aabb().y - unit / 4 - 1
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
                                , y: this.aabb().y /*- unit / 4*/ + unit / 4 + 1
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
                    world.addBody(dead_copy);

                    return;
                },

            };

        });
    });