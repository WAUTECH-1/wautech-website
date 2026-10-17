import { renderToString } from 'react-dom/server';
import { App } from './App';
export { pages } from './content';
export const render = (path: string) => renderToString(<App path={path} />);
