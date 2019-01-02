import { ListProjectsQuery, ListSkillsQuery, ListCategorysQuery } from './API'

export type ProjectItems = ListProjectsQuery['listProjects']['items']
export type SkillItems = ListSkillsQuery['listSkills']['items']
export type CategoryItems = ListCategorysQuery['listCategorys']['items']
