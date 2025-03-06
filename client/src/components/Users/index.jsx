import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { fetchUsersData } from "@/Store/user/userSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { users, page, total_pages, status } = useSelector((state) => state.user.users);
  const { ref, inView } = useInView({ threshold: 0.5 });

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchUsersData({ page: 1, limit: 30, search }));
  }, [dispatch, search]);


  useEffect(() => {
    if (inView && page < total_pages && status !== "loading") {
      dispatch(fetchUsersData({ page: page + 1, limit: 30, search }));
    }
  }, [inView, total_pages, status, dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">User List</h2>

      <Input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full sm:w-1/2"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map((user) => (
          <Card key={user._id} className="shadow-md p-2 ">
            <CardHeader className="font-semibold">{user.fullName}</CardHeader>
            <CardContent>
              <p className="text-gray-700">{user.email}</p>
              <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {status === "loading" && <Loader className="animate-spin mx-auto my-4" />}
      <div ref={ref} />
    </div>
  );
};

export default Users;
