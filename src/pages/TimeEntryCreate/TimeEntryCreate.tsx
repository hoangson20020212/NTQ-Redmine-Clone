import moment from "moment";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorImg from "~/assets/images/error-img.png";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Label from "~/components/Label";
import Select from "~/components/Select";

interface IFormInput {
  project: string;
  issue: string;
  date: string;
  hours: number;
  comment?: string;
  activity: string;
  productCategory: string;
}

const OPTIONS_PROJECT = [
  { id: 1, nameProject: "project 1" },
  { id: 2, nameProject: "project 2" },
  { id: 3, nameProject: "project 3" },
];

const OPTIONS_ACTIVITY = [
  { id: 1, name: "Create" },
  { id: 2, name: "Review" },
  { id: 3, name: "Correct" },
  { id: 3, name: "Study" },
  { id: 4, name: "Test" },
  { id: 5, name: "Translate" },
  { id: 6, name: "Verify" },
  { id: 7, name: "Re-test" },
  { id: 8, name: "Regression test" },
  { id: 9, name: "Meeting" },
  { id: 10, name: "Selftest" },
  { id: 11, name: "Report" },
];

const OPTIONS_CATEGORY = [
  { id: 1, name: "Requirement / SRS" },
  { id: 2, name: "Estimation" },
  { id: 3, name: "Plan / Schedule" },
  { id: 3, name: "Report" },
  { id: 4, name: "Basic Design" },
  { id: 5, name: "Detail Design" },
  { id: 6, name: "Code" },
  { id: 7, name: "UT Case" },
  { id: 8, name: "IT Viewpoint / Case" },
  { id: 9, name: "IT Report" },
  { id: 10, name: "ST Viewpoint/Case" },
  { id: 11, name: "ST Report" },
  { id: 12, name: "Test estimation" },
  { id: 13, name: "Test Plan/Schedule" },
  { id: 14, name: "Bug list" },
  { id: 15, name: "Other" },
];

const SpentTime = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const currentDate = moment().format("YYYY-MM-DD");

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data, errors?.hours?.message);

  return (
    <div className="p-2.5 mb-3 flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-mouse-gray">SpentTime</h2>

      {errors?.project || errors?.issue || errors?.date || errors?.hours || errors.activity || errors?.productCategory ? (
        <div className="flex items-center text-xs text-red-900 p-5 bg-red-100 border-2 border-red-500">
          <img className="flex w-fit h-fit" src={ErrorImg} alt="Error" />
          <div className="pl-5">
            {errors.project?.message ? <li>{errors.project?.message}</li> : ""}
            {errors.issue?.message ? <li> {errors.issue?.message}</li> : ""}
            {errors.date?.message ? <li> {errors.date?.message}</li> : ""}
            {errors.hours?.message ? <li> {errors.hours?.message} </li> : ""}
            {errors.activity?.message ? <li>{errors.activity?.message} </li> : ""}
            {errors.productCategory?.message ? <li>{errors.productCategory?.message}</li> : ""}
          </div>
        </div>
      ) : (
        " "
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex mb-1 border-solid border-inherit	 border p-3">
          <div className="flex flex-col gap-2 m-1 text-right">
            <Label htmlFor="project">Project</Label>
            <Label htmlFor="issue">Issue</Label>
            <Label htmlFor="date" isRequired={true} name="Date" />
            <Label htmlFor="hours" isRequired={true} name="Hours" />
            <Label htmlFor="comment">Comment</Label>
            <Label htmlFor="activity" isRequired={true} name="Activity" />
            <Label htmlFor="category" isRequired={true} name="Product Category" />
          </div>

          <div className="flex flex-col gap-1 m-1 text-sm text-mouse-gray pl-1">
            <Select data-testid="projectOption" id="project" className="text-xs" {...register("project", { required: "Project can't be blank" })}>
              <option value="" disabled></option>
              {OPTIONS_PROJECT.map((option) => (
                <option data-testid={`projectOption ${option.nameProject}`} key={option.id} value={option.nameProject}>
                  {option.nameProject}
                </option>
              ))}
            </Select>
            <Input id="issue" {...register("issue")} />
            <Input type="date" className="text-xs" id="date" value={currentDate} min="2018-01-01" {...register("date")} />
            <Input
              id="hours"
              {...register("hours", {
                required: "Hours can't be blank",
                validate: {
                  isNumber: (value) => !isNaN(value) || "Hours must be a number",
                },
              })}
            />
            <Input id="comment" {...register("comment")} />
            <Select data-testid="activity" id="activity" className="text-xs" {...register("activity", { required: "Activity  can't be blank" })}>
              <option value="" disabled>
                ---Please select---
              </option>
              {OPTIONS_ACTIVITY.map((option) => (
                <option data-testid={`activity ${option.name}`} key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </Select>
            <Select
              data-testid="productCategory"
              id="category"
              className="text-xs"
              {...register("productCategory", { required: "Product Category can't be blank" })}
            >
              <option value="" disabled>
                ---Please select---
              </option>
              {OPTIONS_CATEGORY.map((option) => (
                <option data-testid={`productCategory ${option.name}`} key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <Button type="submit" className="text-xs px-1.5 mr-1 leading-5 h-5 line border bg-slate-50 text-black">
          Create
        </Button>
        <Button type="submit" className="text-xs px-1.5 mr-1 leading-5 h-5 line border bg-slate-50 text-black">
          Create and continue
        </Button>
      </form>
    </div>
  );
};

export default SpentTime;
