import http from "~/utils/http";

// Interface for the role in a membership
export interface Role {
  id: number;
  name: string;
  inherited?: boolean;
}

// Interface for the user or group in a membership
export interface User {
  id: number;
  name: string;
}

// Interface for the membership
export interface Membership {
  id: number;
  project: {
    id: number;
    name: string;
  };
  user: User;
  group?: User;
  roles: Role[];
}

// Interface for the response when fetching memberships
export interface MembershipsResponse {
  memberships: Membership[];
  total_count: number;
  limit: number;
  offset: number;
}

// Interface for the new membership to be created
export interface NewMembership {
  user_id: number;
  role_ids: number[];
}

// Interface for the updated membership
export interface UpdatedMembership {
  role_ids: number[];
}

const projectMembershipsApi = {
  // Get all memberships for a project
  getProjectMemberships(projectId: string | number) {
    return http.get<MembershipsResponse>(`/projects/${projectId}/memberships.json`);
  },

  // Get a specific membership by ID
  getMembership(membershipId: number) {
    return http.get<Membership>(`/memberships/${membershipId}.json`);
  },

  // Create a new membership for a project
  createMembership(projectId: string | number, newMembership: NewMembership) {
    return http.post<Membership>(`/projects/${projectId}/memberships.json`, { membership: newMembership });
  },

  // Update a membership by ID
  updateMembership(membershipId: number, updatedMembership: UpdatedMembership) {
    return http.put<void>(`/memberships/${membershipId}.json`, { membership: updatedMembership });
  },

  // Delete a membership by ID
  deleteMembership(membershipId: number) {
    return http.delete<void>(`/memberships/${membershipId}.json`);
  },
};

export default projectMembershipsApi;
