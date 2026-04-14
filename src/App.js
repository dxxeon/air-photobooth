import { useState } from "react";
import Home from './pages/home';
import Shoot from './pages/shoot';
import Frame from './pages/frame';
import Download from './pages/download';

function App() {
  const [step, setStep] = useState("home");
  const [photos, setPhotos] = useState([]);
  const [finalImage, setFinalImage] = useState(null);
  return (
    <>
      {step === "home" && <Home setStep={setStep} />}
      {step === "shoot" && (
        <Shoot setStep={setStep} photos={photos} setPhotos={setPhotos} />
      )}
      {step === "frame" && (
        <Frame
          photos={photos}
          setFinalImage={setFinalImage}
          setStep={setStep} />
      )}
      {step === "download" && <Download finalImage={finalImage} />}
    </>
  );
}

export default App;
