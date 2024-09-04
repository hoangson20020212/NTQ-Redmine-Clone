import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import issuesApi from "~/apis/issue.api";
import timeEntriesApi from "~/apis/timeEntries.api";
import ErrorImg from "~/assets/images/error-img.png";
import IconSearch from "~/assets/images/magnifier.png";
import IconSuccess from "~/assets/images/apply-img.png";
import Button from "~/components/Button";
import DatePickerCustom from "~/components/DatePicker";
import EnhanceSelect from "~/components/EnhanceSelect";
import Input from "~/components/Input";
import Label from "~/components/Label";
import config from "~/constants/config";
import { useGlobalStore } from "~/store/globalStore";
import { Issue } from "~/types/issue.type";
import { OPTIONS_ACTIVITY, OPTIONS_CATEGORY } from "~/constants/constants";
import ToastSuccess from "~/components/ToastSuccess";

interface IFormInput {
  issue_id: string;
  spent_on: string;
  hours: number;
  comment?: string;
  activity_id: string;
  productCategory: string;
}

interface Task {
  id: number;
  name: string;
}

const EditSpentTime = () => {
  const { id, name, issueId } = useParams();
  const [isActiveParentTask, setIsActiveParentTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState(issueId || "");
  const [filteredItems, setFilteredItems] = useState<Task[]>([]);
  const navigate = useNavigate();
  const { setIsSuccessEdit, isSuccessEdit } = useGlobalStore((state) => ({
    setIsSuccessEdit: state.setIsSuccessEdit,
    isSuccessEdit: state.isSuccessEdit,
  }));

  const convertListIssue = (listItem: Issue[]): Task[] => {
    const newList = listItem.map((item) => ({
      id: item.id,
      name: `${item.tracker.name} #${item.id}: ${item.subject}`,
    }));

    return newList;
  };

  const fetchIssuesOfProject = async () => {
    const responseIssue = await issuesApi.listIssues({ project_id: Number(id) });
    const issueConvert = convertListIssue(responseIssue.data.issues);
    return issueConvert;
  };

  const { data: allIssue = [] } = useQuery({
    queryKey: ["issuesProjects"],
    queryFn: () => fetchIssuesOfProject(),
    staleTime: config.staleTime,
  });

  const currentIssues = allIssue.find((item) => item.id === Number(searchTerm));

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

  const CreateLogTime = async (data: IFormInput, action: string) => {
    const dataTime = {
      issue_id: isNaN(Number(searchTerm)) ? Number(issueId) : Number(searchTerm),
      comment: data?.comment,
      hours: Number(data?.hours),
      spent_on: data?.spent_on,
      activity_id: data?.activity_id,
      custom_fields: [
        {
          id: 34,
          name: "Product Category",
          value: data.productCategory,
        },
      ],
    };
    const response = await timeEntriesApi.createTimeEntries(dataTime);

    switch (action) {
      case "create":
        if (response.status === 201) {
          setIsSuccessEdit(true);
          navigate(`/projects/${id}/${name}/issues/${issueId}`);
        }
        break;
      case "create_and_continue":
        if (response.status === 201) {
          setIsSuccessEdit(true);
        }
        break;
      default:
        break;
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>();
  const currentDate = moment().format("YYYY-MM-DD");

  const onSubmit: SubmitHandler<IFormInput> = (data, event) => {
    const submitEvent = event?.nativeEvent as SubmitEvent;
    const action = (submitEvent.submitter as HTMLButtonElement)?.value;
    CreateLogTime(data, action);
  };

  useEffect(() => {
    if (isSuccessEdit) {
      const timer = setTimeout(() => {
        setIsSuccessEdit(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccessEdit]);

  return (
    <div className="border p-2.5 mt-3 bg-white min-h-84 flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-mouse-gray">Spent Time</h2>
      {isSuccessEdit && <ToastSuccess />}
      {errors?.issue_id || errors?.spent_on || errors?.hours || errors.activity_id || errors?.productCategory ? (
        <div className="flex items-center text-xs text-red-900 p-5 bg-red-100 border-2 border-red-500">
          <img className="flex w-fit h-fit" src={ErrorImg} alt="Error" />
          <div className="pl-5">
            {errors.issue_id?.message ? <li> {errors.issue_id?.message}</li> : ""}
            {errors.spent_on?.message ? <li> {errors.spent_on?.message}</li> : ""}
            {errors.hours?.message ? <li> {errors.hours?.message} </li> : ""}
            {errors.activity_id?.message ? <li>{errors.activity_id?.message} </li> : ""}
            {errors.productCategory?.message ? <li>{errors.productCategory?.message}</li> : ""}
          </div>
        </div>
      ) : (
        " "
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex mb-1 border-solid border-inherit	 border p-3">
          <div className="flex flex-col gap-2 m-1 text-right">
            <Label htmlFor="issue_id ">Issue</Label>
            <Label htmlFor="spent_on" isRequired={true} name="Date" />
            <Label htmlFor="hours" isRequired={true} name="Hours" />
            <Label htmlFor="comments">Comment</Label>
            <Label htmlFor="activity_id" isRequired={true} name="Activity" />
            <Label htmlFor="category" isRequired={true} name="Product Category" />
          </div>

          <div className="flex flex-col gap-2 m-1 text-sm text-mouse-gray pl-1">
            <div className="flex gap-2 items-center mb-0.5">
              <div className={`flex items-center border relative ml-1 w-32 ${isActiveParentTask ? "border-black rounded-sm" : ""}`}>
                <img src={IconSearch} alt="IconSearch" className="px-1" />
                <input
                  id="issue_id"
                  type="text"
                  className=" outline-none w-full text-xs py-1"
                  value={searchTerm}
                  {...register("issue_id", {
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
              <span className="text-xs ">{searchTerm && currentIssues && currentIssues.name} </span>
            </div>
            {isActiveParentTask && filteredItems.length > 0 && (
              <div className="absolute top-52 border border-gray-300 bg-white z-10 max-h-48 overflow-y-auto" style={{ width: "calc(100% - 225px)" }}>
                {filteredItems.map((item) => (
                  <div
                    key={item.name}
                    className="border-b border-[#eee] text-xs hover:bg-blue-300"
                    onClick={() => {
                      handleItemClick(item.id);
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
            <Controller
              control={control}
              name="spent_on"
              defaultValue={currentDate}
              render={({ field }) => (
                <DatePickerCustom
                  id="spent_on"
                  className="ml-0.5"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    const formattedDate = date ? moment(date).format("YYYY-MM-DD") : "";
                    field.onChange(formattedDate);
                  }}
                />
              )}
            />{" "}
            <Input
              id="hours"
              type="number"
              className="w-20 text-xs"
              {...register("hours", {
                required: "Hours can't be blank",
                validate: {
                  isNumber: (value) => !isNaN(value) || "Hours must be a number",
                },
              })}
            />
            <Input id="comment" className="text-xs" {...register("comment")} />
            <EnhanceSelect
              arrayOption={OPTIONS_ACTIVITY}
              data-testid="activity"
              id="activity_id"
              className="text-xs w-3/5"
              {...register("activity_id", {
                required: "Activity can't be blank",
                validate: (value) => value !== "" || "Activity can't be blank",
              })}
            />
            <EnhanceSelect
              data-testid="productCategory"
              id="category"
              className="text-xs w-3/5"
              arrayOption={OPTIONS_CATEGORY}
              {...register("productCategory", {
                required: "Product Category can't be blank",
                validate: (value) => value !== "" || "Product Category can't be blank",
              })}
            />
          </div>
        </div>

        <Button type="submit" name="action" value="create" className="text-xs px-1.5 mr-1 leading-5 h-5 line border bg-slate-50 text-black">
          Create
        </Button>
        <Button
          type="submit"
          name="action"
          value="create_and_continue"
          className="text-xs px-1.5 mr-1 leading-5 h-5 line border bg-slate-50 text-black"
        >
          Create and continue
        </Button>
      </form>
    </div>
  );
};

export default EditSpentTime;
