import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import sleep from 'sleep-promise'
import { useWindowSize } from 'react-use'

import { ProjectItem, CategoryItem, SkillItem } from '../../types'
import NodePositioner from './NodePositioner'
import ProjectDetails from './ProjectDetails'
import CategoryDetails from './CategoryDetails'
import HelpCallouts, { HelpCalloutType } from './HelpCallouts'
import { useSunburstDimensioning, sunburstScaleDown } from './dimensioning'
import useSunburstData from './dataGenerator'
import { NodeTypes, ProjectSkill } from './types'
import { getTransition, extractProjectId, slowlyAddCategoryNodes, slowlyAddProjectSkills, sunburstRotater } from './utils'

interface Props {
	projects: ProjectItem[]
	allCategories: CategoryItem[]
	allSkills: SkillItem[]
}

const Sunburst = (props: Props) => {
	const { allCategories, allSkills, projects } = props

	/** Track which Node user is currently hovering over */
	const currentHoverNode: { current: { id: string; type: NodeTypes } } = useRef(null)
	/** Disable hovering over categories */
	const disableCategoryHover = useRef(false)
	/** track when Nodes are moving to prevent additional hover-renders */
	const nodesAreMoving = useRef(false)
	/** track when Nodes are in a hover transition to prevent additional hover-renders */
	const inHoverTransition = useRef(false)

	/** Project the user is hovering over */
	const [hoveringProjectId, setHoveringProjectId] = useState(null as string)
	/** Selected project to show more details */
	const [selectedProject, setSelectedProject] = useState(undefined as ProjectItem)
	/** Array of projectSkills that are selected to show more detail */
	const [selectedProjectSkills, setSelectedProjectSkills] = useState(null as ProjectSkill[])
	/** Category id that is currently being hovered over */
	const [hoverCategoryId, setHoverCategoryId] = useState(null as string)
	/** Amount to scale the sunburst */
	const [sunburstScale, setSunburstScale] = useState(1 as number)
	/** Current selected category id and total rotation from 0 (right) clockwise */
	const [selectedCategoryId, setSelectedCategoryId] = useState(null as string)
	/** Selected nodes to be displayed in category */
	const [selectedCategoryNodes, setSelectedCategoryNodes] = useState([] as string[])
	/** Rotation of the Sunburst */
	const [sunburstRotation, setSunburstRotation] = useState(0)
	/** Help callout on mounting */
	const [helpCallout, setHelpCallout] = useState('category' as HelpCalloutType)

	const { width: screenWidth } = useWindowSize()
	const { projectDetailsPositioning, categoryDetailsPositioning, sunburstPosition, radiuses } = useSunburstDimensioning(
		screenWidth,
		selectedCategoryId,
		selectedProject
	)
	const sunburstData = useSunburstData(allCategories, allSkills, projects)

	/**
	 * Method called after user hovers over a node
	 * @param id Node id
	 * @param type Type of node - category, skill or project
	 * @param inSelectedCategory if node is in a selected category
	 */
	const hoverNode = (id: string, type: NodeTypes, inSelectedCategory: boolean) => {
		if (type !== 'project' || !inSelectedCategory || (selectedProject && selectedProject.id === extractProjectId(id))) return
		currentHoverNode.current = { id, type }
		if (nodesAreMoving.current || inHoverTransition.current) return

		setHoveringProjectId(currentHoverNode.current.id)

		inHoverTransition.current = true
		setTimeout(() => {
			inHoverTransition.current = false
			setHoveringProjectId(
				currentHoverNode.current && currentHoverNode.current.type === 'project' ? currentHoverNode.current.id : null
			)
		}, 300)
	}

	/** Method called after leaving the Sunburst */
	const leaveSunburstTimeout = useRef(null)
	const leaveSunburst = () => {
		currentHoverNode.current = null
		setHoveringProjectId(null)
		clearTimeout(leaveSunburstTimeout.current)
		leaveSunburstTimeout.current = setTimeout(() => {
			if (!currentHoverNode.current) setHoverCategoryId(null)
		}, 2000)
	}

	/**
	 * Method called after user clicks a node
	 * @param id Node id
	 * @param type Type of node - category, skill or project
	 * @param inSelectedCategory if node is in a selected category
	 */
	const selectNode = async (id: string, type: NodeTypes, inSelectedCategory: boolean, event) => {
		if (nodesAreMoving.current) return

		const transition = getTransition(id, type, inSelectedCategory, selectedCategoryId, selectedProject)

		switch (transition) {
			case 'select project':
				// Close current project first and rerun with new project
				if (selectedProject) {
					setSelectedProject(null)
					setSelectedProjectSkills(null)
					await sleep(300)
				}

				if (helpCallout === 'project') setHelpCallout(null)

				// Find selected project and create list of project skills from selected project
				const newSelectedProject = props.projects.find(project => project.id === extractProjectId(id))

				const projectSkills = newSelectedProject.skills.items.map(projectSkill => {
					const name = allSkills.find(skill => skill.id === projectSkill.skillId).name
					return { id: projectSkill.id, name }
				})

				if (projectSkills.length > 1) nodesAreMoving.current = true

				setHoveringProjectId(null)
				setSelectedProject(newSelectedProject)
				await slowlyAddProjectSkills(projectSkills, setSelectedProjectSkills)

				nodesAreMoving.current = false
				break

			case 'collapse project':
				setSelectedProject(undefined)
				setSelectedProjectSkills(null)
				break

			case 'collapse category':
				disableCategoryHover.current = false
				if (helpCallout === 'project') setHelpCallout('hide project')
				setSunburstScale(1)
				setSelectedCategoryId(null)
				setSelectedCategoryNodes([])
				setSelectedProject(undefined)
				setSelectedProjectSkills(null)
				break

			case 'select category':
			case 'do nothing':
				break
		}
	}

	const handleCategorySelect = async categoryId => {
		if (selectedCategoryId || nodesAreMoving.current) return

		nodesAreMoving.current = true
		disableCategoryHover.current = true

		const { rotationReference } = sunburstPosition
		const rotation = sunburstRotater(sunburstData, sunburstRotation, categoryId, rotationReference)
		if (Math.abs(sunburstRotation - rotation) > 0.1) {
			setSunburstRotation(rotation)
			await sleep(500)
		}

		if (helpCallout === 'category' || helpCallout === 'hide project') setHelpCallout('project')

		setHoverCategoryId(null)
		setSunburstScale(sunburstScaleDown)
		setSelectedCategoryId(categoryId)
		await slowlyAddCategoryNodes(sunburstData, categoryId, setSelectedCategoryNodes, rotationReference)

		nodesAreMoving.current = false
	}

	const handleCategoryHover = categoryId => {
		if (!disableCategoryHover.current) {
			setHoverCategoryId(categoryId)
		}
	}

	if (sunburstData.length === 0) return <h3>Loading...</h3>

	let categoryRotation = 0

	const nodePositionerProps: any = {
		hoverNode,
		selectNode,
		categoryDetailsPositioning,
		selectedCategoryNodes,
		sunburstRotation,
		hoveringProjectId,
		sunburstRotationReference: sunburstPosition.rotationReference,
	}

	return (
		<div
			style={{
				position: 'absolute',
				transform: `translate(${sunburstPosition.x}px, ${sunburstPosition.y}px) `,
				transition: 'all 500ms',
			}}
		>
			<div
				onMouseLeave={leaveSunburst}
				style={{
					position: 'absolute',
					transform: `scale(${1 / sunburstScale})	rotate(${-sunburstRotation}rad)`,
					transition: 'all 500ms',
				}}
			>
				{sunburstData.map((category, categoryI) => {
					// Rotation logic for skills
					if (categoryI > 0) categoryRotation += sunburstData[categoryI - 1].phi / 2 + category.phi / 2
					let skillRotation = categoryRotation - category.phi / 2 + category.skills[0].phi / 2

					let transform = null
					let parentSelectedCategory = null
					let zIndex = 0
					if (selectedCategoryId && selectedCategoryId === category.id) {
						parentSelectedCategory = { phi: category.phi, projectCount: category.projectCount }
						zIndex = 1
					} else if (hoverCategoryId === category.id) {
						transform = `translate(${40 * Math.cos(categoryRotation)}px, ${40 * Math.sin(categoryRotation)}px)`
					}

					const categoryStyle: React.CSSProperties = {
						position: 'absolute',
						transform,
						transition: 'all 500ms',
						zIndex,
					}

					const categoryPositionerProps = {
						...nodePositionerProps,
						parentSelectedCategory,
						type: 'category',
						data: [category],
						innerRadius: radiuses.category,
						outerRadius: radiuses.skill,
						itemRotation: categoryRotation,
						fontSize: 14,
					}

					const skillPositionerProps = {
						...nodePositionerProps,
						parentSelectedCategory,
						type: 'skill',
						data: category.skills,
						innerRadius: radiuses.skill,
						outerRadius: radiuses.project,
						itemRotation: skillRotation,
						fontSize: 12,
					}

					return (
						<div
							key={category.id}
							onMouseEnter={() => handleCategoryHover(category.id)}
							onMouseUp={() => handleCategorySelect(category.id)}
							style={categoryStyle}
						>
							<NodePositioner {...categoryPositionerProps} />

							<NodePositioner {...skillPositionerProps} />

							{category.skills.map((skill, skillI) => {
								// Rotation logic for projects
								if (skillI > 0) skillRotation += category.skills[skillI - 1].phi / 2 + skill.phi / 2
								const projectRotation = skillRotation - skill.phi / 2 + skill.projects[0].phi / 2

								const projectPositionerProps = {
									...nodePositionerProps,
									parentSelectedCategory,
									type: 'project',
									data: skill.projects,
									innerRadius: radiuses.project,
									outerRadius: radiuses.outer,
									itemRotation: projectRotation,
									fontSize: 10,
									selectedProjectSkills,
									projectDetailsPositioning,
								}

								return <NodePositioner key={skill.id} {...projectPositionerProps} />
							})}
						</div>
					)
				})}
			</div>

			<ProjectDetails
				projectDetailsPositioning={projectDetailsPositioning}
				selectedProject={selectedProject}
				selectedProjectSkills={selectedProjectSkills}
			/>

			<CategoryDetails categoryDetailsPositioning={categoryDetailsPositioning} show={Boolean(selectedCategoryId)} />

			<HelpCallouts
				type={helpCallout}
				categoryDetailsPositioning={categoryDetailsPositioning}
				sunburstRadius={radiuses.outer}
				sunburstRotationReference={sunburstPosition.rotationReference}
			/>
		</div>
	)
}

const mapStateToProps = ({ projects, allCategories, allSkills }) => ({
	projects,
	allCategories,
	allSkills,
})

export default connect(mapStateToProps)(Sunburst)
