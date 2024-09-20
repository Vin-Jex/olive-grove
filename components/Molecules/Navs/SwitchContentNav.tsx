import { FC } from "react";

interface SwitchContentNavProp {
  navLink: string[];
  activeItem: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
}
const SwitchContentNav: FC<SwitchContentNavProp> = ({
  navLink,
  activeItem,
  setActiveItem,
}) => {
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <nav className='flex justify-between items-center'>
      <ul className='flex items-center overflow-hidden'>
        {navLink?.map((item: string) => {
          return (
            <li
              key={item}
              onClick={() => {
                handleItemClick(item.toLowerCase());
              }}
              className={`flex items-center justify-center relative font-roboto text-sm text-subtext/40 py-3 px-3 capitalize cursor-pointer transition ease-in duration-100 border-subtext/20 border-y-[1.7px] first:border-l-[1.7px] last:border-r-[1.7px] first:rounded-tl-xl first:rounded-bl-xl last:rounded-tr-xl last:rounded-br-xl min-w-[140px] ${
                activeItem === item &&
                "bg-primary !text-light font-medium !border-primary"
              }`}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SwitchContentNav;
