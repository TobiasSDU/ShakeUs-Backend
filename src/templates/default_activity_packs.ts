import { ActivityPack } from "../models/activity_pack";

import { ActivityPackService } from "./../services/activity_pack_service";
import { generateUUID } from "./../util/uuid_generator";
import {
  createActivitiesFromTemplate,
  defaultActivities,
} from "./default_activities";

const defaultActivityPack1 = new ActivityPack(
  "AP1",
  "The Classics",
  "Fun party games and activities everyone should know.",
  ["AP1A1", "AP1A2", "AP1A3", "AP1A4", "AP1A5", "AP1A6"]
);

const defaultActivityPack2 = new ActivityPack(
  "AP2",
  "Standard Activities",
  "Easy activities for everyone.",
  ["AP2A1", "AP2A2", "AP2A3", "AP2A4", "AP2A5", "AP2A6"]
);

const defaultActivityPack3 = new ActivityPack(
  "AP3",
  "Liver Damage",
  "An activity pack filled with fun drinking games.",
  ["AP3A1", "AP3A2", "AP3A3", "AP3A4"]
);

export const defaultActivityPacks: ActivityPack[] = [
  defaultActivityPack1,
  defaultActivityPack2,
  defaultActivityPack3,
];

export const createActivityPackFromTemplate = async (
  activityPackId: string,
  startTime: number
) => {
  const activityPack = getActivityPackById(activityPackId);

  if (activityPack) {
    activityPack.id = generateUUID();

    const newActivityIds = await createActivitiesFromTemplate(
      activityPack.getActivities,
      startTime
    );
    updateActivityIds(activityPack, newActivityIds);

    await ActivityPackService.createActivityPack(activityPack);

    return activityPack.id;
  }

  return "";
};

const getActivityPackById = (activityPackId: string) => {
  for (let i = 0; i < defaultActivityPacks.length; i++) {
    if (defaultActivityPacks[i].id == activityPackId) {
      return Object.assign(
        Object.getPrototypeOf(defaultActivityPacks[i]),
        defaultActivityPacks[i]
      );
    }
  }

  return null;
};

const updateActivityIds = (
  activityPack: ActivityPack,
  newActivityIds: string[]
) => {
  activityPack.setActivities = [];
  for (let i = 0; i < newActivityIds.length; i++) {
    activityPack.addActivity(newActivityIds[i]);
  }
};
