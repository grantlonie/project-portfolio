import { useState, useEffect } from 'react'

import { SunburstData } from './types'

/** Colors for the categories and associated skills and projects */
const colors = ['#6ff5fc', 'orange', 'gray', '#ff5959', '#f682ff']

/** This method creates the sunburst data by looping through categories, skills and projects */
export default function useSunburstData(allCategories, allSkills, projects) {
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
			id: 'general',
			phi: null,
			projectCount: generalCategorySkills.reduce((acc, cur) => acc + cur.projectCount, 0),
			skills: generalCategorySkills,
		})

		// Count total projects and calculate rotation angle for each category, skill and project
		const totalProjects = newSunburstData.reduce((acc, cur) => acc + cur.projectCount, 0)
		newSunburstData = newSunburstData.map(category => {
			const skills = category.skills.map(skill => {
				const projects = skill.projects.map(project => ({ ...project, phi: (Math.PI * 2) / totalProjects }))

				return { ...skill, projects, phi: (skill.projectCount * Math.PI * 2) / totalProjects }
			})

			return { ...category, skills, phi: (category.projectCount * Math.PI * 2) / totalProjects }
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
