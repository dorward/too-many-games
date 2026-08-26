import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./uploadData.css";
import { parseFile } from "../../data/parseFile";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";
import { FileRejectionItems } from "./FileRejectionItems";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "An unknown parsing error occurred";

export const UploadData = () => {
  const { setData } = useTooManyGamesData();
  const [parsingError, setParsingError] = useState<string | null>(null);

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      setParsingError(null);
      void parseFile(acceptedFiles)
        .then(setData)
        .catch((error: unknown) => {
          setParsingError(getErrorMessage(error));
        });
    },
    [setData],
  );

  const { getRootProps, fileRejections, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/json": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
    maxFiles: 1,
    onDropAccepted,
  });

  return (
    <>
      {/* oxlint-disable-next-line react/jsx-props-no-spreading */}
      <div {...getRootProps()} className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}>
        <div className="dropzone-icon">📁</div>
        {/* oxlint-disable-next-line react/jsx-props-no-spreading */}
        <input {...getInputProps()} />
        <p>Drag &amp; drop a file here, or click to select one.</p>
        <aside>
          <p>
            <strong>Accepted filetypes:</strong> Excel &amp; JSON
          </p>
          <FileRejectionItems fileRejections={fileRejections} />
        </aside>
      </div>
      {parsingError !== null && (
        <p className="dropzone-error" role="alert">
          {parsingError}
        </p>
      )}
    </>
  );
};
