import { describe, expect, jest, test, fail } from '@jest/globals';
import logService from '../../src/services/logService.js';
import { LogItem } from '../../src/models/logItem.js';

const mockValue = jest.Mock;

global.fetch = jest.fn();

describe('logService', () => {
    
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('create log with log name should create new log', async () => {
        logService.resetLogs();
        logService.createLog("logName");
        expect(await logService.getLog("logName")).toBeTruthy();
    });

    test('log should add to log', async () => {
        // Setup Test
        logService.resetLogs();
        await logService.createLog("test");
        let item = new TestClass("one", "two");

        // Run Test
        await logService.log("test", new LogItem(TestClass.name, item));

        // Assert Results
        let list = await logService.getLog("test");
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);

        let logItem = list[0];
        expect(logItem).toBeTruthy();
        expect(TestClass.name).toEqual(logItem.type);
        expect(logItem.data).toBeTruthy();
        expect(logItem.timeStamp).toBeTruthy();
    });

    test('log with unknown log name should create log and add to log', async () => {
        // Setup Test
        logService.resetLogs();
        let item = new TestClass("one", "two");

        // Run Test
        await logService.log("test", new LogItem(TestClass.name, item));

        // Assert Results
        let list = await logService.getLog("test");
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);

        let logItem = list[0];
        expect(logItem).toBeTruthy();
        expect(TestClass.name).toEqual(logItem.type);
        expect(logItem.data).toBeTruthy();
        expect(logItem.timeStamp).toBeTruthy();
    });

    test('clear log should delete entries', async () => {
        // Setup Test
        logService.resetLogs();
        await logService.createLog("test");
        let item = new TestClass("one", "two");
        await logService.log("test", new LogItem(TestClass.name, item));

        // Run Test
        await logService.clearLog("test")

        // Assert Results
        let list = await logService.getLog("test");
        expect(list.length).toBe(0);
    });

    test('get log when log does not exist should return empty array', async () => {
        // Setup Test
        logService.resetLogs();

        // Run Test
        let list = await logService.getLog("badLog");

        // Assert Results
        expect(list).toBeTruthy();
        expect(list.length).toBe(0);
    });

    test('clear log when log does not exist should do nothing', async () => {
        // Setup Test
        logService.resetLogs();
        await logService.createLog("goodLog");
        let item = new TestClass("one", "two");
        await logService.log("goodLog", new LogItem(TestClass.name, item));

        // Run Test
        await logService.clearLog("badLog")

        // Assert Results
        let list = await logService.getLog("badLog")
        expect(list.length).toBe(0);

        list = await logService.getLog("goodLog");
        expect(list).toBeTruthy();
        expect(list.length).toBe(1);

        let logItem = list[0];
        expect(logItem).toBeTruthy();
        expect(TestClass.name).toEqual(logItem.type);
        expect(logItem.data).toBeTruthy();
        expect(logItem.timeStamp).toBeTruthy();
    });
});

class TestClass {
    #s1
    #s2

    constructor(s1, s2) {
        this.#s1 = s1;
        this.#s2 = s2;
    }

    get s1() { return this.#s1; }
    set s1(value) {
        this.#s1 = value;
    }

    get s2() { return this.#s2; }
    set s2(value) {
        this.#s2 = value;
    }

    toJSON() {
        return {
            s1: this.#s1,
            s2: this.#s2
        }
    }
}
