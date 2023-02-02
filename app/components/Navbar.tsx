import { FaEllipsisH } from "react-icons/fa";

export const Navbar = () => {
  return (
    <header className="px-5 pt-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-xl">Husker Gym</div>
          <div className="-mt-1 font-bold text-gray-500">
            Thursday, February 2
          </div>
        </div>

        <div className="bg-gray-100 text-gray-800 p-1 rounded-full">
          <FaEllipsisH />
        </div>
      </div>
    </header>
  );
};
