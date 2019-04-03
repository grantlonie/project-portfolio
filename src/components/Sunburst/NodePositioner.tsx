import React from 'react'

import { ProjectItem } from '../../types'
import Node, { NodeProps } from './Node'
import { sunburstScaleDown } from './dimensioning'
import { nodeTypes, CategoryDetailsPositioning, ProjectDetailsPositioning } from './types'

interface Props {
	/** Type of Node grouping */
	type: nodeTypes
	/** Contains data needed to make Sunburst Circle */
	data: any
	/** Distance to inner radius of Node */
	innerRadius: number
	/** Distance to the outer radius of Node */
	outerRadius: number
	/** Initial Node center rotation angle in degrees */
	itemRotation: number
	fontSize: number
	/** Id of project that is being hovered */
	hoveringProjectId?: string
	/** Fires when hovering starts over project */
	hoverNode: (id: string, type: this['type'], inSelectedCategory: boolean) => void
	/** Fires when node is clicked */
	selectNode: (id: string, type: this['type'], inSelectedCategory: boolean) => void
	/** positioning details for nodes of selected category */
	categoryDetailsPositioning: CategoryDetailsPositioning
	/** project selected to show additional details. If null, don't display */
	selectedProject?: ProjectItem
	/** Array of projectSkillIds that are selected to show more detail */
	selectedProjectSkills?: { id: string; name: string }[]
	/** Where the project details list x and y position are wrt to Sunburst center and spacing between skills */
	projectDetailsPositioning?: ProjectDetailsPositioning
	/** If category is selected, key positioning props */
	parentSelectedCategory?: { projectCount: number; phi: number; rotation: number }
	/** In radians, the current sunburst rotation */
	sunburstRotation: number
}

const NodePositioner = (props: Props) => {
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
		selectedProject,
		selectedProjectSkills,
		projectDetailsPositioning,
		parentSelectedCategory,
		categoryDetailsPositioning,
		sunburstRotation,
	} = props

	let rotation = itemRotation

	return data.map((item, itemI) => {
		const { id, name, phi, fill, skillId, projectCount } = item

		if (itemI > 0) rotation += data[itemI - 1].phi / 2 + phi / 2

		let translateX = innerRadius
		let translateY = 0
		let corrRotation = rotation
		let scale = 1

		const nodeProps: NodeProps = {
			type,
			text: name,
			innerRadius,
			phi,
			outerRadius,
			fontSize,
			fill,
			id,
			hoverNode,
			selectNode,
			inSelectedCategory: Boolean(parentSelectedCategory),
		}

		let projectIsSelected = false

		// Determine if project skill is selected, hovering or in queue to be selected
		if (selectedProjectSkills) {
			// if (rotation > Math.PI) rotation -= Math.PI * 2
			let skillItemIndex = selectedProjectSkills.findIndex(i => i.id === skillId)
			if (skillItemIndex > -1) projectIsSelected = true

			if (projectIsSelected) {
				scale = sunburstScaleDown
				corrRotation = horizontalCorrection(sunburstRotation)

				const { startX, startY, itemHeight, itemMargin, projectWidth } = projectDetailsPositioning

				translateX = startX
				translateY = startY + itemHeight / 2 + (itemHeight + itemMargin) * skillItemIndex

				nodeProps.text = selectedProjectSkills[skillItemIndex].name
				nodeProps.rectangle = { width: projectWidth, height: itemHeight }
				nodeProps.fontSize = 14
			}
		}

		// Position Nodes for selected category
		if (parentSelectedCategory && !projectIsSelected) {
			corrRotation = horizontalCorrection(sunburstRotation)
			scale = sunburstScaleDown

			switch (type) {
				case 'category':
					translateX = categoryDetailsPositioning.category.translate
					nodeProps.trapezoid = {
						width: categoryDetailsPositioning.category.width,
						innerHeight: 50,
						outerHeight: categoryDetailsPositioning.totalHeight,
					}
					break

				case 'skill':
					translateX = categoryDetailsPositioning.skill.translate
					translateY = (categoryDetailsPositioning.totalHeight * (rotation - corrRotation)) / parentSelectedCategory.phi
					nodeProps.rectangle = {
						width: categoryDetailsPositioning.skill.width,
						height:
							(projectCount / parentSelectedCategory.projectCount) * categoryDetailsPositioning.totalHeight -
							categoryDetailsPositioning.itemMargin,
					}
					break

				case 'project':
					translateX = categoryDetailsPositioning.project.translate
					translateY = (categoryDetailsPositioning.totalHeight * (rotation - corrRotation)) / parentSelectedCategory.phi
					nodeProps.rectangle = {
						width: categoryDetailsPositioning.project.width,
						height:
							(1 / parentSelectedCategory.projectCount) * categoryDetailsPositioning.totalHeight -
							categoryDetailsPositioning.itemMargin,
					}
					break
			}
		}

		// Apply project hovering
		if (hoveringProjectId && hoveringProjectId === id) translateX += 10

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
					transition: 'all 500ms',
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
function horizontalCorrection(sunburstRotation: number) {
	let corrRotation = sunburstRotation % (2 * Math.PI)
	if (corrRotation < 0) corrRotation += 2 * Math.PI

	return corrRotation
}

export default NodePositioner
