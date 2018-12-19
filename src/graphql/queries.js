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
    categories {
      id
      userId
      description
      category {
        id
        userId
        name
        group
        tags {
          id
          userId
          name
        }
      }
      tags {
        id
        userId
        name
        category {
          id
          userId
          name
          group
          tags {
            id
            userId
            name
          }
        }
      }
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
      categories {
        id
        userId
        description
        category {
          id
          userId
          name
          group
          tags {
            id
            userId
            name
          }
        }
        tags {
          id
          userId
          name
          category {
            id
            userId
            name
            group
            tags {
              id
              userId
              name
            }
          }
        }
      }
    }
    nextToken
  }
}
`;
export const getAccomplishmentCategory = `query GetAccomplishmentCategory($id: ID!) {
  getAccomplishmentCategory(id: $id) {
    id
    userId
    description
    category {
      id
      userId
      name
      group
      tags {
        id
        userId
        name
      }
    }
    tags {
      id
      userId
      name
      category {
        id
        userId
        name
        group
        tags {
          id
          userId
          name
        }
      }
    }
  }
}
`;
export const listAccomplishmentCategorys = `query ListAccomplishmentCategorys(
  $filter: ModelAccomplishmentCategoryFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccomplishmentCategorys(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      description
      category {
        id
        userId
        name
        group
        tags {
          id
          userId
          name
        }
      }
      tags {
        id
        userId
        name
        category {
          id
          userId
          name
          group
          tags {
            id
            userId
            name
          }
        }
      }
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
    group
    tags {
      id
      userId
      name
      category {
        id
        userId
        name
        group
        tags {
          id
          userId
          name
        }
      }
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
      group
      tags {
        id
        userId
        name
        category {
          id
          userId
          name
          group
          tags {
            id
            userId
            name
          }
        }
      }
    }
    nextToken
  }
}
`;
export const getTag = `query GetTag($id: ID!) {
  getTag(id: $id) {
    id
    userId
    name
    category {
      id
      userId
      name
      group
      tags {
        id
        userId
        name
      }
    }
  }
}
`;
export const listTags = `query ListTags($filter: ModelTagFilterInput, $limit: Int, $nextToken: String) {
  listTags(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      name
      category {
        id
        userId
        name
        group
        tags {
          id
          userId
          name
        }
      }
    }
    nextToken
  }
}
`;
