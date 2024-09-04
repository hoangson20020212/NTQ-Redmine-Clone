import React, { useState } from "react";
import "~/pages/MyPage/_components/Dialog/Dialog.css";
import EnhanceSelect from "~/components/EnhanceSelect";
import Label from "~/components/Label";
import Input from "~/components/Input";
import DatePickerCustom from "~/components/DatePicker";
import Button from "~/components/Button";
import { useParams } from "react-router-dom";
import ErrorImg from "~/assets/images/error-img.png";
import ApplyImg from "~/assets/images/apply-img.png";
import { Controller, useForm } from "react-hook-form";
import versionsApi from "~/apis/versions.api";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface DialogProps {
  handleClick: (isVisible: boolean) => void;
}

const ModalNewVersion: React.FC<DialogProps> = ({ handleClick }) => {
  const { id } = useParams();
  const { t } = useTranslation("createIssue");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [statusOptions, _setStatusOptions] = useState([
    { label: "open", value: "open" },
    { label: "locked", value: "locked" },
    { label: "closed", value: "closed" },
  ]);

  const [isSuccessful, setIsCreateSuccessful] = useState(false);

  const handleClickOutside = () => {
    setIsCreateSuccessful(false);
    handleClick(false);
  };

  const [sharingOptions, _setSharinOptions] = useState([
    { label: "Not shared", value: "none" },
    { label: "With subprojects", value: "descendants" },
    { label: "With project hierarchy", value: "hierarchy" },
    { label: "With project tree", value: "tree" },
  ]);

  const onSubmit = async (data: any) => {
    const version = {
      name: data.name,
      description: data.description,
      status: data.status,
      wiki_page_title: data.wiki_page_title,
      due_date: data.effective_date,
      sharing: data.sharing,
    };

    const responseVersion = await versionsApi.postNewVersions(Number(id), version);
    if (responseVersion.status === 201) {
      setIsCreateSuccessful(true);
    }
  };

  return (
    <>
      <div className="w-screen h-screen top-0 background_opacity  opacity-40 fixed z-50"></div>
      <div className="w-[610px]  border  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#fff] z-50">
        <div className="border py-1.5 px-2 flex justify-between rounded-md title_dialog items-center">
          <span className="font-bold text-[#fff] text-[13.2px] overflow-hidden whitespace-nowrap text-ellipsis">{t("modal_new_version.title")}</span>
          <button
            className="w-5 h-5 icon_close bg-[#f6f6f6] px-2 rounded-sm border-[1px] border-[#ccc] hover:border-[#628db6]"
            onClick={handleClickOutside}
            title="Close"
          ></button>
        </div>
        {errors.name && (
          <div className="pt-2 px-2">
            <div className="flex border-[#dd0000] items-center text-[13.2px] border-2 bg-[#ffe3e3] gap-3 p-[2px] mt-2 mb-3">
              <figure className="ml-2">
                <img src={ErrorImg} alt="error" />
              </figure>
              <span className="text-[#880000]">{t("modal_new_version.message.error")}</span>
            </div>
          </div>
        )}
        {isSuccessful && (
          <div className="pt-2 px-2">
            <div className="flex border-[#0b8800] items-center text-[13.2px] border-2 bg-[#efffe3] gap-3 p-[2px] mt-2 mb-3">
              <figure className="ml-2">
                <img src={ApplyImg} alt="successful" />
              </figure>
              <span className="text-[#0b8800]">{t("modal_new_version.message.successful")}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-3 py-1">
            <div className="bg-[#fcfcfc] w-full py-2 border">
              <div className="flex">
                <Label htmlFor="name" isRequired={true} className="flex gap-1 items-center p-0" name={t("modal_new_version.name")}></Label>
                <Input id="name" style={{ width: "calc(100% - 225px)" }} className="ml-2" {...register("name", { required: "Name is required" })} />
              </div>
              <div className="flex">
                <Label htmlFor="description" className="flex gap-1 items-center p-0" name={t("modal_new_version.description")}></Label>
                <Input id="description" style={{ width: "calc(100% - 225px)" }} className="ml-2" {...register("description")} />
              </div>
              <div className="flex">
                <Label htmlFor="status" className="flex gap-1 items-center p-0" name={t("modal_new_version.status")}></Label>
                <EnhanceSelect
                  id="status"
                  className="text-[13.33px] font-normal text-[black] w-14 ml-2"
                  arrayOption={statusOptions}
                  defaultValue={"Bug"}
                  {...register("status")}
                />
              </div>
              <div className="flex">
                <Label htmlFor="wikiPage" className="flex gap-1 items-center p-0" name={t("modal_new_version.wiki_page")}></Label>
                <Input id="wikiPage" style={{ width: "calc(100% - 225px)" }} className="ml-2" {...register("wiki_page_title")} />
              </div>
              <div className="flex">
                <Label htmlFor="Effective date" className="flex gap-1 items-center p-0" name={t("modal_new_version.start_date")}></Label>
                <Controller
                  control={control}
                  name="effective_date"
                  render={({ field }) => (
                    <DatePickerCustom
                      id="effective_date"
                      selected={field.value ? new Date(field.value) : null}
                      className="pl-2"
                      onChange={(date) => field.onChange(date ? moment(date).format("YYYY-MM-DD") : "")}
                    />
                  )}
                />
              </div>
              <div className="flex">
                <Label htmlFor="sharing" className="flex gap-1 items-center p-0" name={t("modal_new_version.sharing")}></Label>
                <EnhanceSelect
                  id="sharing"
                  className="text-[13.33px] font-normal text-[black] w-1/3 ml-2"
                  arrayOption={sharingOptions}
                  defaultValue={"none"}
                  {...register("sharing")}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end pt-1 pr-3 pb-2">
            <Button type="submit">Create</Button>
            <Button type="button" onClick={handleClickOutside}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalNewVersion;
