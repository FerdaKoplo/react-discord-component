import type { ChangeEvent } from "react";
import ImageDatabaseViewer from "../components/image-view";
import Title from "../components/shared/title";
import { useDiscordBlob } from "../zustand/store";
import Input from "../components/shared/input";
import { FaFile } from "react-icons/fa";
import FileInput from "../components/shared/file-input";
import Loading from "../components/shared/loading";
import Frame from "../components/shared/frame";

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
    <div className="flex flex-col justify-eenter bg-neutral-50  items-center">
      <div className="flex gap-20  justify-center items-center  w-full min-h-screen ">
        <ImageDatabaseViewer />
        <div className="flex flex-col items-start justify-start gap-8 ">
          <Title text="Stick It Right Below Here" size="4xl" />
          <FileInput
            accept="image/*"
            onChange={handleFileSelected}
            disabled={isUploading}
            icon={<FaFile />}
          />

          {isUploading && (
            <Loading label="Sharding image and streaming chunks..." />
          )}

          {latestImage && (
            <Frame src={latestImage} alt="Reconstructed from Lyrical Shards" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
