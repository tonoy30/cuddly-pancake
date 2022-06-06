import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import DynamicLoader from './DynamicLoader';

const HorizontalLinearStepper = ({ steps, handleStepperFinished }) => {
	const [activeStep, setActiveStep] = useState(0);
	const [skipped, setSkipped] = useState(new Set());

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
					<DynamicLoader
						componentName={steps[activeStep].componentName}
					/>
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
