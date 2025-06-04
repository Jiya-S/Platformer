class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap.png");                         // Packed tilemap
        this.load.image("background_tiles", "tilemap-backgrounds.png");   // Note the underscore instead of hyphen
        this.load.tilemapTiledJSON("platformer", "jiyagame3b5.tmj");   // Tilemap in JSON

        this.load.spritesheet("tilemap_sheet", "tilemap.png", {
            frameWidth: 18,
            frameHeight: 18,
            spacing: 1
        });

        this.load.spritesheet("background_sheet", "tilemap-backgrounds.png", {
            frameWidth: 24,
            frameHeight: 24,
            spacing: 1
        });

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        // Load audio files
        this.load.audio('coinCollect', 'coinCollect.mp3');
        this.load.audio('running', 'running.mp3');
        this.load.audio('keyCollect', 'keyCollect.mp3');
        this.load.audio('levelComplete', 'levelComplete.wav');
        this.load.audio('jump', 'jump.wav');
        this.load.audio('buttonPress', 'buttonPress.mp3');

        // Add loading event listener
        this.load.on('complete', () => {
            console.log('All assets loaded successfully');
        });

        this.load.on('loaderror', (file) => {
            console.error('Error loading asset:', file.key);
        });
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

       
        this.anims.create({
            key: 'coin-spin',
            frames: this.anims.generateFrameNumbers('tilemap_sheet', { 
                frames: [151, 152] 
            }),
            frameRate: 8,
            repeat: -1
        });

      
        this.scene.start("platformerScene");
    }

    
    update() {
    }
}