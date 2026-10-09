import SectionHeader from "../SectionHeader/SectionHeader";
import TestimonialCard from "../TestimonialCard/TestimonialCard";
import useAuth from "../../context/useAuth";

export default function ReviewsSection({ testimonials }) {
  const { user, isAuthenticated } = useAuth();

  return (
    <section className="reviews-section" id="reviews">
      <SectionHeader
        title="Customer Reviews"
        subtitle="Feedback from people who have built their PCs."
      />
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} {...testimonial} />
        ))}
      </div>
      <p role="status">
        {isAuthenticated
          ? `Welcome, ${user.name}. You are signed in.`
          : "Log in to share your own review."}
      </p>
    </section>
  );
}
