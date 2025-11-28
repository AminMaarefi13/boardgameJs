import React, { useEffect, useState } from "react";
import { socket } from "../../network/socket";

export default function RoomInvite({ roomId }) {
  const [pendingInvites, setPendingInvites] = useState([]);
  const [invitees, setInvitees] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) fetchPendingInvites();
    socket.on("room_invite_received", fetchPendingInvites);
    return () => {
      socket.off("room_invite_received", fetchPendingInvites);
    };
    // eslint-disable-next-line
  }, [roomId, open]);

  useEffect(() => {
    socket.emit("get_friends_data", (data) => {
      setInvitees(data.friends || []);
    });
    if (open) fetchPendingInvites();
    // eslint-disable-next-line
  }, [open]);

  function fetchPendingInvites() {
    socket.emit("get_pending_room_invites", { roomId }, (data) => {
      setPendingInvites(data || []);
    });
  }

  const handleInvite = (friendId) => {
    socket.emit("invite_friend_to_room", { friendId, roomId }, (res) => {
      if (res.success) fetchPendingInvites();
      alert(res.message);
    });
  };

  const handleCancelInvite = (friendId) => {
    socket.emit("cancel_room_invite", { friendId, roomId }, (res) => {
      if (res.success) fetchPendingInvites();
      alert(res.message);
    });
  };

  return (
    <div className="bg-gray-800">
      <button
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold w-full h-12 mb-2"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "بستن دعوت دوستان" : "دعوت دوستان به روم"}
      </button>
      {open && (
        <div>
          <div className="mb-3">
            <span className="text-gray-300">لیست دوستان:</span>
            <ul className="flex flex-col gap-2 mt-2">
              {invitees.length === 0 && (
                <li className="text-gray-400">دوستی پیدا نشد.</li>
              )}
              {invitees.map((f) => (
                <li
                  key={f._id}
                  className="flex items-center justify-between gap-3 bg-gray-700 rounded-lg px-3 py-2 shadow"
                >
                  <div className="w-full flex items-center justify-between gap-4 bg-gray-700 rounded-lg px-3 py-2 shadow">
                    <div className="flex items-center gap-3 bg-gray-700 rounded-lg ">
                      {/* آواتار دایره‌ای با حرف اول اسم */}
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
                        {f.name?.charAt(0) || "?"}
                      </div>
                      <span className="text-white font-medium">{f.name}</span>
                    </div>
                    <div>
                      <button
                        className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow"
                        onClick={() => handleInvite(f._id)}
                        disabled={pendingInvites.some(
                          (inv) => inv.friendId === f._id
                        )}
                      >
                        دعوت
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {pendingInvites.length > 0 && (
            <div className="mb-3">
              <span className="text-gray-300">دعوت های ارسال شده:</span>
              <ul className="mt-2">
                {pendingInvites.map((inv) => (
                  <li
                    key={inv.to + "-" + inv.from}
                    className="flex  items-center justify-between gap-2 bg-gray-700 rounded-lg px-3 py-2 shadow"
                  >
                    <span className="w-full text-white">{inv.toName}</span>
                    <button
                      className="bg-red-500 w-20 h-8 hover:bg-red-600 text-white px-2 py-1 rounded text-xs ml-auto"
                      onClick={() => handleCancelInvite(inv.to)}
                    >
                      حذف
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
