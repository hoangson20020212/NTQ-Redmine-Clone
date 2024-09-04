import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import projectsApi from "~/apis/projects.api";
import usersApi from "~/apis/user.api";
import { useQuery } from "@tanstack/react-query";
import config from "~/constants/config";

const MemberProject: React.FC = () => {
  const { id, userId } = useParams();

  const fetchUserDetails = async () => {
    const response = await usersApi.getUserById(Number(userId));
    return response.data.user;
  };

  const { data: memberOfProject } = useQuery({
    queryKey: ["memberOfProject"],
    queryFn: fetchUserDetails,
    staleTime: config.staleTime,
  });

  const fetchProjects = async () => {
    const response = await projectsApi.getProjectById({ id: Number(id) });
    return response.data.project;
  };

  const { data: projectOfUser } = useQuery({
    queryKey: ["projectOfUser"],
    queryFn: fetchProjects,
    staleTime: config.staleTime,
  });

  useEffect(() => {
    fetchUserDetails();
    fetchProjects();
  }, [userId]);

  console.log(memberOfProject, projectOfUser);

  return (
    <div className="bg-white min-h-84 mt-4 grid gap-2 auto-rows-auto grid-cols-2">
      <div className="p-5">
        <div className="flex items-center col-span-2 ml- mb-4">
          <div className="flex gap-2 flex-wrap">
            <div className="size-16 p-1 border bg-white">
              <img
                src="https://img-cdn.pixlr.com/image-generator/history/65bb506dcb310754719cf81f/ede935de-1138-4f66-8ed7-44bd16efc709/medium.webp"
                alt="avatar"
              />
            </div>
          </div>

          <div className="ml-4">
            <h2 className="text-lg font-bold">
              {memberOfProject && memberOfProject?.firstname}
              {memberOfProject && memberOfProject?.lastname}
            </h2>
          </div>
        </div>

        <div className="pr-4">
          <ul className="text-xs ml-8 text-gray-600 list-disc list-inside">
            <li>Email: {memberOfProject?.mail}</li>
            <li>Registered on: {moment(memberOfProject?.created_on).format("DD/MM/YYYY")}</li>
            <li>Last connection: {moment(memberOfProject?.last_login_on).format("DD/MM/YYYY")} </li>
          </ul>
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700">Projects</h3>
            <ul className="ml-8 text-gray-600 list-disc list-inside text-xs">
              <li>{projectOfUser?.name} (Developer, 07/08/2024)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 pl-4 text-xs">
        <h3 className="text-base font-semibold text-ocean-blue">Activity</h3>
        <p className=" text-gray-600 mb-2">Reported issues: 2</p>
        <div className="space-y-4">
          <div>
            <p className=" text-gray-600">08/05/2024</p>
            <p className=" ">02:34 PM [Fresher]_ ReactJS Fresher - 10.00 hours (Bug #123061 (New) : Bug tailwind css)</p>
            <p className=" text-gray-500">no comment</p>
          </div>
          <div>
            <p className=" text-gray-600">08/05/2024</p>
            <p className=" ">02:34 PM [Fresher]_ ReactJS Fresher - 10.00 hours (Bug #123061 (New) : Bug tailwind css)</p>
            <p className=" text-gray-500">no comment</p>
          </div>
          <div>
            <p className=" text-gray-600">08/05/2024</p>
            <p className=" ">02:34 PM [Fresher]_ ReactJS Fresher - 10.00 hours (Bug #123061 (New) : Bug tailwind css)</p>
            <p className=" text-gray-500">no comment</p>
          </div>
          <div>
            <p className=" text-gray-600">08/05/2024</p>
            <p className=" ">02:34 PM [Fresher]_ ReactJS Fresher - 10.00 hours (Bug #123061 (New) : Bug tailwind css)</p>
            <p className=" text-gray-500">no comment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProject;
