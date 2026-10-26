import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";

const FileUpload = ({
  title,
  name,
  display,
  handleChange,
  accept,
  value,
  existingFileName,
}) => {
  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (value instanceof File) {
      setFileName(value.name);
      return;
    }

    if (value?.name) {
      setFileName(value.name);
      return;
    }

    if (typeof value === "string" && value) {
      if (existingFileName) {
        setFileName(existingFileName);
        return;
      }

      if (value.startsWith("data:")) {
        setFileName(title || "Uploaded file");
        return;
      }

      const extractedName = value.split("?")[0].split("/").pop();
      setFileName(extractedName || title || "Uploaded file");
      return;
    }

    setFileName("");
  }, [existingFileName, title, value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFileName(file ? file.name : "");

    handleChange(e);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 ">
        {title}
      </label>

      <div
        onClick={() => fileInputRef.current.click()}
        className="flex flex-col md:flex-row gap-2 items-center justify-between border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 transition bg-[#f3f3f5] text-gray-800"
      >
        <div className="flex items-center gap-2 text-gray-600 ">
          <Upload size={18} className="text-sm md:text-base" />

          <span className={`text-sm ${display ? "block" : "hidden"}`}>
            {fileName ? "Change file" : "Choose file"}
          </span>
        </div>

        <div className="text-sm text-gray-500 truncate max-w-[100px]">
          {fileName || "No file selected"}
        </div>
      </div>

      <input
        type="file"
        name={name}
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
