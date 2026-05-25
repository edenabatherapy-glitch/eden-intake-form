export default function Home() {
  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>Eden ABA Therapy</h1>

      <a
        href="/intake.html"
        style={{
          color: "green",
          fontSize: "20px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Open Intake Form
      </a>
    </main>
  );
}