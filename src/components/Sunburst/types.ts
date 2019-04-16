export type nodeTypes = 'category' | 'skill' | 'project'

/** Horizontal or vertical layout based on width of screen */
export type SunburstLayout = 'horizontal' | 'vertical'

export interface Radiuses {
	category: number
	skill: number
	project: number
	outer: number
}

export interface CategoryDetailsPositioning {
	totalHeight: number
	itemMargin: number
	startX: number
	startY: number
	categoryWidth: number
	skillStart: number
	skillWidth: number
	projectStart: number
	projectWidth: number
}

export interface ProjectDetailsPositioning {
	headerHeight: number
	startX: number
	startY: number
	itemHeight: number
	itemMargin: number
	projectWidth: number
	textWidth: number
}

interface NodeData {
	id: string
	name: string
	fill: string
	phi: number
}

export interface ProjectData extends NodeData {
	skillId: string
}

export interface SkillData extends NodeData {
	projectCount: number
	projects: ProjectData[]
}

export interface SunburstData extends NodeData {
	projectCount: number
	skills: SkillData[]
}

export interface ProjectSkill {
	id: string
	name: string
}
