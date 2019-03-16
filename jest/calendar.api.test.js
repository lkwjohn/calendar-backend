import request from 'request-promise';
import { ENV_LIST, PORT } from '../src/constants';

describe('Calendar API', () => {
    let options = {
        headers: {
            'content-type': 'application/json',
        },
        json: true,
        resolveWithFullResponse: true
    }

    test('GET calendar should successful retrieve the environment status', async (done) => {

        options.uri = `http://localhost:${PORT}/api/web/calendar`;

        try {
            let res = await request.get(options);
            expect(res.body.resultCode).toBe(1);
            expect(res.body.body.length).toEqual(3);
            res.body.body.map(env => {
                expect(ENV_LIST).toContain(env.code);
                expect(env.summary).toBeDefined()
            })
            done();
        } catch (err) {
            console.log('errr', err);
            done();
        }
    });
})