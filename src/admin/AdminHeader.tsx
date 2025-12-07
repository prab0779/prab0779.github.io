import { useAuth } from "../../hooks/useAuth";
import { Users, LogOut } from "lucide-react";
import { useContext } from "react";
import { PresenceContext } from "../OnlinePresenceProvider";

export default function AdminHeader() {
  const { user, signOut } = useAuth();
  const { onlineCount } = useContext(PresenceContext);

  return (
    <header className="bg-black border-b border-red-900 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2 text-red-400">
        <Users className="w-5 h-5" />
        <span>{onlineCount} online</span>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-gray-300">{user?.email}</span>

        <button
          onClick={signOut}
          className="flex items-center space-x-1 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
