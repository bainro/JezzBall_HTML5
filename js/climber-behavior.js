define(
    [
        'physicsjs'
    ],
    function (
        Physics
    ) {

        //If the referenced cell is real, not marked as true, and still attached to the DOM
        function flood_mark(indexes) {
            if (indexes[0] >= 0 && indexes[0] <= 26 && indexes[1] >= 0 && indexes[1] <= 17
                && $(cells[indexes[0]][indexes[1]]).data('marked') === false
                && $.contains(document.getElementById('cell_container'), $(cells[indexes[0]][indexes[1]])[0])
            ) {
                $(cells[indexes[0]][indexes[1]]).data('marked', true);

                //recursive calls passing each adjacent cell
                flood_mark([indexes[0] + 1, indexes[1]]);
                flood_mark([indexes[0] - 1, indexes[1]]);
                flood_mark([indexes[0], indexes[1] - 1]);
                flood_mark([indexes[0], indexes[1] + 1]);
            }
            return;
        }

        function remove_unmarked(world) {
            for (var i = 0; i < 27; i++) {
                for (var j = 0; j < 18; j++) {
                    if ($(cells[i][j]).data('marked') === false) {
                        //remove all cells not marked as visited
                        $(cells[i][j]).detach();
                    }
                    else {
                        //or unset data-visited 
                        $(cells[i][j]).data('marked', false);
                    }
                }
            }

            if ($('#cell_container').children().length <= 121) {

                if (lvl >= 10) {
                    console.log('YOU WON');
                }
                else {
                    $(document.body).addClass('beat-level');
                    self_destruct = true;
                    $(document).on('click touchend', (e) => {
                        $(document.body).removeClass('beat-level');
                        self_destruct = false;

                        var balls = world.find(Physics.query({
                            name: 'circle'
                        }));

                        var climbers = world.find(Physics.query({
                            name: 'climber'
                        }));

                        var dead_climbers = world.find(Physics.query({
                            name: 'rectangle'
                        }));

                        world.remove(balls);
                        world.remove(dead_climbers);
                        world.remove(climbers);

                        for (i = 0; i < 27; i++) {
                            for (j = 0; j < 18; j++) {
                                $('#cell_container').append(cells[i][j]); //.data('marked', false);
                            }
                        }

                        $('#cell_container').css(
                            {
                                background: 'url("./images/staredad.jpg") no-repeat',
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundColor: "black"
                            });

                        var i = lvl + 1;
                        var balls = [];
                        while (i--) {
                            var plus_or_minus = Math.random() < 0.5 ? -1 : 1;
                            var random_velocity = Math.random() * .25 - .125;
                            var ball = Physics.body('circle', {
                                x: Math.random() * canvasWidth
                                , y: Math.random() * canvasHeight
                                , radius: unit / 2 - .5
                                , vx: random_velocity
                                , vy: (0.0625 - random_velocity ** 2) ** 0.5 * plus_or_minus
                                , angularVelocity: Math.random() * .02 - .01
                                , mass: 0.001
                                , restitution: 1
                                , cof: 0
                                , styles: {
                                    strokeStyle: '#f4356f'
                                    , fillStyle: 'black'
                                    , angleIndicator: '#ff00ff'
                                }
                            });
                            ball.gameType = 'circle';
                            balls.push(ball);
                        }

                        world.add(balls);

                        $(document).off('click touchend');
                    });
                }

                lvl++;
                cells_left = 486;
            }
        }

        return Physics.behavior('climber-behavior', function (parent) {

            return {
                init: function (options) {
                    parent.init.call(this, options);
                },

                // this is automatically called by the world when this behavior is added
                connect: function (world) {
                    world.on('collisions:detected', this.checkClimberCollision, this);
                    world.on('integrate:positions', this.behave, this);
                },

                disconnect: function (world) {
                    world.off('collisions:detected', this.checkClimberCollision, this);
                    world.off('integrate:positions', this.behave, this);
                },

                checkClimberCollision: function (data) {

                    var world = this._world
                        , collisions = data.collisions
                        , col
                        ;

                    for (var i = 0, l = collisions.length; i < l; ++i) {
                        col = collisions[i];

                        //if collision between a jezzball and this climber
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
                        //if collision between a dead_climber and this climber
                        else if ((col.bodyA.gameType === 'dead_climber' || col.bodyB.gameType === 'dead_climber') &&
                            (col.bodyA === this.getTargets()[0] || col.bodyB === this.getTargets()[0])
                        ) {
                            this.getTargets()[0].die();

                            var balls = world.find(Physics.query({
                                name: 'circle'
                            }));

                            for (var i = 0; i < balls.length; i++) {
                                //get coord's and convert to matrix indexes
                                col = Math.round((balls[i].aabb().x - unit / 2) / unit);
                                row = Math.round((balls[i].aabb().y - unit / 2) / unit);
                                flood_mark([col, row]);
                            }

                            remove_unmarked(world);
                            world.removeBehavior(this);
                        }
                    }
                },

                //Called by integrator to update positions
                behave: function () {

                    var world = this._world,
                        row,
                        col;

                    if (self_destruct) {
                        world.removeBehavior(this);
                    }

                    this.getTargets()[0].grow();
                    //if the climber reaches the viewport border
                    if (this.getTargets()[0].aabb().y - this.getTargets()[0].geometry.height / 2 < 0 ||
                        this.getTargets()[0].aabb().y + this.getTargets()[0].geometry.height / 2 > canvasHeight ||
                        this.getTargets()[0].aabb().x - this.getTargets()[0].geometry.width / 2 < 0 ||
                        this.getTargets()[0].aabb().x + this.getTargets()[0].geometry.width / 2 > canvasWidth
                    ) {
                        this.getTargets()[0].die();

                        var balls = world.find(Physics.query({
                            name: 'circle'
                        }));

                        for (var i = 0; i < balls.length; i++) {
                            //get coord's and convert to matrix indexes
                            col = Math.round((balls[i].aabb().x - unit / 2) / unit);
                            row = Math.round((balls[i].aabb().y - unit / 2) / unit);
                            //$(cells[col][row]).detach(); //<- proving wrong ball cell calc
                            flood_mark([col, row]);
                        }

                        remove_unmarked(world);
                        world.removeBehavior(this);

                    }
                },
            };
        });
    });