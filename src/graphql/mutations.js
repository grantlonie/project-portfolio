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
export const updateAccomplishment = `mutation UpdateAccomplishment($input: UpdateAccomplishmentInput!) {
  updateAccomplishment(input: $input) {
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
export const deleteAccomplishment = `mutation DeleteAccomplishment($input: DeleteAccomplishmentInput!) {
  deleteAccomplishment(input: $input) {
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
export const createAccomplishmentCategory = `mutation CreateAccomplishmentCategory(
  $input: CreateAccomplishmentCategoryInput!
) {
  createAccomplishmentCategory(input: $input) {
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
export const updateAccomplishmentCategory = `mutation UpdateAccomplishmentCategory(
  $input: UpdateAccomplishmentCategoryInput!
) {
  updateAccomplishmentCategory(input: $input) {
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
export const deleteAccomplishmentCategory = `mutation DeleteAccomplishmentCategory(
  $input: DeleteAccomplishmentCategoryInput!
) {
  deleteAccomplishmentCategory(input: $input) {
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
export const createCategory = `mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
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
export const updateCategory = `mutation UpdateCategory($input: UpdateCategoryInput!) {
  updateCategory(input: $input) {
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
export const deleteCategory = `mutation DeleteCategory($input: DeleteCategoryInput!) {
  deleteCategory(input: $input) {
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
export const createTag = `mutation CreateTag($input: CreateTagInput!) {
  createTag(input: $input) {
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
export const updateTag = `mutation UpdateTag($input: UpdateTagInput!) {
  updateTag(input: $input) {
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
export const deleteTag = `mutation DeleteTag($input: DeleteTagInput!) {
  deleteTag(input: $input) {
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
