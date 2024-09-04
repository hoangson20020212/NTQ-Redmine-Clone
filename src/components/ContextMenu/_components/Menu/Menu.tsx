import React from "react";
import "./Menu.css";
import { cn } from "~/utils/utils";
import IconApply from "~/assets/images/apply-img.png";
import IconArrowCollapsed from "~/assets/images/arrow_collapsed.png";

const Menu: React.FC<{ items: any[] }> = ({ items }) => {
  return (
    <ul className="text-xs w-40 absolute bg-white ml-40 z-50 text-[#30a0e1]" style={{ zIndex: 100 }}>
      {items.map((item, index) => (
        <li
          key={index}
          onClick={item.onClick ? item.onClick : undefined}
          className={cn("flex items-center justify-between relative hover:border", { "has-children": item.children })}
        >
          <div className="flex items-center gap-1">
            {item.isChoose && (
              <div className="w-4 h-4">
                <img src={IconApply} alt="IconApply" />
              </div>
            )}
            <div className="w-5">{item.icon && <img src={item.icon} alt="Icon" />}</div>
            <span className="">{item.name}</span>
          </div>

          {item.children && <img src={IconArrowCollapsed} alt="IconArrowCollapsed" />}
          {item.children && <Menu items={item.children} />}
        </li>
      ))}
    </ul>
  );
};

export default Menu;
