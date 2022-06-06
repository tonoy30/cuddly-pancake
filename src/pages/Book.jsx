import { Container } from '@mui/material';
import HorizontalLinearStepper from 'components/HorizontalLinearStepper';
import Page from 'components/Page';
import React from 'react';

const STEPS = [{ id: '', title: '', isOptional: false, component: '' }];

const Book = () => {
	return (
		<Page title='Book Product'>
			<Container>
				<HorizontalLinearStepper steps={STEPS} />
			</Container>
		</Page>
	);
};

export default Book;
