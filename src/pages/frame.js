import { useState, useEffect } from "react";

export default function Select({ photos, setFinalImage, setStep }) {
  const [frame, setFrame] = useState("/frames/frame-kor.png");
  const [previewUrl, setPreviewUrl] = useState(null);

  const frameList = [
    { id: "kor", thumbnail: "/frames/thumb-kor.png", src: "/frames/frame-kor.png", label: "KOR" },
    { id: "usa", thumbnail: "/frames/thumb-usa.png", src: "/frames/frame-usa.png", label: "USA" },
    { id: "chn", thumbnail: "/frames/thumb-chn.png", src: "/frames/frame-chn.png", label: "CHN" },
    { id: "jpn", thumbnail: "/frames/thumb-jpn.png", src: "/frames/frame-jpn.png", label: "JPN" }
  ]

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 351;
    canvas.height = 1010;

    const frameImg = new Image();
    frameImg.src = frame;
    frameImg.onload = () => {
      let loadedCount = 0;
      const yPositions = [126, 340, 553, 767];
      const xPosition = 26;
      const photoWidth = 300;
      const photoHeight = 188;

      photos.forEach((src, i) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          ctx.drawImage(img, xPosition, yPositions[i], photoWidth, photoHeight);
          loadedCount++;
          if (loadedCount === photos.length) {
            ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
            setPreviewUrl(canvas.toDataURL("image/png"));
          }
        };
      });
    };
  }, [frame, photos]);

  const makeFinalImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scale = 2;
    canvas.width = 351*scale;
    canvas.height = 1010*scale;

    const frameImg = new Image();
    frameImg.src = frame;

    frameImg.onload = () => {
      let loadedCount = 0;

      const yPositions = [126, 340, 553, 767].map(y=>y*scale);
      const xPosition = 26*scale;
      const photoWidth = 300*scale;
      const photoHeight = 188*scale;

      photos.forEach((src, i) => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
          ctx.drawImage(img, xPosition, yPositions[i], photoWidth, photoHeight);

          loadedCount++;

          if (loadedCount === photos.length) {
            ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

            const final = canvas.toDataURL("image/png");
            setFinalImage(final);
            setStep("download");
          }
        };
      });
    };
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "30px" }}>프레임 선택</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "60px", alignItems: "flex-start" }}>
        
        {/* 왼쪽: 2x2 프레임 선택창 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          width: "400px"
        }}>
          {frameList.map((f) => (
            <div
              key={f.id}
              onClick={() => setFrame(f.src)}
              style={{
                cursor: "pointer",
                borderRadius: "12px",
                overflow: "hidden",
                border: frame === f.src ? "5px solid #3b82f6" : "5px solid transparent",
                transition: "all 0.2s ease",
                transform: frame === f.src ? "scale(1.02)" : "scale(1)",
                backgroundColor: "#f3f4f6"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <img src={f.thumbnail} alt={f.label} style={{ width: "100%", display: "block", height: "auto" }} />
              <p style={{ margin: "10px 0", fontWeight: "bold" }}>{f.label}</p>
            </div>
          ))}
        </div>

        {/* 오른쪽: 실시간 미리보기 */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ marginBottom: "15px", color: "#666" }}>미리보기</h3>
          <div style={{
            width: "250px", // 미리보기 크기 조절
            height: "auto",
            border: "1px solid #ddd",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            borderRadius: "5px",
            backgroundColor: "#fff",
            minHeight: "400px"
          }}>
            {previewUrl && <img src={previewUrl} alt="preview" style={{ width: "100%" }} />}
          </div>
          
          <button
            onClick={makeFinalImage}
            style={{
              marginTop: "30px",
              padding: "15px 60px",
              fontSize: "1.2rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background 0.3s"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
          >
            선택 완료
          </button>
        </div>

      </div>
    </div>
  );
}