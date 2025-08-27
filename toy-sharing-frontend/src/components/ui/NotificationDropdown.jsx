import { useState } from "react";
import { Bell } from "lucide-react";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          2
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-semibold">Thông báo</h3>
            <p className="text-sm text-gray-600 mt-2">Chưa có thông báo mới</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
