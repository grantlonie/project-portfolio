// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
    id
    APIkey
    email
  }
}
`;
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
    id
    APIkey
    email
  }
}
`;
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
    id
    APIkey
    email
  }
}
`;
export const onCreateAccomplishment = `subscription OnCreateAccomplishment {
  onCreateAccomplishment {
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
export const onUpdateAccomplishment = `subscription OnUpdateAccomplishment {
  onUpdateAccomplishment {
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
export const onDeleteAccomplishment = `subscription OnDeleteAccomplishment {
  onDeleteAccomplishment {
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
export const onCreateAccomplishmentCategory = `subscription OnCreateAccomplishmentCategory {
  onCreateAccomplishmentCategory {
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
export const onUpdateAccomplishmentCategory = `subscription OnUpdateAccomplishmentCategory {
  onUpdateAccomplishmentCategory {
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
export const onDeleteAccomplishmentCategory = `subscription OnDeleteAccomplishmentCategory {
  onDeleteAccomplishmentCategory {
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
export const onCreateCategory = `subscription OnCreateCategory {
  onCreateCategory {
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
export const onUpdateCategory = `subscription OnUpdateCategory {
  onUpdateCategory {
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
export const onDeleteCategory = `subscription OnDeleteCategory {
  onDeleteCategory {
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
export const onCreateTag = `subscription OnCreateTag {
  onCreateTag {
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
export const onUpdateTag = `subscription OnUpdateTag {
  onUpdateTag {
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
export const onDeleteTag = `subscription OnDeleteTag {
  onDeleteTag {
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
