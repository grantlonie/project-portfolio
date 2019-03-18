import { useState, useEffect } from 'react'

import { CategoryDetailsPositioning, ProjectDetailsPositioning } from './types'

/** Factor to scale the sunburst down when category selected */
export const sunburstScaleDown = 1.4

// Project Details
const projectHeaderHeight = 170
const projectDetailsWidth = 100
const projectDetailsPadding = 40

// Category Details
const totalHeight = 500
const itemMargin = 2

const categoryWidth = 100
const skillWidth = 125
const projectWidth = 150
const categoryTranslate = 200

const skillTranslate = categoryTranslate + categoryWidth + itemMargin
const projectTranslate = skillTranslate + skillWidth + itemMargin

export const horizontalCategoryPositioning: CategoryDetailsPositioning = {
	totalHeight,
	itemMargin,
	category: {
		width: categoryWidth,
		translate: categoryTranslate,
	},
	skill: {
		width: skillWidth,
		translate: skillTranslate,
	},
	project: {
		width: projectWidth,
		translate: projectTranslate,
	},
}

interface Radiuses {
	category: number
	skill: number
	project: number
	outer: number
}

/** Set sunburst and associated text positions and sizes */
export function useSunburstDimensioning(screenWidth, selectedCategoryId, selectedProject) {
	/** Where the project details are positioned relative the sunburst center */
	const [projectDetailsPositioning, setProjectDetailsPositioning] = useState(null as ProjectDetailsPositioning)
	/** Where the category details are positioned relative the sunburst center */
	const [categoryDetailsPositioning, setCategoryDetailsPositioning] = useState(null as CategoryDetailsPositioning)
	/** x and y sunburst center position */
	const [sunburstPosition, setSunburstPosition] = useState(null as { x: number; y: number })
	/** Inner radius for each circle of sunburst */
	const [radiuses, setRadiuses]: [Radiuses, any] = useState(null as Radiuses)

	const projectIsSelected = Boolean(selectedProject)

	useEffect(() => {
		const normalDiameter = 400
		const minSideBySideWidth = 1300
		const sunburstMargin = 20
		let sunBurstXPosition
		let sunBurstDiameter

		setCategoryDetailsPositioning(horizontalCategoryPositioning)

		if (screenWidth > minSideBySideWidth) {
			sunBurstDiameter = Math.max(screenWidth * 0.4, normalDiameter)
			sunBurstXPosition = screenWidth / 2 - (selectedCategoryId ? 200 : 0) - (projectIsSelected ? 300 : 0)
			const projectDetailsStart =
				horizontalCategoryPositioning.project.translate + horizontalCategoryPositioning.project.width + projectDetailsPadding

			setProjectDetailsPositioning({
				headerHeight: projectHeaderHeight,
				startX: projectDetailsStart,
				startY: projectHeaderHeight - sunBurstDiameter / 2,
				itemHeight: 50,
				itemMargin: 10,
				projectWidth: projectDetailsWidth,
				textWidth: screenWidth - sunBurstXPosition / sunburstScaleDown - projectDetailsStart - projectWidth - 40,
			})
		} else {
			sunBurstDiameter = Math.min(normalDiameter, screenWidth - sunburstMargin * 2)
			sunBurstXPosition = screenWidth / 2
			setProjectDetailsPositioning({
				headerHeight: projectHeaderHeight,
				startX: -sunBurstXPosition,
				startY: sunBurstDiameter,
				itemHeight: 50,
				itemMargin: 10,
				projectWidth,
				textWidth: screenWidth - projectWidth,
			})
		}

		setSunburstPosition({
			x: sunBurstXPosition,
			y: sunBurstDiameter / 2 + sunburstMargin,
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
