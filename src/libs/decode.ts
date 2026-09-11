export const decodeStateFromSouthPark = <T>(lyricMessage: string): T | null => {
  try {
    const match = lyricMessage.match(/\[(.*?)\]/);
    if (!match || !match[1]) throw new Error("No Payload Found");
    return JSON.parse(atob(match[1])) as T;
  } catch (err) {
    console.error("Contamination detected:", err);
    return null;
  }
};
