import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// @ts-expect-error: side-effect CSS import without type declarations
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
