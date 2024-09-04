import Select from "~/components/Select";
import ReLoadImg from "~/assets/images/reload-img.png";

const OPTIONS_TIMES = [
  { value: "year", label: "Year" },
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "days", label: "Days" },
];

const OPTIONS_ADD = [
  { value: "", label: " " },
  { value: "project", label: "Project" },
  { value: "status", label: "Status" },
  { value: "version", label: "Version" },
  { value: "category", label: "Category" },
  { value: "user", label: "User" },
  { value: "tracker", label: "Tracker" },
  { value: "activity", label: "Activity" },
  { value: "issue", label: "Issue" },
  { value: "cf_34", label: "Product category" },
  { value: "cf_53", label: "Contract type" },
  { value: "cf_12", label: "Bug type" },
  { value: "cf_13", label: "Severity" },
  { value: "cf_23", label: "Qc activity" },
  { value: "cf_50", label: "Late release" },
  { value: "cf_56", label: "Business domain" },
  { value: "cf_62", label: "Is degrade?" },
];

const ReportTimeEntries = () => {
  return (
    <div className="py-3 text-xs text-title flex items-center gap-2">
      <>
        <span>Detail: </span>
        <Select
          value="selectedValue"
          className="h-6 text-xs text-black font-medium border border-zinc-300 rounded-none"
          onChange={() => {
            return "selectedValue";
          }}
        >
          <option value="">Select an option</option>
          {OPTIONS_TIMES &&
            OPTIONS_TIMES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </Select>
      </>
      <>
        <span>Add: </span>
        <Select
          value="selectedValue"
          className="h-6 text-xs text-black font-medium border border-zinc-300 rounded-none max-w-[200px] w-full"
          onChange={() => {
            return "selectedValue";
          }}
        >
          {OPTIONS_ADD &&
            OPTIONS_ADD.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </Select>
        <img src={ReLoadImg} alt="clear" />
        <p className="cursor-pointer text-primaryText hover:text-hoverText hover:underline">Clear</p>
      </>
    </div>
  );
};

export default ReportTimeEntries;
