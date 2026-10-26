import { createContext } from 'react';

const FPOProfileFormContext = createContext({
  saveDraft: () => {},
  isSubmitting: false,
});

export default FPOProfileFormContext;
