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

        function remove_unmarked() {
            for (var i = 0; i < 27; i++) {
                for (var j = 0; j < 18; j++) {
                    if ($(cells[i][j]).data('marked') === false) {
                        //remove all cells not marked as visited
                        $(cells[i][j]).detach();
                        //console.log(i,j);
                    }
                    else {
                        //or unset data-visited 
                        $(cells[i][j]).data('marked', false);
                    }
                }
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
                                //$(cells[col][row]).detach(); //<- proving wrong ball cell calc
                                flood_mark([col, row]);
                            }

                            remove_unmarked();
                            world.removeBehavior(this);
                        }
                    }
                },

                //Called by integrator to update positions
                behave: function () {

                    var world = this._world,
                        row,
                        col;

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

                        remove_unmarked();
                        world.removeBehavior(this);

                    }
                },
            };
        });
    });