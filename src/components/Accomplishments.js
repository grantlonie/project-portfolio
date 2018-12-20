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
	Input,
} from '@material-ui/core'

import { createAccomplishment } from '../graphql/mutations'

const emptyAccomplishment = { name: '', date: null, company: '', description: '' }
const headers = [
	{ id: 'id', label: 'ID' },
	{ id: 'name', label: 'Name' },
	{ id: 'date', label: 'Date' },
	{ id: 'company', label: 'Company' },
	{ id: 'description', label: 'Description' },
]

class Accomplishments extends Component {
	constructor(props) {
		super(props)

		this.rowsPerPage = 10

		this.headerStyle = {
			display: 'flex',
			alignItems: 'center',
		}

		this.state = {
			page: 0,
			orderBy: 'id',
			order: 'asc',
			filter: '',
			redirect: null,
		}
	}

	handleClickRow(id) {
		this.setState({ redirect: id })
	}

	handleRequestSort = orderBy => {
		let order = 'desc'
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

	handleAddField() {
		const { fields, addField } = this.props

		this.setState({ page: Math.ceil(fields.length / this.rowsPerPage) })
		addField()
	}

	async handleAddAccomplishment() {
		const newAccomplishment = await API.graphql(
			graphqlOperation(createAccomplishment, { input: { ...this.state } })
		)
		console.log('newAccomplishment: ', newAccomplishment)
		this.setState({ ...emptyAccomplishment })
	}

	render() {
		const { accomplishments, deleteAccomplishment, updateAccomplishment } = this.props
		const { order, orderBy, page, filter, redirect } = this.state

		const filteredAccomplishments = accomplishments.filter(
			field => field.description.toLowerCase().indexOf(this.state.filter) > -1
		)

		if (redirect) return <Redirect to={`edit/${redirect}`} />

		return (
			<div>
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
						onClick={this.handleAddField.bind(this)}
						draggable="false"
						alt="Add Accomplishment"
					/>
					<em>Add Accomplishment</em>
				</div>

				<Table aria-labelledby="tableTitle">
					<TableHead>
						<TableRow>
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
						{this.stableSort(filteredAccomplishments, this.getSorting(order, orderBy))
							.slice(page * this.rowsPerPage, page * this.rowsPerPage + this.rowsPerPage)
							.map(field => {
								return (
									<TableRow hover key={field.id} onClick={this.handleClickRow.bind(this, field.id)}>
										<TableCell>{field.id}</TableCell>
										<TableCell>{field.name}</TableCell>
										<TableCell>{field.date}</TableCell>
										<TableCell>{field.company}</TableCell>
										<TableCell>{field.description}</TableCell>
									</TableRow>
								)
							})}
					</TableBody>
				</Table>

				<TablePagination
					component="div"
					count={filteredAccomplishments.length}
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

const mapStateToProps = ({ accomplishments }) => ({ accomplishments })

export default connect(mapStateToProps)(Accomplishments)
