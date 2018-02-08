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
                    this.direction = options.direction;
                    this.live = true;
                    this.growth = .5;
                    this.gameType = "climber";
                    view = new Image();
                    view.src = ('./images/red.svg');
                    view.width = this.geometry.width;
                    this.view = view;
                    this.cellLoc = options.cell;
                },

                // Makes climber grow
                grow: function () {

                    this.geometry.height += this.growth;
                    //need view to be recalculated each time growth occurs...

                    //don't need this I think... can use .add() instead
                    var scratch = Physics.scratchpad();
                    var v = scratch.vector().set(
                        0,
                        -this.growth/2
                    );

                    $(this.view).attr('height', this.geometry.height);
                    this.state.pos = this.state.pos.vadd(v);
                    scratch.done();

                    return this;
                },

                die: function () {
                    
                    var world = this._world,
                        //cell = cells[this.cellLoc[0]][this.cellLoc[1]],
                        cell_num = this.geometry.height / unit;

                    //$(cell).detach();
                    for (var i = 0; i <= cell_num; i++) {
                        $(cells[ this.cellLoc[ 0 ] ][ this.cellLoc[ 1 ] - i ]).detach();
                    }

                    var dead_copy = Physics.body('rectangle', {
                        x: this.aabb().x
                        , y: this.aabb().y + unit/4
                        , height: this.geometry.height + unit/2
                        , width: this.geometry.width
                        , restitution: 1
                        , cof: 0
                        , treatment: 'static'
                        , styles: {
                            fillStyle: 'rgba(0,0,0,0)'
                        }
                    });
                    world.removeBody(this);
                    world.addBody(dead_copy)

                    return;
                },

            };

        });
    });