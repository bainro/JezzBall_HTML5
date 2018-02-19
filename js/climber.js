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
                    this.growth = unit ** 1.5 / 200;
                    this.gameType = "climber";
                    this.source_cell = options.cell;
                    view = new Image();
                    view.width = this.geometry.width;
                    view.height = this.geometry.height;
                    switch (this.dir) {
                        case 'N': // North
                            view.src = ('./images/red.svg');
                            break;
                        case 'E': // East
                            view.src = ('./images/green.svg');
                            break;
                        case 'S': // South
                            view.src = ('./images/blue.svg');
                            break;
                        case 'W': // West
                            view.src = ('./images/yellow.svg');
                            break;
                    }
                    this.view = view;
                },

                grow: function () {
                    if (this.dir == 'N' || this.dir == 'S') {
                        this.geometry.height += this.growth;
                        $(this.view).attr('height', this.geometry.height);
                        return;
                    }
                    else {
                        this.geometry.width += this.growth;
                        $(this.view).attr('width', this.geometry.width);
                        return;
                    }
                },

                die: function () {

                    var world = this._world;

                    switch (this.dir) {
                        case 'N':
                            var num_of_cells = this.geometry.height / unit;
                            for (var i = 0; i <= num_of_cells; i++) {
                                $(cells[this.source_cell[0]][this.source_cell[1] - i]).data('marked', false).detach();
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
                            var num_of_cells = this.geometry.height / unit;
                            for (var i = 0; i <= num_of_cells; i++) {
                                $(cells[this.source_cell[0]][this.source_cell[1] + i]).data('marked', false).detach();
                            }
                            var dead_copy = Physics.body('rectangle', {
                                x: this.aabb().x
                                , y: this.aabb().y + unit / 4 + 1
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
                        case 'E':
                            var num_of_cells = Math.ceil(this.geometry.width / unit);
                            for (var i = 0; i < num_of_cells; i++) {
                                $(cells[this.source_cell[0] + i][this.source_cell[1]]).data('marked', false).detach();
                            }
                            var dead_copy = Physics.body('rectangle', {
                                x: this.aabb().x + unit / 4 + 1
                                , y: this.aabb().y  
                                , height: this.geometry.height
                                , width: this.geometry.width + unit / 2
                                , restitution: 1
                                , cof: 0
                                , treatment: 'static'
                                , styles: {
                                    fillStyle: 'rgba(0,0,0,0)'
                                }
                            });
                            break;
                        case 'W':
                            var num_of_cells = Math.ceil(this.geometry.width / unit);
                            for (var i = 0; i < num_of_cells; i++) {
                                $(cells[this.source_cell[0] - i][this.source_cell[1]]).data('marked', false).detach();
                            }
                            var dead_copy = Physics.body('rectangle', {
                                x: this.aabb().x - unit / 4 + 1
                                , y: this.aabb().y 
                                , height: this.geometry.height
                                , width: this.geometry.width + unit / 2
                                , restitution: 1
                                , cof: 0
                                , treatment: 'static'
                                , styles: {
                                    fillStyle: 'rgba(0,0,0,0)'
                                }
                            });
                            break;
                        default:
                            break;
                    }

                    dead_copy.gameType = 'dead_climber';
                    try{
                        world.removeBody(this);
                        world.addBody(dead_copy);
                    }
                    catch (err) {
                        console.log("Tried removing climber that wasn't there");
                    }
                    return;
                },

            };

        });
    });