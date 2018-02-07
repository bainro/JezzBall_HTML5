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
            -Their top half*unit**2 need to remain indestructable and distinguished
            -They need a direction (N,W,S,E)
            -They need a die method that removes their event listeners, sets their growth to 0,
            and makes them translucent.
            -Need a method to get ball coordinates and pass to flood-fill
            -Need a flood-fill method 
            */
            
            //extension definition
            return {
               
                init: function (options) {
                    parent.init.call(this, options);
                },
                // this will turn the ship by changing the
                // body's angular velocity to + or - some amount
                turn: function (amount) {
                    // set the ship's rotational velocity
                    this.state.angular.vel = 0.2 * amount * deg;
                    return this;
                },
                
            };

        });
    });