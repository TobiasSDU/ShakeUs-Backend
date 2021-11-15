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
exports.createActivitiesFromTemplate = exports.defaultActivities = void 0;
const activity_1 = require("../models/activity");
const activity_service_1 = require("./../services/activity_service");
const uuid_generator_1 = require("./../util/uuid_generator");
exports.defaultActivities = [
    // ActivityPack1
    new activity_1.Activity("AP1A1", "Drink The Beer", "Get a beer in the bar and drink it as fast as possible. The quickest person to empty their beer can get a free drink.", Date.now() + 1000 * 60 * 30),
    new activity_1.Activity("AP1A2", "Get 2 Know", "Find <NAME> and explain at least two things about yourself.", Date.now() + 1000 * 60 * 60),
    new activity_1.Activity("AP1A3", "Bong", "Start a game of Beer pong with <RANDOM_NAME>.", Date.now() + 1000 * 60 * 90),
    new activity_1.Activity("AP1A4", "Flipping Cups", "Form two teams, equal in players. With a drink filled in a cup, drink it, place it on the side of the table and flip it. The cup must be flipped and not fall over when landing on the table.", Date.now() + 1000 * 60 * 120),
    new activity_1.Activity("AP1A5", "Never Have I Ever", "You know what this is about. Never have you ever done something without drinking :D", Date.now() + 1000 * 60 * 150),
    new activity_1.Activity("AP1A6", "Straight Face", "When you've gotten drunk, you must keep a straight face and write sentences (inappropriate or funny) on small pieces of paper. The first one to lose their straight face, drinks.", Date.now() + 1000 * 60 * 180),
    // Activity Pack 2
    new activity_1.Activity("AP2A1", "Fishing Trip", "With a barrel full of water, fish an apple up without touching with your hands.", Date.now() + 1000 * 60 * 30),
    new activity_1.Activity("AP2A2", "Keep your hat on", "Keep your hat on until next task. If you drop/lose your hat, you drink.", Date.now() + 1000 * 60 * 60),
    new activity_1.Activity("AP2A3", "Music Singalong", "If you don't know the lyrics, drink.", Date.now() + 1000 * 60 * 90),
    new activity_1.Activity("AP2A4", "Birth Month", "Convert the current time to month. If the month is your birth month, take a sip. Example: Clock is 11PM. the person is born in november. Takes a sip.", Date.now() + 1000 * 60 * 120),
    new activity_1.Activity("AP2A5", "Rock, Paper, Scissors", "5 rounds of Rock, Paper, Scissors. Take a sip each round you lose.", Date.now() + 1000 * 60 * 150),
    new activity_1.Activity("AP2A6", "Chair Dance", "You all know this one. Take a shot when you lose.", Date.now() + 1000 * 60 * 180),
    // Activity Pack 3
    new activity_1.Activity("AP3A1", "Limbo Shots", "Limbo, but drink every time it's your turn.", Date.now() + 1000 * 60 * 30),
    new activity_1.Activity("AP3A2", "Meyer!", "Two dice. Lose it and drink it.", Date.now() + 1000 * 60 * 60),
    new activity_1.Activity("AP3A3", "Reversed Buffalo", "For the rest of the party, drink with your non-dominant hand. Whenever someone catches you drinking with your dominant hand, bottoms up.", Date.now() + 1000 * 60 * 90),
    new activity_1.Activity("AP3A4", "Most likely to...", "A most-likely question is asked. Count to three and everyone points at the person most likely to X. Drink the amount of pointed fingers at you.", Date.now() + 1000 * 60 * 120),
];
const createActivitiesFromTemplate = (activityIds) => __awaiter(void 0, void 0, void 0, function* () {
    const newActivityIds = [];
    const newActivities = [];
    for (let i = 0; i < activityIds.length; i++) {
        const activity = getActivityById(activityIds[i]);
        if (activity) {
            activity.id = (0, uuid_generator_1.generateUUID)();
            newActivityIds.push(activity.id);
            newActivities.push(new activity_1.Activity(activity.id, activity.getTitle, activity.getDescription, Date.now() + 1000 * 60 * 30 * (i + 1)));
        }
    }
    yield activity_service_1.ActivityService.createManyActivities(newActivities);
    return newActivityIds;
});
exports.createActivitiesFromTemplate = createActivitiesFromTemplate;
const getActivityById = (activityId) => {
    for (let i = 0; i < exports.defaultActivities.length; i++) {
        if (exports.defaultActivities[i].id == activityId) {
            return Object.assign(Object.getPrototypeOf(exports.defaultActivities[i]), exports.defaultActivities[i]);
        }
    }
    return null;
};
