import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

    // getBy   // crash immediately if not found
    // queryBy // return a big null if not found
    // findBy  // retry for a bit (do not forget async/await) otherwise fail test outright

beforeEach(() => {
  render(<ContactForm />);
});


describe('Contact Form Component', () => {
  test('renders without errors', () => {
    render(<ContactForm />);
  });

  test('renders the contact form header', () => {
    const heading = screen.queryByText(/contact form/i);
    expect(heading).toBeInTheDocument();
    expect(heading).toBeTruthy();
    expect(heading).toHaveTextContent(/contact form/i);
  });

  test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    const firstNameField = screen.queryByText(/First Name*/i);
    userEvent.type(firstNameField, 'abc');
    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
  });

  test('renders THREE error messages if user enters no values into any fields.', async () => {
    const submitButton = screen.queryByText('Submit');
    userEvent.click(submitButton);

    const threeErrorMessages = await screen.findAllByTestId('error');
    expect(threeErrorMessages).toHaveLength(3);
  });

  test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    const firstNameField = screen.queryByText(/First Name*/i);
    userEvent.type(firstNameField, 'Johnny');
    const lastNameField = screen.queryByText(/Last Name*/i);
    userEvent.type(lastNameField, 'Smith');

    const submitButton = screen.queryByText('Submit');
    userEvent.click(submitButton);
    

    const emailErrorMessage = await screen.findAllByTestId('error');
    expect(emailErrorMessage).toHaveLength(1);
  });

  test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    const emailField = screen.queryByText(/Email*/i);
    userEvent.type(emailField, 'Smith.com');

    const emailErrorMessage = await screen.findByText(/email must be a valid email address/i);
    expect(emailErrorMessage).toBeInTheDocument();
  });

  test('renders "lastName is a required field" if a last name is not entered and the submit button is clicked', async () => {
    const submitButton = screen.queryByText('Submit');
    userEvent.click(submitButton);

    const lastNameErrorMessage = await screen.findByText(/lastName is a required field/i);
    expect(lastNameErrorMessage).toBeInTheDocument();
  });

  test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    const firstNameField = screen.queryByText(/First Name*/i);
    userEvent.type(firstNameField, 'Johnny');
    const lastNameField = screen.queryByText(/Last Name*/i);
    userEvent.type(lastNameField, 'Smith');
    const emailNameField = screen.queryByText(/Email*/i);
    userEvent.type(emailNameField, 'JohnSmith@email.com');

    const submitButton = screen.queryByText('Submit');
    userEvent.click(submitButton);

    await waitFor(() => {
      const firstName = screen.queryByText('Johnny');
    expect(firstName).toBeInTheDocument();
    const lastName = screen.queryByText('Smith');
    expect(lastName).toBeInTheDocument();
    const email = screen.queryByText('JohnSmith@email.com');
    expect(email).toBeInTheDocument();
    const Message = screen.queryByTestId('messageDisplay');
    expect(Message).not.toBeInTheDocument();
    });
  });

  test('renders all fields text when all fields are submitted.', async () => {
    const firstNameField = screen.queryByText(/First Name*/i);
    userEvent.type(firstNameField, 'Johnny');
    const lastNameField = screen.queryByText(/Last Name*/i);
    userEvent.type(lastNameField, 'Smith');
    const emailNameField = screen.queryByText(/Email*/i);
    userEvent.type(emailNameField, 'JohnSmith@email.com');
    const messageField = screen.queryByText(/Message/i);
    userEvent.type(messageField, 'This is my unique note');

    const submitButton = screen.queryByText('Submit');
    userEvent.click(submitButton);

    await waitFor(() => {
      const firstName = screen.queryByText('Johnny');
    expect(firstName).toBeInTheDocument();
    const lastName = screen.queryByText('Smith');
    expect(lastName).toBeInTheDocument();
    const email = screen.queryByText('JohnSmith@email.com');
    expect(email).toBeInTheDocument();
    const Message = screen.queryByText('This is my unique note');
    expect(Message).toBeInTheDocument();
    });
  });

});