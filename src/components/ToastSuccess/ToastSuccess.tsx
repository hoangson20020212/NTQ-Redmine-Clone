import IconSuccess from "~/assets/images/apply-img.png";

const ToastSuccess = () => {
  return (
    <div className="flex mt-3 items-center text-xs text-lime-900 p-2 bg-green-100 border-2 border-lime-500">
      <img className="flex w-fit h-fit" src={IconSuccess} alt="Error" />
      <div className="pl-5">Successful creation.</div>
    </div>
  );
};

export default ToastSuccess;
