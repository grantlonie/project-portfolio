import sleep from 'sleep-promise'
import random from 'lodash/random'

import { ProjectSkill, nodeTypes, SunburstData } from './types'

/**
 * Method to calculate the selected category's total rotation from 0 (right) clockwise
 * @param sunburstData main data object
 * @param sunburstRotation current sunburst rotation
 * @param categoryId selected category id
 */
export function sunburstRotater(sunburstData, sunburstRotation, categoryId) {
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
 */
export function slowlyAddProjectSkills(projectSkills, setSelectedProjectSkills) {
	return new Promise(resolve => {
		let newSelectedProjectSkills: ProjectSkill[] = [projectSkills[0]]
		setSelectedProjectSkills(newSelectedProjectSkills)

		// Slowly add project skills to selectedProjectSkills
		if (projectSkills.length < 2) return
		let i = 1
		let projectSkillInterval = setInterval(() => {
			newSelectedProjectSkills = [...newSelectedProjectSkills, projectSkills[i]]
			setSelectedProjectSkills(newSelectedProjectSkills)
			i++
			if (i === projectSkills.length) {
				clearInterval(projectSkillInterval)
				resolve()
			}
		}, 100)
	})
}

/**
 * Slowly add category nodes to display
 * @param sunburstData sunburst data object
 * @param selectedCategoryId selected cateogry id
 * @param setSelectedCategoryNodes callback to set category nodes to display
 */
export function slowlyAddCategoryNodes(sunburstData: SunburstData[], selectedCategoryId, setSelectedCategoryNodes) {
	return new Promise(async resolve => {
		const category = sunburstData.find(category => category.id === selectedCategoryId)

		const method = random(1, 3)

		const skillIds = []
		const projectIds = []
		category.skills.forEach(skill => {
			skillIds.push(skill.id)
			skill.projects.forEach(project => {
				projectIds.push(project.id)
			})
		})

		switch (method) {
			// pulse
			case 1:
				setSelectedCategoryNodes(nodes => [...nodes, ...projectIds])
				await sleep(150)
				setSelectedCategoryNodes(nodes => [...nodes, ...skillIds])
				await sleep(150)
				break

			// center wave
			case 2:
				for (let array of Object.values({ projectIds, skillIds })) {
					let isEven = array.length % 2 === 0
					let midPoint = Math.floor(array.length / 2)
					if (isEven) setSelectedCategoryNodes(nodes => [...nodes, array[midPoint], array[midPoint - 1]])
					else setSelectedCategoryNodes(nodes => [...nodes, array[midPoint]])
					for (let i = midPoint - 1; i > -1; i--) {
						await sleep(10)
						setSelectedCategoryNodes(nodes => [...nodes, array[i], array[array.length - i - 1]])
					}
				}
				break

			// downward wave
			case 3:
				for (const skill of category.skills) {
					for (const project of skill.projects) {
						setSelectedCategoryNodes(nodes => [...nodes, project.id])
						await sleep(10)
					}
					setSelectedCategoryNodes(nodes => [...nodes, skill.id])
				}
		}

		setSelectedCategoryNodes(nodes => [...nodes, category.id])

		resolve()
	})
}

/**
 * Determine the appropriate sunburst transition response after user clicks a node
 * @param id selected node id
 * @param type node type
 * @param inSelectedCategory true if selected node is in a selected category
 * @param selectedCategoryId the currently selected categogry id
 * @param selectedProject the currently selected project
 */
export function getTransition(id, type: nodeTypes, inSelectedCategory, selectedCategoryId, selectedProject) {
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
export function extractProjectId(id) {
	const splitProjectId = id.split('|')
	if (splitProjectId.length === 0) return null
	return splitProjectId[1]
}
