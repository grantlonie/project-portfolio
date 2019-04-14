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
import { nodeTypes, SunburstData } from './types'

interface Props {
	projects: ProjectItem[]
	allCategories: CategoryItem[]
	allSkills: SkillItem[]
}

interface ProjectSkill {
	id: string
	name: string
}

const Sunburst = (props: Props) => {
	const { allCategories, allSkills, projects } = props

	/** Track which Node user is currently hovering over */
	const currentHoverNode: { current: { id: string; type: nodeTypes } } = useRef(null)
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
	const hoverNode = (id: string, type: nodeTypes, inSelectedCategory: boolean) => {
		currentHoverNode.current = { id, type }

		if (
			type !== 'project' ||
			!inSelectedCategory ||
			nodesAreMoving.current ||
			inHoverTransition.current ||
			(selectedProject && selectedProject.id === id)
		)
			return

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
	const selectNode = async (id: string, type: nodeTypes, inSelectedCategory: boolean, event) => {
		console.log('id: ', id)
		if (nodesAreMoving.current) return

		const transition = getTransition(id, type, inSelectedCategory, selectedCategoryId, selectedProject)

		switch (transition) {
			case 'select category':
				// allow event propagation for handleCategorySelect to fire
				return

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

				setHoveringProjectId(null)
				setSelectedProject(newSelectedProject)
				slowlyAddProjectSkills(projectSkills, setSelectedProjectSkills, nodesAreMoving)
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

			case 'do nothing':
				break
		}

		// prevent handleCategorySelect from firing
		event.stopPropagation()
	}

	const handleCategorySelect = async categoryId => {
		disableCategoryHover.current = true
		const rotation = sunburstRotater(sunburstData, sunburstRotation, categoryId)
		if (Math.abs(sunburstRotation - rotation) > 0.1) {
			setSunburstRotation(rotation)
			await sleep(500)
		}

		if (helpCallout === 'category' || helpCallout === 'hide project') setHelpCallout('project')

		setHoverCategoryId(null)
		setSunburstScale(sunburstScaleDown)
		setSelectedCategoryId(categoryId)
		slowlyAddCategoryNodes(sunburstData, categoryId, setSelectedCategoryNodes)
	}

	const handleCategoryHover = categoryId => {
		if (!disableCategoryHover.current) {
			setHoverCategoryId(categoryId)
		}
	}

	if (sunburstData.length === 0) return <h3>Loading...</h3>

	let categoryRotation = 0

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

					return (
						<div
							key={category.id}
							onMouseEnter={() => handleCategoryHover(category.id)}
							onMouseUp={() => handleCategorySelect(category.id)}
							style={categoryStyle}
						>
							<NodePositioner
								type="category"
								data={[category]}
								innerRadius={radiuses.category}
								outerRadius={radiuses.skill}
								itemRotation={categoryRotation}
								fontSize={14}
								hoveringProjectId={hoveringProjectId}
								hoverNode={hoverNode}
								selectNode={selectNode}
								categoryDetailsPositioning={categoryDetailsPositioning}
								selectedCategoryNodes={selectedCategoryNodes}
								parentSelectedCategory={parentSelectedCategory}
								sunburstRotation={sunburstRotation}
							/>

							<NodePositioner
								type="skill"
								data={category.skills}
								innerRadius={radiuses.skill}
								outerRadius={radiuses.project}
								itemRotation={skillRotation}
								fontSize={12}
								hoveringProjectId={hoveringProjectId}
								hoverNode={hoverNode}
								selectNode={selectNode}
								categoryDetailsPositioning={categoryDetailsPositioning}
								selectedCategoryNodes={selectedCategoryNodes}
								parentSelectedCategory={parentSelectedCategory}
								sunburstRotation={sunburstRotation}
							/>

							{category.skills.map((skill, skillI) => {
								// Rotation logic for projects
								if (skillI > 0) skillRotation += category.skills[skillI - 1].phi / 2 + skill.phi / 2
								const projectRotation = skillRotation - skill.phi / 2 + skill.projects[0].phi / 2

								return (
									<React.Fragment key={skill.id}>
										<NodePositioner
											type="project"
											data={skill.projects}
											innerRadius={radiuses.project}
											outerRadius={radiuses.outer}
											itemRotation={projectRotation}
											fontSize={10}
											hoveringProjectId={hoveringProjectId}
											hoverNode={hoverNode}
											selectNode={selectNode}
											categoryDetailsPositioning={categoryDetailsPositioning}
											selectedCategoryNodes={selectedCategoryNodes}
											selectedProjectSkills={selectedProjectSkills}
											projectDetailsPositioning={projectDetailsPositioning}
											parentSelectedCategory={parentSelectedCategory}
											sunburstRotation={sunburstRotation}
										/>
									</React.Fragment>
								)
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

			<HelpCallouts type={helpCallout} categoryDetailsPositioning={categoryDetailsPositioning} sunburstRadius={radiuses.outer} />
		</div>
	)
}

/**
 * Method to calculate the selected category's total rotation from 0 (right) clockwise
 * @param sunburstData main data object
 * @param sunburstRotation current sunburst rotation
 * @param categoryId selected category id
 */
function sunburstRotater(sunburstData, sunburstRotation, categoryId) {
	let rotation = -sunburstData[0].phi / 2
	for (const category of sunburstData) {
		if (category.id !== categoryId) rotation += category.phi
		else {
			rotation += category.phi / 2
			break
		}
	}

	let deltaRotation = (rotation - sunburstRotation) % (2 * Math.PI)
	if (Math.abs(deltaRotation) > Math.PI) deltaRotation -= Math.sign(deltaRotation) * 2 * Math.PI

	return sunburstRotation + deltaRotation
}

/**
 * Slowly add skills to selectedProjectSkills to be displayed
 * @param projectSkills total list of skills
 * @param setSelectedProjectSkills callback to slowly append skill to list that is displayed
 * @param nodesAreMoving reference that nodes are in the process of moving
 */
function slowlyAddProjectSkills(projectSkills, setSelectedProjectSkills, nodesAreMoving) {
	let newSelectedProjectSkills: ProjectSkill[] = [projectSkills[0]]
	if (projectSkills.length > 1) nodesAreMoving.current = true
	setSelectedProjectSkills(newSelectedProjectSkills)

	// Slowly add project skills to selectedProjectSkills
	if (projectSkills.length < 2) return
	let i = 1
	let projectSkillInterval = setInterval(() => {
		newSelectedProjectSkills = [...newSelectedProjectSkills, projectSkills[i]]
		setSelectedProjectSkills(newSelectedProjectSkills)
		i++
		if (i === projectSkills.length) {
			nodesAreMoving.current = false
			clearInterval(projectSkillInterval)
		}
	}, 100)
}

/**
 * Slowly add category nodes to display
 * @param sunburstData sunburst data object
 * @param selectedCategoryId selected cateogry id
 * @param setSelectedCategoryNodes callback to set category nodes to display
 */
async function slowlyAddCategoryNodes(sunburstData: SunburstData[], selectedCategoryId, setSelectedCategoryNodes) {
	const selectedSkills = sunburstData.find(category => category.id === selectedCategoryId).skills
	for (const skill of selectedSkills) {
		for (const project of skill.projects) {
			setSelectedCategoryNodes(nodes => [...nodes, project.id])
			await sleep(10)
		}
	}
}

/**
 * Determine the appropriate sunburst transition response after user clicks a node
 * @param id selected node id
 * @param type node type
 * @param inSelectedCategory true if selected node is in a selected category
 * @param selectedCategoryId the currently selected categogry id
 * @param selectedProject the currently selected project
 */
function getTransition(id, type: nodeTypes, inSelectedCategory, selectedCategoryId, selectedProject) {
	if (selectedProject && selectedProject.id === id) return 'do nothing'

	if (inSelectedCategory) {
		if (type === 'project') return 'select project'
		if (selectedProject) return 'collapse project'
		return 'do nothing'
	} else {
		if (selectedCategoryId) return 'collapse category'
		return 'select category'
	}
}

/**
 * extract project id from id string
 * @param id id with form skillId|projectId
 */
function extractProjectId(id) {
	const splitProjectId = id.split('|')
	if (splitProjectId.length === 0) return null
	return splitProjectId[1]
}

const mapStateToProps = ({ projects, allCategories, allSkills }) => ({
	projects,
	allCategories,
	allSkills,
})

export default connect(mapStateToProps)(Sunburst)
