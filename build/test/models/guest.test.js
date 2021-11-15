"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guest_1 = require("../../src/models/guest");
const uuid_generator_1 = require("../../src/util/uuid_generator");
const testName = 'TestGuest';
const testToken = 'TestToken';
const originalGuest = new guest_1.Guest((0, uuid_generator_1.generateUUID)(), testName, testToken);
describe('guest model methods return expected values', () => {
    let testGuest;
    beforeEach(() => {
        testGuest = Object.assign(Object.getPrototypeOf(originalGuest), originalGuest);
    });
    it('returns a vaild uuid', () => {
        const uuidFormat = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
        expect(testGuest.id).toMatch(uuidFormat);
    });
    it('returns the correct test name', () => {
        expect(testGuest.getName).toEqual(testName);
    });
    it('return the correct notification token', () => {
        expect(testGuest.getNotificationToken).toEqual(testToken);
    });
});
