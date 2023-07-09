// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Spinner from './Spinner'

test('it renders component when prop is set to true', () => {
  render(<Spinner on={true} />)

  const loadingText = screen.getByText(/please wait.../i)

  expect(loadingText).toBeInTheDocument()
  expect(loadingText).toBeTruthy()
  expect(loadingText).toHaveTextContent(/please wait.../i)
})

test('it DOES NOT render component when prop is set to false', () => {
  render(<Spinner on={false} />)

  const loadingText = screen.queryByText(/please wait.../i)

  expect(loadingText).not.toBeInTheDocument()
  expect(loadingText).toBeFalsy()
})
