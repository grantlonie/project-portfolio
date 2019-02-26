import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { useWindowSize } from 'react-use'

import { ProjectItem, CategoryItem, SkillItem } from '../../types'
import Circle from './Circle'
import ProjectDetails from './ProjectDetails'

/** Colors for the categories and associated skills and projects */
const colors = ['#6ff5fc', 'orange', 'gray', '#ff5959', '#f682ff']

/** Height of the project details header with description and date */
const projectHeaderHeight = 170

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
	const currentHoverNode: { current: { id: string; type: string } } = useRef(null)

	/** Project the user is hovering over */
	const [hoveringProjectId, setHoveringProjectId] = useState(null as string)
	/** Selected project to show more details */
	const [selectedProject, setSelectedProject] = useState(null as ProjectItem)
	/** track when Nodes are moving to prevent additional hover-renders */
	const [nodesAreMoving, setNodesAreMoving] = useState(null as boolean)
	/** track when Nodes are in a hover transition to prevent additional hover-renders */
	const [inHoverTransition, setInHoverTransition] = useState(false as boolean)
	/** Array of projectSkills that are selected to show more detail */
	const [selectedProjectSkills, setSelectedProjectSkills] = useState(null as ProjectSkill[])

	const { width: screenWidth } = useWindowSize()
	const { projectDetailsPositioning, sunburstPosition, radiuses } = useSunburstDimensioning(screenWidth)
	const sunburstData = useSunburstData(allCategories, allSkills, projects)

	/**
	 * Method called after user hovers over a node
	 * @param id - Node id
	 * @param type - Type of node - category, skill or project
	 */
	const hoverNode = (id: string, type: string) => {
		if (type !== 'project') return
		currentHoverNode.current = { id, type }
		if (nodesAreMoving || inHoverTransition) return

		setHoveringProjectId(currentHoverNode.current.id)

		setInHoverTransition(true)
		setTimeout(() => {
			setHoveringProjectId(currentHoverNode.current ? currentHoverNode.current.id : null)
			setInHoverTransition(false)
		}, 300)
	}

	/** Method called after leaving the Sunburst */
	const leaveSunburst = () => {
		currentHoverNode.current = null
		setHoveringProjectId(null)
	}

	/**
	 * Method called after user clicks a node
	 * @param id Node id
	 * @param type Type of node - category, skill or project
	 */
	const selectNode = (id: string, type: string) => {
		if (nodesAreMoving) return
		if (type !== 'project') return

		if (selectedProject) {
			// prevent selecting already selected project skill
			if (selectedProject.id === id) return
			// Close current project first and rerun with new project
			else {
				setSelectedProject(null)
				setSelectedProjectSkills(null)
				setTimeout(() => {
					selectNode(id, type)
				}, 500)
				return
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
		setNodesAreMoving(projectSkills.length < 2 ? false : true)
		setSelectedProjectSkills(newSelectedProjectSkills)

		// Slowly add project skills to selectedProjectSkills
		if (projectSkills.length < 2) return
		let i = 1
		let projectSkillInterval = setInterval(() => {
			newSelectedProjectSkills = [...newSelectedProjectSkills, projectSkills[i]]
			setSelectedProjectSkills(newSelectedProjectSkills)
			i++
			if (i === projectSkills.length) {
				setNodesAreMoving(false)
				clearInterval(projectSkillInterval)
			}
		}, 100)
	}

	if (sunburstData.length === 0) return <h3>Loading...</h3>

	let categoryRotation = 0

	return (
		<div
			onMouseLeave={leaveSunburst}
			style={{
				position: 'absolute',
				transform: `translate(${sunburstPosition.x}px, ${sunburstPosition.y}px)`,
			}}
		>
			<Circle
				type="category"
				data={sunburstData}
				innerRadius={radiuses.category}
				outerRadius={radiuses.skill}
				itemRotation={0}
				fontSize={14}
				hoveringProjectId={hoveringProjectId}
				hoverNode={hoverNode}
				selectNode={selectNode}
			/>

			{sunburstData.map((category, categoryI) => {
				// Rotation logic for skills
				if (categoryI > 0) categoryRotation += sunburstData[categoryI - 1].phi / 2 + category.phi / 2
				let skillRotation = categoryRotation - category.phi / 2 + category.skills[0].phi / 2

				return (
					<React.Fragment key={category.id}>
						<Circle
							type="skill"
							data={category.skills}
							innerRadius={radiuses.skill}
							outerRadius={radiuses.project}
							itemRotation={skillRotation}
							fontSize={12}
							hoveringProjectId={hoveringProjectId}
							hoverNode={hoverNode}
							selectNode={selectNode}
						/>

						{category.skills.map((skill, skillI) => {
							// Rotation logic for projects
							if (skillI > 0) skillRotation += category.skills[skillI - 1].phi / 2 + skill.phi / 2
							const projectRotation = skillRotation - skill.phi / 2 + skill.projects[0].phi / 2

							return (
								<React.Fragment key={skill.id}>
									<Circle
										type="project"
										data={skill.projects}
										innerRadius={radiuses.project}
										outerRadius={radiuses.outer}
										itemRotation={projectRotation}
										fontSize={10}
										hoveringProjectId={hoveringProjectId}
										hoverNode={hoverNode}
										selectNode={selectNode}
										selectedProject={selectedProject}
										selectedProjectSkills={selectedProjectSkills}
										projectDetailsPositioning={projectDetailsPositioning}
									/>
								</React.Fragment>
							)
						})}
					</React.Fragment>
				)
			})}

			<ProjectDetails
				projectDetailsPositioning={projectDetailsPositioning}
				selectedProject={selectedProject}
				selectedProjectSkills={selectedProjectSkills}
				projectHeaderHeight={projectHeaderHeight}
			/>
		</div>
	)
}

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
function useSunburstDimensioning(screenWidth) {
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

interface SunburstData {
	id: string
	name: string
	fill: string
	phi: number
	projectCount: number
	skills: {
		id: string
		name: string
		fill: string
		phi: number
		projectCount: number
		projects: {
			id: string
			name: string
			skillId: string
			fill: string
			phi: number
		}[]
	}[]
}

/** This method creates the sunburst data by looping through categories, skills and projects */
function useSunburstData(allCategories, allSkills, projects) {
	const [sunburstData, setSunburstData] = useState([] as SunburstData[])

	useEffect(() => {
		if (allCategories.length === 0) return

		let newSunburstData: SunburstData[] = allCategories.map((category, categoryI) => {
			const skills = category.skills.items
				.map(skill => {
					const associatedProjects = getAssociatedProjects(skill.id, categoryI, projects)
					if (associatedProjects.length === 0) return null

					return {
						...skill,
						projects: associatedProjects,
						projectCount: associatedProjects.length,
						phi: null,
						fill: colors[categoryI],
					}
				})
				.filter(skill => skill !== null)

			// Number of total projects in skills
			const projectCount = skills.reduce((acc, cur) => acc + cur.projectCount, 0)

			return { ...category, skills, projectCount, phi: null, fill: colors[categoryI] }
		})

		// Add general category (no category) skills
		const generalCategorySkills = allSkills
			.filter(skill => skill.category === null)
			.map(skill => {
				const associatedProjects = getAssociatedProjects(skill.id, colors.length - 1, projects)
				if (associatedProjects.length === 0) return null
				return {
					id: skill.id,
					name: skill.name,
					projects: associatedProjects,
					projectCount: associatedProjects.length,
					phi: null,
					fill: colors[colors.length - 1],
				}
			})
			.filter(skill => skill !== null)

		newSunburstData.push({
			name: 'General',
			fill: colors[colors.length - 1],
			id: null,
			phi: null,
			projectCount: generalCategorySkills.reduce((acc, cur) => acc + cur.projectCount, 0),
			skills: generalCategorySkills,
		})

		// Count total projects and calculate rotation angle for each category, skill and project
		const totalProjects = newSunburstData.reduce((acc, cur) => acc + cur.projectCount, 0)
		newSunburstData = newSunburstData.map(category => {
			const skills = category.skills.map(skill => {
				const projects = skill.projects.map(project => ({ ...project, phi: 360 / totalProjects }))

				return { ...skill, projects, phi: (skill.projectCount * 360) / totalProjects }
			})

			return { ...category, skills, phi: (category.projectCount * 360) / totalProjects }
		})

		setSunburstData(newSunburstData)
	}, [allCategories.length])

	return sunburstData
}

/**
 * Returns the associated list of projects with a given skillId
 * @param skillId skillId to search for in projects
 * @param categoryI current category index for choosing color
 * @param projects list of projects
 */
function getAssociatedProjects(skillId, categoryI, projects) {
	return projects
		.map(({ id, name, skills }) => {
			const projectSkill = skills.items.find(projectSkill => {
				return projectSkill.skillId === skillId
			})
			if (!projectSkill) return null
			return { id, name, skillId: projectSkill.id, phi: null, fill: colors[categoryI] }
		})
		.filter(project => project !== null)
}

const mapStateToProps = ({ projects, allCategories, allSkills }) => ({
	projects,
	allCategories,
	allSkills,
})

export default connect(mapStateToProps)(Sunburst)
