import {
	ListProjectsQuery,
	ListSkillsQuery,
	ListCategorysQuery,
	CreateProjectMutation,
	ListToolsQuery,
	ListProjectSkillsQuery,
} from './API'

export type ProjectItem = ListProjectsQuery['listProjects']['items'][0]
export type ProjectSkillItem = ListProjectSkillsQuery['listProjectSkills']['items'][0]
export type SkillItem = ListSkillsQuery['listSkills']['items'][0]
export type ToolItem = ListToolsQuery['listTools']['items'][0]
export type CategoryItem = ListCategorysQuery['listCategorys']['items'][0]
export type CreateProjectMutation = CreateProjectMutation
