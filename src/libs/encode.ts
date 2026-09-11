import { SOUTH_PARK_LINES } from "../constants/lyric";

export const encodeStatetoSouthPark = <T>(stateObj: T) => {
  const jsonString = JSON.stringify(stateObj);
  return [
    SOUTH_PARK_LINES[0],
    `Friendly faces [${btoa(jsonString)}] everwhere humble folks without temptation,`,
    SOUTH_PARK_LINES[2],
    SOUTH_PARK_LINES[3],
  ].join("\n");
};
