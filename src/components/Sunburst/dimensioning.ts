import { useState, useEffect } from 'react'

/** Height of the project details header with description and date */
export const projectHeaderHeight = 170

interface ProjectDetailsPositioning {
	startX: number
	startY: number
	spacing: number
	width: number
}

interface Radiuses {
	category: number
	skill: number
	project: number
	outer: number
}

/** Set sunburst and associated text positions and sizes */
export function useSunburstDimensioning(screenWidth) {
	/** Where the project details are positioned relative the sunburst center */
	const [projectDetailsPositioning, setProjectDetailsPositioning] = useState(null as ProjectDetailsPositioning)
	/** x and y sunburst center position */
	const [sunburstPosition, setSunburstPosition] = useState(null as { x: number; y: number })
	/** Inner radius for each circle of sunburst */
	const [radiuses, setRadiuses]: [Radiuses, any] = useState(null as Radiuses)

	useEffect(() => {
		const normalDiameter = 400
		const minSideBySideWidth = 800
		const sunburstMargin = 20
		let sunBurstXPosition
		let sunBurstDiameter

		if (screenWidth > minSideBySideWidth) {
			sunBurstDiameter = Math.max(screenWidth * 0.4, normalDiameter)
			sunBurstXPosition = sunBurstDiameter / 2 + sunburstMargin
			setProjectDetailsPositioning({
				startX: sunBurstXPosition,
				startY: projectHeaderHeight - sunBurstDiameter / 2,
				spacing: 60,
				width: screenWidth - sunBurstDiameter - sunburstMargin * 4,
			})
		} else {
			sunBurstDiameter = Math.min(normalDiameter, screenWidth - sunburstMargin * 2)
			sunBurstXPosition = screenWidth / 2
			setProjectDetailsPositioning({
				startX: -sunBurstXPosition,
				startY: sunBurstDiameter,
				spacing: 60,
				width: screenWidth,
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
	}, [screenWidth])

	return { projectDetailsPositioning, sunburstPosition, radiuses }
}
