export default function Home({ setStep }) {
    return (
        <div style={{ textAlign: "center" }}>
            <h1> air photobooth </h1>
            <button onClick={() => setStep("shoot")}>start</button>
        </div>
    );
}