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
exports.seedActivityPackCollection = exports.testActivityPack2 = exports.testActivityPack1 = void 0;
const endpoint_tests_setup_1 = require("../controllers/endpoint_tests_setup");
const activity_pack_1 = require("./../../src/models/activity_pack");
const activity_seed_1 = require("./activity.seed");
exports.testActivityPack1 = new activity_pack_1.ActivityPack('ActivityPack1Id', 'ActivityPack1', 'ActivityPack1Desc', [activity_seed_1.testActivity1.id]);
exports.testActivityPack2 = new activity_pack_1.ActivityPack('ActivityPack2Id', 'ActivityPack2', 'ActivityPack2Desc', [activity_seed_1.testActivity1.id, activity_seed_1.testActivity2.id]);
const seedActivityPackCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const activityPackCollection = yield (0, endpoint_tests_setup_1.getCollection)('activity-packs');
    const activityPackSeed = [
        Object.assign({}, exports.testActivityPack1),
        Object.assign({}, exports.testActivityPack2),
    ];
    return yield activityPackCollection
        .insertMany(activityPackSeed)
        .then((result) => {
        return result.acknowledged;
    });
});
exports.seedActivityPackCollection = seedActivityPackCollection;
