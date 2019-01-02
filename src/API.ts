/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  APIkey?: string | null,
  email?: string | null,
  dirtyTables?: boolean | null,
};

export type UpdateUserInput = {
  id: string,
  APIkey?: string | null,
  email?: string | null,
  dirtyTables?: boolean | null,
};

export type DeleteUserInput = {
  id?: string | null,
};

export type CreateProjectInput = {
  id?: string | null,
  userId: string,
  date: string,
  name?: string | null,
  company?: string | null,
  description?: string | null,
};

export type UpdateProjectInput = {
  id: string,
  userId?: string | null,
  date?: string | null,
  name?: string | null,
  company?: string | null,
  description?: string | null,
};

export type DeleteProjectInput = {
  id?: string | null,
};

export type CreateProjectSkillInput = {
  id?: string | null,
  userId: string,
  description?: string | null,
  skillId: string,
  toolIds?: Array< string | null > | null,
  projectSkillProjectId: string,
};

export type UpdateProjectSkillInput = {
  id: string,
  userId?: string | null,
  description?: string | null,
  skillId?: string | null,
  toolIds?: Array< string | null > | null,
  projectSkillProjectId?: string | null,
};

export type DeleteProjectSkillInput = {
  id?: string | null,
};

export type CreateCategoryInput = {
  id?: string | null,
  userId: string,
  name: string,
};

export type UpdateCategoryInput = {
  id: string,
  userId?: string | null,
  name?: string | null,
};

export type DeleteCategoryInput = {
  id?: string | null,
};

export type CreateSkillInput = {
  id?: string | null,
  userId: string,
  name: string,
  skillCategoryId?: string | null,
};

export type UpdateSkillInput = {
  id: string,
  userId?: string | null,
  name?: string | null,
  skillCategoryId?: string | null,
};

export type DeleteSkillInput = {
  id?: string | null,
};

export type CreateToolInput = {
  id?: string | null,
  userId: string,
  name: string,
  toolSkillId?: string | null,
};

export type UpdateToolInput = {
  id: string,
  userId?: string | null,
  name?: string | null,
  toolSkillId?: string | null,
};

export type DeleteToolInput = {
  id?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelStringFilterInput | null,
  APIkey?: ModelStringFilterInput | null,
  email?: ModelStringFilterInput | null,
  dirtyTables?: ModelBooleanFilterInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelBooleanFilterInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelProjectFilterInput = {
  id?: ModelIDFilterInput | null,
  userId?: ModelStringFilterInput | null,
  date?: ModelStringFilterInput | null,
  name?: ModelStringFilterInput | null,
  company?: ModelStringFilterInput | null,
  description?: ModelStringFilterInput | null,
  and?: Array< ModelProjectFilterInput | null > | null,
  or?: Array< ModelProjectFilterInput | null > | null,
  not?: ModelProjectFilterInput | null,
};

export type ModelIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelProjectSkillFilterInput = {
  id?: ModelIDFilterInput | null,
  userId?: ModelStringFilterInput | null,
  description?: ModelStringFilterInput | null,
  skillId?: ModelStringFilterInput | null,
  toolIds?: ModelStringFilterInput | null,
  and?: Array< ModelProjectSkillFilterInput | null > | null,
  or?: Array< ModelProjectSkillFilterInput | null > | null,
  not?: ModelProjectSkillFilterInput | null,
};

export type ModelCategoryFilterInput = {
  id?: ModelIDFilterInput | null,
  userId?: ModelStringFilterInput | null,
  name?: ModelStringFilterInput | null,
  and?: Array< ModelCategoryFilterInput | null > | null,
  or?: Array< ModelCategoryFilterInput | null > | null,
  not?: ModelCategoryFilterInput | null,
};

export type ModelSkillFilterInput = {
  id?: ModelIDFilterInput | null,
  userId?: ModelStringFilterInput | null,
  name?: ModelStringFilterInput | null,
  and?: Array< ModelSkillFilterInput | null > | null,
  or?: Array< ModelSkillFilterInput | null > | null,
  not?: ModelSkillFilterInput | null,
};

export type ModelToolFilterInput = {
  id?: ModelIDFilterInput | null,
  userId?: ModelStringFilterInput | null,
  name?: ModelStringFilterInput | null,
  and?: Array< ModelToolFilterInput | null > | null,
  or?: Array< ModelToolFilterInput | null > | null,
  not?: ModelToolFilterInput | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser:  {
    __typename: "User",
    id: string,
    APIkey: string | null,
    email: string | null,
    dirtyTables: boolean | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    id: string,
    APIkey: string | null,
    email: string | null,
    dirtyTables: boolean | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser:  {
    __typename: "User",
    id: string,
    APIkey: string | null,
    email: string | null,
    dirtyTables: boolean | null,
  } | null,
};

export type CreateProjectMutationVariables = {
  input: CreateProjectInput,
};

export type CreateProjectMutation = {
  createProject:  {
    __typename: "Project",
    id: string,
    userId: string,
    date: string,
    name: string | null,
    company: string | null,
    description: string | null,
    skills:  {
      __typename: "ModelProjectSkillConnection",
      items:  Array< {
        __typename: "ProjectSkill",
        id: string,
        userId: string,
        description: string | null,
        skillId: string,
        toolIds: Array< string | null > | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type UpdateProjectMutationVariables = {
  input: UpdateProjectInput,
};

export type UpdateProjectMutation = {
  updateProject:  {
    __typename: "Project",
    id: string,
    userId: string,
    date: string,
    name: string | null,
    company: string | null,
    description: string | null,
    skills:  {
      __typename: "ModelProjectSkillConnection",
      items:  Array< {
        __typename: "ProjectSkill",
        id: string,
        userId: string,
        description: string | null,
        skillId: string,
        toolIds: Array< string | null > | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type DeleteProjectMutationVariables = {
  input: DeleteProjectInput,
};

export type DeleteProjectMutation = {
  deleteProject:  {
    __typename: "Project",
    id: string,
    userId: string,
    date: string,
    name: string | null,
    company: string | null,
    description: string | null,
    skills:  {
      __typename: "ModelProjectSkillConnection",
      items:  Array< {
        __typename: "ProjectSkill",
        id: string,
        userId: string,
        description: string | null,
        skillId: string,
        toolIds: Array< string | null > | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type CreateProjectSkillMutationVariables = {
  input: CreateProjectSkillInput,
};

export type CreateProjectSkillMutation = {
  createProjectSkill:  {
    __typename: "ProjectSkill",
    id: string,
    userId: string,
    project:  {
      __typename: "Project",
      id: string,
      userId: string,
      date: string,
      name: string | null,
      company: string | null,
      description: string | null,
    },
    description: string | null,
    skillId: string,
    toolIds: Array< string | null > | null,
  } | null,
};

export type UpdateProjectSkillMutationVariables = {
  input: UpdateProjectSkillInput,
};

export type UpdateProjectSkillMutation = {
  updateProjectSkill:  {
    __typename: "ProjectSkill",
    id: string,
    userId: string,
    project:  {
      __typename: "Project",
      id: string,
      userId: string,
      date: string,
      name: string | null,
      company: string | null,
      description: string | null,
    },
    description: string | null,
    skillId: string,
    toolIds: Array< string | null > | null,
  } | null,
};

export type DeleteProjectSkillMutationVariables = {
  input: DeleteProjectSkillInput,
};

export type DeleteProjectSkillMutation = {
  deleteProjectSkill:  {
    __typename: "ProjectSkill",
    id: string,
    userId: string,
    project:  {
      __typename: "Project",
      id: string,
      userId: string,
      date: string,
      name: string | null,
      company: string | null,
      description: string | null,
    },
    description: string | null,
    skillId: string,
    toolIds: Array< string | null > | null,
  } | null,
};

export type CreateCategoryMutationVariables = {
  input: CreateCategoryInput,
};

export type CreateCategoryMutation = {
  createCategory:  {
    __typename: "Category",
    id: string,
    userId: string,
    name: string,
    skills:  {
      __typename: "ModelSkillConnection",
      items:  Array< {
        __typename: "Skill",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type UpdateCategoryMutationVariables = {
  input: UpdateCategoryInput,
};

export type UpdateCategoryMutation = {
  updateCategory:  {
    __typename: "Category",
    id: string,
    userId: string,
    name: string,
    skills:  {
      __typename: "ModelSkillConnection",
      items:  Array< {
        __typename: "Skill",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type DeleteCategoryMutationVariables = {
  input: DeleteCategoryInput,
};

export type DeleteCategoryMutation = {
  deleteCategory:  {
    __typename: "Category",
    id: string,
    userId: string,
    name: string,
    skills:  {
      __typename: "ModelSkillConnection",
      items:  Array< {
        __typename: "Skill",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type CreateSkillMutationVariables = {
  input: CreateSkillInput,
};

export type CreateSkillMutation = {
  createSkill:  {
    __typename: "Skill",
    id: string,
    userId: string,
    name: string,
    category:  {
      __typename: "Category",
      id: string,
      userId: string,
      name: string,
    } | null,
    tools:  {
      __typename: "ModelToolConnection",
      items:  Array< {
        __typename: "Tool",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type UpdateSkillMutationVariables = {
  input: UpdateSkillInput,
};

export type UpdateSkillMutation = {
  updateSkill:  {
    __typename: "Skill",
    id: string,
    userId: string,
    name: string,
    category:  {
      __typename: "Category",
      id: string,
      userId: string,
      name: string,
    } | null,
    tools:  {
      __typename: "ModelToolConnection",
      items:  Array< {
        __typename: "Tool",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type DeleteSkillMutationVariables = {
  input: DeleteSkillInput,
};

export type DeleteSkillMutation = {
  deleteSkill:  {
    __typename: "Skill",
    id: string,
    userId: string,
    name: string,
    category:  {
      __typename: "Category",
      id: string,
      userId: string,
      name: string,
    } | null,
    tools:  {
      __typename: "ModelToolConnection",
      items:  Array< {
        __typename: "Tool",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type CreateToolMutationVariables = {
  input: CreateToolInput,
};

export type CreateToolMutation = {
  createTool:  {
    __typename: "Tool",
    id: string,
    userId: string,
    skill:  {
      __typename: "Skill",
      id: string,
      userId: string,
      name: string,
    } | null,
    name: string,
  } | null,
};

export type UpdateToolMutationVariables = {
  input: UpdateToolInput,
};

export type UpdateToolMutation = {
  updateTool:  {
    __typename: "Tool",
    id: string,
    userId: string,
    skill:  {
      __typename: "Skill",
      id: string,
      userId: string,
      name: string,
    } | null,
    name: string,
  } | null,
};

export type DeleteToolMutationVariables = {
  input: DeleteToolInput,
};

export type DeleteToolMutation = {
  deleteTool:  {
    __typename: "Tool",
    id: string,
    userId: string,
    skill:  {
      __typename: "Skill",
      id: string,
      userId: string,
      name: string,
    } | null,
    name: string,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    id: string,
    APIkey: string | null,
    email: string | null,
    dirtyTables: boolean | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      APIkey: string | null,
      email: string | null,
      dirtyTables: boolean | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetProjectQueryVariables = {
  id: string,
};

export type GetProjectQuery = {
  getProject:  {
    __typename: "Project",
    id: string,
    userId: string,
    date: string,
    name: string | null,
    company: string | null,
    description: string | null,
    skills:  {
      __typename: "ModelProjectSkillConnection",
      items:  Array< {
        __typename: "ProjectSkill",
        id: string,
        userId: string,
        description: string | null,
        skillId: string,
        toolIds: Array< string | null > | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type ListProjectsQueryVariables = {
  filter?: ModelProjectFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProjectsQuery = {
  listProjects:  {
    __typename: "ModelProjectConnection",
    items:  Array< {
      __typename: "Project",
      id: string,
      userId: string,
      date: string,
      name: string | null,
      company: string | null,
      description: string | null,
      skills:  {
        __typename: "ModelProjectSkillConnection",
        items:  Array< {
          __typename: "ProjectSkill",
          id: string,
          userId: string,
          description: string | null,
          skillId: string,
          toolIds: Array< string | null > | null,
        } | null > | null,
        nextToken: string | null,
      } | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetProjectSkillQueryVariables = {
  id: string,
};

export type GetProjectSkillQuery = {
  getProjectSkill:  {
    __typename: "ProjectSkill",
    id: string,
    userId: string,
    project:  {
      __typename: "Project",
      id: string,
      userId: string,
      date: string,
      name: string | null,
      company: string | null,
      description: string | null,
    },
    description: string | null,
    skillId: string,
    toolIds: Array< string | null > | null,
  } | null,
};

export type ListProjectSkillsQueryVariables = {
  filter?: ModelProjectSkillFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProjectSkillsQuery = {
  listProjectSkills:  {
    __typename: "ModelProjectSkillConnection",
    items:  Array< {
      __typename: "ProjectSkill",
      id: string,
      userId: string,
      project:  {
        __typename: "Project",
        id: string,
        userId: string,
        date: string,
        name: string | null,
        company: string | null,
        description: string | null,
      },
      description: string | null,
      skillId: string,
      toolIds: Array< string | null > | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetCategoryQueryVariables = {
  id: string,
};

export type GetCategoryQuery = {
  getCategory:  {
    __typename: "Category",
    id: string,
    userId: string,
    name: string,
    skills:  {
      __typename: "ModelSkillConnection",
      items:  Array< {
        __typename: "Skill",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type ListCategorysQueryVariables = {
  filter?: ModelCategoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCategorysQuery = {
  listCategorys:  {
    __typename: "ModelCategoryConnection",
    items:  Array< {
      __typename: "Category",
      id: string,
      userId: string,
      name: string,
      skills:  {
        __typename: "ModelSkillConnection",
        items:  Array< {
          __typename: "Skill",
          id: string,
          userId: string,
          name: string,
        } | null > | null,
        nextToken: string | null,
      } | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetSkillQueryVariables = {
  id: string,
};

export type GetSkillQuery = {
  getSkill:  {
    __typename: "Skill",
    id: string,
    userId: string,
    name: string,
    category:  {
      __typename: "Category",
      id: string,
      userId: string,
      name: string,
    } | null,
    tools:  {
      __typename: "ModelToolConnection",
      items:  Array< {
        __typename: "Tool",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type ListSkillsQueryVariables = {
  filter?: ModelSkillFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSkillsQuery = {
  listSkills:  {
    __typename: "ModelSkillConnection",
    items:  Array< {
      __typename: "Skill",
      id: string,
      userId: string,
      name: string,
      category:  {
        __typename: "Category",
        id: string,
        userId: string,
        name: string,
      } | null,
      tools:  {
        __typename: "ModelToolConnection",
        items:  Array< {
          __typename: "Tool",
          id: string,
          userId: string,
          name: string,
        } | null > | null,
        nextToken: string | null,
      } | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetToolQueryVariables = {
  id: string,
};

export type GetToolQuery = {
  getTool:  {
    __typename: "Tool",
    id: string,
    userId: string,
    skill:  {
      __typename: "Skill",
      id: string,
      userId: string,
      name: string,
    } | null,
    name: string,
  } | null,
};

export type ListToolsQueryVariables = {
  filter?: ModelToolFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListToolsQuery = {
  listTools:  {
    __typename: "ModelToolConnection",
    items:  Array< {
      __typename: "Tool",
      id: string,
      userId: string,
      skill:  {
        __typename: "Skill",
        id: string,
        userId: string,
        name: string,
      } | null,
      name: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateUserSubscription = {
  onCreateUser:  {
    __typename: "User",
    id: string,
    APIkey: string | null,
    email: string | null,
    dirtyTables: boolean | null,
  } | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser:  {
    __typename: "User",
    id: string,
    APIkey: string | null,
    email: string | null,
    dirtyTables: boolean | null,
  } | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser:  {
    __typename: "User",
    id: string,
    APIkey: string | null,
    email: string | null,
    dirtyTables: boolean | null,
  } | null,
};

export type OnCreateProjectSubscription = {
  onCreateProject:  {
    __typename: "Project",
    id: string,
    userId: string,
    date: string,
    name: string | null,
    company: string | null,
    description: string | null,
    skills:  {
      __typename: "ModelProjectSkillConnection",
      items:  Array< {
        __typename: "ProjectSkill",
        id: string,
        userId: string,
        description: string | null,
        skillId: string,
        toolIds: Array< string | null > | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnUpdateProjectSubscription = {
  onUpdateProject:  {
    __typename: "Project",
    id: string,
    userId: string,
    date: string,
    name: string | null,
    company: string | null,
    description: string | null,
    skills:  {
      __typename: "ModelProjectSkillConnection",
      items:  Array< {
        __typename: "ProjectSkill",
        id: string,
        userId: string,
        description: string | null,
        skillId: string,
        toolIds: Array< string | null > | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnDeleteProjectSubscription = {
  onDeleteProject:  {
    __typename: "Project",
    id: string,
    userId: string,
    date: string,
    name: string | null,
    company: string | null,
    description: string | null,
    skills:  {
      __typename: "ModelProjectSkillConnection",
      items:  Array< {
        __typename: "ProjectSkill",
        id: string,
        userId: string,
        description: string | null,
        skillId: string,
        toolIds: Array< string | null > | null,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnCreateProjectSkillSubscription = {
  onCreateProjectSkill:  {
    __typename: "ProjectSkill",
    id: string,
    userId: string,
    project:  {
      __typename: "Project",
      id: string,
      userId: string,
      date: string,
      name: string | null,
      company: string | null,
      description: string | null,
    },
    description: string | null,
    skillId: string,
    toolIds: Array< string | null > | null,
  } | null,
};

export type OnUpdateProjectSkillSubscription = {
  onUpdateProjectSkill:  {
    __typename: "ProjectSkill",
    id: string,
    userId: string,
    project:  {
      __typename: "Project",
      id: string,
      userId: string,
      date: string,
      name: string | null,
      company: string | null,
      description: string | null,
    },
    description: string | null,
    skillId: string,
    toolIds: Array< string | null > | null,
  } | null,
};

export type OnDeleteProjectSkillSubscription = {
  onDeleteProjectSkill:  {
    __typename: "ProjectSkill",
    id: string,
    userId: string,
    project:  {
      __typename: "Project",
      id: string,
      userId: string,
      date: string,
      name: string | null,
      company: string | null,
      description: string | null,
    },
    description: string | null,
    skillId: string,
    toolIds: Array< string | null > | null,
  } | null,
};

export type OnCreateCategorySubscription = {
  onCreateCategory:  {
    __typename: "Category",
    id: string,
    userId: string,
    name: string,
    skills:  {
      __typename: "ModelSkillConnection",
      items:  Array< {
        __typename: "Skill",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnUpdateCategorySubscription = {
  onUpdateCategory:  {
    __typename: "Category",
    id: string,
    userId: string,
    name: string,
    skills:  {
      __typename: "ModelSkillConnection",
      items:  Array< {
        __typename: "Skill",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnDeleteCategorySubscription = {
  onDeleteCategory:  {
    __typename: "Category",
    id: string,
    userId: string,
    name: string,
    skills:  {
      __typename: "ModelSkillConnection",
      items:  Array< {
        __typename: "Skill",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnCreateSkillSubscription = {
  onCreateSkill:  {
    __typename: "Skill",
    id: string,
    userId: string,
    name: string,
    category:  {
      __typename: "Category",
      id: string,
      userId: string,
      name: string,
    } | null,
    tools:  {
      __typename: "ModelToolConnection",
      items:  Array< {
        __typename: "Tool",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnUpdateSkillSubscription = {
  onUpdateSkill:  {
    __typename: "Skill",
    id: string,
    userId: string,
    name: string,
    category:  {
      __typename: "Category",
      id: string,
      userId: string,
      name: string,
    } | null,
    tools:  {
      __typename: "ModelToolConnection",
      items:  Array< {
        __typename: "Tool",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnDeleteSkillSubscription = {
  onDeleteSkill:  {
    __typename: "Skill",
    id: string,
    userId: string,
    name: string,
    category:  {
      __typename: "Category",
      id: string,
      userId: string,
      name: string,
    } | null,
    tools:  {
      __typename: "ModelToolConnection",
      items:  Array< {
        __typename: "Tool",
        id: string,
        userId: string,
        name: string,
      } | null > | null,
      nextToken: string | null,
    } | null,
  } | null,
};

export type OnCreateToolSubscription = {
  onCreateTool:  {
    __typename: "Tool",
    id: string,
    userId: string,
    skill:  {
      __typename: "Skill",
      id: string,
      userId: string,
      name: string,
    } | null,
    name: string,
  } | null,
};

export type OnUpdateToolSubscription = {
  onUpdateTool:  {
    __typename: "Tool",
    id: string,
    userId: string,
    skill:  {
      __typename: "Skill",
      id: string,
      userId: string,
      name: string,
    } | null,
    name: string,
  } | null,
};

export type OnDeleteToolSubscription = {
  onDeleteTool:  {
    __typename: "Tool",
    id: string,
    userId: string,
    skill:  {
      __typename: "Skill",
      id: string,
      userId: string,
      name: string,
    } | null,
    name: string,
  } | null,
};
