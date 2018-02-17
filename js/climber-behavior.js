define(
    [
        'physicsjs'
    ],
    function (
        Physics
    ) {

        //If the referenced cell is real, not marked as true, and still attached to the DOM
        function flood_mark(indexes) {
            /*if (
                indexes[0] >= 0 && indexes[0] < 27 && indexes[1] >= 0 && indexes[1] < 18 &&
                $(cells[indexes[0]][indexes[1]]).data('marked') === false &&
                $.contains(document.getElementById('cell_container'), $(cells[indexes[0]][indexes[1]])[0])
            ) {*/
                //$(cells[indexes[0]][indexes[1]]).data('marked', true);

                var queue = [];
                queue.push(indexes);
                for (var i = 0; i < queue.length; i++) {
                    var w = [];
                    w[0] = queue[i][0];
                    w[1] = queue[i][1];
                    var e = [];
                    e[0] = queue[i][0];
                    e[1] = queue[i][1];

                        //need to check that target cell is still within DOM
                    while (w[0] - 1 >= 0 && $(cells[w[0] - 1][w[1]]).data('marked') === false && $.contains(document.getElementById('cell_container'), $(cells[w[0] - 1][w[1]])[0])) {
                        w[0] = w[0] - 1;
                    }
                    while (e[0] + 1 < 27 && $(cells[e[0] + 1][e[1]]).data('marked') === false && $.contains(document.getElementById('cell_container'), $(cells[e[0] + 1][e[1]])[0])) {
                        e[0] = e[0] + 1;
                    }
                    //calc nodes between e and w
                    for (var j = w[0]; j <= e[0]; j++) {
                        //console.log('marked one as true');
                        $(cells[j][w[1]]).data('marked', true);
                        if ($(cells[j][w[1] - 1]).data('marked') === false && (w[1] - 1) >= 0 && $.contains(document.getElementById('cell_container'), $(cells[j][w[1] - 1])[0])) {
                            queue.push([j, w[1] - 1]);
                        }
                        if ($(cells[j][w[1] + 1]).data('marked') === false && (w[1] + 1) < 18 && $.contains(document.getElementById('cell_container'), $(cells[j][w[1] + 1])[0])) {
                            queue.push([j, w[1] + 1]);
                        }
                    }
                }

                return;
                /*
 5. For each node N in Q:
 6.         Set w and e equal to N.
 7.         Move w to the west until the color of the node to the west of w no longer matches target-color.
 8.         Move e to the east until the color of the node to the east of e no longer matches target-color.
 9.         For each node n between w and e:
10.             Set the color of n to replacement-color.
11.             If the color of the node to the north of n is target-color, add that node to Q.
12.             If the color of the node to the south of n is target-color, add that node to Q.
13. Continue looping until Q is exhausted.
14. Return.
                */


                //recursive calls passing each adjacent cell
                //flood_mark([indexes[0] + 1, indexes[1]]);
                //flood_mark([indexes[0] - 1, indexes[1]]);
                //flood_mark([indexes[0], indexes[1] - 1]);
                //flood_mark([indexes[0], indexes[1] + 1]);
           // }
           // return;
        }

        function remove_unmarked() {
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

                if (lvl >= 5) {
                    //then you win and restart
                    $('#between_lvl_screen').css({ display: 'block', background: 'rgba(255, 255, 255, 0.84)' }).html('YOU BEAT THE GAME!');
                    $('#between_lvl_screen').center();
                    setTimeout( () => {
                        $(document).on('click', function () {
                            world.destroy();
                            $('.pjs-meta').remove();
                            $('#between_lvl_screen').css('display', 'hidden');
                            new_game();
                        });
                    }, 250);
                }
                else {
                    $('#between_lvl_screen').css({ display: 'block', background: 'rgba(255, 255, 255, 0.84)'}).html('Lvl ' + lvl + ' completed! Tap to continue');
                    $('#between_lvl_screen').center();
                    self_destruct = true;

                    setTimeout(function () {
                        $('#viewport').off('click');

                        $(document).on('click touchend', (e) => {

                            $('#between_lvl_screen').css('display', 'none');
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
                                    background: 'url("./images/' + lvl + '.jpg") no-repeat',
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundColor: "black"
                                });

                            var i = lvl + 1,
                                balls = [],
                                view = new Image();

                            view.width = unit - 1;
                            view.height = unit - 1;
                            view.src = ('./images/jezzball_ball.png');

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
                                ball.view = view;
                                ball.gameType = 'circle';
                                balls.push(ball);
                            }

                            world.add(balls);
                            $(document).off('click touchend');
                            setTimeout( function () {
                                load_climber_handler();
                            }, 150);
                        });
                    }, 250);
                }
                up_down_dir = true;
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

                    var collisions = data.collisions
                        , col
                        ;
                    world = this._world;

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

                            remove_unmarked();//world);
                            world.removeBehavior(this);
                        }
                    }
                },

                //Called by integrator to update positions
                behave: function () {

                    var world = this._world;

                    if (self_destruct) {
                        world.removeBehavior(this);
                        return;
                    }

                    //COULD MAKE THIS A FX? ALSO APPEARS IN COLLISION CHECKER ABOVE
                    this.getTargets()[0].grow();
                    //if the climber reaches the viewport border
                    if (this.getTargets()[0].aabb().y - this.getTargets()[0].geometry.height / 2 < 0 ||
                        this.getTargets()[0].aabb().y + this.getTargets()[0].geometry.height / 2 > canvasHeight ||
                        this.getTargets()[0].aabb().x - this.getTargets()[0].geometry.width / 2 < 0 ||
                        this.getTargets()[0].aabb().x + this.getTargets()[0].geometry.width / 2 > canvasWidth
                    ) {
                        this.getTargets()[0].die();

                        var col, 
                            row,
                            balls = world.find(Physics.query({
                                name: 'circle'
                            }));

                        for (var i = 0; i < balls.length; i++) {
                            //get coord's and convert to matrix indexes
                            col = Math.round((balls[i].aabb().x - unit / 2) / unit);
                            row = Math.round((balls[i].aabb().y - unit / 2) / unit);
                            //$(cells[col][row]).detach(); //<- proving wrong ball cell calc
                            flood_mark([col, row]);
                        }

                        remove_unmarked();//world);
                        world.removeBehavior(this);

                    }
                },
            };
        });
    });