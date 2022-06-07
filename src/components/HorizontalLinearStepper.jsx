import LoadingButton from '@mui/lab/LoadingButton';
import { Container, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { axiosClient } from 'axiosClient';
import { useFormik } from 'formik';
import useFetch from 'hooks/useFetch';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import Confirmation from './Confirmation';
import DateTimePicker from './DataTimePicker';

const HorizontalLinearStepper = ({ steps, handleStepperFinished }) => {
	const [products] = useFetch('products?availability=True');
	const [stepperState, setStepperState] = useState(null);
	const [loading, setLoading] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [skipped, setSkipped] = useState(new Set());
	const formik = useFormik({
		initialValues: {
			product: '',
			from: '',
			to: '',
		},
	});

	const isStepOptional = (step) => {
		return step.isOptional;
	};

	const isStepSkipped = (step) => {
		return skipped.has(step);
	};

	const handleNext = () => {
		setLoading(true);
		const val = formik.values['product'];
		val.rented_at = formik.values['from'];
		val.returned_at = formik.values['to'];
		axiosClient.post('products/rent', val).then((res) => {
			setStepperState(res.data);
			setLoading(false);
			let newSkipped = skipped;
			if (isStepSkipped(activeStep)) {
				newSkipped = new Set(newSkipped.values());
				newSkipped.delete(activeStep);
			}

			setActiveStep((prevActiveStep) => prevActiveStep + 1);
			setSkipped(newSkipped);
		});
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleSkip = () => {
		if (!isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
			const newSkipped = new Set(prevSkipped.values());
			newSkipped.add(activeStep);
			return newSkipped;
		});
	};

	const handleFinished = () => {
		const { id } = stepperState;
		setLoading(true);
		axiosClient
			.post('products/rent/confirmed', { id: id })
			.then((res) => {
				console.log(res.data);
				setLoading(false);
				handleStepperFinished();
			})
			.catch((err) => {
				console.error(err);
				setLoading(false);
			});
	};
	return (
		<Box sx={{ width: '100%' }}>
			<Stepper activeStep={activeStep}>
				{steps.map((step, index) => {
					const stepProps = {};
					const labelProps = {};
					if (isStepOptional(index)) {
						labelProps.optional = (
							<Typography variant='caption'>Optional</Typography>
						);
					}
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}
					return (
						<Step key={nanoid()} {...stepProps}>
							<StepLabel {...labelProps}>{step.title}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			<>
				{steps[activeStep].component === 'ProductBooking' && (
					<Box
						component='form'
						sx={{
							paddingTop: '3rem',
							'& .MuiTextField-root': { m: 1, width: '25ch' },
						}}
						noValidate
						autoComplete='off'
					>
						<Container>
							<FormControl fullWidth>
								<InputLabel id='demo-simple-select-label'>
									Product
								</InputLabel>
								<Select
									labelId='demo-simple-select-label'
									id='demo-simple-select'
									value={formik.values.product}
									label='Product'
									name='product'
									onChange={formik.handleChange}
								>
									{products.map((option) => (
										<MenuItem key={nanoid()} value={option}>
											{option.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<Stack spacing={2} direction='row' mt={2}>
								<DateTimePicker
									name={'from'}
									label={'From'}
									value={formik.values.from}
									onDateChange={(value) =>
										formik.setFieldValue('from', value)
									}
								/>
								<DateTimePicker
									name={'to'}
									label={'To'}
									value={formik.values.to}
									onDateChange={(value) =>
										formik.setFieldValue('to', value)
									}
								/>
							</Stack>
						</Container>
					</Box>
				)}
				{steps[activeStep].component === 'Confirmation' && (
					<Confirmation {...stepperState} />
				)}
				<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
					<Button
						color='inherit'
						variant='outlined'
						disabled={activeStep === 0}
						onClick={handleBack}
						sx={{ mr: 1 }}
					>
						Back
					</Button>
					<Box sx={{ flex: '1 1 auto' }} />
					{isStepOptional(activeStep) && (
						<Button
							variant='outlined'
							color='inherit'
							onClick={handleSkip}
							sx={{ mr: 1 }}
						>
							Skip
						</Button>
					)}

					<LoadingButton
						variant='outlined'
						onClick={
							activeStep === steps.length - 1
								? handleFinished
								: handleNext
						}
						loading={loading}
					>
						{activeStep === steps.length - 1 ? 'Confirmed' : 'Next'}
					</LoadingButton>
				</Box>
			</>
		</Box>
	);
};
export default HorizontalLinearStepper;
