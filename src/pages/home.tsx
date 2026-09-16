import type { ChangeEvent } from "react";
import ImageDatabaseViewer from "../components/image-view";
import Title from "../components/shared/title";
import { useDiscordBlob } from "../zustand/store";
import Input from "../components/shared/input";
import { FaFile } from "react-icons/fa";
import FileInput from "../components/shared/file-input";

const Home = () => {
  const latestImage = useDiscordBlob((state) => state.latestImage);
  const isUploading = useDiscordBlob((state) => state.isUploading);
  const uploadImageToDiscord = useDiscordBlob(
    (state) => state.uploadImageToDiscord,
  );

  // const handleIncrement = () => {
  //   setDiscordState({
  //     count: count + 1,
  //     user: count % 2 === 0 ? "Cartman" : "Kenny",
  //   });
  // };

  const handleFileSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImageToDiscord(file);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen ">
      <div className="flex flex-col items-start justify-start gap-12">
        <Title text="Stick It Right Below Here" size="4xl" />
        <FileInput
          accept="image/*"
          onChange={handleFileSelected}
          disabled={isUploading}
          icon={<FaFile />}
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

      <ImageDatabaseViewer />
    </div>
  );
};

export default Home;
