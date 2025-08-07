import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./admin.css";
import Swal from "sweetalert2";
import { deleteuser } from "../Redux/userSlice";
import Navadmin from "./Navadmin";

function Agency({ ping, setping }) {
  const users = useSelector((state) => state.user.userList);
  console.log(users);
  const dispatch = useDispatch();
  const suremodal = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteuser(id));
        Swal.fire({
          title: "Deleted!",
          text: "This user has been deleted.",
          icon: "success",
        });
        setping((prevPing) => !prevPing);
      }
    });
  };
  return (
    <div className="ges-trips" >
      <Navadmin />
      <div className="container mt-4" style={{ backgroundColor: "#212529" }}>
        <h2 className="text-center text-white">Travelers Overview</h2>
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Category</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users
              ?.filter((el) => el.category === "agency")
              .map((el) => (
                <tr key={el?.id}>
                  <td>
                    {el?.name} {el?.last_name}
                  </td>
                  <td>{el?.email}</td>
                  <td>{el?.category}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        suremodal(el?._id);
                        setping(!ping);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Agency;
