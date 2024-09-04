import React, { useRef, useState } from "react";
import Button from "~/components/Button";
import DeleteImg from "~/assets/images/delete-img.png";
import Attachment from "~/assets/images/attachment.png";

interface IFile {
  id: string;
  name: string;
  description: string;
}

interface IPropsFormAddFile {
  onCancel?: () => void;
  isHiddenButton?: boolean;
}

const MAX_FILE_SIZE_MB = 500;

const FormAddFile: React.FC<IPropsFormAddFile> = ({ onCancel, isHiddenButton = false }) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null); // Initialize ref for file input

  const handleChoseFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const validFiles = selectedFiles.filter((file) => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024); // Filter out files larger than 500 MB

    if (validFiles.length === 0) {
      alert("Some files are too large. Please select files smaller than 500 MB.");
      return;
    }

    const newFiles = selectedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`, // Unique ID based on timestamp, index, and file name
      name: file.name,
      description: "",
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const handleDescriptionChange = (id: string, description: string) => {
    setFiles((prevFiles) => prevFiles.map((file) => ({ ...file, description: file.id === id ? description : file.description })));
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleCreate = () => {
    console.log(files);
  };

  return (
    <>
      <div className="min-h-14 border flex flex-col justify-center text-xs text-subText p-1.5">
        <ul>
          {files.map((file) => (
            <li key={file.id} className="flex items-center text-xs text-subText p-1">
              <img src={Attachment} alt="attachment" />
              <p className="w-64 overflow-hidden">{file.name}</p>
              <input
                value={file.description}
                onChange={(e) => handleDescriptionChange(file.id, e.target.value)}
                placeholder="Optional description"
                className="border p-1 ml-2 w-80 placeholder:text-gray-500"
              />
              <img onClick={() => handleRemoveFile(file.id)} src={DeleteImg} alt="_delete" className="cursor-pointer" />
            </li>
          ))}
        </ul>
        <div className="flex items-center">
          <input
            className="text-mouse-gray"
            ref={fileInputRef} // Attach ref to file input
            onChange={handleChoseFiles}
            type="file"
            multiple
          />
          <p className="text-xs text-mouse-gray">(Maximum size: 500 MB)</p>
        </div>
      </div>
      {!isHiddenButton && (
        <div className="flex items-center mt-2.5">
          <Button
            onClick={handleCreate}
            className="border text-xs border-gray-500 py-[1px] px-2 bg-gray-custom-10 !text-gray-700 hover:no-underline hover:bg-gray-custom-40"
          >
            Add
          </Button>
          <Button className="text-xs" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </>
  );
};

export default FormAddFile;
