import { fireEvent, render, screen, within } from '@testing-library/react';

import Capabilities from '../common/Capabilities';
import JobStatisticsAgentsTabs from '../views/jobStatistics/JobStatisticsServiceView'
import JobStatisticsServiceView from '../views/jobStatistics/JobStatisticsServiceView'
import Sidebar from '../App'
import { application } from 'express';
import userEvent from '@testing-library/user-event'

describe('Job Statistics Service View', () => {

    const originalWarn = console.warn.bind(console.warn)
    const originalError = console.error.bind(console.error)
    const service = require('../services/JobStatisticsService')
    jest.mock('../services/JobStatisticsService', () => ({ getCapabilities: jest.fn() }))
    beforeAll(() => {
        // Ignoring this specific console warning
        console.warn = (msg) =>
            !msg.toString().includes('use a basename on a page whose URL path does not begin with the basename') && originalWarn(msg)
        // Ignoring this specific console error
        console.error = (msg) =>
            !msg.toString().includes('The prop `to` is marked as required in `Link`, but its value is `undefined`.')
    })
    afterAll(() => {
        console.warn = originalWarn
        console.error = originalError
    })

    test.skip('Job Statistics Service View', async () => {
        const user = userEvent.setup();
        // render sidebar and click job statistics service button
        var { getByTestId } = render(<Sidebar />)
        await user.click(screen.getByTestId('job-statistics-button'))

        const { getByText } = within(getByTestId('job-statistics-view'));
        const expectedTitle = 'Job Statistics Service'
        const expectedDesc = 'Example interaction with the OXPd2 Job Statistics Service'
        expect(getByText(expectedTitle)).toBeInTheDocument()
        expect(getByText(expectedDesc)).toBeInTheDocument()
    });

    test.skip('Job Statistics Service Tabs', async () => {
        const user = userEvent.setup();

        const { getByLabelText } = render(
            <JobStatisticsAgentsTabs />
        )
        const input = getByLabelText('simple tabs example')
        fireEvent.change(input, { target: { Tabs: 'Test' } })

        const capabilitiesTab = getByLabelText('Capabilities')
        expect(capabilitiesTab).toBeInTheDocument()
        await user.click(capabilitiesTab)
    });

    test.skip('Job Statistics Service Buttons', async () => {
        const user = userEvent.setup();

        const { getByTestId, getByLabelText } = render(<JobStatisticsAgentsTabs />)
        service.getCapabilities.mockReturnValue(
            <Capabilities>
                <apiVersion>1</apiVersion>
                <description>1</description>
                <implVersion>1</implVersion>
                <serviceGun>1</serviceGun>
            </Capabilities>
        )

        const capabilitiesTab = getByLabelText('Capabilities')
        expect(capabilitiesTab).toBeInTheDocument()
        await user.click(capabilitiesTab)

        const apiResponse = getByTestId('get-api-response')
        expect(apiResponse).toBeInTheDocument()
        fireEvent.click(apiResponse)
    });

    test.skip('Job Statistics Service Methods', async () => {
        const user = userEvent.setup();

        const { getByTestId, getByLabelText } = render(<JobStatisticsAgentsTabs />)
        service.getCapabilities.mockReturnValue(
            <Capabilities>
                <apiVersion>1</apiVersion>
                <description>1</description>
                <implVersion>1</implVersion>
                <serviceGun>1</serviceGun>
            </Capabilities>
        )

        const capabilitiesTab = getByLabelText('Capabilities')
        expect(capabilitiesTab).toBeInTheDocument()
        await user.click(capabilitiesTab)

        const apiResponse = getByTestId('get-api-response')
        expect(apiResponse).toBeInTheDocument()

        fireEvent.click(apiResponse)
    });

});
