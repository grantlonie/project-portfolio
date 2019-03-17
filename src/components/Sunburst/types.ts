export type nodeTypes = 'category' | 'skill' | 'project'

/** Horizontal or vertical layout based on width of screen */
export type SunburstLayout = 'horizontal' | 'vertical'

interface CategoryNodeTypePosition {
	width: number
	translate: number
}

export interface CategoryDetailsPositioning {
	totalHeight: number
	itemTopMargin: number
	category: CategoryNodeTypePosition
	skill: CategoryNodeTypePosition
	project: CategoryNodeTypePosition
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
