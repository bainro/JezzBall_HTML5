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

                    parent.init.call(this, options);

                    // events
                    document.addEventListener('keydown', function (e) {});

                },

                // this is automatically called by the world
                // when this behavior is added to the world
                connect: function (world) {
                    // we want to subscribe to world events
                    world.on('collisions:detected', this.checkClimberCollision, this);
                    world.on('integrate:positions', this.behave, this);
                },

                disconnet: function (world) {
                    // unsub from world events
                    world.off('collisions:detected', this.checkClimberCollision, this);
                    world.off('integrate:positions', this.behave, this);
                },

                checkClimberCollision: function (data) {

                    //console.log(data);

                    var self = this
                        , world = self._world
                        , collisions = data.collisions
                        , col
                        ;

                    for (var i = 0, l = collisions.length; i < l; ++i) {
                        col = collisions[i];

                        // 
                        if (col.bodyA.gameType !== 'circle' &&
                            col.bodyB.gameType !== 'circle' &&
                            (col.bodyA.gameType === 'climber' || col.bodyB.gameType === 'climber')
                        ) {
                            console.log('Climber hit border');
                            /*player.blowUp();
                            world.removeBehavior(this);
                            // when we crash, we'll publish an event to the world
                            // that we can listen for to prompt to restart the game
                            world.emit('lose-game');*/
                            return;
                        }
                    }
                },

                behave: function () {
                    var climbers = this.getTargets(),
                    world = this._world;
                    for (var i = 0; i < climbers.length; i++){
                        climbers[i].grow();
                        if ( climbers[i].aabb().y - climbers[i].geometry.height/2 < 0 ) {
                            climbers[i].die();
                            world.removeBehavior(this);
                        }
                        //console.log(climbers[i].aabb().y);
                    }
                },

            };

        });
    });