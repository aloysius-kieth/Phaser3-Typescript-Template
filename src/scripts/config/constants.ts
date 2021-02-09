export default {
  SCENES: {
    GLOBAL: 'GlobalScene',
    LOADING_CIRCLE: 'oadingCircle',
    BOOT: 'BootScene',
    PRELOAD: 'PreloadScene',
    MAIN: 'MainScene',
    RESULT: 'ResultScene'
  },
  GAME: {
    MAX_LIVES: 3,
    CAR_MOVE_DURATION: 0,
    NUMBER_OF_LANES: 3,
    SCOREABLES_POOL_SIZE: 50,
    OBSTACLE_POOL_SIZE: 50
  },
  SORTING_LAYER: {
    BACKGROUND: 0,
    OVERLAY: 2,
    GAME: 5,
    UI: 10
  },
  EVENTS: {
    ON_START: 'onStart',
    ON_COUNT: 'onCount',
    FINISH_COUNTDOWN: 'finishCountdown',
    ON_GAMEOVER: 'onGameover'
  },
  SESSION_KEYS: {
    USER_ID: 'userID',
    GAME_SCORE: 'gameScore',
    AUDIO: 'audio'
  },
  SESSION_STORAGE: {
    GAME_SCORE: 'gameScore',
    GAME_TIMER: 'gameTimer',
    GAME_TIMER_FORMATTED: 'gameTimerFormatted'
  }
}
