import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import API, { graphqlOperation } from '@aws-amplify/api'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Tooltip,
	TableSortLabel,
	TextField,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import { createProject, deleteProject, deleteProjectSkill } from '../graphql/mutations'
import { ProjectItem } from '../types'
import DeleteProjectModal from './DeleteProjectModal'

const headers = [
	{ id: 'id', label: 'ID' },
	{ id: 'name', label: 'Name' },
	{ id: 'date', label: 'Date' },
	{ id: 'company', label: 'Company' },
	{ id: 'description', label: 'Description' },
]

interface Props {
	userId: string
	addProject: (project: ProjectItem) => null
	removeProjectFromStore: (projectId: string) => null
	showSpinner: (show: boolean) => null
	projects: ProjectItem[]
}

interface State {
	page: number
	orderBy: string
	order: 'asc' | 'desc'
	filter: string
	redirect: string
	confirmDeleteModal: ProjectItem
}

class Projects extends Component<Props, State> {
	private rowsPerPage: number = 10

	private headerStyle: any = {
		display: 'flex',
		alignItems: 'center',
	}

	state: State = {
		page: 0,
		orderBy: 'id',
		order: 'asc',
		filter: '',
		redirect: null,
		confirmDeleteModal: null,
	}

	handleClickRow(id) {
		this.setState({ redirect: id })
	}

	handleRequestSort = orderBy => {
		let order: State['order'] = 'desc'
		if (this.state.orderBy === orderBy && this.state.order === 'desc') {
			order = 'asc'
		}

		this.setState({ order, orderBy })
	}

	stableSort(array, cmp) {
		const stabilizedThis = array.map((el, index) => [el, index])
		stabilizedThis.sort((a, b) => {
			const order = cmp(a[0], b[0])
			if (order !== 0) return order
			return a[1] - b[1]
		})
		return stabilizedThis.map(el => el[0])
	}

	getSorting(order, orderBy) {
		return order === 'desc'
			? (a, b) => this.desc(a, b, orderBy)
			: (a, b) => -this.desc(a, b, orderBy)
	}

	desc(a, b, orderBy) {
		if (b[orderBy] < a[orderBy]) {
			return -1
		}
		if (b[orderBy] > a[orderBy]) {
			return 1
		}
		return 0
	}

	handleChangePage = (e, page) => {
		this.setState({ page })
	}

	handleChangeFilter({ target: { value } }) {
		this.setState({ filter: value.toLowerCase() })
	}

	async handleAddProject() {
		const { userId, addProject, showSpinner } = this.props

		showSpinner(true)

		const date = new Date()
		const year = date.getFullYear()
		let month = ('0' + (date.getMonth() + 1)).slice(-2)
		let day = ('0' + date.getDate()).slice(-2)

		const emptyProject = { userId, date: `${year}-${month}-${day}` }

		const data = await API.graphql(graphqlOperation(createProject, { input: { ...emptyProject } }))

		showSpinner(false)

		addProject(data['data']['createProject'])
		this.setState({ redirect: data['data']['createProject']['id'] })
	}

	async handleRemoveProject(confirm) {
		const { showSpinner, removeProjectFromStore } = this.props
		const { confirmDeleteModal } = this.state

		if (confirm) {
			showSpinner(true)

			// Delete all ProjectSkills in the project
			for (const skill of confirmDeleteModal.skills.items) {
				await API.graphql(graphqlOperation(deleteProjectSkill, { input: { id: skill.id } }))
			}

			// Delete project once all related ProjectSkills are gone and update store
			const data = await API.graphql(
				graphqlOperation(deleteProject, { input: { id: confirmDeleteModal.id } })
			)

			removeProjectFromStore(data['data']['deleteProject']['id'])

			showSpinner(false)
		}

		this.setState({ confirmDeleteModal: null })
	}

	handleRequestRemoveProject(project, e) {
		e.stopPropagation() // prevents bubbling to EditProject

		this.setState({ confirmDeleteModal: project })
	}

	render() {
		const { projects } = this.props
		const { order, orderBy, page, filter, redirect, confirmDeleteModal } = this.state

		const filteredProjects = projects.filter(project => {
			if (project.name === null) return true
			return project.name.toLowerCase().indexOf(this.state.filter) > -1
		})

		if (redirect) return <Redirect push to={`editProject/${redirect}`} />

		return (
			<div>
				{confirmDeleteModal ? (
					<DeleteProjectModal
						project={confirmDeleteModal}
						close={this.handleRemoveProject.bind(this)}
					/>
				) : null}

				<div style={this.headerStyle}>
					<TextField
						id="standard-search"
						label="Filter"
						type="search"
						value={filter}
						onChange={this.handleChangeFilter.bind(this)}
						style={{ marginLeft: '20px' }}
					/>

					<img
						style={{ margin: '0 10px 0 30px', height: '30px' }}
						src="./assets/img/baseline-add_circle-24px.svg"
						onClick={this.handleAddProject.bind(this)}
						draggable={false}
						alt="Add Project"
					/>
					<em>Add Project</em>
				</div>

				<Table aria-labelledby="tableTitle">
					<TableHead>
						<TableRow>
							<TableCell />
							{headers.map(header => {
								return (
									<TableCell key={header.id} sortDirection={orderBy === header.id ? order : false}>
										<Tooltip title="Sort" enterDelay={300}>
											<TableSortLabel
												active={orderBy === header.id}
												direction={order}
												onClick={this.handleRequestSort.bind(this, header.id)}>
												{header.label}
											</TableSortLabel>
										</Tooltip>
									</TableCell>
								)
							}, this)}
						</TableRow>
					</TableHead>

					<TableBody>
						{this.stableSort(filteredProjects, this.getSorting(order, orderBy))
							.slice(page * this.rowsPerPage, page * this.rowsPerPage + this.rowsPerPage)
							.map(project => {
								return (
									<TableRow
										hover
										key={project.id}
										onClick={this.handleClickRow.bind(this, project.id)}>
										<TableCell>
											<DeleteIcon onClick={this.handleRequestRemoveProject.bind(this, project)} />
										</TableCell>
										<TableCell>{project.id}</TableCell>
										<TableCell>{project.name}</TableCell>
										<TableCell>{project.date}</TableCell>
										<TableCell>{project.company}</TableCell>
										<TableCell>{project.description}</TableCell>
									</TableRow>
								)
							})}
					</TableBody>
				</Table>

				<TablePagination
					component="div"
					count={filteredProjects.length}
					rowsPerPage={this.rowsPerPage}
					rowsPerPageOptions={[]}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page',
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page',
					}}
					onChangePage={this.handleChangePage.bind(this)}
				/>
			</div>
		)
	}
}

const mapStateToProps = ({ projects, userId }) => ({ projects, userId })

const mapDispatchToProps = dispatch => {
	return {
		addProject: project => {
			dispatch({ type: 'ADD_PROJECT', project })
		},
		showSpinner: show => {
			dispatch({ type: 'SHOW_SPINNER', show })
		},
		removeProjectFromStore: projectId => {
			dispatch({ type: 'REMOVE_PROJECT', projectId })
		},
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Projects)
