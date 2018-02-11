define(
    [
        'physicsjs'
    ],
    function (
        Physics
    ) {

        // extend the circle body
        Physics.body('climber', 'rectangle', function (parent) {

            return {

                init: function (options) {
                    parent.init.call(this, options);
                    this.dir = options.dir;
                    this.growth = .5;
                    this.gameType = "climber";
                    this.source_cell = options.cell;
                    view = new Image();
                    view.width = this.geometry.width;
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
                    this.view = view;
                },

                grow: function () {

                    this.geometry.height += this.growth;
                    $(this.view).attr('height', this.geometry.height);

                    return this;
                },

                die: function () {

                    var world = this._world,
                        num_of_cells = this.geometry.height / unit;

                    switch (this.dir) {
                        case 'N':
                            for (var i = 0; i <= num_of_cells; i++) {
                                $(cells[this.source_cell[0]][this.source_cell[1] - i]).detach();
                            }
                            var dead_copy = Physics.body('rectangle', {
                                x: this.aabb().x
                                , y: this.aabb().y - unit / 4 - 1
                                , height: this.geometry.height + unit / 2
                                , width: this.geometry.width
                                , restitution: 1
                                , cof: 0
                                , treatment: 'static'
                                , styles: {
                                    fillStyle: 'rgba(0,0,0,0)'
                                }
                            });
                            break;
                        case 'S':
                            for (var i = 0; i <= num_of_cells; i++) {
                                $(cells[this.source_cell[0]][this.source_cell[1] + i]).detach();
                            }
                            var dead_copy = Physics.body('rectangle', {
                                x: this.aabb().x
                                , y: this.aabb().y /*- unit / 4*/ + unit / 4 + 1
                                , height: this.geometry.height + unit / 2
                                , width: this.geometry.width
                                , restitution: 1
                                , cof: 0
                                , treatment: 'static'
                                , styles: {
                                    fillStyle: 'rgba(0,0,0,0)'
                                }
                            });
                            break;
                        default:
                            console.log('You need to code this switch in climber.die()');
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