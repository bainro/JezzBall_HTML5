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
                    //document.addEventListener('keydown', function (e) {});

                },

                // this is automatically called by the world
                // when this behavior is added to the world
                connect: function (world) {
                    // we want to subscribe to world events
                    world.on('collisions:detected', this.checkClimberCollision, this);
                    world.on('integrate:positions', this.behave, this);
                },

                disconnect: function (world) {
                    // unsub from world events
                    world.off('collisions:detected', this.checkClimberCollision, this);
                    world.off('integrate:positions', this.behave, this);
                },

                checkClimberCollision: function (data) {

                    //console.log(data);

                    var world = this._world
                        , collisions = data.collisions
                        , col
                        ;

                    for (var i = 0, l = collisions.length; i < l; ++i) {
                        col = collisions[i];

                        if ((col.bodyA.gameType === 'circle' || col.bodyB.gameType === 'circle') &&
                            (col.bodyA === this.getTargets()[0] || col.bodyB === this.getTargets()[0])
                        ) {

                            if (col.bodyA.gameType === 'climber') {
                                world.removeBody(col.bodyA);
                            }
                            else {
                                world.removeBody(col.bodyB);
                            }

                            world.removeBehavior(this);

                            return;
                        }
                        else if ((col.bodyA.gameType === 'dead_climber' || col.bodyB.gameType === 'dead_climber') &&
                                 (col.bodyA === this.getTargets()[0] || col.bodyB === this.getTargets()[0])
                        ) {
                            //console.log('I touched a dead person');
                            this.getTargets()[0].die();
                            world.removeBehavior(this);
                        }
                    }
                },

                behave: function () {
                    //can pass in climber obj during behav init and pass fx to set this method to dynamically
                    world = this._world;

                        this.getTargets()[0].grow();
                        //depends on direction
                        if (this.getTargets()[0].aabb().y - this.getTargets()[0].geometry.height/2 < 0 || 
                            this.getTargets()[0].aabb().y + this.getTargets()[0].geometry.height / 2 > canvasHeight
                        ) {
                            this.getTargets()[0].die();
                            world.removeBehavior(this);
                        }
                        
                },

            };

        });
    });