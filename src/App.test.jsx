import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// On simule Firebase pour éviter les erreurs de connexion pendant les tests
vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(),
  ref: vi.fn(),
  onValue: vi.fn(() => vi.fn()), // Retourne une fonction de nettoyage vide
  push: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
}));

describe('App Component', () => {
  
  it('doit afficher le titre et le champ de saisie', () => {
    render(<App />);
    expect(screen.getByText(/Welcome to To-Do App/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
  });

  it('doit mettre à jour la valeur de l\'input quand l\'utilisateur écrit', () => {
    render(<App />);
    const input = screen.getByLabelText(/Item Name/i);
    
    fireEvent.change(input, { target: { value: 'Acheter du lait' } });
    
    expect(input.value).toBe('Acheter du lait');
  });

  it('doit afficher une alerte si on soumet un champ vide', () => {
    // On simule la fonction alert du navigateur
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<App />);
    const submitButton = screen.getByText(/submit/i);
    
    fireEvent.click(submitButton);
    
    expect(alertMock).toHaveBeenCalledWith("Please input item name");
    alertMock.mockRestore();
  });
});