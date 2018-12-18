// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateAccomplishment = `subscription OnCreateAccomplishment {
  onCreateAccomplishment {
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
export const onUpdateAccomplishment = `subscription OnUpdateAccomplishment {
  onUpdateAccomplishment {
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
export const onDeleteAccomplishment = `subscription OnDeleteAccomplishment {
  onDeleteAccomplishment {
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
export const onCreateAccomplishmentCategory = `subscription OnCreateAccomplishmentCategory {
  onCreateAccomplishmentCategory {
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
export const onUpdateAccomplishmentCategory = `subscription OnUpdateAccomplishmentCategory {
  onUpdateAccomplishmentCategory {
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
export const onDeleteAccomplishmentCategory = `subscription OnDeleteAccomplishmentCategory {
  onDeleteAccomplishmentCategory {
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
export const onCreateCategory = `subscription OnCreateCategory {
  onCreateCategory {
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
export const onUpdateCategory = `subscription OnUpdateCategory {
  onUpdateCategory {
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
export const onDeleteCategory = `subscription OnDeleteCategory {
  onDeleteCategory {
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
export const onCreateTag = `subscription OnCreateTag {
  onCreateTag {
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
export const onUpdateTag = `subscription OnUpdateTag {
  onUpdateTag {
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
export const onDeleteTag = `subscription OnDeleteTag {
  onDeleteTag {
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
