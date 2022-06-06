import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import HorizontalLinearStepper from 'components/HorizontalLinearStepper';
import React from 'react';

const ProductBookOrReturnDialog = ({
	open,
	title,
	steps,
	handleClose,
	handleStepperFinished,
	handleStepperNext,
	hasActions = false,
}) => {
	return (
		<>
			<Dialog
				fullWidth={true}
				maxWidth={'lg'}
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
				<DialogContent>
					<Container>
						<HorizontalLinearStepper
							steps={steps}
							handleStepperNext={handleStepperNext}
							handleStepperFinished={handleStepperFinished}
						/>
					</Container>
				</DialogContent>
				{hasActions && (
					<DialogActions>
						<Button onClick={handleClose}>Disagree</Button>
						<Button onClick={handleClose} autoFocus>
							Agree
						</Button>
					</DialogActions>
				)}
			</Dialog>
		</>
	);
};
export default ProductBookOrReturnDialog;
