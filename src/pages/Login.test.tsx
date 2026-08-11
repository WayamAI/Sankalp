import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

describe('Login', () => {
  it('shows a validation error for a malformed email instead of relying on native validation', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByDisplayValue('r.krishnamurthy@planmaster.ai');
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
  });
});
