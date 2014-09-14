/* global Phaser */
'use strict';

var w = window.innerWidth * window.devicePixelRatio,
	h = window.innerHeight * window.devicePixelRatio;

var
	coins,
	cursors,
	layer,
	layer_foreground,
	layer_collision,
	map,
	player,
	score = 0,
	scoreText,
	// game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
	// game = new Phaser.Game(480, 320, Phaser.AUTO, '', {
	game = new Phaser.Game((h > w) ? h : w, (h > w) ? w : h, Phaser.AUTO, '', {
		preload: function () {
			game.load.tilemap('mario', 'assets/img/maps/smb_1_1.json', null, Phaser.Tilemap.TILED_JSON);
			game.load.image('tiles', 'assets/img/tiles/smb_1_1.png');
			game.load.image('metatiles', 'assets/img/tiles/metatiles16x16.png');
			game.load.spritesheet('coin', 'assets/img/sprites/smb_coin.png', 16, 16);
			game.load.spritesheet('bmo', 'assets/img/sprites/bmo.png', 32, 32);
		},
		create: function () {

			cursors = game.input.keyboard.createCursorKeys();

			game.stage.backgroundColor = '#6b8cff';
			game.physics.startSystem(Phaser.Physics.ARCADE);

			map = game.add.tilemap('mario');
			map.addTilesetImage('smb_1_1', 'tiles');
			map.addTilesetImage('metatiles16x16', 'metatiles');

			layer_collision = map.createLayer('collision');
			layer_collision.resizeWorld();
			layer_collision.visible = false;
			map.setCollision(41, true, layer_collision, true);
			map.setCollision(42, true, layer_collision, true);

			layer = map.createLayer('background');
			layer.resizeWorld();

			player = game.add.sprite(32, game.world.height - 150, 'bmo');

			game.physics.arcade.enable(player);
			game.camera.follow(player);
			game.camera.deadzone = new Phaser.Rectangle(100, 100, (w * 0.5), (h * 0.5));

			player.body.debug = true;
			player.body.bounce.y = 0;
			player.body.gravity.y = 600;
			player.body.collideWorldBounds = true;
			player.anchor.setTo(0.5, 1);
			player.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
			player.collectStar = function(player, coin) {
				// Removes the coin from the screen
				coin.kill();

				// Add and update the score
				score += 10;
				scoreText.text = 'Score: ' + score;
			};

			layer_foreground = map.createLayer('foreground');
			layer_foreground.resizeWorld();

			coins = game.add.group();
			coins.enableBody = true;

			// Here we'll create 12 of them evenly spaced apart
			for (var i = 0; i < 12; i++) {
				// Create a coin inside of the 'coins' group
				var coin = coins.create(i * 70, 0, 'coin', 0);

				game.physics.arcade.enable(coin);

				coin.body.collideWorldBounds = true;
				coin.body.gravity.y = 250 + Math.random() * 0.75;
				coin.body.bounce.y = 0.6 + Math.random() * 0.2;
				coin.animations.add('blink', [0, 1, 2], 5, true);
				coin.animations.play('blink');
			}

			scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
		},
		update: function () {
			// Collide the player and the coins
			game.physics.arcade.collide(coins, coins);
			game.physics.arcade.collide(coins, layer_collision);
			game.physics.arcade.collide(player, layer_collision);
			game.physics.arcade.overlap(player, coins, player.collectStar, null, this);

			// Reset the players velocity (movement)
			player.body.velocity.x = 0;


			if (game.input.pointer1.isDown) {
				if (game.input.pointer1.x > player.x) {
					// Move to the right
					player.body.velocity.x = 150;
					player.animations.play('walk');
					player.scale.x = 1;
				} else if (game.input.pointer1.x < player.x) {
					// Move to the left
					player.body.velocity.x = -150;
					player.animations.play('walk');
					player.scale.x = -1;
				} else {
					// Stand still
					player.animations.stop();
					player.frame = 1;
				}

				if (game.input.pointer1.y < player.y && (player.body.touching.down || player.body.blocked.down || Math.ceil(player.y) === game.world.height)) {
					player.body.velocity.y = -350;
				}
			}

			if (cursors.left.isDown) {
				// Move to the left
				player.body.velocity.x = -150;
				player.animations.play('walk');
				player.scale.x = -1;
			} else if (cursors.right.isDown) {
				// Move to the right
				player.body.velocity.x = 150;
				player.animations.play('walk');
				player.scale.x = 1;
			} else {
				// Stand still
				player.animations.stop();
				player.frame = 1;
			}

			// Allow the player to jump if they are touching the ground or the bottom of the screen
			if (cursors.up.isDown && (player.body.touching.down || player.body.blocked.down || Math.ceil(player.y) === game.world.height)) {
				player.body.velocity.y = -350;
			}
		}
	})
	;

console.log(game);
