import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import sleep from 'sleep-promise'
import { useWindowSize } from 'react-use'

import { ProjectItem, CategoryItem, SkillItem } from '../../types'
import NodePositioner from './NodePositioner'
import ProjectDetails from './ProjectDetails'
import CategoryDetails from './CategoryDetails'
import { useSunburstDimensioning, sunburstScaleDown } from './dimensioning'
import useSunburstData from './dataGenerator'
import stateService from './state'
import { nodeTypes } from './types'

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
	const [selectedProject, setSelectedProject] = useState(null as ProjectItem)
	/** Array of projectSkills that are selected to show more detail */
	const [selectedProjectSkills, setSelectedProjectSkills] = useState(null as ProjectSkill[])
	/** Category id that is currently being hovered over */
	const [hoverCategoryId, setHoverCategoryId] = useState(null as string)
	/** Amount to scale the sunburst */
	const [sunburstScale, setSunburstScale] = useState(1 as number)
	/** Current selected category id and total rotation from 0 (right) clockwise */
	const [selectedCategoryId, setSelectedCategoryId] = useState(null as string)
	/** Rotation of the Sunburst */
	const [sunburstRotation, setSunburstRotation] = useState(0)

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
		if (type !== 'project' || !inSelectedCategory || nodesAreMoving.current || inHoverTransition.current) return

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
	const selectNode = async (id: string, type: nodeTypes, inSelectedCategory: boolean) => {
		if (type !== 'project' || nodesAreMoving.current || !inSelectedCategory) return

		if (selectedProject) {
			// prevent selecting already selected project skill
			if (selectedProject.id === id) return
			// Close current project first and rerun with new project
			else {
				setSelectedProject(null)
				setSelectedProjectSkills(null)
				await sleep(300)
			}
		}

		// Find selected project and create list of project skills from selected project
		const newSelectedProject = props.projects.find(project => project.id === id)

		const projectSkills = newSelectedProject.skills.items.map(projectSkill => {
			const name = allSkills.find(skill => skill.id === projectSkill.skillId).name
			return { id: projectSkill.id, name }
		})

		// Add first project skill to selectedProjectSkills
		let newSelectedProjectSkills: ProjectSkill[] = [projectSkills[0]]
		setHoveringProjectId(null)
		setSelectedProject(newSelectedProject)
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

	const handleCategoryHover = categoryId => {
		if (!disableCategoryHover.current) {
			setHoverCategoryId(categoryId)
		}
	}

	const handleCategorySelect = async (categoryId: string) => {
		if (categoryId === selectedCategoryId) return

		if (selectedCategoryId) {
			disableCategoryHover.current = false
			setSunburstScale(1)
			setSelectedCategoryId(null)
		} else {
			disableCategoryHover.current = true
			const rotation = sunburstRotater(sunburstData, sunburstRotation, categoryId)
			if (Math.abs(sunburstRotation - rotation) > 0.1) {
				setSunburstRotation(rotation)
				await sleep(500)
			}

			setSunburstScale(sunburstScaleDown)
			setSelectedCategoryId(categoryId)
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
					if (selectedCategoryId && selectedCategoryId === category.id) {
						const translateAmount = 0
						parentSelectedCategory = {
							phi: category.phi,
							projectCount: category.projectCount,
						}
						transform = `translate(
						${translateAmount * Math.cos(categoryRotation)}px, 
						${translateAmount * Math.sin(categoryRotation)}px
					)`
					} else if (hoverCategoryId === category.id) {
						const translateAmount = 40
						transform = `translate(
						${translateAmount * Math.cos(categoryRotation)}px, 
						${translateAmount * Math.sin(categoryRotation)}px
					)`
					}

					const categoryStyle: React.CSSProperties = {
						position: 'absolute',
						transform,
						transition: 'all 500ms',
					}

					return (
						<div
							key={category.id}
							onMouseEnter={() => handleCategoryHover(category.id)}
							onMouseDown={() => handleCategorySelect(category.id)}
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

const mapStateToProps = ({ projects, allCategories, allSkills }) => ({
	projects,
	allCategories,
	allSkills,
})

export default connect(mapStateToProps)(Sunburst)
