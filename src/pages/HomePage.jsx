import CartSection from "../components/CartSection/CartSection";
import Container from "../components/Container/Container";
import HeroSection from "../components/HeroSection/HeroSection";
import OfferCountdown from "../components/OfferCountdown/OfferCountdown";
import ReviewsSection from "../components/ReviewsSection/ReviewsSection";
import StatsSection from "../components/StatsSection/StatsSection";

export default function HomePage({
  isAuthenticated,
  productsCount,
  categoriesCount,
  favoritesCount,
  testimonials,
  catalogSection,
}) {
  return (
    <Container>
      <OfferCountdown />
      <HeroSection
        heading="Find the right components for your PC"
        subheading="Explore processors, graphics cards, memory, storage, and more for your next build."
        buttonText="Explore components"
      />

      {isAuthenticated && <CartSection />}

      <StatsSection
        productsCount={productsCount}
        categoriesCount={categoriesCount}
        favoritesCount={favoritesCount}
      />

      {catalogSection}

      <ReviewsSection testimonials={testimonials} />
    </Container>
  );
}
