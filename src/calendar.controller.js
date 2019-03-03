
import calendarService from './calendar.service';

class calendarController {
    constructor() {
        this.service = new calendarService();
    }

    async init(req, res) {
        // Load client secrets from a local file.
        let oAuth2Client = await this.service._generateOAuth2Client();

        this.service.authorize(oAuth2Client, this.service.listEvents)
            .then((result) => {
                return this.success(res, result);
            }).catch(err => {
                return this.failure(res, err, 'Require authorization', -401);
            })
    }

    async setCode(req, res) {
        let code = req.body.code;
        if (!code || typeof code !== 'string') {
            return this.failure(res, null, 'Invalid code');
        }

        this.service._generateOAuth2Client()
            .then(oAuth2Client => {
                this.service.setCode(oAuth2Client, code)

                    .then(result => {
                        return this.success(res, result, 'Code have been set');
                    })
                    .catch(err => {
                        return this.failure(res, null, 'Code error');
                    });
            })
            .catch(err => {
                return this.failure(res, null, 'Code error');
            })


    }

    success(res, body, message = 'success') {
        res.status(200)
        res.json({
            resultCode: 1,
            message,
            body
        });
    }

    failure(res, body, message = 'require authorizartion', resultCode = -400) {
        res.status(400)
        res.json({
            resultCode,
            message,
            body
        });
    }
}



export default calendarController 