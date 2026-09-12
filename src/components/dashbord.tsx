import type { ChangeEvent } from "react";
import { useDiscordBlob, useDiscordState } from "../zustand/store";
import ImageDatabaseViewer from "./image-view";
import Title from "./shared/title";

const Dashboard = () => {
  const { count, user } = useDiscordState((state) => state.state);
  const setDiscordState = useDiscordState((state) => state.setDiscordState);

  const latestImage = useDiscordBlob((state) => state.latestImage);
  const isUploading = useDiscordBlob((state) => state.isUploading);
  const uploadImageToDiscord = useDiscordBlob(
    (state) => state.uploadImageToDiscord,
  );

  const handleIncrement = () => {
    setDiscordState({
      count: count + 1,
      user: count % 2 === 0 ? "Cartman" : "Kenny",
    });
  };

  const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImageToDiscord(file);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div>
        <Title text="Stick It Right Here" />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelected}
          disabled={isUploading}
        />

        {isUploading && (
          <p>Sharding image and streaming chunks via the South Park choir...</p>
        )}

        {latestImage && (
          <div>
            <p>Reassembled successfully from Discord Gateway:</p>
            <img src={latestImage} alt="Reconstructed from Lyrical Shards" />
          </div>
        )}
      </div>

      <div>
        <ImageDatabaseViewer />
      </div>
    </div>
  );
};

export default Dashboard;
