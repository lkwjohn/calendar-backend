import fs from 'fs';
import { google } from 'googleapis';
import moment from 'moment';
import { CALENDAR_ID, ENV_LIST } from './constants'

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

class calendarService {

    constructor() {
        this.listEvents = this.listEvents.bind(this);
    }

    setCode(oAuth2Client, code) {
        return new Promise((resolve, reject) => {
            oAuth2Client.getToken(code, (err, token) => {
                if (err) {
                    reject(err)
                    return;
                };

                oAuth2Client.setCredentials(token);

                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(null);
                });
            });
        })

    }

    authorize(oAuth2Client, callback) {
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

    _getCurrentDate() {
        return new moment();
    }


    listEvents(auth) {
        const calendar = google.calendar({ version: 'v3', auth });
        return new Promise((resolve, rejects) => {
            calendar.events.list({
                calendarId: CALENDAR_ID,
                timeMin: (new Date()).toISOString(),
                maxResults: 20,
                singleEvents: true,
                orderBy: 'startTime',
            }, (err, res) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    rejects('The API returned an error');
                }

                let events = this._retrieveEnvironmentStatus(res.data.items);
                resolve(events);
            });
        })
    }

    _retrieveEnvironmentStatus(data) {
        let events = [];
        let environmentCodeRecorded = [];

        let today = this._getCurrentDate();
        data.map((event, i) => {
            const startDate = event.start.dateTime || event.start.date;
            const endDate = event.end.dateTime || event.end.date;
            let eventStartDate = new moment(startDate);
            let eventEndDate = new moment(endDate);

            if (today.isSameOrAfter(eventStartDate, 'minute') && today.isSameOrBefore(eventEndDate, 'minute')) {
                let envStatus = ENV_LIST.map((item) => {
                    return { index: event.summary.toLowerCase().indexOf(item), code: item }
                });

                envStatus = envStatus.sort(function (a, b) {
                    if (a.index < b.index) return -1;
                    if (a.index > b.index) return 1;
                    return 0;
                });

                envStatus.map((envState, i) => {

                    let summary = '';
                    if (envState.index !== -1 && !events.find(event => event.code === envState.code)) {

                        if (i + 1 < envStatus.length && envStatus[i + 1].index !== -1) {
                            summary = event.summary.substring(envState.code.length + envState.index, envStatus[i + 1].index);
                        }
                        else {
                            summary = event.summary.substring(envState.code.length + envState.index, event.summary.length);
                        }

                        summary = summary.trim();
                        environmentCodeRecorded.push(envState.code);
                        events.push({ code: envState.code.toLowerCase(), summary });
                    }
                })
            }
        });


        if (events.length < ENV_LIST.length) {
            let environmentNotRecorded = [];

            ENV_LIST.map(env => {
                if (!events.find(event => event.code === env)) {
                    environmentNotRecorded.push(env);
                }
            })

            environmentNotRecorded.map(env => {
                events.push({ code: env, summary: 'Free' });
            })

        }

        return events;
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
}

export default calendarService;