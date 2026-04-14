export default function Result({ finalImage }) {
  return (
    <div style={{ textAlign: "center" }}>
      <h2>결과</h2>
      <img src={finalImage} alt="result" width="300" />
      <br />
      <a href={finalImage} download="photo.png">
        다운로드
      </a>
    </div>
  );
}