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
                },

                // Makes climber grow
                grow: function () {
                    this.geometry.height += this.growth;
                    //need view to be recalculated each time growth occurs...

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
                    
                    console.log('Bleh! I died :(');
                    var world = this._world;
                    world.removeBody(this);
                    //climber1 = null;

                    return;
                },

            };

        });
    });