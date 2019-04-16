import { useState, useEffect } from 'react'
import clamp from 'lodash/clamp'

import { CategoryDetailsPositioning, ProjectDetailsPositioning, Radiuses } from './types'

/** Factor to scale the sunburst down when category selected */
export const sunburstScaleDown = 1.4

const minSunburstDiameter = 400
const maxSunburstDiameter = 650
const desktopMinWidth = 1300
const tabletMinWidth = 800
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
	/** x and y sunburst center position and rotation reference clockwise from the right for ejecting the category details */
	const [sunburstPosition, setSunburstPosition] = useState(null as { x: number; y: number; rotationReference: number })
	/** Inner radius for each circle of sunburst */
	const [radiuses, setRadiuses] = useState(null as Radiuses)

	const projectIsSelected = selectedProject !== undefined

	useEffect(() => {
		let sunburstXPosition, sunburstDiameter, sunburstRotationReference

		const categoryTotalHeight = 500
		const categoryItemMargin = 2
		const categoryCategoryWidth = 100
		const categorySkillWidth = 125
		const categoryProjectWidth = 150
		let categoryStartX, categoryStartY, categorySkillStart, categoryProjectStart

		const projectSkillWidth = 100
		const projectSkillHeight = 50
		const projectSkillMargin = 10
		let projectHeaderHeight, projectSkillStartX, projectSkillStartY, projectSkillTextWidth

		if (screenWidth > desktopMinWidth) {
			sunburstDiameter = clamp(screenWidth * 0.4, minSunburstDiameter, maxSunburstDiameter)
			sunburstXPosition = screenWidth / 2 - (selectedCategoryId ? 200 : 0) - (projectIsSelected ? 300 : 0)
			sunburstRotationReference = 0

			categoryStartX = 140
			categoryStartY = 0
			categorySkillStart = categoryStartX + categoryCategoryWidth + categoryItemMargin
			categoryProjectStart = categorySkillStart + categorySkillWidth + categoryItemMargin

			projectHeaderHeight = 130
			projectSkillStartX = categoryProjectStart + categoryProjectWidth + 40
			projectSkillStartY = projectHeaderHeight - sunburstDiameter / 2
			projectSkillTextWidth = screenWidth - sunburstXPosition - projectSkillStartX - projectSkillWidth - 70
		} else if (screenWidth > tabletMinWidth) {
			sunburstDiameter = clamp(screenWidth - sunburstMargin * 2, 0, maxSunburstDiameter)
			sunburstXPosition = screenWidth / 2 - (selectedCategoryId ? 200 : 0)
			sunburstRotationReference = 0

			categoryStartX = 140
			categoryStartY = 0
			categorySkillStart = categoryStartX + categoryCategoryWidth + categoryItemMargin
			categoryProjectStart = categorySkillStart + categorySkillWidth + categoryItemMargin

			projectHeaderHeight = 110
			projectSkillStartX = -sunburstXPosition + 50
			projectSkillStartY = sunburstDiameter / sunburstScaleDown / 2 + projectHeaderHeight + 40
			projectSkillTextWidth = screenWidth - projectSkillWidth - 100
		} else {
			sunburstDiameter = clamp(screenWidth - sunburstMargin * 2, 0, maxSunburstDiameter)
			sunburstXPosition = screenWidth / 2
			sunburstRotationReference = -Math.PI / 2

			categoryStartX = -sunburstXPosition + 50
			categoryStartY = sunburstDiameter / sunburstScaleDown / 2 + categoryTotalHeight / 2
			categorySkillStart = categoryStartX + categoryCategoryWidth + categoryItemMargin
			categoryProjectStart = categorySkillStart + categorySkillWidth + categoryItemMargin

			projectHeaderHeight = 110
			projectSkillStartX = -sunburstXPosition + 50
			projectSkillStartY = categoryStartY + categoryTotalHeight / 2 + projectHeaderHeight + 40
			projectSkillTextWidth = screenWidth - projectSkillWidth - 100
		}

		setSunburstPosition({
			x: sunburstXPosition,
			y: sunburstDiameter / 2 + sunburstMargin,
			rotationReference: sunburstRotationReference,
		})

		setCategoryDetailsPositioning({
			totalHeight: categoryTotalHeight,
			itemMargin: categoryItemMargin,
			startX: categoryStartX,
			startY: categoryStartY,
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
			category: (sunburstDiameter * 0.2) / 2,
			skill: (sunburstDiameter * 0.5) / 2,
			project: (sunburstDiameter * 0.8) / 2,
			outer: sunburstDiameter / 2,
		})
	}, [screenWidth, selectedCategoryId, projectIsSelected])

	return { projectDetailsPositioning, categoryDetailsPositioning, sunburstPosition, radiuses }
}
