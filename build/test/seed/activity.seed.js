"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedActivityCollection = exports.testActivity2 = exports.testActivity1 = void 0;
const endpoint_tests_setup_1 = require("../controllers/endpoint_tests_setup");
const activity_1 = require("./../../src/models/activity");
exports.testActivity1 = new activity_1.Activity('Activity1Id', 'Activity1', 'Activity1Desc', Date.now());
exports.testActivity2 = new activity_1.Activity('Activity2Id', 'Activity2', 'Activity2Desc', Date.now() + 1);
const seedActivityCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const activitiesCollection = yield (0, endpoint_tests_setup_1.getCollection)('activities');
    const activitySeed = [Object.assign({}, exports.testActivity1), Object.assign({}, exports.testActivity2)];
    return yield activitiesCollection
        .insertMany(activitySeed)
        .then((result) => {
        return result.acknowledged;
    });
});
exports.seedActivityCollection = seedActivityCollection;
