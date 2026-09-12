import { useState } from "react";
import { blobConfig, useDiscordBlob } from "../zustand/store";
import {
  queryBlobFromDiscord,
  scanForRecentImages,
} from "../hooks/useQueryDiscordBlob";

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
    <div>
      <h3>NoSQL Database Inspector</h3>

      <div>
        <button onClick={handleScan} disabled={isScanning}>
          {isScanning ? "Scanning Cluster..." : "Scan For Recent Images"}
        </button>

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
