import React from 'react'

import Node, { NodeProps } from './Node'
import { sunburstScaleDown } from './dimensioning'
import { NodeTypes, CategoryDetailsPositioning, ProjectDetailsPositioning } from './types'
import { extractProjectId, transitionDuration } from './utils'

export interface NodePositionerProps {
	/** Type of Node grouping */
	type: NodeTypes
	/** Contains data needed to make Sunburst Circle */
	data: any
	/** Distance to inner radius of Node */
	innerRadius: number
	/** Distance to the outer radius of Node */
	outerRadius: number
	/** Initial Node center rotation angle in degrees */
	itemRotation: number
	/** font size of node text */
	fontSize: number
	/** Id of project that is being hovered */
	hoveringProjectId?: string
	/** Fires when hovering starts over project */
	hoverNode: (id: string, type: this['type'], inSelectedCategory: boolean) => void
	/** Fires when node is clicked */
	selectNode: (id: string, type: this['type'], inSelectedCategory: boolean, event) => void
	/** positioning details for nodes of selected category */
	categoryDetailsPositioning: CategoryDetailsPositioning
	/** Array of projectSkillIds that are selected to show more detail */
	selectedProjectSkills?: { id: string; name: string }[]
	/** Where the project details list x and y position are wrt to Sunburst center and spacing between skills */
	projectDetailsPositioning?: ProjectDetailsPositioning
	/** If category is selected, key positioning props */
	parentSelectedCategory?: { projectCount: number; phi: number; rotation: number }
	/** Selected nodes to be displayed in category */
	selectedCategoryNodes?: string[]
	/** In radians, the current sunburst rotation */
	sunburstRotation: number
	/** In radians, the reference rotation angle from right clockwise */
	sunburstRotationReference: number
}

const NodePositioner = (props: NodePositionerProps) => {
	const {
		type,
		data,
		innerRadius,
		outerRadius,
		itemRotation,
		fontSize,
		hoveringProjectId,
		hoverNode,
		selectNode,
		selectedProjectSkills,
		projectDetailsPositioning,
		parentSelectedCategory,
		selectedCategoryNodes,
		categoryDetailsPositioning,
		sunburstRotation,
		sunburstRotationReference,
	} = props

	let rotation = itemRotation

	return data.map((item, itemI) => {
		const { id, name, phi, fill, skillId, projectCount } = item

		if (itemI > 0) rotation += data[itemI - 1].phi / 2 + phi / 2

		let translateX
		let translateY
		let corrRotation
		let scale

		let nodeProps: NodeProps = {
			type,
			name,
			fontSize,
			fill,
			id,
			hoverNode,
			selectNode,
			inSelectedCategory: Boolean(parentSelectedCategory),
		}

		let skillItemIndex = -1
		if (selectedProjectSkills) skillItemIndex = selectedProjectSkills.findIndex(i => i.id === skillId)

		// Position Node for selected project
		if (skillItemIndex > -1) {
			const { startX, startY, itemHeight, itemMargin, projectWidth } = projectDetailsPositioning

			scale = sunburstScaleDown
			corrRotation = horizontalCorrection(sunburstRotation)
			translateX = startX
			translateY = startY + itemHeight / 2 + (itemHeight + itemMargin) * skillItemIndex

			nodeProps.name = selectedProjectSkills[skillItemIndex].name
			nodeProps.rectangle = { width: projectWidth, height: itemHeight }
			nodeProps.fontSize = 14
		}

		// Position Node for selected category
		else if (parentSelectedCategory && selectedCategoryNodes.findIndex(i => i === id) > -1) {
			const {
				startX,
				startY,
				categoryWidth,
				skillStart,
				skillWidth,
				projectStart,
				projectWidth,
				totalHeight,
				itemMargin,
			} = categoryDetailsPositioning

			scale = sunburstScaleDown
			corrRotation = horizontalCorrection(sunburstRotation)
			if (sunburstRotationReference && corrRotation + sunburstRotationReference >= Math.PI) corrRotation -= 2 * Math.PI

			switch (type) {
				case 'category':
					translateX = startX
					translateY = startY
					nodeProps.trapezoid = { width: categoryWidth, innerHeight: 50, outerHeight: totalHeight }
					break

				case 'skill':
					translateX = skillStart
					translateY = startY + (totalHeight * (sunburstRotationReference + rotation - corrRotation)) / parentSelectedCategory.phi
					nodeProps.rectangle = {
						width: skillWidth,
						height: (projectCount / parentSelectedCategory.projectCount) * totalHeight - itemMargin,
					}
					break

				case 'project':
					translateX = projectStart
					translateY = startY + (totalHeight * (sunburstRotationReference + rotation - corrRotation)) / parentSelectedCategory.phi
					nodeProps.rectangle = {
						width: projectWidth,
						height: (1 / parentSelectedCategory.projectCount) * totalHeight - itemMargin,
					}
					break
			}
		}

		// Position Node around Sunburst
		else {
			translateX = innerRadius
			translateY = 0
			corrRotation = rotation
			scale = 1

			nodeProps = { ...nodeProps, innerRadius, outerRadius, phi }
		}

		// Apply project hovering
		if (hoveringProjectId && extractProjectId(hoveringProjectId) === extractProjectId(id)) translateX += 10

		return (
			<div
				key={id}
				style={{
					position: 'absolute',
					transform: `
						scale(${scale})
						rotate(${corrRotation}rad) 
						translate3d(${translateX}px, ${translateY}px, 0)
					`,
					transition: `all ${transitionDuration}ms`,
					transformOrigin: '0 0',
				}}
			>
				<Node {...nodeProps} />
			</div>
		)
	})
}

/**
 * Offset the rotation of the sunburst to obtain a horizontal Node
 * @param sunburstRotation current rotation of the sunburst in radians
 */
function horizontalCorrection(sunburstRotation) {
	let corrRotation = sunburstRotation % (2 * Math.PI)
	if (corrRotation < 0) corrRotation += 2 * Math.PI

	return corrRotation
}

export default NodePositioner
