// Home View Tests
import { render, screen, within } from '@testing-library/react';
import HomeView from '../views/home/HomeView'

describe('HomeView', () => {

    const originalError = console.error.bind(console.error)
    beforeAll(() => {
        // Ignoring this specific console error
        console.error = (msg) =>
            !msg.toString().includes('The prop `to` is marked as required in `Link`, but its value is `undefined`.')
    })
    afterAll(() => {
        console.error = originalError
    })

    test('Home View Introduction', () => {
        const { getByTestId } = render(<HomeView />);
        const { getByText } = within(getByTestId('home-view'));
        const expectedIntroduction = 'Introduction to the OXPd2 Examples'
        const expectedIntroductionDesc = 'A wonderful introduction to the OXPd2 examples follows. Details about how to navigate and use the app are provided as well.'
        expect(getByText(expectedIntroduction)).toBeInTheDocument();
        expect(getByText(expectedIntroductionDesc)).toBeInTheDocument();
    });

});
