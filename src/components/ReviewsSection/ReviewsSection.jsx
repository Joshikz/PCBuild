import SectionHeader from "../SectionHeader/SectionHeader";
import TestimonialCard from "../TestimonialCard/TestimonialCard";

export default function ReviewsSection({ testimonials }) {
  return (
    <section className="reviews-section">
      <SectionHeader
        title="Customer Reviews"
        subtitle="Feedback from people who have built their PCs."
      />
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} {...testimonial} />
        ))}
      </div>
    </section>
  );
}
