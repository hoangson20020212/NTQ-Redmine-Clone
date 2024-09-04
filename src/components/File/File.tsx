import React, { useState } from "react";
import Attachment from "~/assets/images/attachment.png";
import Delete from "~/assets/images/delete-img.png";
import { useTranslation } from "react-i18next";
import { Controller, Control } from "react-hook-form";

type FileProps = {
  control: Control<any>;
  name?: string;
};

interface UploadedFile {
  file: File;
  description: string;
}

const File: React.FC<FileProps> = ({ control, name }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { t } = useTranslation("createIssue");

  const handleDescriptionChange = (index: number, newDescription: string) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles[index].description = newDescription;
    setUploadedFiles(updatedFiles);
  };

  const handleDelete = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFileChange = (event: any) => {
    const files: File[] = Array.from(event.target.files);
    const newFiles: UploadedFile[] = files.map((file) => ({ file, description: "" }));
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  return (
    <>
      <div className="text-[13px]">
        {uploadedFiles.map((uploadedFile, index) => (
          <div key={index} className="flex items-center">
            <div className="flex w-72 h-7 items-center">
              <img src={Attachment} alt="Attachment" onClick={() => handleDelete(index)} />
              <span>{uploadedFile.file.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Optional description"
                value={uploadedFile.description}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                className="border w-80"
              />
              <img src={Delete} className="cursor-pointer" alt="Delete" onClick={() => handleDelete(index)} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <Controller
          name={name || "file"}
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <input
              id="files"
              type="file"
              className="text-xs"
              multiple
              onChange={(e) => {
                handleFileChange(e);
                field.onChange(e.target.files);
              }}
            />
          )}
        />
        <span>{t("maximum_size")}</span>
      </div>
    </>
  );
};

export default File;
