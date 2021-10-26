import { defaultActivityPack } from '../templates/default_activity_pack.js';

let activityPackContainer = document.getElementById('default-activity-pack');

let id = document.createElement('p');
id.innerHTML = `Id: ${defaultActivityPack._id}`;

let title = document.createElement('p');
title.innerHTML = `Title: ${defaultActivityPack.title}`;

let description = document.createElement('p');
description.innerHTML = `Description: ${defaultActivityPack.description}`;

let activities = document.createElement('p');
activities.innerHTML = `Activities: ${defaultActivityPack.activities}`;

let activityContainer = document.createElement('div');

activityContainer.appendChild(id);
activityContainer.appendChild(title);
activityContainer.appendChild(description);
activityContainer.appendChild(activities);

activityPackContainer.appendChild(activityContainer);
