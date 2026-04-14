import { useEffect, useRef, useState } from "react";

export default function Shoot({ setStep, photos, setPhotos}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const timerRef = useRef(null);

    const [count, setCount] = useState(2);
    const [shotIndex, setShotIndex] = useState(-1);

    const filter = "brightness(1.1) contrast(1.2)";

    /*   카메라   */
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true}).then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        });
        return () => {
            clearInterval(timerRef.current);
        };
    }, []);

    /* 타이머 1 - 숫자만 감소 */
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setCount((prev) => (prev > 0 ? prev - 1 : prev));
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    /* 타이머 2 - 카운트다운 감시 및 사진 촬영 */
    useEffect(() => {
        if (count === 0) {
            if (shotIndex === -1) {
                setShotIndex(0); setCount(2);
            } else if (shotIndex < 4) {
                capturePhoto(shotIndex);
            }
        }
    }, [count]);

    /*   타이머   */
    // useEffect(() => {
    //     clearInterval(timerRef.current);

    //     timerRef.current = setInterval(() => {
    //        setCount((prev) => {
    //         if (prev === 1) {
    //             if (shotIndex === -1) {
    //                 setShotIndex(0); return 3;
    //             } else {
    //                 capturePhoto(shotIndex); return 3;
    //             }
    //         }
    //         return prev - 1;
    //        });
    //     }, 1000);

    //     return () => clearInterval(timerRef.current);
    // }, [shotIndex]);

    /*   사진 촬영   */
    const capturePhoto = (currentIndex) => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        /* 촬영화면->완성본 비율 유지 로직 */
        const video = videoRef.current;

        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const targetW = 300;
        const targetH = 188;
        const targetRatio = targetW / targetH;
        const videoRatio = vw / vh;

        let sx, sy, sw, sh;

        if (videoRatio > targetRatio) { // 좌우 crop
            sh = vh; sw = vh * targetRatio;
            sx = (vw - sw) / 2; sy = 0;
        } else { // 위아래 crop
            sw = vw; sh = vw / targetRatio;
            sx = 0; sy = (vh - sh) / 2;
        }

        canvas.width = targetW;
        canvas.height = targetH;

        /* 좌우 반전 로직 */
        ctx.save(); // 현재 상태 저장
        ctx.translate(canvas.width, 0); // 캔버스 원점을 오른쪽 끝으로 이동
        ctx.scale(-1, 1); // 좌우 반전

        ctx.filter = filter;

        // crop & resize
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, targetW, targetH);
        ctx.restore();
        ctx.filter = "none";

        const image = canvas.toDataURL("image/png");
        setPhotos((prev) => [...prev, image]);

        if (currentIndex === 3) {
            clearInterval(timerRef.current);
            setStep("frame");
        } else {
            setShotIndex(currentIndex+ 1);
            setCount(3);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px"}} >
            {shotIndex === -1 ? (
                <h2> 촬영 준비 중 ... </h2>
            ) : (
                <h2>촬영 중 ({shotIndex + 1}/4)</h2>
            )}
            <h1 style={{color:shotIndex === -1 ? "blue" : "red"}}>{count === 0 ? "0" : count}</h1>

            {/* video crop */}
            <div style={{width: "800px", height: "501px", overflow: "hidden", margin: "0 auto", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", backgroundColor: "#000", border: "5px solid #fff", position: "relative"}}>
                <video ref={videoRef} autoPlay playsInline style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) scaleX(-1)", width: "100%", height: "100%", objectFit: "cover", filter : filter}}/>
            </div>
            
            <canvas ref={canvasRef} width="300" height="188" style={{ display: "none" }} />
        </div>
    );
}