// eslint-disable
// this is an auto generated file. This will be overwritten

export const createAccomplishment = `mutation CreateAccomplishment($input: CreateAccomplishmentInput!) {
  createAccomplishment(input: $input) {
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
export const updateAccomplishment = `mutation UpdateAccomplishment($input: UpdateAccomplishmentInput!) {
  updateAccomplishment(input: $input) {
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
export const deleteAccomplishment = `mutation DeleteAccomplishment($input: DeleteAccomplishmentInput!) {
  deleteAccomplishment(input: $input) {
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
export const createAccomplishmentCategory = `mutation CreateAccomplishmentCategory(
  $input: CreateAccomplishmentCategoryInput!
) {
  createAccomplishmentCategory(input: $input) {
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
export const updateAccomplishmentCategory = `mutation UpdateAccomplishmentCategory(
  $input: UpdateAccomplishmentCategoryInput!
) {
  updateAccomplishmentCategory(input: $input) {
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
export const deleteAccomplishmentCategory = `mutation DeleteAccomplishmentCategory(
  $input: DeleteAccomplishmentCategoryInput!
) {
  deleteAccomplishmentCategory(input: $input) {
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
export const createCategory = `mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
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
export const updateCategory = `mutation UpdateCategory($input: UpdateCategoryInput!) {
  updateCategory(input: $input) {
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
export const deleteCategory = `mutation DeleteCategory($input: DeleteCategoryInput!) {
  deleteCategory(input: $input) {
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
export const createTag = `mutation CreateTag($input: CreateTagInput!) {
  createTag(input: $input) {
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
export const updateTag = `mutation UpdateTag($input: UpdateTagInput!) {
  updateTag(input: $input) {
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
export const deleteTag = `mutation DeleteTag($input: DeleteTagInput!) {
  deleteTag(input: $input) {
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
