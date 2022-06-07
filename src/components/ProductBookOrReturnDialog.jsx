import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import HorizontalLinearStepper from 'components/HorizontalLinearStepper';
import React from 'react';
import Iconify from './Iconify';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiDialogContent-root': {
		padding: theme.spacing(2),
	},
	'& .MuiDialogActions-root': {
		padding: theme.spacing(1),
	},
}));
const BootstrapDialogTitle = (props) => {
	const { children, onClose, ...other } = props;

	return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label='close'
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<Iconify icon='eva:close-outline' />
				</IconButton>
			) : null}
		</DialogTitle>
	);
};

const ProductBookOrReturnDialog = ({
	open,
	title,
	steps,
	handleClose,
	handleStepperFinished,
	hasActions = false,
}) => {
	return (
		<>
			<BootstrapDialog
				fullWidth={true}
				maxWidth={'md'}
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<BootstrapDialogTitle
					id='alert-dialog-title'
					onClose={handleClose}
				>
					{title}
				</BootstrapDialogTitle>
				<DialogContent>
					<Container>
						<HorizontalLinearStepper
							steps={steps}
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
			</BootstrapDialog>
		</>
	);
};
export default ProductBookOrReturnDialog;
