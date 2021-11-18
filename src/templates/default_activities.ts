import { Activity } from "../models/activity";
import { ActivityService } from "./../services/activity_service";
import { generateUUID } from "./../util/uuid_generator";

export const defaultActivities: Activity[] = [
  // ActivityPack1
  new Activity(
    "AP1A1",
    "Drink The Beer",
    "Get a beer in the bar and drink it as fast as possible. The quickest person to empty their beer can get a free drink.",
    0
  ),
  new Activity(
    "AP1A2",
    "Get 2 Know",
    "Find <NAME> and explain at least two things about yourself.",
    0
  ),
  new Activity(
    "AP1A3",
    "Bong",
    "Start a game of Beer pong with <RANDOM_NAME>.",
    0
  ),
  new Activity(
    "AP1A4",
    "Flipping Cups",
    "Form two teams, equal in players. With a drink filled in a cup, drink it, place it on the side of the table and flip it. The cup must be flipped and not fall over when landing on the table.",
    0
  ),
  new Activity(
    "AP1A5",
    "Never Have I Ever",
    "You know what this is about. Never have you ever done something without drinking :D",
    0
  ),
  new Activity(
    "AP1A6",
    "Straight Face",
    "When you've gotten drunk, you must keep a straight face and write sentences (inappropriate or funny) on small pieces of paper. The first one to lose their straight face, drinks.",
    0
  ),

  // Activity Pack 2
  new Activity(
    "AP2A1",
    "Fishing Trip",
    "With a barrel full of water, fish an apple up without touching with your hands.",
    0
  ),
  new Activity(
    "AP2A2",
    "Keep your hat on",
    "Keep your hat on until next task. If you drop/lose your hat, you drink.",
    0
  ),
  new Activity(
    "AP2A3",
    "Music Singalong",
    "If you don't know the lyrics, drink.",
    0
  ),
  new Activity(
    "AP2A4",
    "Birth Month",
    "Convert the current time to month. If the month is your birth month, take a sip. Example: Clock is 11PM. the person is born in november. Takes a sip.",
    0
  ),
  new Activity(
    "AP2A5",
    "Rock, Paper, Scissors",
    "5 rounds of Rock, Paper, Scissors. Take a sip each round you lose.",
    0
  ),
  new Activity(
    "AP2A6",
    "Chair Dance",
    "You all know this one. Take a shot when you lose.",
    0
  ),

  // Activity Pack 3
  new Activity(
    "AP3A1",
    "Limbo Shots",
    "Limbo, but drink every time it's your turn.",
    0
  ),
  new Activity("AP3A2", "Meyer!", "Two dice. Lose it and drink it.", 0),
  new Activity(
    "AP3A3",
    "Reversed Buffalo",
    "For the rest of the party, drink with your non-dominant hand. Whenever someone catches you drinking with your dominant hand, bottoms up.",
    0
  ),
  new Activity(
    "AP3A4",
    "Most likely to...",
    "A most-likely question is asked. Count to three and everyone points at the person most likely to X. Drink the amount of pointed fingers at you.",
    0
  ),
];

export const createActivitiesFromTemplate = async (
  activityIds: string[],
  startTime: number
) => {
  const newActivityIds: string[] = [];
  const newActivities: Activity[] = [];

  for (let i = 0; i < activityIds.length; i++) {
    const activity = getActivityById(activityIds[i]);

    if (activity) {
      activity.id = generateUUID();
      newActivityIds.push(activity.id);

      newActivities.push(
        new Activity(
          activity.id,
          activity.getTitle,
          activity.getDescription,
          startTime + 1000 * 60 * 30 * (i + 1)
        )
      );
    }
  }

  await ActivityService.createManyActivities(newActivities);

  return newActivityIds;
};

const getActivityById = (activityId: string) => {
  for (let i = 0; i < defaultActivities.length; i++) {
    if (defaultActivities[i].id == activityId) {
      return Object.assign(
        Object.getPrototypeOf(defaultActivities[i]),
        defaultActivities[i]
      );
    }
  }

  return null;
};
