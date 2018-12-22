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
export const createAccomplishment = `mutation CreateAccomplishment($input: CreateAccomplishmentInput!) {
  createAccomplishment(input: $input) {
    id
    userId
    name
    date
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
export const updateAccomplishment = `mutation UpdateAccomplishment($input: UpdateAccomplishmentInput!) {
  updateAccomplishment(input: $input) {
    id
    userId
    name
    date
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
export const deleteAccomplishment = `mutation DeleteAccomplishment($input: DeleteAccomplishmentInput!) {
  deleteAccomplishment(input: $input) {
    id
    userId
    name
    date
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
export const createAccomplishmentSkill = `mutation CreateAccomplishmentSkill($input: CreateAccomplishmentSkillInput!) {
  createAccomplishmentSkill(input: $input) {
    id
    userId
    accomplishment {
      id
      userId
      name
      date
      company
      description
    }
    description
    skillId
    toolIds
  }
}
`;
export const updateAccomplishmentSkill = `mutation UpdateAccomplishmentSkill($input: UpdateAccomplishmentSkillInput!) {
  updateAccomplishmentSkill(input: $input) {
    id
    userId
    accomplishment {
      id
      userId
      name
      date
      company
      description
    }
    description
    skillId
    toolIds
  }
}
`;
export const deleteAccomplishmentSkill = `mutation DeleteAccomplishmentSkill($input: DeleteAccomplishmentSkillInput!) {
  deleteAccomplishmentSkill(input: $input) {
    id
    userId
    accomplishment {
      id
      userId
      name
      date
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
