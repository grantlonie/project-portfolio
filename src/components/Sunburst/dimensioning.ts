import { useState, useEffect } from 'react'

import { CategoryDetailsPositioning, ProjectDetailsPositioning } from './types'

// Project Details
const projectHeaderHeight = 170

/** Factor to scale the sunburst down when category selected */
export const sunburstScaleDown = 1.4

// Category Details
const totalHeight = 400
const itemTopMargin = 2
const itemLeftMargin = 3

const categoryWidth = 175
const skillWidth = 150
const projectWidth = 200
const categoryTranslate = 175

const skillTranslate = categoryTranslate + categoryWidth + itemLeftMargin
const projectTranslate = skillTranslate + skillWidth + itemLeftMargin

export const horizontalCategoryPositioning: CategoryDetailsPositioning = {
	totalHeight,
	itemTopMargin,
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

	useEffect(() => {
		const normalDiameter = 400
		const minSideBySideWidth = 1300
		const sunburstMargin = 20
		let sunBurstXPosition
		let sunBurstDiameter
		const projectWidth = 100

		setCategoryDetailsPositioning(horizontalCategoryPositioning)

		if (screenWidth > minSideBySideWidth) {
			sunBurstDiameter = Math.max(screenWidth * 0.4, normalDiameter)
			sunBurstXPosition = screenWidth / 2 - (selectedCategoryId ? 200 : 0)
			setProjectDetailsPositioning({
				headerHeight: projectHeaderHeight,
				startX: sunBurstXPosition,
				startY: projectHeaderHeight - sunBurstDiameter / 2,
				itemHeight: 50,
				itemMargin: 10,
				projectWidth,
				textWidth: screenWidth - sunBurstDiameter - sunburstMargin * 4 - projectWidth,
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
	}, [screenWidth, selectedCategoryId, Boolean(selectedProject)])

	return { projectDetailsPositioning, categoryDetailsPositioning, sunburstPosition, radiuses }
}
