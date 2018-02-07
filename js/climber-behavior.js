define(
    [
        'physicsjs'
    ],
    function (
        Physics
    ) {

        return Physics.behavior('climber-behavior', function (parent) {

            //subscribe to DOM & world events and define other methods...

            return {
                init: function (options) {
                    var self = this;
                    parent.init.call(this, options);
                    // the player will be passed in via the config options
                    // so we need to store the player
                    var player = self.player = options.player;
                    self.gameover = false;

                    // events
                    document.addEventListener('keydown', function (e) {});

                },

                // this is automatically called by the world
                // when this behavior is added to the world
                connect: function (world) {

                    // we want to subscribe to world events
                    world.on('collisions:detected', this.checkPlayerCollision, this);
                    world.on('integrate:positions', this.behave, this);
                },
            };

        });
    });