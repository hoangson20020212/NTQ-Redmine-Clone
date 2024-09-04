import LoadingEffect from "~/assets/images/loading.gif";

const Loading = () => {
  return (
    <>
      <div className="w-screen h-screen top-0 bg-[#b5b5b5] background_opacity opacity-40 fixed z-50"></div>
      <div className="flex items-center w-96 h-5 p-3 border border-gray-400 gap-2 justify-center fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] opacity-50 z-50 bg-slate-100">
        <img src={LoadingEffect} alt="loading" className="opacity-35" />
        <span className="font-bold opacity-35">Loading...</span>
      </div>
    </>
  );
};

export default Loading;
