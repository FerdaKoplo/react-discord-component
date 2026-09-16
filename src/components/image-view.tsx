import { useState } from "react";
import { blobConfig } from "../zustand/store";
import {
  queryBlobFromDiscord,
  scanForRecentImages,
} from "../hooks/useQueryDiscordBlob";
import Button from "./shared/button";
import { IoIosSearch } from "react-icons/io";
import Title from "./shared/title";

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
    <div className="flex flex-col gap-12 items-start ">
      <Title text="GO Search Something" size="xl" className="font-sans" />
      <div>
        <Button
          onClick={handleScan}
          disabled={isScanning}
          label={isScanning ? "Scanning Cluster..." : "Scan For Recent Images"}
          icon={<IoIosSearch />}
        />
        {availableIds.length > 0 && (
          <div>
            <p>Found Records:</p>
            {availableIds.map((id) => (
              <button
                key={id}
                onClick={() => handleLoadImage(id)}
                disabled={isQuerying}
              >
                Image with '{id}'
              </button>
            ))}
          </div>
        )}
      </div>

      {isQuerying && <p>Reassembling shards...</p>}

      {queriedImage && (
        <div>
          <p>Query Result:</p>
          <img src={queriedImage} alt="Queried from Discord" />
        </div>
      )}
    </div>
  );
};

export default ImageDatabaseViewer;
