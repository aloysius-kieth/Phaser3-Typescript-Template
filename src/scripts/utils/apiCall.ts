import { utils } from './utils'

const STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400
}

export default class APICall {
    private static instance: APICall;
    config;

    constructor(config) {
        if (!APICall.instance) {
            APICall.instance = this;
        }
     
        this.config = config;
        console.log(this.config);

        return APICall.instance;
    }
    static getInstance(config = null): APICall {
        if (!APICall.instance) {
            APICall.instance = new APICall(config);
        } 
        return APICall.instance;
    }
    addGameResult(_userID, callback) {
        console.log("Adding game result...")
        if (!_userID || 0 === _userID.length) return

        var apiResult: apiResultClass = new apiResultClass()
        var data = {
            userID: _userID,
        }
        if (this.config != null) {
            var url = this.config.frontURL + this.config.port + this.config.backURL + 'addSpinWinResult/'
            utils.POST(url, data, (result) => {
                console.log(result.responseJSON)
                if (result.status == STATUS_CODE.OK) {
                    callback(result.responseJSON, true)
                } else {
                    callback(result, false)
                }
            })
        } else {
            console.log('Could not call API <addGameResult>')
        }
    }
}

class apiResultClass {
    request: requestClass;
    error: errorClass;
    data: dataClass;
    constructor() {
        this.request = new requestClass()
        this.error = new errorClass()
        this.data = new dataClass()
    }
}

class requestClass {
    api = ''
    result = ''
}

class errorClass {
    error_code = ''
    error_message = ''
}

class dataClass {
    data = null
}