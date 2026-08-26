import { FaCheck, FaTimes } from "react-icons/fa";

interface EditorActionsProps {
  closeEditor: () => void;
}

export const EditorActions = ({ closeEditor }: EditorActionsProps) => (
  <div className="modal-actions">
    <button aria-label="Save" title="Save" type="submit">
      <FaCheck />
    </button>
    <button
      className="modal-close-button"
      type="button"
      onClick={closeEditor}
      aria-label="Close"
      title="Close"
    >
      <FaTimes />
    </button>
  </div>
);
