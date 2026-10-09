import SectionHeader from "../SectionHeader/SectionHeader";
import StatCard from "../StatCard/StatCard";

export default function StatsSection({
  productsCount,
  categoriesCount,
  favoritesCount,
}) {
  return (
    <section className="stats-section" id="statistics">
      <SectionHeader
        title="Catalog Statistics"
        subtitle="Current store metrics"
        align="center"
      />
      <div className="stats-grid">
        <StatCard title="Products in Catalog" value={productsCount} />
        <StatCard title="Hardware Categories" value={categoriesCount} />
        <StatCard title="Favorite Products" value={favoritesCount} />
      </div>
    </section>
  );
}
