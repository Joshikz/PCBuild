import Button from "../Button/Button";
import Modal from "../Modal/Modal";

export default function AuthPromptModal({ isOpen, onClose, onLogin }) {
  return (
    <Modal isOpen={isOpen} title="Log in required" onClose={onClose}>
      <p>
        You need to log in before using favorites, the cart, or purchase
        actions.
      </p>
      <Button text="Log in" onClick={onLogin} />
    </Modal>
  );
}
