import React from 'react'
import axiosInstance from "../Utils/axiosInstance";

const ProfileUser = () => {
    const getProfileData = ()=>{

        const token = JSON.parse(localStorage.getItem('token'))

        const header={
            headers:{
                Authorization:`Bearer ${token}`
            }
        }

    try {
      const response =  axiosInstance.get("users/profile/${userId}", header);
      console.log("User data", response.data);

      // Check if the response indicates success
     
      
    
    } catch (error) {
      console.log(error?.message);
      console.error("Error while doing register:", error);
    }
  return (
    <div>
      <p>this is my profile Pages</p>
      <button onClick={getProfileData}>Profile Data</button>
    </div>
  )
}
}

export default ProfileUser
