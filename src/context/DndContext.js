import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

const backend = isTouchDevice ? TouchBackend({ enableMouseEvents: true }) : HTML5Backend;

const DndContext = ({ children }) => {
  return (
    <DndProvider backend={backend}>
      {children}
    </DndProvider>
  );
};

export default DndContext;