import { useDropzone } from "react-dropzone";
import "./uploadData.css";
import { parseFile } from "../../data/parseFile";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";

export const UploadData = () => {
  const { setData } = useTooManyGamesData();

  const { getRootProps, fileRejections, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const appData = await parseFile(acceptedFiles);
      console.log("Upload Data got ", appData);
      setData(appData);
    },
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
      "application/json": [],
    },
    maxFiles: 1,
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}>
      <div className="dropzone-icon">📁</div>
      <input {...getInputProps()} />
      <p>Drag 'n' drop a file here, or click to select one.</p>
      <aside>
        <p>
          <strong>Accepted filetypes:</strong> Excel &amp; JSON
        </p>
        {fileRejectionItems.length ? <ul>{fileRejectionItems}</ul> : null}
      </aside>
    </div>
  );
};
