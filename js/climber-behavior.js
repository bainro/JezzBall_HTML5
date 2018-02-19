define(
    [
        'physicsjs'
    ],
    function (
        Physics
    ) {

        function flood_mark(col, row) {
            if ($.contains(document.getElementById('cell_container'), $(cells[col][row])[0])) {
                //mark the cell as visited
                $(cells[col][row]).data('marked', true);
                //recursive calls passing each adjacent cell
                if (col + 1 < 27 && $(cells[col + 1][row]).data('marked') === false) {
                    flood_mark(col + 1, row);
                }
                if (col - 1 >= 0 && $(cells[col - 1][row]).data('marked') === false) {
                    flood_mark(col - 1, row);
                }
                if (row - 1 >= 0 && $(cells[col][row - 1]).data('marked') === false) {
                    flood_mark(col, row - 1);
                }
                if (row + 1 < 18 && $(cells[col][row + 1]).data('marked') === false) {
                    flood_mark(col, row + 1);
                }
            }
            return;
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

            var percent = Math.round((486 - $('#cell_container').children().length) / 4.86);
            $('#percent').html(String(percent).substring(0, 2).padStart(2, '0') + '%');

            if (percent >= 75) {

                clearInterval(timer_id);

                if (lvl >= 5) {
                    //then you win and restart
                    $('#between_lvl_screen').css({ display: 'block', background: 'rgba(255, 255, 255, 0.84)' }).html('YOU BEAT THE GAME!');
                    $('#between_lvl_screen').center();
                    setTimeout(() => {
                        $(document).on('click', function () {
                            self_destruct = false;
                            $('#viewport').off('click');
                            $('html').off('swipe mouseup');
                            $('#cell_container').empty();
                            //$('.pjs-meta').remove();
                            $('#between_lvl_screen').css('display', 'hidden');
                            $(document).off('click');
                            new_game();
                        });
                    }, 250);
                }
                else {
                    lives += (lvl + 1);
                    self_destruct = true;

                    $('#lives').html(lives);
                    $('#between_lvl_screen').css({ display: 'block', background: 'rgba(255, 255, 255, 0.84)' }).html('Lvl ' + lvl + ' completed! Tap to continue');
                    $('#between_lvl_screen').center();

                    setTimeout(function () {
                        $('#viewport').off('click');

                        $(document).on('click touchend', (e) => {

                            $('#percent').html('00%');
                            $('#between_lvl_screen').css('display', 'none');
                            self_destruct = false;

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
                                    $('#cell_container').append(cells[i][j]);
                                }
                            }

                            $('#cell_container').css(
                                {
                                    background: 'url("./images/' + lvl + '.jpg") no-repeat',
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundColor: "black"
                                }
                            );

                            time_left = 120;
                            $('#timer').html(120);
                            $('#timer').css('color', 'black');
                            timer_id = setInterval(() => {
                                if (time_left-- > 0) {
                                    $('#timer').html(String(time_left).padStart(3, '0'));
                                    if (time_left == 30) {
                                        $('#timer').css('color', '#ff1f1f');
                                    }
                                }
                                else {
                                    $('#between_lvl_screen').css({ display: 'block', background: 'rgba(255, 255, 255, 0.84)' }).html('Game Over! Tap to restart');
                                    $('#between_lvl_screen').center();
                                    clearInterval(timer_id);
                                    world.remove(world.find(Physics.query({
                                        name: 'climber'
                                    })));
                                    self_destruct = true;
                                    setTimeout(() => {
                                        $(document).on('click', function () {
                                            self_destruct = false;
                                            $('#viewport').off('click');
                                            $('html').off('swipe mouseup');
                                            $('#cell_container').empty();
                                            //$('.pjs-meta').remove();
                                            $('#between_lvl_screen').css('display', 'hidden');
                                            $(document).off('click');
                                            new_game();
                                        });
                                    }, 250);
                                }
                            }, 1000);

                            var i = lvl + 1,
                                view = new Image();

                            balls = [];
                            view.width = unit - 1;
                            view.height = unit - 1;
                            view.src = ('./images/jezzball_ball.png');

                            while (i--) {
                                var plus_or_minus = Math.random() < 0.5 ? -1 : 1,
                                    max_v = unit ** 1.5 / 400,
                                    random_v = Math.random() * max_v - 0.5 * max_v,
                                    ball = Physics.body('circle', {
                                        x: Math.random() * canvasWidth
                                        , y: Math.random() * canvasHeight
                                        , radius: unit / 2 - .5
                                        , vx: random_v
                                        , vy: (max_v ** 2 - random_v ** 2) ** 0.5 * plus_or_minus
                                        , angularVelocity: Math.random() * .02 - .01
                                        , mass: 0.001
                                        , restitution: 1
                                        , cof: 0
                                        , styles: {
                                            strokeStyle: '#f4356f'
                                            , fillStyle: 'black'
                                            , angleIndicator: 'green'
                                        }
                                    });
                                ball.view = view;
                                ball.gameType = 'circle';
                                balls.push(ball);
                            }

                            world.add(balls);
                            $(document).off('click touchend');
                            setTimeout(function () {
                                load_climber_handler();
                            }, 150);
                        });
                    }, 250);
                }
                dir_toggle = true;
                $('#current_dir').html('&#8597;');
                document.body.style.cursor = 'n-resize';
                lvl = lvl + 1;
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

                            $('#lives').html(--lives);
                            if (lives <= 0) {
                                $('#between_lvl_screen').css({ display: 'block', background: 'rgba(255, 255, 255, 0.84)' }).html('Game Over! Tap to restart');
                                $('#between_lvl_screen').center();
                                clearInterval(timer_id);
                                world.remove(world.find(Physics.query({
                                    name: 'climber'
                                })));
                                self_destruct = true;
                                setTimeout(() => {
                                    $(document).on('click', function () {
                                        self_destruct = false;
                                        $('#viewport').off('click');
                                        $('html').off('swipe mouseup');
                                        $('#cell_container').empty();
                                        //$('.pjs-meta').remove();
                                        $('#between_lvl_screen').css('display', 'hidden');
                                        $(document).off('click');
                                        new_game();
                                    });
                                }, 250);
                            }
                            
                            world.removeBehavior(this);

                            return;
                        }
                        //if collision between a dead_climber and this climber
                        else if ((col.bodyA.gameType === 'dead_climber' || col.bodyB.gameType === 'dead_climber') &&
                            (col.bodyA === this.getTargets()[0] || col.bodyB === this.getTargets()[0])
                        ) {
                            this.getTargets()[0].die();

                            for (var i = 0; i < balls.length; i++) {
                                //get coord's and convert to matrix indexes
                                col = Math.round((balls[i].aabb().x - unit / 2) / unit);
                                row = Math.round((balls[i].aabb().y - unit / 2) / unit);
                                flood_mark(col, row);
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
                            row;

                        for (var i = 0; i < balls.length; i++) {
                            //get coord's and convert to matrix indexes
                            col = Math.round((balls[i].aabb().x - unit / 2) / unit);
                            row = Math.round((balls[i].aabb().y - unit / 2) / unit);
                            flood_mark(col, row);
                        }

                        remove_unmarked();
                        world.removeBehavior(this);

                    }
                },
            };
        });
    });