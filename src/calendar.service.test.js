
import calendarService from './calendar.service';
import moment from 'moment';
import { ENV_LIST } from './constants';

describe('Calendar Service Test', () => {
    let service = new calendarService();
    // const mockLogContext = { trxContext: { uuid: 2 }, metadata: {} };
    // let res = {};


    describe('_retrieveEnvironmentStatus', () => {
        beforeAll(() => {

        })

        test('Should return 2 Environment, QE and Staging status given a list of calendar events', () => {
            let todayEventStartDate = new moment();
            let todayEventEndDate = new moment()
            todayEventStartDate.add(-2, 'hours');
            todayEventStartDate = todayEventStartDate.format('YYYY-MM-DD HH:mm:ss');
            todayEventEndDate.add(2, 'hours');
            todayEventEndDate = todayEventEndDate.format('YYYY-MM-DD HH:mm:ss');

            let calendarEvents = [
                {
                    summary: '#qe testing',
                    start: {
                        dateTime: todayEventStartDate
                    },
                    end: {
                        dateTime: todayEventEndDate
                    }
                },
                {
                    summary: '#staging testing',
                    start: {
                        dateTime: todayEventStartDate
                    },
                    end: {
                        dateTime: todayEventEndDate
                    }
                },
                {
                    summary: 'Random event',
                    start: {
                        dateTime: todayEventStartDate
                    },
                    end: {
                        dateTime: todayEventEndDate
                    }
                },
                {
                    summary: 'Random event 2 #aaaa',
                    start: {
                        dateTime: todayEventStartDate
                    },
                    end: {
                        dateTime: todayEventEndDate
                    }
                },
                {
                    summary: 'Random event',
                    start: {
                        dateTime: todayEventStartDate
                    },
                    end: {
                        dateTime: todayEventEndDate
                    }
                }
            ];

            let envEvents = service._retrieveEnvironmentStatus(calendarEvents);
            expect(envEvents.length).toEqual(3);

            let numberOfEnvWithOccupiedStatus = 0;
            envEvents.map(env => {

                expect(env.code).toBeDefined();
                expect(env.summary).toBeDefined();
                expect(ENV_LIST).toContain(env.code);
                if (env.summary === 'testing') {
                    numberOfEnvWithOccupiedStatus++;
                }
            })

            expect(numberOfEnvWithOccupiedStatus).toEqual(2);

        });

        test('All environment should return  default status given no events', () => {
            let envEvents = service._retrieveEnvironmentStatus([]);

            expect(envEvents.length).toEqual(3);
            let numberOfEnvWithOccupiedStatus = 0;
            envEvents.map(env => {

                expect(env.code).toBeDefined();
                expect(env.summary).toBeDefined();
                expect(ENV_LIST).toContain(env.code);
                if (env.summary === 'testing') {
                    numberOfEnvWithOccupiedStatus++;
                }
            })

            expect(numberOfEnvWithOccupiedStatus).toEqual(0);
        })

        test('All environment should return  default status given a environment event that have passed', () => {
            let todayEventStartDate = new moment();
            let todayEventEndDate = new moment()
            todayEventStartDate.add(-10, 'hours');
            todayEventStartDate = todayEventStartDate.format('YYYY-MM-DD HH:mm:ss');
            todayEventEndDate.add(-2, 'hours');
            todayEventEndDate = todayEventEndDate.format('YYYY-MM-DD HH:mm:ss');

            let calendarEvents = [
                {
                    summary: '#qe testing',
                    start: {
                        dateTime: todayEventStartDate
                    },
                    end: {
                        dateTime: todayEventEndDate
                    }
                }
            ];
            let envEvents = service._retrieveEnvironmentStatus(calendarEvents);

            expect(envEvents.length).toEqual(3);
            let numberOfEnvWithOccupiedStatus = 0;
            envEvents.map(env => {

                expect(env.code).toBeDefined();
                expect(env.summary).toBeDefined();
                expect(ENV_LIST).toContain(env.code);
                if (env.summary === 'testing') {
                    numberOfEnvWithOccupiedStatus++;
                }
            })

            expect(numberOfEnvWithOccupiedStatus).toEqual(0);
        });

        test('All environment should return  default status given a environment event start date that have is before today', () => {
            let todayEventStartDate = new moment();
            let todayEventEndDate = new moment()
            todayEventStartDate.add(1, 'hours');
            todayEventStartDate = todayEventStartDate.format('YYYY-MM-DD HH:mm:ss');
            todayEventEndDate.add(2, 'hours');
            todayEventEndDate = todayEventEndDate.format('YYYY-MM-DD HH:mm:ss');

            let calendarEvents = [
                {
                    summary: '#qe testing',
                    start: {
                        dateTime: todayEventStartDate
                    },
                    end: {
                        dateTime: todayEventEndDate
                    }
                }
            ];
            let envEvents = service._retrieveEnvironmentStatus(calendarEvents);

            expect(envEvents.length).toEqual(3);
            let numberOfEnvWithOccupiedStatus = 0;
            envEvents.map(env => {

                expect(env.code).toBeDefined();
                expect(env.summary).toBeDefined();
                expect(ENV_LIST).toContain(env.code);
                if (env.summary === 'testing') {
                    numberOfEnvWithOccupiedStatus++;
                }
            })

            expect(numberOfEnvWithOccupiedStatus).toEqual(0);
        })
    })

});