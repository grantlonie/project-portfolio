// eslint-disable
// this is an auto generated file. This will be overwritten

export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    APIkey
    email
  }
}
`;
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    APIkey
    email
  }
}
`;
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
    id
    APIkey
    email
  }
}
`;
export const createProject = `mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    userId
    date
    name
    company
    description
    skills {
      items {
        id
        userId
        description
        skillId
        toolIds
      }
      nextToken
    }
  }
}
`;
export const updateProject = `mutation UpdateProject($input: UpdateProjectInput!) {
  updateProject(input: $input) {
    id
    userId
    date
    name
    company
    description
    skills {
      items {
        id
        userId
        description
        skillId
        toolIds
      }
      nextToken
    }
  }
}
`;
export const deleteProject = `mutation DeleteProject($input: DeleteProjectInput!) {
  deleteProject(input: $input) {
    id
    userId
    date
    name
    company
    description
    skills {
      items {
        id
        userId
        description
        skillId
        toolIds
      }
      nextToken
    }
  }
}
`;
export const createProjectSkill = `mutation CreateProjectSkill($input: CreateProjectSkillInput!) {
  createProjectSkill(input: $input) {
    id
    userId
    project {
      id
      userId
      date
      name
      company
      description
    }
    description
    skillId
    toolIds
  }
}
`;
export const updateProjectSkill = `mutation UpdateProjectSkill($input: UpdateProjectSkillInput!) {
  updateProjectSkill(input: $input) {
    id
    userId
    project {
      id
      userId
      date
      name
      company
      description
    }
    description
    skillId
    toolIds
  }
}
`;
export const deleteProjectSkill = `mutation DeleteProjectSkill($input: DeleteProjectSkillInput!) {
  deleteProjectSkill(input: $input) {
    id
    userId
    project {
      id
      userId
      date
      name
      company
      description
    }
    description
    skillId
    toolIds
  }
}
`;
export const createCategory = `mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    id
    userId
    name
    skills {
      items {
        id
        userId
        name
      }
      nextToken
    }
  }
}
`;
export const updateCategory = `mutation UpdateCategory($input: UpdateCategoryInput!) {
  updateCategory(input: $input) {
    id
    userId
    name
    skills {
      items {
        id
        userId
        name
      }
      nextToken
    }
  }
}
`;
export const deleteCategory = `mutation DeleteCategory($input: DeleteCategoryInput!) {
  deleteCategory(input: $input) {
    id
    userId
    name
    skills {
      items {
        id
        userId
        name
      }
      nextToken
    }
  }
}
`;
export const createSkill = `mutation CreateSkill($input: CreateSkillInput!) {
  createSkill(input: $input) {
    id
    userId
    name
    category {
      id
      userId
      name
    }
    tools {
      items {
        id
        userId
        name
      }
      nextToken
    }
  }
}
`;
export const updateSkill = `mutation UpdateSkill($input: UpdateSkillInput!) {
  updateSkill(input: $input) {
    id
    userId
    name
    category {
      id
      userId
      name
    }
    tools {
      items {
        id
        userId
        name
      }
      nextToken
    }
  }
}
`;
export const deleteSkill = `mutation DeleteSkill($input: DeleteSkillInput!) {
  deleteSkill(input: $input) {
    id
    userId
    name
    category {
      id
      userId
      name
    }
    tools {
      items {
        id
        userId
        name
      }
      nextToken
    }
  }
}
`;
export const createTool = `mutation CreateTool($input: CreateToolInput!) {
  createTool(input: $input) {
    id
    userId
    skill {
      id
      userId
      name
    }
    name
  }
}
`;
export const updateTool = `mutation UpdateTool($input: UpdateToolInput!) {
  updateTool(input: $input) {
    id
    userId
    skill {
      id
      userId
      name
    }
    name
  }
}
`;
export const deleteTool = `mutation DeleteTool($input: DeleteToolInput!) {
  deleteTool(input: $input) {
    id
    userId
    skill {
      id
      userId
      name
    }
    name
  }
}
`;
