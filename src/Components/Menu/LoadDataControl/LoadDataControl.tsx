import { useCallback, useState } from "react";
import { FaUpload } from "react-icons/fa";
import type { AppData } from "../../../types";
import { Modal } from "../../EventGrid/Modal";
import { UploadData } from "../../UploadData/UploadData";

interface LoadDataControlProps {
  onLoad: (data: AppData) => void;
}

export const LoadDataControl = ({ onLoad }: LoadDataControlProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);
  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);
  const loadData = useCallback(
    (data: AppData) => {
      onLoad(data);
      closeDialog();
    },
    [closeDialog, onLoad],
  );

  return (
    <>
      <button aria-label="Load" title="Load" onClick={openDialog}>
        <FaUpload />
      </button>
      <Modal isOpen={isOpen} onClose={closeDialog} title="Load source data">
        {isOpen && (
          <>
            <UploadData onUpload={loadData} />
            <div className="modal-actions">
              <button className="modal-close-button" type="button" onClick={closeDialog}>
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};
