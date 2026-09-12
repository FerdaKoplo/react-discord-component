import { useDiscordState } from "../zustand/store";

const Counter = () => {
  const count = useDiscordState((state) => state.state.count);
  const setDiscordState = useDiscordState((state) => state.setDiscordState);

  return (
    <button
      onClick={() => setDiscordState({ count: count + 1, user: "Kenny" })}
    >
      South Park Count: {count}
    </button>
  );
};

export default Counter;
