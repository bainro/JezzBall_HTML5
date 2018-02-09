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
                    var world = this._world,
                        row,
                        col;


                        this.getTargets()[0].grow();
                        if (this.getTargets()[0].aabb().y - this.getTargets()[0].geometry.height/2 < 0 || 
                            this.getTargets()[0].aabb().y + this.getTargets()[0].geometry.height / 2 > canvasHeight
                        ) {
                            this.getTargets()[0].die();

                        /*
                        -Get ball positions
                        -Call flood fill on each ball
                        -Convert ball coordinates to cells[col][row]
                        -Check that that cell is contained within #cell_container
                        -Also check that row and col are within (0,26) & (0,17) respectively
                        -If not, return
                        -If true, remove the cell and recursively call flood-fill on:
                            *cells[col + 1][row]
                            *cells[col - 1][row]
                            *cells[col][row + 1]
                            *cells[col][row - 1]
                        */

                            //$('#cell_container').children().detach();

                            var balls = world.find(Physics.query({
                                name: 'circle', // only circles AKA our balls
                            }));

                            for (var i = 0; i < balls.length; i++) {
                                //get coord's and convert to matrix indexes
                                col = Math.round(balls[i].state.pos.x / unit);
                                row = Math.round(balls[i].state.pos.y / unit);
                                flood_mark([col, row]);
                            }

                            for (var i = 0; i < 27; i++) {
                                for (var j = 0; j < 18; j++) {
                                    if ($(cells[i][j]).data('marked') != 'true') {
                                        //console.log('c\'mon');
                                        $(cells[i][j]).detach();
                                    }
                                    else {
                                        $(cells[i][j]).data('marked', 'false');
                                    }
                                }
                            }

                            function flood_mark(indexes) {
                                if (indexes[0] >= 0 && indexes[0] <= 26 && indexes[1] >= 0 && indexes[1] <= 17
                                    && $.contains(document.getElementById('cell_container'), $(cells[indexes[0]][indexes[1]])[0])
                                    && $(cells[indexes[0]][indexes[1]]).data('marked') != 'true'
                                ) {
                                    //set data-visited to true to mark cell as visited
                                    //remove all cells not marked as visited
                                    //reset data-visited for all cells upon next climber creation
                                    $(cells[indexes[0]][indexes[1]]).data('marked', 'true');
                                    //console.log($(cells[indexes[0]][indexes[1]]).data('marked'));
                                    //recursive calls
                                    flood_mark([indexes[0] + 1, indexes[1]]);
                                    flood_mark([indexes[0] - 1, indexes[1]]);
                                    flood_mark([indexes[0], indexes[1] - 1]);
                                    flood_mark([indexes[0], indexes[1] + 1]);
                                }
                                return;
                            }

                            world.removeBehavior(this);
                        }
                        
                },

            };

        });
    });