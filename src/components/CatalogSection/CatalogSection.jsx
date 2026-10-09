import Card from "../Card/Card";
import CategoryFilter from "../CategoryFilter/CategoryFilter";
import Pagination from "../Pagination/Pagination";
import SearchBar from "../SearchBar/SearchBar";
import SectionHeader from "../SectionHeader/SectionHeader";
import SortDropdown from "../SortDropdown/SortDropdown";

export default function CatalogSection({
  categories,
  isLoading,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  selectedCategory,
  setSelectedCategory,
  products,
  favorites,
  onAddToCart,
  onBuyNow,
  onToggleFavorite,
  onQuickView,
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) {
  return (
    <section className="catalog-section" id="catalog">
      <SectionHeader
        title="Hardware Catalog"
        subtitle="Find components for your next PC build."
      />

      {isLoading ? (
        <p role="status">Loading Catalog...</p>
      ) : (
        <>
          <div className="catalog-tools">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          <CategoryFilter
            categories={["All", ...categories]}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <Card
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                  onToggleFavorite={onToggleFavorite}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          ) : (
            <p role="status">No products found for your search.</p>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={onPrev}
            onNext={onNext}
          />
        </>
      )}
    </section>
  );
}
