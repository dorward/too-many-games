import type { FileRejection } from "react-dropzone";

interface FileRejectionItemsProps {
  fileRejections: readonly FileRejection[];
}

export const FileRejectionItems = ({ fileRejections }: FileRejectionItemsProps) =>
  fileRejections.length > 0 ? (
    <ul>
      {fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map((error) => (
              <li key={error.code}>{error.message}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  ) : null;
