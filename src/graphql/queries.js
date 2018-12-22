// eslint-disable
// this is an auto generated file. This will be overwritten

export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    APIkey
    email
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      APIkey
      email
    }
    nextToken
  }
}
`;
export const getAccomplishment = `query GetAccomplishment($id: ID!) {
  getAccomplishment(id: $id) {
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
export const listAccomplishments = `query ListAccomplishments(
  $filter: ModelAccomplishmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccomplishments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getAccomplishmentSkill = `query GetAccomplishmentSkill($id: ID!) {
  getAccomplishmentSkill(id: $id) {
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
export const listAccomplishmentSkills = `query ListAccomplishmentSkills(
  $filter: ModelAccomplishmentSkillFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccomplishmentSkills(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
  }
}
`;
export const getCategory = `query GetCategory($id: ID!) {
  getCategory(id: $id) {
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
export const listCategorys = `query ListCategorys(
  $filter: ModelCategoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listCategorys(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getSkill = `query GetSkill($id: ID!) {
  getSkill(id: $id) {
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
export const listSkills = `query ListSkills(
  $filter: ModelSkillFilterInput
  $limit: Int
  $nextToken: String
) {
  listSkills(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
export const getTool = `query GetTool($id: ID!) {
  getTool(id: $id) {
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
export const listTools = `query ListTools(
  $filter: ModelToolFilterInput
  $limit: Int
  $nextToken: String
) {
  listTools(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      skill {
        id
        userId
        name
      }
      name
    }
    nextToken
  }
}
`;
