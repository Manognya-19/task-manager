import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
// import { useEffect } from "react";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState("");
  
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault()

    let profileImageUrl = ''
    if (!fullName) {
      setError("Please enter full name")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!password) {
      setError("Please enter the password")
      return
    }

    setError("");
    //Login API Call
  try {
    //upload image if present
    if(profilePic){
      const imgUploadRes = await uploadImage(profilePic);
      profileImageUrl = imgUploadRes.imageUrl || "";
    }
    const response = await axiosInstance.post(
      API_PATHS.AUTH.REGISTER,
      {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      }
    );

    const { token, role } = response.data;

    if (token) {
      // Save token
      localStorage.setItem("token", token);

      // Update global user context
      updateUser(response.data);

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/user/dashboard")
      }
    }
  } catch (error) {
    if (error.response && error.response.data?.message) {
      setError(error.response.data.message);
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

};
  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">
          Create an Account
        </h3>

        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector
            image={profilePic}
            setImage={setProfilePic}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="text-sm text-slate-700 mb-1 block">
              Full Name
            </label>
            <input
              type="text"
              placeholder="abc"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}

            />
            </div>

            <div>
             <label className="text-sm text-slate-700 mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="abc@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>

            <div>
              <label className="text-sm text-slate-700 mb-1 block">
              Password
            </label>
            <input
              type="password"
              placeholder="Min 8 Characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            </div>

            <div>
            <label className="text-sm text-slate-700 mb-1 block">
              Admin Invite Token
            </label>
            <input
               value={adminInviteToken}
               onChange={(e) => setAdminInviteToken(e.target.value)}
              placeholder="6 Digit Token"
              type="text"
            />
          </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs pb-2.5">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link
              className="font-medium text-primary underline"
              to="/login"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp;
