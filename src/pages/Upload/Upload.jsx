import React, { useState } from "react";
import styles from "./upload.module.css";


const Upload = () => {
  const [imageFile, setImageFile] = useState(null);
   const [highQualityFile, setHighQualityFile] = useState(null);
    const [lowQualityFile, setLowQualityFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageBlobId, setImageBlobId] = useState(null);
  const [highQualityBlobId, setHighQualityBlobId] = useState(null);
  const [lowQualityBlobId, setLowQualityBlobId] = useState(null);

 



  const publisherUrl = "https://publisher.walrus-testnet.walrus.space";


  const uploadToWalrus = async (e) => {
    e.preventDefault();
    setLoading(true)

    

    try {
      const [res1, res2, res3] = await Promise.all([
        fetch(`${publisherUrl}/v1/blobs?epochs=5`,{
          method: "PUT",
          headers: {
            "Content-Type": lowQualityFile.type || "application/octet-stream",
          },
          body: lowQualityFile,
        }),
        fetch(`${publisherUrl}/v1/blobs?epochs=5`,{
          method: "PUT",
          headers: {
            "Content-Type": highQualityFile.type || "application/octet-stream",
          },
          body: highQualityFile,
        }),
        fetch(`${publisherUrl}/v1/blobs?epochs=5`,{
          method: "PUT",
          headers: {
            "Content-Type": imageFile.type || "application/octet-stream",
          },
          body: imageFile,
        }),
      ]);

      const [result1, result2, result3] = await Promise.all([
        res1.json(), 
        res2.json(), 
        res3.json()]);

      const [blobId1, blobId2, blobId3] = [
        result1?.newlyCreated?.blobObject?.blobId || result1?.alreadyCertified?.blobId,
        result2?.newlyCreated?.blobObject?.blobId || result2?.alreadyCertified?.blobId, 
        result3?.newlyCreated?.blobObject?.blobId || result3?.alreadyCertified?.blobId
      ]

      setLowQualityBlobId(blobId1)
      setHighQualityBlobId(blobId2)
      setImageBlobId(blobId3)

    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };
   
  

  return (
    <div className={styles.uploadContainer}>
    
      <div className={styles.uploadContent}>
        <div className={styles.uploadCard}>
          <div className={styles.uploadForm}>
            <h2 className={styles.uploadTitle}>Upload to Walrus</h2>
            <input
              type="file"
              onChange={(e) => setLowQualityFile(e.target.files[0])}
              className={styles.uploadInput}
            />

            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              className={styles.uploadInput}
            />

            <input
              type="file"
              onChange={(e) => setHighQualityFile(e.target.files[0])}
              className={styles.uploadInput}
            />
          </div>
          <button
            onClick={uploadToWalrus}
            className={styles.uploadButton}
            disabled={
              !lowQualityFile || !highQualityFile || !imageFile || loading
            }
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>

      <div className={styles.uploadExample}>
        {highQualityBlobId && lowQualityBlobId && imageBlobId && (
          <div>
            <div>
              <img
                src={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${imageBlobId}`}
                alt="Uploaded Image"
              />
            </div>
            <div>
              <audio
                src={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${lowQualityBlobId}`}
                controls
              ></audio>
              <audio
                src={`https://aggregator.walrus-testnet.walrus.space/v1/blobs/${highQualityBlobId}`}
                controls
              ></audio>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
