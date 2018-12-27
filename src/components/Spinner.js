import React from 'react'
import { BarLoader } from 'react-spinners'
import { Modal, Paper } from '@material-ui/core'

const modalStyle = {
	maxWidth: '600px',
	position: 'absolute',
	top: '20%',
	left: '50%',
	transform: 'translate(-50%, 50%)',
	padding: '20px',
}

const Spinner = ({ show }) => {
	return (
		<Modal open={show}>
			<Paper style={modalStyle} elevation={1}>
				<BarLoader
					// className={override}
					sizeUnit={'px'}
					size={150}
					color={'#123abc'}
					loading={show}
				/>
			</Paper>
		</Modal>
	)
}

export default Spinner
