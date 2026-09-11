import { useDiscord } from "../zustand/store";

const Counter = () => {
  const count = useDiscord((state) => state.state.count);
  const setDiscordState = useDiscord((state) => state.setDiscordState);

  return (
    <button
      onClick={() => setDiscordState({ count: count + 1, user: "Kenny" })}
    >
      South Park Count: {count}
    </button>
  );
};

export default Counter;
