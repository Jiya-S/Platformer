class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
        this.cursors = null;  }

    init() {
        
        this.ACCELERATION = 700;     
        this.DRAG = 700;           
        this.MAX_SPEED = 300;     
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
    }

    create() {
       
        this.map = this.make.tilemap({ key: "platformer", tileWidth: 18, tileHeight: 18 });
        console.log('Tilemap loaded');

   
        this.tileset = this.map.addTilesetImage("tiledx3", "tilemap_tiles");

        this.tileset2 = this.map.addTilesetImage("tilemap-backgrounds", "background_tiles");
        //this.tileset3 = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

    
        this.background1 = this.map.createLayer("background", this.tileset2, 0, 0);
        this.background1.setScale(2);
        this.decorLayer = this.map.createLayer("Decor", this.tileset, 0, 0);
        this.decorLayer.setScale(2.0);
        
        this.background2 = this.map.createLayer("bg2", this.tileset, 0, 0);
        this.background2.setScale(2.0);

        this.groundLayer = this.map.createLayer("GroundPlatform", this.tileset, 0, 0);
        this.groundLayer.setScale(2.0);

        this.invisibleLayer = this.map.createLayer("InvisibleLayer", this.tileset, 0, 0);
        this.invisibleLayer.setScale(2.0);
        this.invisibleLayer.visible = false;

        
        this.groundLayer.setCollisionByProperty({ collides: true });
        
      
        this.invisibleLayer.setCollisionByProperty({ collides: true });

        
        my.sprite.player = this.physics.add.sprite(game.config.width/8, game.config.height/2, "platformer_characters", "tile_0000.png").setScale(SCALE);
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setBounce(0.2);    
        this.player = my.sprite.player;

        
        this.physics.world.bounds.width = this.map.widthInPixels * 2;
        this.physics.world.bounds.height = this.map.heightInPixels * 2;

        //Camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * 2, this.map.heightInPixels * 2);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(100, 100);

        //Parallax scrolling
        this.background1.setScrollFactor(0.5);
        this.background2.setScrollFactor(0.7);

        
        this.physics.add.collider(this.player, this.groundLayer);
        this.physics.add.collider(this.player, this.invisibleLayer, null, () => this.invisibleLayer.visible, this);

        

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        this.coins.forEach(coin => {
            const origX = coin.x;
            const origY = coin.y;
            coin.setScale(2).setOrigin(0.5);
            coin.setPosition(origX * 2, origY * 2);
            
            coin.play('coin-spin');
        });

       
        this.ladders = this.map.createFromObjects("Objects", {
            name: "ladder",
            key: "tilemap_sheet",
            frame: 71
        });

      
        if (this.ladders) {
            this.ladders.forEach(ladder => {
                const origX = ladder.x;
                const origY = ladder.y;
                ladder.setScale(2).setOrigin(0.5);
                ladder.setPosition(origX * 2, origY * 2);
                
                
                this.physics.world.enable(ladder);
                ladder.body.setAllowGravity(false);
                ladder.body.setImmovable(true);
                
               
                ladder.setAlpha(0);
            });

         
            this.ladderGroup = this.add.group(this.ladders);
        }

       
        const keys = this.map.createFromObjects("Objects", {
            name: "key",
            key: "tilemap_sheet",
            frame: 27  
        });

       
        if (keys && keys.length > 0) {
            this.key = keys[0];  
            const origX = this.key.x;
            const origY = this.key.y;
            this.key.setScale(2).setOrigin(0.5);
            this.key.setPosition(origX * 2, origY * 2);
            
            
            this.physics.world.enable(this.key);
            this.key.body.setAllowGravity(false);
            this.key.collected = false;
        }

        
        const locks = this.map.createFromObjects("Objects", {
            name: "lock",
            key: "tilemap_sheet",
            frame: 28
        });

        
        if (locks && locks.length > 0) {
            console.log(locks);
            this.lock = locks[0];  
            const origX = this.lock.x;
            const origY = this.lock.y;
            this.lock.setScale(2).setOrigin(0.5);
            this.lock.setPosition(origX * 2, origY * 2);
            console.log('Lock created at:', this.lock.x, this.lock.y);

            this.physics.world.enable(this.lock);
            this.lock.body.setAllowGravity(false);
        }

       
        this.runningSound = this.sound.add('running', { 
            loop: true,
            volume: 1
        });

       
        if (this.coins && this.coins.length > 0) {
            this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
            this.coinGroup = this.add.group(this.coins);
            
            this.physics.add.overlap(this.player, this.coinGroup, (obj1, obj2) => {
                
                this.coinGroup.remove(obj2);
                
                
                this.sound.play('coinCollect');

                
                obj2.setBlendMode(Phaser.BlendModes.ADD);
                
                
                this.tweens.add({
                    targets: obj2,
                    alpha: { from: 1, to: 0 },    
                    scale: { from: 2, to: 3 },     
                    duration: 100,               
                    onComplete: () => {
                        if (obj2.body) {
                            obj2.body.destroy();
                        }
                        obj2.destroy();  
                    }
                });
            });
        }
        
       
        const buttons = this.map.createFromObjects("Objects", {
            name: "button",
            key: "tilemap_sheet",
            frame: 148 
        });

        
        this.button = buttons[0];
        //console.log('Created button:', this.button); 

        if (this.button) {
            const origX = this.button.x;
            const origY = this.button.y;
            //console.log('Button original position:', origX, origY); // Debug log
            
            this.button.setScale(2).setOrigin(0.5);
            this.button.setPosition(origX*2, origY*2);
            //console.log('Button scaled position:', this.button.x, this.button.y); // Debug log
            
           
            this.physics.world.enable(this.button);
            this.button.body.setAllowGravity(false); 
            this.button.body.setImmovable(true);     
            
          
            this.button.setInteractive();
            this.button.isPressed = false;

           
            this.button.setAlpha(1);
            this.button.setTint(0xff0000); 
            
           
            this.button.setDepth(1);

           
            this.physics.add.overlap(this.player, this.button, this.handleButtonPress, null, this);
        } else {
            console.error('Button not found in the map!');
        }

      
        if (this.movingPlatforms) {
            this.movingPlatforms.forEach(platform => {
                platform.setAlpha(0); 
                platform.active = false;
            });
        }
        
        this.waterTiles = this.decorLayer.filterTiles(tile => {
            return tile.properties.isWater == true;
        });
        
        //console.log('Found water tiles:', this.waterTiles.length);  // Debug log

        
        this.waterColliders = [];
        this.waterTiles.forEach(tile => {
            
            const scaledX = tile.pixelX * 2;
            const scaledY = tile.pixelY * 2;
            
            
            const waterHitbox = this.add.rectangle(scaledX + 18, scaledY + 18, 36, 36);
            this.physics.add.existing(waterHitbox, true); 
            
            
            
            this.waterColliders.push(waterHitbox);
            //console.log('Created water collider at:', scaledX, scaledY);  // Debug log
        });

     
        this.waterGroup = this.add.group(this.waterColliders);

        
        this.physics.add.overlap(this.player, this.waterColliders, () => {
            this.scene.start("platformerScene");
        });

        
        this.movingPlatforms = this.map.createFromObjects("MovingPlatforms", {
            name: "cloud",
            key: "tilemap_sheet"
        });

        
        if (this.movingPlatforms) {
            
            let clouds1 = [];
            let clouds2 = [];

            
            for (let i = 0; i < 4; i++) {
                const platform = this.movingPlatforms[i];
                const origX = platform.x * 2;
                const origY = platform.y * 2;
                
                const cloudPlatform = this.physics.add.sprite(origX, origY, 'tilemap_sheet', [156, 155, 155, 154][i]-1);
                cloudPlatform.setScale(2);
                
               
                cloudPlatform.setPushable(false);
                cloudPlatform.body.allowGravity = false;
                cloudPlatform.body.moves = false;
                
                clouds1.push(cloudPlatform);
                
                this.physics.add.collider(this.player, cloudPlatform);
                
                platform.destroy();
            }

           
            for (let i = 4; i < 8; i++) {
                const platform = this.movingPlatforms[i];
                const origX = platform.x * 2;
                const origY = platform.y * 2;
                
                const cloudPlatform = this.physics.add.sprite(origX, origY, 'tilemap_sheet', [156, 155, 155, 154][i-4]-1);
                cloudPlatform.setScale(2);
                
                
                cloudPlatform.setPushable(false);
                cloudPlatform.body.allowGravity = false;
                cloudPlatform.body.moves = false;
                
                clouds2.push(cloudPlatform);
            
                this.physics.add.collider(this.player, cloudPlatform);
                
                platform.destroy();
            }

           
            this.cloudGroup1 = this.add.group(clouds1);
            this.cloudGroup2 = this.add.group(clouds2);

            
            clouds1.forEach(platform => {
                platform.startX = platform.x;
                platform.direction = 1;
                platform.moveDistance = 200;
                platform.active = true;
            });

            clouds2.forEach(platform => {
                platform.startY = platform.y;
                platform.direction = 1;
                platform.moveDistance = 150;
                platform.active = true;
            });
        }

       
        this.physics.world.createDebugGraphic();
        this.physics.world.debugGraphic.visible = false;

        
        this.cursors = this.input.keyboard.createCursorKeys();

        
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

       
        if (this.key) {
            this.physics.add.overlap(this.player, this.key, this.collectKey, null, this);
            
            
            this.keyText = this.add.text(16, 16, '', {
                fontSize: '32px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 4
            });
            this.keyText.setScrollFactor(0); 
            this.keyText.setDepth(100); 
        }

       
        if (this.lock) {
            this.physics.add.overlap(this.player, this.lock, this.openLock, null, this);
        }
    }

    update() {
        const player = this.player;  
        const onGround = player.body.blocked.down;

        
        let onLadder = false;
        let hasLadderAbove = false;
        
        if (this.ladders && this.ladders.length > 0) {
           
            onLadder = this.physics.overlap(player, this.ladderGroup);
            
           
            if (onLadder) {
                hasLadderAbove = this.ladders.some(ladder => 
                    ladder.y < player.y &&
                    Math.abs(ladder.x - player.x) < 16 
                );
            }
        }

       
        if (onLadder) {
            if (!hasLadderAbove && this.cursors.up.isDown) {
                
                player.body.setAllowGravity(true);
                player.setVelocityY(this.JUMP_VELOCITY);
            } else {
               
                player.body.setAllowGravity(false);
                
                
                if (this.cursors.up.isDown) {
                    player.setVelocityY(-200); 
                } else if (this.cursors.down.isDown) {
                    player.setVelocityY(200);  
                } else {
                    player.setVelocityY(0);
                }
            }

           
            if (this.cursors.left.isDown) {
                player.setVelocityX(-100); 
                player.setFlipX(false);
            } else if (this.cursors.right.isDown) {
                player.setVelocityX(100); 
                player.setFlipX(true);
            } else {
                player.setVelocityX(0);
            }
        } else {
           
            player.body.setAllowGravity(true);
            
            
            if(this.cursors.left.isDown) {
                if (player.body.velocity.x > 0) {
                    player.setVelocityX(0);
                }
                player.setAccelerationX(-this.ACCELERATION);
                player.setFlipX(false);
                player.anims.play('walk', true);
                
                if (player.body.velocity.x < -this.MAX_SPEED) {
                    player.setVelocityX(-this.MAX_SPEED);
                }
            } else if(this.cursors.right.isDown) {
                if (player.body.velocity.x < 0) {
                    player.setVelocityX(0);
                }
                player.setAccelerationX(this.ACCELERATION);
                player.setFlipX(true);
                player.anims.play('walk', true);

                if (player.body.velocity.x > this.MAX_SPEED) {
                    player.setVelocityX(this.MAX_SPEED);
                }
            } else {
                player.setAccelerationX(0);
                player.setDragX(this.DRAG);
                
                if (Math.abs(player.body.velocity.x) < 10) {
                    player.setVelocityX(0);
                }
                player.anims.play('idle');
            }

            if(!onGround) {
                player.anims.play('jump');
            }
            if(onGround && Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                player.setVelocityY(this.JUMP_VELOCITY);
                this.sound.play('jump');
            }
        }

      
        if (this.cloudGroup1) {
            this.cloudGroup1.getChildren().forEach(platform => {
                if (platform.active) {
                    platform.x += platform.direction * 2;
                    if (Math.abs(platform.x - platform.startX) > platform.moveDistance) {
                        platform.direction *= -1;
                    }
                }
            });
        }

        if (this.cloudGroup2) {
            this.cloudGroup2.getChildren().forEach(platform => {
                if (platform.active) {
                    platform.y += platform.direction * 1.5;
                    if (Math.abs(platform.y - platform.startY) > platform.moveDistance) {
                        platform.direction *= -1;
                    }
                }
            });
        }

   
        if (onGround && (this.cursors.left.isDown || this.cursors.right.isDown)) {
            if (!this.runningSound.isPlaying) {
                this.runningSound.play();
            }
        } else {
            if (this.runningSound.isPlaying) {
                this.runningSound.stop();
            }
        }
    }

    handleButtonPress(player, button) {
       
        if (button === this.button && !button.isPressed) {
            //console.log('Button pressed at position:', button.x, button.y); // Debug log
            
           
            this.sound.play('buttonPress');
            
           
            button.setFrame(149);  
            button.isPressed = true;
            button.setTint(0x00ff00); 
            
            //console.log('Making invisible layer visible'); // Debug log
           
            this.invisibleLayer.visible = true;

            
            if (this.ladders) {
                this.ladders.forEach(ladder => {
                    this.tweens.add({
                        targets: ladder,
                        alpha: 1,
                        duration: 500,
                        ease: 'Power2'
                    });
                });
            }

           
            if (this.movingPlatforms) {
                // Activate cloud group 1
                this.cloudGroup1.getChildren().forEach(platform => {
                    this.tweens.add({
                        targets: platform,
                        alpha: 1,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            platform.active = true;
                        }
                    });
                });

                // Activate cloud group 2
                this.cloudGroup2.getChildren().forEach(platform => {
                    this.tweens.add({
                        targets: platform,
                        alpha: 1,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            platform.active = true;
                        }
                    });
                });
            }
        }
    }

    collectKey(player, key) {
        if (!key.collected) {
            key.collected = true;
            this.hasKey = true;  
            
            
            this.sound.play('keyCollect');
            
           
            this.keyText.setText('Key Collected!');
            
            key.setBlendMode(Phaser.BlendModes.ADD);
            
           // console.log('Key collected!'); // Debug log
            
           
            this.tweens.add({
                targets: key,
                alpha: { from: 1, to: 0 },
                scale: { from: 2, to: 3 },
                duration: 200,
                onComplete: () => {
                    key.destroy();
                }
            });
        }
    }

    openLock(player, lock) {
        if (this.hasKey && !this.lockOpened) {
            this.lockOpened = true;
            
           
            this.sound.play('levelComplete');
            
            this.tweens.add({
                targets: lock,
                alpha: { from: 1, to: 0 },
                scale: { from: 2, to: 3 },
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    lock.destroy();
                    
                   
                    this.time.delayedCall(1000, () => {
                        this.cameras.main.fade(1000, 0, 0, 0);
                        this.time.delayedCall(1000, () => {
                            this.scene.start('gameOverScene');
                        });
                    });
                }
            });
        } else if (!this.hasKey) {
            
            if (!this.needKeyText) {
                this.needKeyText = this.add.text(
                    this.cameras.main.worldView.centerX,
                    this.cameras.main.worldView.centerY + 50,
                    'Find the key first!',
                    {
                        fontSize: '32px',
                        fill: '#fff',
                        stroke: '#000',
                        strokeThickness: 4
                    }
                ).setOrigin(0.5);
                this.needKeyText.setScrollFactor(0);
                this.needKeyText.setDepth(100);
                
               
                this.tweens.add({
                    targets: this.needKeyText,
                    alpha: { from: 1, to: 0 },
                    duration: 2000,
                    onComplete: () => {
                        this.needKeyText.destroy();
                        this.needKeyText = null;
                    }
                });
            }
        }
    }
}