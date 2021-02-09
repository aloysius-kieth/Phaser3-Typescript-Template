import Bowser from '../lib/bowser'
// import d from '../utils/debugLog'

const API_KEY = 'ACe680ereAeo3098b7d2bc756db0fc33'
const API_SECRET = 'S5483dac48jduyqnk3eba2c64074dfb14'

export class utils {
  static isLandscape = false

  constructor() {}

  public static SetSessionStorageItem(str, value) {
    sessionStorage.setItem(str, value)
    //d.log(`Saved ${value} to ${str}`)
  }
  public static GetSessionStorageItem(str) {
    if (!sessionStorage.getItem(str)) {
      //d.log(`${str} does not exist in session storage!`)
    } else {
      //d.log(`${str} | ${sessionStorage.getItem(str)} found in session storage`)
      return sessionStorage.getItem(str)
    }
  }
  public static CheckLandscape() {
    return this.isLandscape
  }
  public static GetBrowserPlatform() {
    var result = Bowser.getParser(window.navigator.userAgent)
    //@ts-ignore
    return result.parsedResult.platform.type
  }
  public static WebglAvailable() {
    try {
      var canvas = document.createElement('canvas')
      return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch (e) {
      return false
    }
  }
  public static CheckDesktopBrowser() {
    // Check if browser is running from mobile and tablet devices
    var result = Bowser.getParser(window.navigator.userAgent)
    var isDesktop = true
    //@ts-ignore
    if (result.parsedResult.platform.type != 'desktop') {
      isDesktop = false
    }
    return isDesktop
  }
  public static WindowResizeDetect(callback) {
    $(window).resize(function () {
      callback()
    })
  }
  public static ReadJsonFetch(url, callback) {
    fetch(url)
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        console.log('parsed json', json)
        callback(json)
      })
      .catch(function (ex) {
        console.log('parsing failed', ex)
      })
  }
  public static ReadJsonXMLHttpRequest(url, callback) {
    var request = new XMLHttpRequest()
    request.open('GET', url, true)

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        console.log('SUCCESS loaded: ' + url)
        var data = JSON.parse(request.response)
        callback(data)
      } else {
        console.log('FAILED loaded: ' + url + ' | ' + '<' + request.status + '>')
      }
    }

    request.onerror = function () {
      console.log('FAILED loaded: ' + url + ' | ' + '<' + request.status + '>')
    }
    request.send()
  }
  public static GET(url, callback) {
    $.ajax({
      dataType: 'json',
      type: 'GET',
      url: url,
      success: function (result) {
        callback(result)
      },
      error: function (e) {
        console.log('Error GetJson ', e)
      }
    })
  }
  public static POST(url, data, callback) {
    var jsonStr = JSON.stringify(data)

    $.ajax({
      headers: {
        'api-key': API_KEY,
        'api-secret': API_SECRET,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      type: 'POST',
      url: url,
      data: jsonStr,
      // success: function (data) {
      //     callback(data);
      // },
      // error: function (e) {
      //     console.log("Error: " + e.status + " | " + e.statusText)
      //     callback(e)
      // },
      complete: function (result) {
        callback(result)
      }
    })
  }
}
