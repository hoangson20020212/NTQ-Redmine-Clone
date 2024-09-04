import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import versionsApi from "~/apis/versions.api";
import ErrorImg from "~/assets/images/error-img.png";
import Button from "~/components/Button";
import DatePickerCustom from "~/components/DatePicker";
import EnhanceSelect from "~/components/EnhanceSelect";
import Input from "~/components/Input";
import Label from "~/components/Label";
import config from "~/constants/config";
import { useGlobalStore } from "~/store/globalStore";

interface IFormInput {
  name: string;
  description?: string;
  status: string;
  wiki_page_title: string;
  due_date: string;
  sharing: string;
}

const OPTIONS_STATUS = [
  { value: "open", label: "Open" },
  { value: "locked", label: "Locked" },
  { value: "closed", label: "Closed" },
];

const OPTIONS_SHARING = [
  { value: "none", label: "Not Shared" },
  { value: "descendants", label: "With sub projects" },
  { value: "hierarchy", label: "With project hierarchy" },
  { value: "tree", label: "With project tree" },
];

const NewVersion = () => {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsSuccessEdit } = useGlobalStore((state) => ({
    setIsSuccessEdit: state.setIsSuccessEdit,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: location.state?.name || "",
      description: location.state?.description || "",
      status: location.state?.status || "open",
      wiki_page_title: location.state?.wiki_page_title || "",
      sharing: location.state?.sharing || "none",
      due_date: location.state?.due_date || new Date(),
    },
  });

  const fetchVersionOfProject = async () => {
    const responseVersion = await versionsApi.getAllVersionOfProject({ idProject: Number(id) });
    return responseVersion.data.versions.map((version) => version.name);
  };

  const { data: allVersion = [] } = useQuery({
    queryKey: ["allVersion"],
    queryFn: () => fetchVersionOfProject(),
    staleTime: config.staleTime,
  });

  const postNewVersions = async (data: IFormInput) => {
    const responses = await versionsApi.postNewVersions(Number(id), data);
    if (responses.status === 201) {
      setIsSuccessEdit(true);
      navigate(`/projects/${id}/${name}/roadmap`);
    }
  };

  const updateVersions = async (data: IFormInput) => {
    const responses = await versionsApi.updateVersions(Number(location.state?.id), data);
    if (responses.status === 200) {
      setIsSuccessEdit(true);
      navigate(`/projects/${id}/${name}/settings`);
    }
  };

  const handleSubmitForm = (data: IFormInput, action: string) => {
    switch (action) {
      case "create":
        postNewVersions(data);
        break;
      case "update":
        updateVersions(data);
        break;
      default:
        break;
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = (data, event) => {
    const submitEvent = event?.nativeEvent as SubmitEvent;
    const action = (submitEvent.submitter as HTMLButtonElement)?.value;
    handleSubmitForm(data, action);
  };

  return (
    <div className="min-h-84 bg-white px-3 mt-3 pb-8 p-2.5 mb-3 flex flex-col gap-3">
      <h2 className="text-xl font-semibold text-mouse-gray">NewVersion</h2>
      {errors?.name ? (
        <div className="flex items-center text-xs text-red-900 p-5 bg-red-100 border-2 border-red-500">
          <img className="flex w-fit h-fit" src={ErrorImg} alt="Error" />
          <div className="pl-5">{errors.name?.message ? <li>{errors.name?.message}</li> : ""}</div>
        </div>
      ) : (
        " "
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex mb-1 border-solid border-inherit	 border p-3">
          <div className="flex flex-col gap-2 m-1 text-right">
            <Label htmlFor="name">
              Name
              <span className="text-red-500"> *</span>
            </Label>
            <Label htmlFor="description">Description</Label>
            <Label htmlFor="status">Status</Label>
            <Label htmlFor="wiki">Wiki page</Label>
            <Label htmlFor="comment">Date</Label>
            <Label htmlFor="sharing">Sharing</Label>
          </div>

          <div className="flex flex-col gap-1 m-1 text-xs text-mouse-gray pl-1">
            <Input
              id="name"
              className="min-w-400 text-xs"
              {...register("name", {
                required: "Name can't be blank",
                validate: (value) => {
                  if (!location.state) {
                    if (allVersion.includes(value)) {
                      return "Name already exists";
                    }
                  }
                  return true;
                },
              })}
            />
            <Input id="description" className=" text-xs" {...register("description")} />
            <EnhanceSelect arrayOption={OPTIONS_STATUS} id="status" className="max-w-28 text-xs" {...register("status")} />
            <Input id="wiki" className=" text-xs" {...register("wiki_page_title")} />
            <Controller
              control={control}
              name="due_date"
              render={({ field }) => (
                <DatePickerCustom
                  id="due_date"
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date ? moment(date).format("YYYY-MM-DD") : "")}
                />
              )}
            />
            <EnhanceSelect arrayOption={OPTIONS_SHARING} id="sharing" className="max-w-28 mt-3 text-xs" {...register("sharing")} />
          </div>
        </div>
        <Button
          type="submit"
          name="action"
          value={location.state ? "update" : "create"}
          className="text-xs px-1.5 mr-1 leading-5 h-5 line border bg-slate-50 text-black"
        >
          Create
        </Button>
      </form>
    </div>
  );
};

export default NewVersion;
