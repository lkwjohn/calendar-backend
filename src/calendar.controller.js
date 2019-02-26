import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import moment from 'moment';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';



class calendarController {
    constructor() {
    }

    init(req, res) {
        // Load client secrets from a local file.
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Calendar API.
            this.authorize(JSON.parse(content), this.listEvents)
                .then((result) => {
                    return this.success(res, result);
                }).catch(err => {
                    return this.failure(res, err, 'Require authorization', -401);
                })
        });
    }

    async setCode(req, res) {
        let code = req.body.code;
        if (!code || typeof code !== 'string') {
            return this.failure(res, null, 'Invalid code');
        }

        return this._generateOAuth2Client()
            .then(oAuth2Client => {
                new Promise((resolve, reject) => {
                    oAuth2Client.getToken(code, (err, token) => {
                        if (err) {
                            // console.error('Error retrieving access token', err);
                            reject(err)
                            return;
                        };

                        oAuth2Client.setCredentials(token);
                        // Store the token to disk for later program executions
                        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                            if (err) {
                                // console.error(err);
                                reject(err);
                                return;
                            }
                            // console.log('Token stored to', TOKEN_PATH);
                            resolve(null);
                        });
                    });
                })
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

    async authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        return new Promise((resolve, reject) => {
            fs.readFile(TOKEN_PATH, async (err, token) => {
                if (err) {
                    let authUrl = this.getAccessToken(oAuth2Client);
                    reject({ authUrl });
                    return;
                }
                oAuth2Client.setCredentials(JSON.parse(token));
                callback(oAuth2Client)
                    .then((result) => resolve(result))
                    .catch(err => reject(err));
            });
        })
    }



    getAccessToken(oAuth2Client) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        return authUrl;
    }


    listEvents(auth) {
        const calendar = google.calendar({ version: 'v3', auth });
        return new Promise((resolve, rejects) => {
            calendar.events.list({
                calendarId: 'primary',
                timeMin: (new Date()).toISOString(),
                maxResults: 20,
                singleEvents: true,
                orderBy: 'startTime',
            }, (err, res) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    rejects('The API returned an error');
                }
                const data = res.data.items;
                let events = [];
                if (data.length) {
                    console.log('Upcoming 10 events:', data.length);
                    let today = new moment();
                    data.map((event, i) => {
                        const startDate = event.start.dateTime || event.start.date;

                        let eventStartDate = new moment(startDate);
                        if (eventStartDate.isSame(today, 'day')) {
                            if (event.summary.indexOf('#qe') > -1 || event.summary.indexOf('#stable') > -1 || event.summary.indexOf('#staging') > -1) {
                                events = event.summary.split(' ');
                            }
                        }
                    });
                }

                resolve(events);
            });
        })
    }

    _generateOAuth2Client() {
        return new Promise((resolve, reject) => {
            fs.readFile('credentials.json', (err, content) => {
                if (err) {
                    console.log('Error loading client secret file:', err);
                    reject('API have error generate OAuth2Client');
                    return;
                }
                let credentials = JSON.parse(content);
                const { client_secret, client_id, redirect_uris } = credentials.installed;
                let oAuth2Client = new google.auth.OAuth2(
                    client_id, client_secret, redirect_uris[0]);
                resolve(oAuth2Client);
            });
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