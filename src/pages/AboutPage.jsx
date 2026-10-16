import SectionHeader from "../components/SectionHeader/SectionHeader";

export default function AboutPage() {
  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px 40px",
      }}
    >
      <SectionHeader
        title="About PCBuild"
        subtitle="A practical place to explore and plan your next PC build."
      />
      <section
        aria-label="About the project"
        style={{
          padding: "24px",
          border: "1px solid var(--border-color)",
          background: "var(--bg-card)",
          color: "var(--text-primary)",
        }}
      >
        <p>
          PCBuild helps you find the components you need for a custom computer.
          Our goal is to make exploring PC hardware and planning a build simple
          and convenient.
        </p>
        <h2>What you can do</h2>
        <ul>
          <li>Browse processors, graphics cards, memory, storage, and more.</li>
          <li>Search, filter, and sort components to find the right options.</li>
          <li>Compare choices and plan the components for your PC build.</li>
        </ul>
      </section>
    </main>
  );
}
