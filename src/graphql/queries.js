// eslint-disable
// this is an auto generated file. This will be overwritten

export const getAccomplishment = `query GetAccomplishment($id: ID!) {
  getAccomplishment(id: $id) {
    id
    name
    date
    company
    description
    categories {
      id
      description
      category {
        id
        name
        group
        tags {
          id
          name
        }
      }
      tags {
        id
        name
        category {
          id
          name
          group
          tags {
            id
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
      name
      date
      company
      description
      categories {
        id
        description
        category {
          id
          name
          group
          tags {
            id
            name
          }
        }
        tags {
          id
          name
          category {
            id
            name
            group
            tags {
              id
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
    description
    category {
      id
      name
      group
      tags {
        id
        name
      }
    }
    tags {
      id
      name
      category {
        id
        name
        group
        tags {
          id
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
      description
      category {
        id
        name
        group
        tags {
          id
          name
        }
      }
      tags {
        id
        name
        category {
          id
          name
          group
          tags {
            id
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
    name
    group
    tags {
      id
      name
      category {
        id
        name
        group
        tags {
          id
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
      name
      group
      tags {
        id
        name
        category {
          id
          name
          group
          tags {
            id
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
    name
    category {
      id
      name
      group
      tags {
        id
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
      name
      category {
        id
        name
        group
        tags {
          id
          name
        }
      }
    }
    nextToken
  }
}
`;
