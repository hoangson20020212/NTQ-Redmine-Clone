import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Label from "~/components/Label";
import Input from "~/components/Input";
import IconAdd from "~/assets/images/icon-add.png";
import IconSearch from "~/assets/images/magnifier.png";
import IconBulletAdd from "~/assets/images/bullet_add.png";
import Button from "~/components/Button";
import DatePickerCustom from "~/components/DatePicker";
import ErrorImg from "~/assets/images/error-img.png";
import EnhanceSelect from "~/components/EnhanceSelect";
import Editor from "~/components/Editor";
import { SyncLoader } from "react-spinners";
import { Issue } from "~/types/issue.type";
import issuesApi from "~/apis/issue.api";
import ModalNewVersion from "./_components/ModalNewVersion";
import projectMembershipsApi from "~/apis/projectMemberships.api";
import ModalAddWatchers from "./_components/ModalAddWatchers";
import { Controller, useForm } from "react-hook-form";
import versionsApi from "~/apis/versions.api";
import { useTranslation } from "react-i18next";
import moment from "moment";
import File from "~/components/File";
import { convertMDtoElement } from "~/utils/utils";
import ApplyImg from "~/assets/images/apply-img.png";
import Loading from "~/components/Loading";
import {
  TRACKER_OPTIONS,
  PRIORITY_OPTIONS,
  BUG_TYPE_OPTIONS,
  statusOptionsNewIssue,
  PERCENT_DONE_OPTIONS,
  SEVERITY_OPTIONS,
  QC_ACTIVITY_OPTIONS,
  CAUSE_CATEGORY_OPTIONS,
  DEGRADE_OPTIONS,
} from "~/constants/constants";
import uploadFileApi from "~/apis/uploads.api";
import { IssueCreate } from "~/types/issue.type";
import backgroundDraft from "~/assets/images/draft.png";

interface Member {
  id: number;
  name: string;
  role: string;
}

interface Task {
  id: number;
  name: string;
}

const IssuesCreate = () => {
  const { id, name } = useParams();
  const { t } = useTranslation("createIssue");
  const [isActiveParentTask, setIsActiveParentTask] = useState(false);
  const [newVersion, setNewVersion] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<Task[]>([]);
  const [allIssue, setAllIssue] = useState<Task[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState([
    { label: "", value: "" },
    { label: "<<me>>", value: "1" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [check, setCheck] = useState(true);
  const [isAddWatcher, setIsAddWatcher] = useState<boolean>(false);
  const [targetVerOptions, setTargetVerOptions] = useState([{ label: "", value: "" }]);
  const [valueTextEdit, setValueTextEdit] = useState<string>("");
  const [valuePreview, setValuePreview] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = allIssue.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredItems(filtered);
  };

  const handleItemClick = (id: number) => {
    setSearchTerm(id.toString());
    setFilteredItems([]);
  };

  const [isSuccessful, setIsCreateSuccessful] = useState(false);

  const convertListIssue = (listItem: Issue[]): Task[] => {
    const newList = listItem.map((item) => ({
      id: item.id,
      name: `${item.tracker.name} #${item.id}: ${item.subject}`,
    }));
    return newList;
  };

  const fetchProject = async () => {
    try {
      setLoading(true);
      const responseVersion = await versionsApi.getAllVersionOfProject({ idProject: Number(id) });
      const versions = responseVersion.data.versions
        .filter((items) => items.status === "open")
        .map((version) => ({
          label: version.name,
          value: String(version.id),
        }));
      setTargetVerOptions((targetVerOptions) => [...targetVerOptions, ...versions]);
      const memberList = await projectMembershipsApi.getProjectMemberships(Number(id));
      const arrayMember = memberList.data.memberships;
      arrayMember.forEach((mem) => {
        setMembers((prevState) => [
          ...prevState,
          {
            id: mem.user.id,
            name: mem.user?.name ?? "",
            role: mem.roles[0]?.name ?? "",
          },
        ]);
      });
      const assigneeArray = arrayMember.map((item) => ({
        label: item.user.name,
        value: String(item.user.id),
      }));
      setAssigneeOptions((assigneeOptions) => [...assigneeOptions, ...assigneeArray]);
      const responseIssue = await issuesApi.listIssues({ project_id: Number(id) });
      const issueConvert = convertListIssue(responseIssue.data.issues);
      setAllIssue(issueConvert);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    convertMDtoElement(valueTextEdit);
  }, [valueTextEdit]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isBug, setIsBug] = useState(true);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const issue: IssueCreate = {
      project_id: Number(id),
      tracker_id: data.tracker_id,
      status_id: +data.status_id,
      done_ratio: data.done_ratio,
      priority_id: +data.priority_id,
      subject: data.subject,
      description: data.description,
      fixed_version_id: +data.fixed_version_id,
      assigned_to_id: +data.assigned_to_id,
      parent_issue_id: +data.parent_issue_id,
      estimated_hours: +data.estimated_hours,
      custom_fields: [
        { value: data.bug_type, id: 12 },
        { value: data.severity, id: 13 },
        { value: data.qc_activity, id: 23 },
        { value: data.cause_category, id: 25 },
        { value: data.is_degrade, id: 62 },
        { value: +data.reopen_counter, id: 63 },
      ],
      due_date: data.due_date,
      start_date: data.start_date,
      watcher_user_ids: data.watcher_user_ids,
      uploads: [],
    };

    if (data.file !== null) {
      const filesArray: File[] = Array.from(data.file);
      const uploadData = filesArray.map(async (item: File) => {
        const responseUpload = await uploadFileApi.postFiles(item);
        return {
          token: responseUpload.data.upload.token,
          filename: item.name,
          content_type: item.type,
        };
      });
      issue.uploads = await Promise.all(uploadData);
    }

    const responseVersion = await issuesApi.createIssue(issue);

    if (responseVersion.status === 201) {
      setIsCreateSuccessful(true);
    }
    setIsLoading(false);
  };

  const handleChangeTracker = (value: number) => {
    setIsBug(!(value === 4));
  };

  return (
    <>
      {newVersion && <ModalNewVersion handleClick={setNewVersion} />}
      {isAddWatcher && <ModalAddWatchers data={members} handleClick={setIsAddWatcher} />}
      <Helmet>
        <title>{`New Issue - ${name} - NTQ Redmine`}</title>
        <meta name="description" content="Redmine" />
      </Helmet>
      {isLoading && <Loading />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-2.5 pt-1 min-h-84 bg-white px-3 mt-3 pb-8">
          <h2 className="text-xl font-semibold pt-0.5 pr-3 mb-3 text-mouse-gray">{t("title")}</h2>

          {errors.subject && (
            <div className="pt-2">
              <div className="flex border-[#dd0000] items-center text-[13.2px] border-2 bg-[#ffe3e3] gap-3 p-[2px] mt-2 mb-3">
                <figure className="ml-2">
                  <img src={ErrorImg} alt="error" />
                </figure>
                <span className="text-[#880000]">{`Subject can't be blank`}</span>
              </div>
            </div>
          )}

          {isSuccessful && (
            <div className="flex border-[#0b8800] items-center text-[13.2px] border-2 bg-[#efffe3] gap-3 p-[2px] mt-2 mb-3">
              <figure className="ml-2">
                <img src={ApplyImg} alt="successful" />
              </figure>
              <span className="text-[#0b8800]">{t("modal_new_version.message.successful")}</span>
            </div>
          )}

          <div className="bg-[#fcfcfc]  w-full border border-[#e4e4e4] py-2">
            <div className="flex-block">
              <Label htmlFor="tracker" isRequired={true} className="flex gap-1 items-center p-0" name={t("label.tracker")}>
                <Controller
                  name="tracker_id"
                  control={control}
                  defaultValue={1}
                  render={({ field }) => (
                    <EnhanceSelect
                      {...field}
                      id="tracker"
                      className="text-[13.33px] font-normal text-[black]"
                      arrayOption={TRACKER_OPTIONS}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleChangeTracker(+e.target.value);
                      }}
                    />
                  )}
                />
              </Label>
            </div>
            <div className="flex">
              <Label htmlFor="subject" isRequired={true} className="flex gap-1 items-center p-0" name={t("label.subject")}></Label>
              <Input
                id="subject"
                style={{ width: "calc(100% - 225px)" }}
                className="ml-2"
                {...register("subject", {
                  required: "Subject can't be blank",
                })}
              />
            </div>
            <div className="flex">
              <Label htmlFor="textareaEdit" className="flex gap-1 items-center p-0 pb-[162px]" name={t("label.description")}></Label>
              <Editor onChangeText={setValueTextEdit} control={control} name="description" />
            </div>
            {/* Row 1 */}
            <div className="flex">
              <div className="w-1/2">
                <div className="flex">
                  <Label htmlFor="status" className="flex gap-1 items-center p-0" name={t("label.status")} isRequired></Label>
                  <EnhanceSelect
                    id="status"
                    className="text-[13.33px] font-normal text-[black] w-1/3 ml-2"
                    arrayOption={statusOptionsNewIssue}
                    defaultValue={1}
                    {...register("status_id")}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex relative">
                  <Label htmlFor="ParentTask" className="flex gap-1 items-center p-0 parent-task" name={t("label.parent_task")}></Label>
                  <div className={`flex items-center border ml-1 w-32 ${isActiveParentTask ? "border-[black] rounded-sm" : ""}`}>
                    <img src={IconSearch} alt="IconSearch" className="px-1" />
                    <Controller
                      name={"parent_issue_id"}
                      control={control}
                      render={({ field }) => (
                        <input
                          id="ParentTask"
                          {...field}
                          type="text"
                          className="outline-none w-full text-xs py-1"
                          value={searchTerm}
                          onChange={(e) => {
                            field.onChange(e);
                            handleSearchChange(e);
                          }}
                          onFocus={() => setIsActiveParentTask(true)}
                          onBlur={() => setIsActiveParentTask(false)}
                        ></input>
                      )}
                    />
                  </div>
                  {filteredItems.length > 0 && (
                    <div
                      className="absolute top-[30px] left-[180px] border border-gray-300 bg-white z-10 max-h-48 overflow-y-auto"
                      style={{ width: "calc(100% - 225px)" }}
                    >
                      {filteredItems.map((item) => (
                        <div key={item.id} className="border-b border-[#eee] text-xs hover:bg-blue-300" onClick={() => handleItemClick(item.id)}>
                          {item.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex items-center">
              <div className="w-1/2">
                <div className="flex">
                  <Label htmlFor="priority" className="flex gap-1 items-center p-0" name={t("label.priority")} isRequired></Label>
                  {check && (
                    <EnhanceSelect
                      id="priority"
                      className="text-[13.33px] font-normal text-[black] w-1/3 ml-2"
                      arrayOption={PRIORITY_OPTIONS}
                      defaultValue={2}
                      {...register("priority_id")}
                    />
                  )}
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex">
                  <Label htmlFor="StartDate" className="flex gap-1 items-center p-0" name={t("label.start_date")}></Label>
                  <Controller
                    control={control}
                    name="start_date"
                    render={({ field }) => (
                      <DatePickerCustom
                        id="start_date"
                        selected={field.value ? new Date(field.value) : null}
                        className="pl-1"
                        onChange={(date) => field.onChange(date ? moment(date).format("YYYY-MM-DD") : "")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Row 3 */}
            <div className="flex items-center">
              <div className="w-1/2">
                <div className="flex">
                  <Label htmlFor="assignee" className="flex gap-1 items-center p-0" name={t("label.assignee")}></Label>
                  <EnhanceSelect
                    id="assignee"
                    className="text-[13.33px] font-normal text-black w-1/3 ml-2"
                    arrayOption={assigneeOptions}
                    defaultValue={""}
                    {...register("assigned_to_id")}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex">
                  <Label htmlFor="DueDate" className="flex gap-1 items-center p-0" name={t("label.due_date")}></Label>
                  <Controller
                    control={control}
                    name="due_date"
                    render={({ field }) => (
                      <DatePickerCustom
                        name="issue[due_date]"
                        id="due_date"
                        className="pl-1"
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date ? moment(date).format("YYYY-MM-DD") : "")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Row 4 */}
            <div className="flex items-center">
              <div className="w-1/2">
                <div className="flex items-center">
                  <Label htmlFor="TargetVersion" className="flex gap-1 items-center p-0" name={t("label.target_version")}></Label>
                  <EnhanceSelect
                    id="TargetVersion"
                    className="text-[13.33px] font-normal text-[black] w-1/3 ml-2"
                    arrayOption={targetVerOptions}
                    defaultValue={2}
                    {...register("fixed_version_id")}
                  />
                  <img src={IconAdd} alt="IconAdd" className="cursor-pointer" onClick={() => setNewVersion(true)} />
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex items-center">
                  <Label htmlFor="EstimateTime" className="flex gap-1 items-center p-0" name={t("label.estimate_time")}></Label>
                  <Input className="ml-1 w-14" id="EstimateTime" {...register("estimated_hours")} />
                  <span className="text-xs text-[#505050]">{t("hours")}</span>
                </div>
              </div>
            </div>
            {/* Row 5 */}
            <div className="flex items-center">
              <div className="w-1/2"></div>
              <div className="w-1/2">
                <div className="flex">
                  <Label htmlFor="done" className="flex gap-1 items-center p-0" name={t("label.done")}></Label>
                  <EnhanceSelect
                    id="done"
                    className="text-[13.33px] font-normal text-[black]"
                    arrayOption={PERCENT_DONE_OPTIONS}
                    defaultValue={0}
                    {...register("done_ratio")}
                  />
                </div>
              </div>
            </div>
            {/* Row 6 */}
            <div className="flex items-center">
              <div className="w-1/2">
                {isBug && (
                  <div className="flex">
                    <Label htmlFor="bugType" className="flex gap-1 items-center p-0" name={t("label.bug_type")} isRequired></Label>
                    <EnhanceSelect
                      id="bugType"
                      className="text-[13.33px] font-normal text-[black] w-1/3 ml-2"
                      arrayOption={BUG_TYPE_OPTIONS}
                      defaultValue={"Others"}
                      {...register("bug_type")}
                    />
                  </div>
                )}

                <div className="flex">
                  <Label htmlFor="severity" className="flex gap-1 items-center p-0" name={t("label.severity")} isRequired></Label>
                  <EnhanceSelect
                    id="severity"
                    className="text-[13.33px] font-normal text-[black] w-1/3 ml-2"
                    arrayOption={SEVERITY_OPTIONS}
                    defaultValue={"Cosmetic"}
                    {...register("severity")}
                  />
                </div>
                {isBug && (
                  <div className="flex">
                    <Label htmlFor="qcActivity" className="flex gap-1 items-center p-0" name={t("label.qc_activity")} isRequired></Label>
                    <EnhanceSelect
                      id="qcActivity"
                      className="text-[13.33px] font-normal text-[black] w-1/3 ml-2"
                      arrayOption={QC_ACTIVITY_OPTIONS}
                      defaultValue={"Other Test"}
                      {...register("qc_activity")}
                    />
                  </div>
                )}
              </div>
              {isBug && (
                <div className="w-1/2 h-full">
                  <div className="flex h-full">
                    <Label htmlFor="causeCategory" className="flex gap-1 items-center p-0" name={t("label.cause_category")} isRequired></Label>
                    <EnhanceSelect
                      id="causeCategory"
                      className="text-[13.33px] font-normal text-[black] h-full"
                      arrayOption={CAUSE_CATEGORY_OPTIONS}
                      defaultValue={["9. Other"]}
                      multiple
                      size={4}
                      {...register("cause_category")}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Row 7 */}
            {isBug && (
              <div className="flex items-center">
                <div className="w-1/2"></div>
                <div className="w-1/2">
                  <div className="flex">
                    <Label htmlFor="isDegrade" className="flex gap-1 items-center p-0" name={t("label.is_degrade")} isRequired></Label>
                    <EnhanceSelect
                      id="isDegrade"
                      className="text-[13.33px] font-normal text-[black] h-full ml-1"
                      arrayOption={DEGRADE_OPTIONS}
                      defaultValue={0}
                      {...register("is_degrade")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Row 8 */}
            {isBug && (
              <div className="flex items-center">
                <div className="w-1/2"></div>
                <div className="w-1/2">
                  <div className="flex">
                    <Label htmlFor="reopenCounter" className="flex gap-1 items-center p-0" name={t("label.reopen_counter")} isRequired></Label>
                    <Input
                      id="reopenCounter"
                      style={{ width: "calc(100% - 225px)" }}
                      className="ml-1"
                      defaultValue={0}
                      {...register("reopen_counter")}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Label htmlFor="files" className="flex gap-1 items-center p-0" name={t("label.files")}></Label>
              <div className="text-[9.6px] text-[#505050] ">
                <File control={control} name="file" />
              </div>
            </div>
            <div className="flex pt-2 w-full">
              <Label htmlFor="watcher" className="inline-flex gap-1 items-center p-0 " name={t("label.watcher")}></Label>
              <div className="flex flex-col h-full">
                {loading ? (
                  <SyncLoader className="ml-4" color="#169" size={5} />
                ) : (
                  <div className="flex items-center text-xs text-[#505050] pl-3 h-full flex-wrap">
                    <Controller
                      name="watcher_user_ids"
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <>
                          {members
                            .filter((item) => item.role === "Developer")
                            .map((item) => {
                              return (
                                <div className="flex items-center gap-1 min-w-72 pr-4" key={item.id}>
                                  <input
                                    type="checkbox"
                                    value={item.id}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      const isChecked = e.target.checked;
                                      if (isChecked) {
                                        field.onChange([...field.value, +value]);
                                      } else {
                                        field.onChange(field.value.filter((item: number) => item !== +value));
                                      }
                                    }}
                                    checked={field.value.includes(item.id)}
                                  />
                                  <span className="">{item.name}</span>
                                </div>
                              );
                            })}
                        </>
                      )}
                    />
                  </div>
                )}

                <div className="flex items-center pl-2 text-[9.6px]" onClick={() => setIsAddWatcher(true)}>
                  <img src={IconBulletAdd} alt="" />
                  <a href="#!" className="link">
                    {t("button.search_user")}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center py-3 gap-1">
            <Button type="submit">{t("button.create")}</Button>
            <Button onClick={() => setCheck(!check)}>{t("button.create_continue")}</Button>
            <a
              href="#!"
              className="link"
              onClick={() => {
                setValuePreview(convertMDtoElement(valueTextEdit));
              }}
            >
              {t("button.preview")}
            </a>
          </div>

          <fieldset className="text-xs pl-2.5 border bg-light-gray pb-1">
            <legend className="text-mouse-gray">{t("label.description")}</legend>
            <div className="py-4 text-gray-rain" style={{ backgroundImage: `url('${backgroundDraft}')` }}>
              <div dangerouslySetInnerHTML={{ __html: valuePreview }} />
            </div>
          </fieldset>
        </div>
      </form>
    </>
  );
};

export default IssuesCreate;
