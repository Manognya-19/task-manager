import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Modal from "../Modal";
import AnimeGroup from "../AnimeGroup";
import { toast } from "react-hot-toast";


const SelectUsers = ({ selectedUsers = [], setSelectedUsers = ()=>{}, }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

  // ✅ Fetch users ONCE
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
        setAllUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching users", err);
        toast.error("Unable to load users");
      }
    };
    getAllUsers();
  }, []);

  // ✅ Sync temp selection only when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTempSelectedUsers(selectedUsers);
    }
  }, [selectedUsers,isModalOpen]);

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  
const selectedUserAnimes = allUsers
  .filter(user => selectedUsers.includes(user._id))
  .map(user => user.profileImageUrl);

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAnimes.length === 0 &&(
          <button className="card-btn" onClick={() => setIsModalOpen(true)}>
        <LuUsers className="text-sm" /> Add Members
      </button>
      )}

      {selectedUserAnimes.length > 0 &&(
        <div className="cursor-pointer" onClick={()=>setIsModalOpen(true)}>
          <AnimeGroup anime = {selectedUserAnimes} maxVisible={3} />
        </div>
      )}
      

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 border-b"
            >
              <img
                src={user.profileImageUrl || "/avatar.png"}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <input
                type="checkbox"
                checked={tempSelectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={()=> setIsModalOpen(false)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>
            DONE
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
