import React from 'react'

import { ProjectItem } from '../../types'
import Node from './Node'
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
	} = props

	let rotation = itemRotation

	return data.map((item, itemI) => {
		if (itemI > 0) rotation += data[itemI - 1].phi / 2 + item.phi / 2

		let translateX = innerRadius
		let translateY = 0
		let corrRotation = rotation
		let rectangle = null
		let trapezoid = null
		let text = item.name
		let displayFontSize = fontSize
		let scale = 1

		// Determine if project skill is selected, hovering or in queue to be selected
		let projectIsSelected = false
		let skillItemIndex = -1
		if (selectedProjectSkills) {
			if (rotation > Math.PI) rotation -= Math.PI * 2
			skillItemIndex = selectedProjectSkills.findIndex(i => i.id === item.skillId)
		}
		if (skillItemIndex === -1 && selectedProject) projectIsSelected = item.id === selectedProject.id

		if (skillItemIndex > -1) {
			const { startX, startY, itemHeight, itemMargin, projectWidth } = projectDetailsPositioning
			text = selectedProjectSkills[skillItemIndex].name
			rectangle = { width: projectWidth, height: itemHeight }
			translateX = startX
			translateY = startY + rectangle.height / 2 + (itemHeight + itemMargin) * skillItemIndex
			corrRotation = 0
			displayFontSize = 14
		} else if (projectIsSelected) translateX += 30
		else if (hoveringProjectId && hoveringProjectId === item.id) translateX += 10

		// Position Nodes for selected category
		if (!projectIsSelected && parentSelectedCategory) {
			corrRotation = parentSelectedCategory.rotation % (2 * Math.PI)
			if (corrRotation < 0) corrRotation += 2 * Math.PI
			scale = sunburstScaleDown

			switch (type) {
				case 'category':
					translateX = categoryDetailsPositioning.category.translate
					trapezoid = {
						width: categoryDetailsPositioning.category.width,
						innerHeight: 50,
						outerHeight: categoryDetailsPositioning.totalHeight,
					}
					break
				case 'skill':
					translateX = categoryDetailsPositioning.skill.translate
					translateY = (categoryDetailsPositioning.totalHeight * (rotation - corrRotation)) / parentSelectedCategory.phi
					rectangle = {
						width: categoryDetailsPositioning.skill.width,
						height:
							(item.projectCount / parentSelectedCategory.projectCount) * categoryDetailsPositioning.totalHeight -
							categoryDetailsPositioning.itemTopMargin,
					}
					break
				case 'project':
					translateX = categoryDetailsPositioning.project.translate
					translateY = (categoryDetailsPositioning.totalHeight * (rotation - corrRotation)) / parentSelectedCategory.phi
					rectangle = {
						width: categoryDetailsPositioning.project.width,
						height:
							(1 / parentSelectedCategory.projectCount) * categoryDetailsPositioning.totalHeight -
							categoryDetailsPositioning.itemTopMargin,
					}
					break
			}
		}

		return (
			<div
				key={item.id}
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
				<Node
					type={type}
					rectangle={rectangle}
					trapezoid={trapezoid}
					text={text}
					innerRadius={innerRadius}
					phi={item.phi}
					outerRadius={outerRadius}
					fontSize={displayFontSize}
					fill={item.fill}
					id={item.id}
					hoverNode={hoverNode}
					selectNode={selectNode}
					inSelectedCategory={Boolean(parentSelectedCategory)}
				/>
			</div>
		)
	})
}

export default NodePositioner
