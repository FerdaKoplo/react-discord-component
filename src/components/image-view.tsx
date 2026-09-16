import { useState } from "react";
import { blobConfig } from "../zustand/store";
import {
  queryBlobFromDiscord,
  scanForRecentImages,
} from "../hooks/useQueryDiscordBlob";
import Button from "./shared/button";
import { IoIosSearch } from "react-icons/io";
import Title from "./shared/title";
import { FaEye } from "react-icons/fa";
import Loading from "./shared/loading";
import Frame from "./shared/frame";

const ImageDatabaseViewer = () => {
  const [queriedImage, setQueriedImage] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  const [availableIds, setAvailableIds] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleScan = async () => {
    setIsScanning(true);
    const ids = await scanForRecentImages(blobConfig);
    setAvailableIds(ids);
    setIsScanning(false);
  };

  const handleLoadImage = async (id: string) => {
    setIsQuerying(true);
    const result = await queryBlobFromDiscord(blobConfig, id);
    setQueriedImage(result);
    setIsQuerying(false);
  };

  return (
    <div className="flex flex-col gap-6 items-start w-full max-w-3xl">
      <Title text="Search Something..." size="xl" className="font-sans" />

      {queriedImage && (
        <div className="flex flex-col gap-3 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="font-mono text-sm font-medium text-slate-500">
            Query Result:
          </p>

          <Frame src={queriedImage} alt="Queried from Discord" />
        </div>
      )}
      <div className="flex flex-col gap-6 w-full">
        <Button
          onClick={handleScan}
          disabled={isScanning}
          label={isScanning ? "Scanning Cluster..." : "Scan For Recent Images"}
          icon={<IoIosSearch />}
        />

        {availableIds.length > 0 && (
          <div className="flex flex-col gap-4 w-full p-4 border border-slate-200 rounded-lg bg-slate-50">
            <Title
              text="Found Records:"
              size="xl"
              className="font-sans text-slate-700"
            />

            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
              {availableIds.map((id) => (
                <Button
                  key={id}
                  onClick={() => handleLoadImage(id)}
                  disabled={isQuerying}
                  label={`Image with ${id}`}
                  icon={<FaEye />}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isQuerying && <Loading label="Quering your pictures..." />}
    </div>
  );
};

export default ImageDatabaseViewer;
