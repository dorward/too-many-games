import { useDropzone } from "react-dropzone";
import "./uploadData.css";
import { parseFile } from "../../data/parseFile";
import { useTooManyGamesData } from "../../context/useTooManyGamesData";

export const UploadData = () => {
  const { setData } = useTooManyGamesData();

  const { getRootProps, fileRejections, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/json": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const doWork = async () => {
        const appData = await parseFile(acceptedFiles);
        console.log("Upload Data got ", appData);
        setData(appData);
      };
      // TODO: Handle errors?
      void doWork();
    },
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
          {fileRejectionItems.length ? <ul>{fileRejectionItems}</ul> : null}
        </aside>
      </div>
    </>
  );
};
