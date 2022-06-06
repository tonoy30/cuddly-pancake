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
import { useFormik } from 'formik';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import Confirmation from './Confirmation';
import DateTimePicker from './DataTimePicker';
const currencies = [
	{
		value: 'None',
		label: 'None',
	},
	{
		value: 'USD',
		label: '$',
	},
	{
		value: 'EUR',
		label: '€',
	},
	{
		value: 'BTC',
		label: '฿',
	},
	{
		value: 'JPY',
		label: '¥',
	},
];

const HorizontalLinearStepper = ({
	steps,
	handleStepperNext,
	handleStepperFinished,
}) => {
	const [activeStep, setActiveStep] = useState(0);
	const [skipped, setSkipped] = useState(new Set());
	const formik = useFormik({
		initialValues: {
			product: 'None',
			from: '',
			to: '',
		},
		onSubmit: (values) => {
			alert(JSON.stringify(values, null, 2));
		},
	});
	const isStepOptional = (step) => {
		return step.isOptional;
	};

	const isStepSkipped = (step) => {
		return skipped.has(step);
	};

	const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
		handleStepperNext();
		console.log(formik.values);
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
			{activeStep === steps.length ? (
				<>
					<Typography sx={{ mt: 2, mb: 1 }}>
						All steps completed - you&apos;re finished
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Box sx={{ flex: '1 1 auto' }} />
						<Button onClick={handleStepperFinished}>
							Confirmed
						</Button>
					</Box>
				</>
			) : (
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
										{currencies.map((option) => (
											<MenuItem
												key={option.value}
												value={option.value}
											>
												{option.label}
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
						<Confirmation />
					)}
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Button
							color='inherit'
							disabled={activeStep === 0}
							onClick={handleBack}
							sx={{ mr: 1 }}
						>
							Back
						</Button>
						<Box sx={{ flex: '1 1 auto' }} />
						{isStepOptional(activeStep) && (
							<Button
								color='inherit'
								onClick={handleSkip}
								sx={{ mr: 1 }}
							>
								Skip
							</Button>
						)}

						<Button onClick={handleNext}>
							{activeStep === steps.length - 1
								? 'Finish'
								: 'Next'}
						</Button>
					</Box>
				</>
			)}
		</Box>
	);
};
export default HorizontalLinearStepper;
