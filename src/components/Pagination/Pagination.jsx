import Button from "../Button/Button";

export default function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrev,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        justifyContent: "center",
        margin: "24px 0",
      }}
    >
      <Button text="Previous" isDisabled={currentPage <= 1} onClick={onPrev} />
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        text="Next"
        isDisabled={currentPage >= totalPages}
        onClick={onNext}
      />
    </div>
  );
}
