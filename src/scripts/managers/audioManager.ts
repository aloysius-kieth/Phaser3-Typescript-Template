import AudioConfig from '../config/audioConfig'
import Global from '../config/global'

export class AudioManager {
  private static instance: AudioManager
  music_map = new Map()
  sfx_map = new Map()

  music: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound
  sfx: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound

  scene: Phaser.Scene
  config: Global

  constructor(scene, config) {
    if (!AudioManager.instance) {
      AudioManager.instance = this
    }

    this.scene = scene
    this.config = config
    console.log(this.config)

    this.init()

    return AudioManager.instance
  }
  static getInstance(scene = null, config = null): AudioManager {
    if (!AudioManager.instance) {
      console.log(AudioManager.instance)
      AudioManager.instance = new AudioManager(scene, config)
    }

    return AudioManager.instance
  }
  init() {
    let sfxProp = {
      volume: this.config.settings.getAudio('sfxVolume')
    }
    let musicProp = {
      volume: this.config.settings.getAudio('musicVolume'),
      loop: true
    }
    // this.music = this.scene.sound.addAudioSprite('music', musicProp);
    // this.sfx = this.scene.sound.addAudioSprite('sfx', sfxProp);

    Object.keys(AudioConfig.MUSIC).forEach((key) => {
      const music = AudioConfig.MUSIC[key]
      this.music_map.set(music.KEY, this.scene.sys.sound.add(music.KEY, musicProp))
    })
    Object.keys(AudioConfig.SFX).forEach((key) => {
      const sfx = AudioConfig.SFX[key]
      this.sfx_map.set(sfx.KEY, this.scene.sys.sound.add(sfx.KEY, sfxProp))
    })
  }
  //#region Audio Sprite Methods
  playSFXAS(key) {
    var audio = this.sfx;
    if (audio != null) {
      audio.play(key);
    } else {
      console.log(`${key} does not exist!`)
    }
  }
  playSFXCallbackAS(key, callback: () => void) {
    var audio = this.sfx;
    if (audio != null) {
      audio.play(key);
      audio.once(Phaser.Sound.Events.COMPLETE, () => {
        if (callback != null) {
          callback();
        }
      })
    } else {
      console.log(`${key} does not exist!`);
    }
  }
  playMusicAS(key) {
    var audio = this.music;
    if (audio != null) {
      audio.play();
    } else {
      console.log(`${key} does not exist!`);
    }
  }
  stopMusicAS() {
    var audio = this.music
    if (audio != null && audio.isPlaying) {
      audio.stop();
    } else {
      console.log(`music is playing ${audio.isPlaying}`);
    }
  }
  fadeOutMusicAS(scene: Phaser.Scene, stopPlaying: boolean = true, time: number = 1500) {
    var audio = this.music;
    if (audio != null && audio.isPlaying) {
      scene.tweens.add({
        targets: audio,
        volume: 0,
        duration: time,
        ease: 'Linear',
        onComplete: function () {
          if (stopPlaying) {
            audio.stop();
          }
        }
      })
    } else {
      console.log(`music is playing ${audio.isPlaying}`);
    }
  }
  fadeInMusicAS(scene: Phaser.Scene, key: string, vol: number = 1, time: number = 5000) {
    var audio = this.music;
    audio.play(key, { volume: 0 });
    if (audio != null && audio.isPlaying) {
      scene.tweens.add({
        targets: audio,
        volume: {
          from: 0,
          to: vol
        },
        duration: time,
        ease: 'Linear'
      })
    } else {
      console.log(`${key} does not exist`);
    }
  }
  //#endregion

  //#region Audio Play and stop methods
  playSFX(key) {
    var sound: Phaser.Sound.BaseSound;
    if (this.sfx_map.has(key)) {
      sound = this.sfx_map.get(key)
      sound.play()
    } else {
      console.log(`${key} does not exist!`)
    }
  }
  playSFXCallback(key, callback: () => void) {
    var sound: Phaser.Sound.BaseSound;
    if (this.sfx_map.has(key)) {
      sound = this.sfx_map.get(key)
      sound.play()
      sound.once(Phaser.Sound.Events.COMPLETE, () => {
        if (callback != null) {
          callback();
        }
      })
    } else {
      console.log(`${key} does not exist!`)
    }
  }
  playMusic(key) {
    var music: Phaser.Sound.BaseSound;
    if (this.music_map.has(key)) {
      music = this.music_map.get(key)
      music.play()
    } else {
      console.log(`${key} does not exist!`)
    }
  }
  stopMusic(key) {
    var music: Phaser.Sound.BaseSound;
    if (this.music_map.has(key)) {
      music = this.music_map.get(key)
      music.stop()
    } else {
      console.log(`${key} does not exist!`)
    }
  }
  fadeOutMusic(scene: Phaser.Scene, key, stopPlaying = true, time = 1500) {
    var music: Phaser.Sound.BaseSound;
    if (this.music_map.has(key)) {
      music = this.music_map.get(key)
      //console.log(music.isPlaying)
      if (music != null && music.isPlaying) {
        scene.tweens.add({
          targets: music,
          volume: 0,
          duration: time,
          ease: 'Linear',
          onComplete: function () {
            if (stopPlaying) {
              music.stop()
            }
          }
        })
      }
    }
  }
  fadeInMusic(scene: Phaser.Scene, key: string, vol: number = 1, time: number = 5000) {
    var music: Phaser.Sound.BaseSound
    if (this.music_map.has(key)) {
      music = this.music_map.get(key)
      music.play({ volume: 0 })
      if (music != null && music.isPlaying) {
        scene.tweens.add({
          targets: music,
          volume: {
            from: 0,
            to: vol
          },
          duration: time,
          ease: 'Linear'
        })
      }
    }
  }
  //#endregion
}
