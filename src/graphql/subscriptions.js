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
export const onCreateProject = `subscription OnCreateProject {
  onCreateProject {
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
export const onUpdateProject = `subscription OnUpdateProject {
  onUpdateProject {
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
export const onDeleteProject = `subscription OnDeleteProject {
  onDeleteProject {
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
export const onCreateProjectSkill = `subscription OnCreateProjectSkill {
  onCreateProjectSkill {
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
export const onUpdateProjectSkill = `subscription OnUpdateProjectSkill {
  onUpdateProjectSkill {
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
export const onDeleteProjectSkill = `subscription OnDeleteProjectSkill {
  onDeleteProjectSkill {
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
export const onCreateCategory = `subscription OnCreateCategory {
  onCreateCategory {
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
export const onUpdateCategory = `subscription OnUpdateCategory {
  onUpdateCategory {
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
export const onDeleteCategory = `subscription OnDeleteCategory {
  onDeleteCategory {
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
export const onCreateSkill = `subscription OnCreateSkill {
  onCreateSkill {
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
export const onUpdateSkill = `subscription OnUpdateSkill {
  onUpdateSkill {
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
export const onDeleteSkill = `subscription OnDeleteSkill {
  onDeleteSkill {
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
export const onCreateTool = `subscription OnCreateTool {
  onCreateTool {
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
export const onUpdateTool = `subscription OnUpdateTool {
  onUpdateTool {
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
export const onDeleteTool = `subscription OnDeleteTool {
  onDeleteTool {
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
