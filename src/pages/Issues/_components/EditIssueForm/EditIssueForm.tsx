import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Label from "~/components/Label";
import Input from "~/components/Input";
import IconAdd from "~/assets/images/icon-add.png";
import IconSearch from "~/assets/images/magnifier.png";
import Button from "~/components/Button";
import DatePickerCustom from "~/components/DatePicker";
import ErrorImg from "~/assets/images/error-img.png";
import EnhanceSelect from "~/components/EnhanceSelect";
import Editor from "~/components/Editor";
import { Issue, IssueEdit } from "~/types/issue.type";
import {
  STATUS_TASK_OPTIONS,
  STATUS_BUG_OPTIONS,
  TRACKER_OPTIONS,
  PERCENT_DONE_OPTIONS,
  PRIORITY_OPTIONS,
  BUG_TYPE_OPTIONS,
  SEVERITY_OPTIONS,
  QC_ACTIVITY_OPTIONS,
  CAUSE_CATEGORY_OPTIONS,
  DEGRADE_OPTIONS,
  OPTIONS_ACTIVITY,
  OPTIONS_CATEGORY,
} from "~/constants/constants";
import issuesApi from "~/apis/issue.api";
import projectMembershipsApi from "~/apis/projectMemberships.api";
import ModalNewVersion from "~/pages/IssuesCreate/_components/ModalNewVersion";
import { Controller, useForm } from "react-hook-form";
import versionsApi from "~/apis/versions.api";
import timeEntriesApi from "~/apis/timeEntries.api";
import moment from "moment";
import { useGlobalStore } from "~/store/globalStore";
import FormAddFile from "~/pages/Wiki/_components/FormAddFile";
import { convertMDtoElement } from "~/utils/utils";
import backgroundDraft from "~/assets/images/draft.png";

interface Task {
  id: number;
  name: string;
}

interface PropsEdit {
  formRef: React.MutableRefObject<HTMLFormElement | null>;
  dataEdit: Issue;
  setIsActiveEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditIssueForm: React.FC<PropsEdit> = ({ formRef, dataEdit, setIsActiveEdit }) => {
  const { id } = useParams();
  const [isActiveParentTask, setIsActiveParentTask] = useState(false);
  const [newVersion, setNewVersion] = useState(false);
  const [searchTerm, setSearchTerm] = useState(dataEdit?.parent?.id || "");
  const [filteredItems, setFilteredItems] = useState<Task[]>([]);
  const [allIssue, setAllIssue] = useState<Task[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState([
    { label: "", value: 0 },
    { label: "<<me>>", value: 1 },
  ]);
  const [valueTextEdit, setValueTextEdit] = useState<string>("");
  const [valuePreview, setValuePreview] = useState<string>("");
  const [isShowPreview, setIsShowPreview] = useState<boolean>(false);
  const [valueTextNoteEdit, setValueNoteEdit] = useState<string>("");
  const [valueNotePreview, setValueNotePreview] = useState<string>("");
  const [versionOptions, setVersionOptions] = useState([{ label: "", value: 0 }]);
  const { setIsSuccessEdit } = useGlobalStore((state) => ({
    setIsSuccessEdit: state.setIsSuccessEdit,
  }));

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

  const convertListIssue = (listItem: Issue[]): Task[] => {
    const newList = listItem.map((item) => ({
      id: item.id,
      name: `${item.tracker.name} #${item.id}: ${item.subject}`,
    }));

    return newList;
  };

  const fetchProject = async () => {
    try {
      const memberList = await projectMembershipsApi.getProjectMemberships(dataEdit?.project?.id | Number(id));
      const arrayMember = memberList.data.memberships;

      const assigneeArray = arrayMember.map((item) => ({
        label: item.user.name,
        value: item.user.id,
      }));
      setAssigneeOptions((assigneeOptions) => [...assigneeOptions, ...assigneeArray]);
      const responseVersion = await versionsApi.getAllVersionOfProject({ idProject: dataEdit.project.id | Number(id) });
      const versionOpenArray = responseVersion.data.versions.reduce<{ label: string; value: number }[]>((acc, item) => {
        if (item.status === "open") {
          acc.push({
            label: item.name,
            value: item.id,
          });
        }
        return acc;
      }, []);
      setVersionOptions((versionOptions) => [...versionOptions, ...versionOpenArray]);
      const responseIssue = await issuesApi.listIssues({ project_id: Number(id) });
      const issueConvert = convertListIssue(responseIssue.data.issues);
      setAllIssue(issueConvert);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    convertMDtoElement(valueTextEdit);
  }, [valueTextEdit]);

  useEffect(() => {
    fetchProject();
  }, []);

  const UpdateIssuesByID = async (data: IssueEdit, trackerValue: string) => {
    const currentDate = moment().format("YYYY-MM-DD");
    console.log(data);
    const dataEditForm = {
      project_id: dataEdit.project.id,
      issueEdit: {
        subject: data.subject ?? undefined,
        tracker_id: Number(data.tracker_id) ?? undefined,
        priority_id: Number(data.priority_id) ?? undefined,
        assigned_to_id: Number(data.assigned_to_id) ?? undefined,
        due_date: data.due_date ?? undefined,
        start_date: data.start_date ?? undefined,
        status_id: Number(data.status_id) ?? undefined,
        estimated_hours: data.estimated_hours ?? undefined,
        fixed_version_id: data.fixed_version_id ?? undefined,
        done_ratio: Number(data.done_ratio) ?? undefined,
        description: data?.description ?? undefined,
        parent_issue_id: Number(searchTerm) ?? undefined,
        custom_fields:
          trackerValue === "4"
            ? [{ id: 13, name: "Severity", value: data.severity ?? undefined }]
            : [
                {
                  id: 13,
                  name: "Severity",
                  value: data.severity ?? undefined,
                },
                {
                  id: 12,
                  name: "Bug Type",
                  value: data.bugType ?? undefined,
                },
                {
                  id: 23,
                  name: "QC Activity",
                  value: data.qcActivity,
                },
                {
                  id: 25,
                  name: "Cause Category",
                  multiple: true,
                  value: data.causeCategory,
                },
                {
                  id: 62,
                  name: "Is Degrade?",
                  value: data.isDegrade,
                },
                {
                  id: 63,
                  name: "Reopen counter",
                  value: Number(data.reopenCounter),
                },
              ],
      },
      spent_time: {
        issue_id: dataEdit.id,
        comment: data?.comment,
        hours: Number(data?.hours),
        spent_on: currentDate,
        activity_id: Number(data?.activity_id),
        custom_fields: [
          {
            id: 34,
            name: "Product Category",
            value: data.productCategory,
          },
        ],
      },
    };
    // return;
    const responses = await issuesApi.updateIssue(dataEdit.id, dataEditForm.issueEdit);

    if (dataEditForm?.spent_time?.hours && dataEditForm?.spent_time?.activity_id) {
      await timeEntriesApi.createTimeEntries(dataEditForm.spent_time);
    }
    console.log(responses);
    if (responses.status === 200) {
      setIsActiveEdit(false);
      setIsSuccessEdit(true);
    }
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const trackerValue = watch("tracker_id");
  const onSubmit = (data: IssueEdit) => UpdateIssuesByID(data, trackerValue);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
        {newVersion && <ModalNewVersion handleClick={setNewVersion} />}
        <div className="relative m-2 pt-1 border bg-white p-3 mt-3 pb-3">
          <span className="text-10 px-1 absolute -top-2 left-3 bg-white cursor-pointer text-gray-rain">Change properties</span>
          {errors?.subject?.message && (
            <div className="pt-2">
              <div className="flex border-red-600 items-center text-sm border-2 bg-[#ffe3e3] gap-3 p-0.5 mt-2 mb-3">
                <figure className="ml-2">
                  <img src={ErrorImg} alt="error" />
                </figure>
                {/* <span className="text-[#880000]">{errors?.subject?.message}</span> */}
              </div>
            </div>
          )}
          <div className="w-full py-2">
            <div className="flex">
              <Label htmlFor="tracker" isRequired={true} className="flex gap-1 items-center p-0" name="Tracker">
                <EnhanceSelect
                  id="tracker_id"
                  defaultValue={dataEdit?.tracker?.id}
                  className="text-xs font-normal text-black"
                  arrayOption={TRACKER_OPTIONS}
                  {...register("tracker_id")}
                />
              </Label>
            </div>
            <div className="flex">
              <Label htmlFor="subject" isRequired={true} className="flex gap-1 items-center p-0" name="Subject" />
              <Input
                id="subject"
                defaultValue={dataEdit.subject}
                style={{ width: "calc(100% - 225px)" }}
                className="ml-2 text-xs"
                {...register("subject", {
                  required: "Subject can't be blank",
                })}
              />
            </div>
            <div className="flex">
              <Label htmlFor="textareaEdit" className="flex gap-1 items-center p-0 " name="Description"></Label>
              <Editor onChangeText={setValueTextEdit} description={dataEdit?.description} control={control} name="description" />
            </div>
            {/* Row 1 */}
            <div className="flex">
              <div className="w-1/2">
                <div className="flex">
                  <Label htmlFor="status_id" className="flex gap-1 items-center p-0" name="Status" isRequired></Label>
                  <EnhanceSelect
                    id="status_id"
                    defaultValue={dataEdit?.status?.id}
                    className="text-xs w-full font-normal text-black"
                    arrayOption={trackerValue === "1" ? STATUS_BUG_OPTIONS : STATUS_TASK_OPTIONS}
                    {...register("status_id", { required: "Status can't be blank" })}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex relative">
                  <Label htmlFor="parent_issue_id" className="flex gap-1 items-center p-0 parent-task" name="Parent task"></Label>
                  <div className={`flex items-center border relative ml-1 w-32 ${isActiveParentTask ? "border-black rounded-sm" : ""}`}>
                    <img src={IconSearch} alt="IconSearch" className="px-1" />
                    <input
                      id="parent_issue_id"
                      type="text"
                      className=" outline-none w-full text-xs py-1"
                      value={searchTerm}
                      {...register("parent_issue_id", {
                        onChange: (e) => {
                          handleSearchChange(e);
                        },
                      })}
                      onFocus={() => setIsActiveParentTask(true)}
                      onBlur={() => {
                        if (!searchTerm) {
                          setIsActiveParentTask(false);
                        }
                      }}
                    />
                  </div>
                  {isActiveParentTask && filteredItems.length > 0 && (
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
                  <Label htmlFor="priority_id" className="flex gap-1 items-center p-0" name="Priority" isRequired></Label>
                  <EnhanceSelect
                    id="priority_id"
                    defaultValue={dataEdit?.priority?.id}
                    className="text-xs w-full font-normal text-black"
                    arrayOption={PRIORITY_OPTIONS}
                    {...register("priority_id", { required: "Priority can't be blank" })}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex">
                  <Label htmlFor="start_date" className="flex gap-1 items-center p-0" name="Start date"></Label>
                  <Controller
                    control={control}
                    name="start_date"
                    defaultValue={dataEdit?.start_date ? moment(dataEdit.start_date).format("YYYY-MM-DD") : null}
                    render={({ field }) => (
                      <DatePickerCustom
                        id="start_date"
                        selected={field.value ? new Date(field.value) : dataEdit?.start_date ? new Date(dataEdit.start_date) : null}
                        onChange={(date) => {
                          const formattedDate = date ? moment(date).format("YYYY-MM-DD") : "";
                          field.onChange(formattedDate);
                        }}
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
                  <Label htmlFor="assigned_to_id" className="flex gap-1 items-center p-0" name="Assignee"></Label>
                  <Controller
                    name="assigned_to_id"
                    control={control}
                    defaultValue={dataEdit?.assigned_to?.id}
                    render={({ field }) => (
                      <EnhanceSelect
                        id="assigned_to_id"
                        className="w-full text-xs font-normal text-black"
                        arrayOption={assigneeOptions}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex">
                  <Label htmlFor="DueDate" className="flex gap-1 items-center p-0" name="Due date"></Label>
                  <Controller
                    control={control}
                    name="due_date"
                    defaultValue={dataEdit?.start_date ? moment(dataEdit.due_date).format("YYYY-MM-DD") : null}
                    render={({ field }) => (
                      <DatePickerCustom
                        id="due_date"
                        selected={field.value ? new Date(field.value) : dataEdit?.due_date ? new Date(dataEdit.due_date) : null}
                        onChange={(date) => {
                          const formattedDate = date ? moment(date).format("YYYY-MM-DD") : "";
                          field.onChange(formattedDate);
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Row 4 */}
            <div className="flex items-center">
              <div className="w-1/2">
                <div className="flex gap-0.5 items-center">
                  <Label htmlFor="fixed_version_id" className="flex gap-1 items-center p-0" name="Target version" />
                  <Controller
                    name="fixed_version_id"
                    control={control}
                    defaultValue={dataEdit?.fixed_version?.id}
                    render={({ field }) => (
                      <EnhanceSelect
                        id="fixed_version_id"
                        className="w-full pr-10 text-xs font-normal text-black"
                        arrayOption={versionOptions}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    )}
                  />
                  <img src={IconAdd} alt="IconAdd" className="cursor-pointer" onClick={() => setNewVersion(true)} />
                </div>
              </div>
              <div className="w-1/2">
                <div className="flex items-center">
                  <Label htmlFor="estimated_hours" className="flex gap-1 items-center p-0" name="Estimate time"></Label>
                  <Input
                    id="estimated_hours"
                    defaultValue={dataEdit.estimated_hours}
                    className="ml-1 w-14 text-xs"
                    {...register("estimated_hours")}
                  />
                  <span className="text-xs text-mouse-gray ">Hours</span>
                </div>
              </div>
            </div>
            {/* Row 5 */}
            <div className="flex items-center">
              <div className="w-1/2"></div>
              <div className="w-1/2">
                <div className="flex">
                  <Label htmlFor="done_ratio" className="flex gap-1 items-center p-0" name="% Done" />
                  <EnhanceSelect
                    id="done_ratio"
                    defaultValue={dataEdit?.done_ratio}
                    className="text-xs font-normal text-black"
                    arrayOption={PERCENT_DONE_OPTIONS}
                    {...register("done_ratio")}
                  />
                </div>
              </div>
            </div>
            {/* Row 6 */}
            <div className="flex items-center">
              <div className="w-1/2">
                {trackerValue === "1" ? (
                  <div className="flex">
                    <Label htmlFor="bugType" className="flex gap-1 items-center p-0" name="Bug Type" isRequired />
                    <EnhanceSelect
                      id="bugType"
                      defaultValue={dataEdit?.BugType}
                      className="text-xs font-normal text-black w-1/3 ml-2"
                      arrayOption={BUG_TYPE_OPTIONS}
                      {...register("bugType", {
                        required: "Bug Type can't be blank",
                      })}
                    />
                  </div>
                ) : (
                  <></>
                )}

                <div className="flex">
                  <Label htmlFor="severity" className="flex gap-1 items-center p-0" name="Severity" isRequired></Label>
                  <EnhanceSelect
                    id="severity"
                    defaultValue={dataEdit?.Severity}
                    className="text-xs font-normal text-black w-1/3 ml-2"
                    arrayOption={SEVERITY_OPTIONS}
                    {...register("severity", {
                      required: "Severity can't be blank",
                    })}
                  />
                </div>
                {trackerValue === "1" ? (
                  <div className="flex">
                    <Label htmlFor="qcActivity" className="flex gap-1 items-center p-0" name="QC Activity" isRequired></Label>
                    <EnhanceSelect
                      id="qcActivity"
                      defaultValue={dataEdit?.QCActivity}
                      className="text-xs font-normal text-black w-1/3 ml-2"
                      arrayOption={QC_ACTIVITY_OPTIONS}
                      {...register("qcActivity", {
                        required: "QCActivity can't be blank",
                      })}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {trackerValue === "1" ? (
                <div className="w-1/2 h-full">
                  <div className="flex h-full">
                    <Label htmlFor="causeCategory" className="flex gap-1 items-center p-0" name="Cause Category" isRequired></Label>
                    <EnhanceSelect
                      id="causeCategory"
                      multiple={true}
                      defaultValue={dataEdit?.CauseCategory ?? []}
                      className="text-xs font-normal text-black h-full"
                      arrayOption={CAUSE_CATEGORY_OPTIONS}
                      size={4}
                      {...register("causeCategory", {
                        required: "CauseCategory can't be blank",
                      })}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            {/* Row 7 */}
            {trackerValue === "1" ? (
              <div className="flex items-center">
                <div className="w-1/2"></div>
                <div className="w-1/2">
                  <div className="flex">
                    <Label htmlFor="isDegrade" className="flex gap-1 items-center p-0" name="Is Degrade?" isRequired></Label>
                    <EnhanceSelect
                      id="isDegrade"
                      defaultValue={dataEdit?.["IsDegrade?"]}
                      className="text-xs font-normal text-black w-1/3 ml-2"
                      arrayOption={DEGRADE_OPTIONS}
                      {...register("isDegrade", {
                        required: "isDegrade can't be blank",
                      })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            {/* Row 8 */}
            {trackerValue === "1" ? (
              <div className="flex items-center">
                <div className="w-1/2"></div>
                <div className="w-1/2">
                  <div className="flex">
                    <Label htmlFor="reopenCounter" className="flex gap-1 items-center p-0" name="Reopen counter" isRequired></Label>
                    <Input
                      id="reopenCounter"
                      defaultValue={dataEdit.Reopencounter}
                      style={{ width: "calc(100% - 225px)" }}
                      className="ml-1 text-xs"
                      {...register("reopenCounter", {
                        required: "Reopen counter can't be blank",
                      })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="relative m-2 pt-1 border bg-white p-3 mt-3 pb-3">
          <span className="text-10 px-1 absolute -top-2 left-3 bg-white cursor-pointer text-gray-rain">Log time</span>
          <div className="flex items-center">
            <div className="flex text-xs w-1/2 items-center">
              <Label htmlFor="spent_hours" className="flex gap-1 items-center p-0" name="Spent time"></Label>
              <Input id="spent_hours" type="number" className="w-20 text-xs" {...register("hours")} />
              Hours
            </div>
            <div className="flex">
              <Label htmlFor="activity_id" className="flex gap-1 items-center p-0" name="Activity" />
              <EnhanceSelect arrayOption={OPTIONS_ACTIVITY} id="activity_id" className="text-xs w-3/5" {...register("activity_id")} />
            </div>
          </div>
          <div className="flex">
            <Label htmlFor="comment" className="flex gap-1 items-center p-0" name="Comment" />
            <Input id="comment" style={{ width: "calc(100% - 225px)" }} className="ml-2 text-xs" {...register("comment")} />
          </div>
          <div className="flex">
            <Label htmlFor="category" isRequired className="flex gap-1 items-center p-0" name="Product Category" />
            <EnhanceSelect
              id="category"
              className="text-xs font-normal text-black h-full ml-1"
              arrayOption={OPTIONS_CATEGORY}
              {...register("productCategory")}
            />
          </div>
        </div>

        <div className="relative m-2 pt-1 border bg-white p-3 mt-3 pb-3">
          <span className="text-10 px-1 absolute -top-2 left-3 bg-white cursor-pointer text-gray-rain">Notes</span>
          <div className="pt-2 w-full">
            <Editor onChangeText={setValueNoteEdit} control={control} name="notes" />
            <div className="flex items-center">
              <Input type="checkbox" id="private" className="text-xs" />
              <label htmlFor="private" className="text-10">
                Private note
              </label>
            </div>
          </div>
        </div>

        <div className="relative m-2 pt-1 border bg-white p-3 mt-3 pb-3">
          <span className="text-10 px-1 absolute -top-2 left-3 bg-white cursor-pointer text-gray-rain">Files</span>
          <FormAddFile isHiddenButton={true} />
        </div>

        <div className="flex items-center pt-2 pl-2 gap-1">
          <Button className="text-xs" type="submit">
            Submit
          </Button>
          <div className="text-ocean-blue text-xs">
            <a
              href="#!"
              className="link"
              onClick={() => {
                setValuePreview(convertMDtoElement(valueTextEdit));
                setValueNotePreview(convertMDtoElement(valueTextNoteEdit));
                setIsShowPreview(true);
              }}
            >
              preview
            </a>{" "}
            |{" "}
            <span className="text-xs cursor-pointer" onClick={() => setIsActiveEdit(false)}>
              Cancel
            </span>
          </div>
        </div>
        {isShowPreview && (
          <div className="flex gap-1 flex-col mt-2 ">
            <fieldset className="text-xs mx-2 border bg-light-gray pb-1">
              <legend className="text-mouse-gray">description</legend>
              <div className="py-4 text-gray-rain" style={{ backgroundImage: `url('${backgroundDraft}')` }}>
                <div dangerouslySetInnerHTML={{ __html: valuePreview }} />
              </div>
            </fieldset>
            <fieldset className="text-xs mx-2 border bg-light-gray pb-1">
              <legend className="text-mouse-gray">Notes</legend>
              <div className="py-4 text-gray-rain" style={{ backgroundImage: `url('${backgroundDraft}')` }}>
                <div dangerouslySetInnerHTML={{ __html: valueNotePreview }} />
              </div>
            </fieldset>
          </div>
        )}
      </form>
    </>
  );
};

export default EditIssueForm;
