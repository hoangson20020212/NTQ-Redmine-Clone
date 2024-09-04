import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "~/utils/utils";

const Navbar = ({ idProject, nameHeader }: { idProject?: string | undefined; nameHeader?: string }) => {
  const [listValueNavbar, setListValueNavbar] = useState([
    {
      name: "Overview",
      path: "/overview",
      selected: false,
      isExternal: true,
    },
    {
      name: "Activity",
      path: "/activity",
      selected: false,
    },
    {
      name: "Roadmap",
      path: "/roadmap",
      selected: false,
    },
    {
      name: "Issues",
      path: "/issues",
      selected: false,
    },
    {
      name: "New issue",
      path: "/issues/new",
      selected: false,
    },
    {
      name: "Gantt",
      path: "/issues/gantt",
      selected: false,
    },
    {
      name: "Calendar",
      path: "/issues/calendar",
      selected: false,
    },
    {
      name: "Documents",
      path: "/documents",
      selected: false,
    },
    {
      name: "Wiki",
      path: "/wiki",
      selected: false,
    },
    {
      name: "Files",
      path: "/files",
      selected: false,
    },
    {
      name: "Settings",
      path: "/settings",
      selected: false,
    },
  ]);

  const handleClickNavbar = (itemName: string) => {
    setListValueNavbar((prevState) => prevState.map((item) => (item.name === itemName ? { ...item, selected: true } : { ...item, selected: false })));
  };

  return (
    <div>
      <ul className="flex gap-0.5 cursor-pointer pl-1 text-white text-xs font-bold">
        {listValueNavbar.length > 0 &&
          listValueNavbar.map((item) => (
            <Link
              key={item.name}
              className={cn("bg-[#507AAA] hover:underline py-1 px-2.5", { "text-mouse-gray bg-[#eee]": item.selected })}
              onClick={() => handleClickNavbar(item.name)}
              rel={item?.isExternal ? "noopener noreferrer" : ""}
              to={`/projects/${idProject}/${nameHeader}${item.path}`}
            >
              {item.name}
            </Link>
          ))}
      </ul>
    </div>
  );
};

export default Navbar;
