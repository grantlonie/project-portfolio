import { useState, useEffect } from 'react'
import clamp from 'lodash/clamp'

import { CategoryDetailsPositioning, ProjectDetailsPositioning, Radiuses } from './types'

/** Factor to scale the sunburst down when category selected */
export const sunburstScaleDown = 1.4

const minSunburstDiameter = 400
const maxSunburstDiameter = 650
const minSideBySideWidth = 1300
const sunburstMargin = 20

/**
 * Set sunburst and associated text positions and sizes
 * @param screenWidth viewport width
 * @param selectedCategoryId currently selected category
 * @param selectedProject currently selected project
 */
export function useSunburstDimensioning(screenWidth, selectedCategoryId, selectedProject) {
	/** Where the project details are positioned relative the sunburst center */
	const [projectDetailsPositioning, setProjectDetailsPositioning] = useState(null as ProjectDetailsPositioning)
	/** Where the category details are positioned relative the sunburst center */
	const [categoryDetailsPositioning, setCategoryDetailsPositioning] = useState(null as CategoryDetailsPositioning)
	/** x and y sunburst center position */
	const [sunburstPosition, setSunburstPosition] = useState(null as { x: number; y: number })
	/** Inner radius for each circle of sunburst */
	const [radiuses, setRadiuses] = useState(null as Radiuses)

	const projectIsSelected = selectedProject !== undefined

	useEffect(() => {
		let sunBurstXPosition, sunBurstDiameter

		const categoryTotalHeight = 500
		const categoryItemMargin = 2
		const categoryCategoryWidth = 100
		const categorySkillWidth = 125
		const categoryProjectWidth = 150
		const categoryStartX = 140
		const categorySkillStart = categoryStartX + categoryCategoryWidth + categoryItemMargin
		const categoryProjectStart = categorySkillStart + categorySkillWidth + categoryItemMargin

		const projectSkillWidth = 100
		const projectSkillHeight = 50
		const projectSkillMargin = 10
		let projectHeaderHeight, projectSkillStartX, projectSkillStartY, projectSkillTextWidth

		if (screenWidth > minSideBySideWidth) {
			sunBurstDiameter = clamp(screenWidth * 0.4, minSunburstDiameter, maxSunburstDiameter)
			sunBurstXPosition = screenWidth / 2 - (selectedCategoryId ? 200 : 0) - (projectIsSelected ? 300 : 0)

			projectHeaderHeight = 130
			projectSkillStartX = categoryProjectStart + categoryProjectWidth + 40
			projectSkillStartY = projectHeaderHeight - sunBurstDiameter / 2
			projectSkillTextWidth = screenWidth - sunBurstXPosition - projectSkillStartX - projectSkillWidth - 70
		} else {
			sunBurstDiameter = clamp(screenWidth - sunburstMargin * 2, 0, maxSunburstDiameter)
			sunBurstXPosition = screenWidth / 2 - (selectedCategoryId ? 200 : 0)

			projectHeaderHeight = 110
			projectSkillStartX = -sunBurstXPosition + 50
			projectSkillStartY = sunBurstDiameter / sunburstScaleDown / 2 + projectHeaderHeight + 40
			projectSkillTextWidth = screenWidth - projectSkillWidth - 100
		}

		setSunburstPosition({ x: sunBurstXPosition, y: sunBurstDiameter / 2 + sunburstMargin })

		setCategoryDetailsPositioning({
			totalHeight: categoryTotalHeight,
			itemMargin: categoryItemMargin,
			startX: categoryStartX,
			startY: 0,
			categoryWidth: categoryCategoryWidth,
			skillStart: categorySkillStart,
			skillWidth: categorySkillWidth,
			projectStart: categoryProjectStart,
			projectWidth: categoryProjectWidth,
		})

		setProjectDetailsPositioning({
			headerHeight: projectHeaderHeight,
			startX: projectSkillStartX,
			startY: projectSkillStartY,
			itemHeight: projectSkillHeight,
			itemMargin: projectSkillMargin,
			projectWidth: projectSkillWidth,
			textWidth: projectSkillTextWidth,
		})

		setRadiuses({
			category: (sunBurstDiameter * 0.2) / 2,
			skill: (sunBurstDiameter * 0.5) / 2,
			project: (sunBurstDiameter * 0.8) / 2,
			outer: sunBurstDiameter / 2,
		})
	}, [screenWidth, selectedCategoryId, projectIsSelected])

	return { projectDetailsPositioning, categoryDetailsPositioning, sunburstPosition, radiuses }
}
