// DesignEditor.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Icons from 'react-feather';
import './DesignEditor1.scss';

// Constants
const SHAPE_TYPES = {
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  TEXT: 'text',
  STAR: 'star',
  POLYGON: 'polygon',
  IMAGE: 'image',
  LINE: 'line',
  ARROW: 'arrow',
  CONTAINER: 'container',
  GRID_LAYOUT: 'grid-layout',
  FLEX_LAYOUT: 'flex-layout',
  STACK_LAYOUT: 'stack-layout',
  GROUP: 'group'
};

const COMPONENT_TYPES = {
  BUTTON: 'button',
  INPUT: 'input',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SELECT: 'select',
  CARD: 'card',
  NAVBAR: 'navbar',
  MODAL: 'modal',
  TABS: 'tabs',
  ACCORDION: 'accordion',
  TABLE: 'table',
  LIST: 'list',
  CLOCK: 'clock',
  PROGRESS: 'progress',
  RATING: 'rating',
  ALERT: 'alert',
  TOOLTIP: 'tooltip',
  AVATAR: 'avatar',
  BADGE: 'badge',
  CAROUSEL: 'carousel',
  DROPDOWN: 'dropdown'
};

const EVENT_TYPES = {
  CLICK: 'onClick',
  CHANGE: 'onChange',
  MOUSE_ENTER: 'onMouseEnter',
  MOUSE_LEAVE: 'onMouseLeave',
  FOCUS: 'onFocus',
  BLUR: 'onBlur',
  KEY_DOWN: 'onKeyDown',
  KEY_UP: 'onKeyUp'
};

const DEFAULT_SHAPE_PROPS = {
  [SHAPE_TYPES.RECTANGLE]: { width: 100, height: 100, fill: '#f0f0f0', stroke: '#000000', strokeWidth: 1 },
  [SHAPE_TYPES.CIRCLE]: { radius: 50, width: 100, height: 100, fill: '#f0f0f0', stroke: '#000000', strokeWidth: 1 },
  [SHAPE_TYPES.TEXT]: { text: 'Text element', fontSize: 16, fontFamily: 'Arial', color: '#000000' },
  [SHAPE_TYPES.STAR]: { points: 5, innerRadius: 25, outerRadius: 50, width: 100, height: 100, fill: '#f0f0f0', stroke: '#000000', strokeWidth: 1 },
  [SHAPE_TYPES.POLYGON]: { sides: 6, radius: 50, width: 100, height: 100, fill: '#f0f0f0', stroke: '#000000', strokeWidth: 1 },
  [SHAPE_TYPES.IMAGE]: { width: 200, height: 150, src: 'https://via.placeholder.com/200x150' },
  [SHAPE_TYPES.LINE]: { x2: 100, y2: 0, width: 100, height: 4, stroke: '#000000', strokeWidth: 2 },
  [SHAPE_TYPES.ARROW]: { x2: 100, y2: 0, width: 100, height: 20, stroke: '#000000', strokeWidth: 2, arrowSize: 10 },
  [SHAPE_TYPES.CONTAINER]: { width: 300, height: 200, background: '#f8f8f8', children: [] },
  [SHAPE_TYPES.GRID_LAYOUT]: { columns: 3, gap: 10, width: 400, height: 300, children: [] },
  [SHAPE_TYPES.FLEX_LAYOUT]: { direction: 'row', gap: 10, width: 400, height: 100, children: [] },
  [SHAPE_TYPES.STACK_LAYOUT]: { spacing: 10, width: 200, height: 300, children: [] },
  [SHAPE_TYPES.GROUP]: { children: [], name: 'Group' }
};

const DEFAULT_COMPONENT_PROPS = {
  [COMPONENT_TYPES.BUTTON]: { 
    text: 'Button', 
    variant: 'primary', 
    size: 'medium', 
    width: 120, 
    height: 40, 
    color: '#ffffff', 
    backgroundColor: '#1e88e5', 
    borderRadius: 4 
  },
  [COMPONENT_TYPES.INPUT]: {
    placeholder: 'Enter text...', 
    width: 200, 
    height: 40, 
    fontSize: 14, 
    color: '#333333', 
    backgroundColor: '#ffffff', 
    borderWidth: 1, 
    borderColor: '#dddddd', 
    borderRadius: 4
  },
  [COMPONENT_TYPES.TEXTAREA]: {
    placeholder: 'Enter text...',
    width: 200,
    height: 100,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4
  },
  [COMPONENT_TYPES.SELECT]: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    width: 200,
    height: 40,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 4
  },
  [COMPONENT_TYPES.CARD]: {
    title: 'Card Title', 
    content: 'Card content goes here...', 
    width: 300, 
    height: 200, 
    backgroundColor: '#ffffff', 
    borderWidth: 1, 
    borderColor: '#dddddd', 
    borderRadius: 8
  },
  [COMPONENT_TYPES.NAVBAR]: {
    title: 'My App', 
    backgroundColor: '#2d3748', 
    color: '#ffffff', 
    links: ['Home', 'Products', 'About', 'Contact'], 
    width: '100%', 
    height: 60
  },
  [COMPONENT_TYPES.TABS]: {
    tabs: ['Tab 1', 'Tab 2', 'Tab 3'],
    activeTab: 0,
    width: 400,
    height: 300,
    backgroundColor: '#ffffff'
  },
  [COMPONENT_TYPES.ACCORDION]: {
    items: [
      { title: 'Section 1', content: 'Content 1', open: true },
      { title: 'Section 2', content: 'Content 2', open: false }
    ],
    width: 300,
    height: 'auto'
  },
  [COMPONENT_TYPES.TABLE]: {
    columns: ['Name', 'Age', 'Email'],
    data: [
      ['John Doe', 30, 'john@example.com'],
      ['Jane Smith', 25, 'jane@example.com']
    ],
    width: 500,
    height: 300
  },
  [COMPONENT_TYPES.LIST]: {
    items: ['Item 1', 'Item 2', 'Item 3'],
    width: 200,
    height: 'auto'
  },
  [COMPONENT_TYPES.CLOCK]: {
    size: 100, 
    showSeconds: true, 
    backgroundColor: '#ffffff', 
    borderWidth: 2, 
    borderColor: '#333333'
  },
  [COMPONENT_TYPES.DROPDOWN]: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    selected: 0,
    width: 200,
    height: 40
  }
};

const BREAKPOINTS = {
  DESKTOP: { width: 1200, height: 800, label: 'Desktop' },
  TABLET: { width: 768, height: 1024, label: 'Tablet' },
  MOBILE: { width: 375, height: 667, label: 'Mobile' }
};

const ANIMATION_TYPES = {
  NONE: 'none',
  FADE: 'fade',
  SLIDE: 'slide',
  BOUNCE: 'bounce',
  ROTATE: 'rotate'
};

// Custom Hooks
const useHistory = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [index, setIndex] = useState(0);

  const push = useCallback((newState) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(JSON.parse(JSON.stringify(newState)));
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  }, [history, index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
      return history[index - 1];
    }
    return history[index];
  }, [history, index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(index + 1);
      return history[index + 1];
    }
    return history[index];
  }, [history, index]);

  return { 
    state: history[index], 
    push, 
    undo, 
    redo, 
    canUndo: index > 0, 
    canRedo: index < history.length - 1,
    history,
    index
  };
};

const useDrag = (onDrag, onDragEnd) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e, initialX, initialY) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX,
      y: e.clientY,
      initialX,
      initialY
    });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    const newX = startPos.initialX + deltaX;
    const newY = startPos.initialY + deltaY;

    onDrag(newX, newY);
  }, [isDragging, startPos, onDrag]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd();
    }
  }, [isDragging, onDragEnd]);

  return { handleMouseDown, handleMouseMove, handleMouseUp, isDragging };
};

// Helper Functions
const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

const getElementIcon = (type) => {
  switch (type) {
    case SHAPE_TYPES.RECTANGLE: return <Icons.Square size={16} />;
    case SHAPE_TYPES.CIRCLE: return <Icons.Circle size={16} />;
    case SHAPE_TYPES.TEXT: return <Icons.Type size={16} />;
    case SHAPE_TYPES.IMAGE: return <Icons.Image size={16} />;
    case SHAPE_TYPES.GROUP: return <Icons.Layers size={16} />;
    case COMPONENT_TYPES.BUTTON: return <Icons.Square size={16} />;
    case COMPONENT_TYPES.CARD: return <Icons.Layout size={16} />;
    case COMPONENT_TYPES.CLOCK: return <Icons.Clock size={16} />;
    case COMPONENT_TYPES.NAVBAR: return <Icons.Navigation size={16} />;
    case COMPONENT_TYPES.TABS: return <Icons.Copy size={16} />;
    case COMPONENT_TYPES.ACCORDION: return <Icons.AlignJustify size={16} />;
    case COMPONENT_TYPES.TABLE: return <Icons.Grid size={16} />;
    case COMPONENT_TYPES.LIST: return <Icons.List size={16} />;
    case COMPONENT_TYPES.DROPDOWN: return <Icons.ChevronDown size={16} />;
    default: return <Icons.Box size={16} />;
  }
};

// Components
const Sidebar = ({ 
  selectedTool, 
  onSelectTool, 
  onAddShape, 
  onAddComponent,
  onCanvasBackgroundChange,
  canvasBackground
}) => {
  const [backgroundTab, setBackgroundTab] = useState('color');
  const [expandedSections, setExpandedSections] = useState({
    tools: true,
    shapes: true,
    layouts: true,
    components: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBackgroundColorChange = (e) => {
    onCanvasBackgroundChange('color', e.target.value);
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onCanvasBackgroundChange('image', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tools = [
    { id: 'select', icon: <Icons.MousePointer size={20} />, label: 'Select' },
    { id: 'text', icon: <Icons.Type size={20} />, label: 'Text' },
    { id: 'pen', icon: <Icons.PenTool size={20} />, label: 'Pen' },
    { id: 'group', icon: <Icons.Layers size={20} />, label: 'Group' },
    { id: 'ungroup', icon: <Icons.Layers size={20} />, label: 'Ungroup' }
  ];

  const shapes = [
    { id: SHAPE_TYPES.RECTANGLE, icon: <Icons.Square size={20} />, label: 'Rectangle' },
    { id: SHAPE_TYPES.CIRCLE, icon: <Icons.Circle size={20} />, label: 'Circle' },
    { id: SHAPE_TYPES.TEXT, icon: <Icons.Type size={20} />, label: 'Text' },
    { id: SHAPE_TYPES.STAR, icon: <Icons.Star size={20} />, label: 'Star' },
    { id: SHAPE_TYPES.POLYGON, icon: <Icons.Triangle size={20} />, label: 'Polygon' },
    { id: SHAPE_TYPES.IMAGE, icon: <Icons.Image size={20} />, label: 'Image' },
    { id: SHAPE_TYPES.LINE, icon: <Icons.Minus size={20} />, label: 'Line' },
    { id: SHAPE_TYPES.ARROW, icon: <Icons.CornerDownRight size={20} />, label: 'Arrow' }
  ];

  const layouts = [
    { id: SHAPE_TYPES.CONTAINER, icon: <Icons.Layout size={20} />, label: 'Container' },
    { id: SHAPE_TYPES.GRID_LAYOUT, icon: <Icons.Grid size={20} />, label: 'Grid' },
    { id: SHAPE_TYPES.FLEX_LAYOUT, icon: <Icons.Columns size={20} />, label: 'Flex' },
    { id: SHAPE_TYPES.STACK_LAYOUT, icon: <Icons.Layers size={20} />, label: 'Stack' }
  ];

  const components = [
    { id: COMPONENT_TYPES.BUTTON, icon: <Icons.Square size={20} />, label: 'Button' },
    { id: COMPONENT_TYPES.INPUT, icon: <Icons.Edit size={20} />, label: 'Input' },
    { id: COMPONENT_TYPES.TEXTAREA, icon: <Icons.AlignLeft size={20} />, label: 'Textarea' },
    { id: COMPONENT_TYPES.SELECT, icon: <Icons.ChevronDown size={20} />, label: 'Select' },
    { id: COMPONENT_TYPES.CARD, icon: <Icons.Layout size={20} />, label: 'Card' },
    { id: COMPONENT_TYPES.NAVBAR, icon: <Icons.Navigation size={20} />, label: 'Navbar' },
    { id: COMPONENT_TYPES.TABS, icon: <Icons.Copy size={20} />, label: 'Tabs' },
    { id: COMPONENT_TYPES.ACCORDION, icon: <Icons.AlignJustify size={20} />, label: 'Accordion' },
    { id: COMPONENT_TYPES.TABLE, icon: <Icons.Grid size={20} />, label: 'Table' },
    { id: COMPONENT_TYPES.LIST, icon: <Icons.List size={20} />, label: 'List' },
    { id: COMPONENT_TYPES.CLOCK, icon: <Icons.Clock size={20} />, label: 'Clock' },
    { id: COMPONENT_TYPES.DROPDOWN, icon: <Icons.ChevronDown size={20} />, label: 'Dropdown' }
  ];

  const handleToolClick = (toolId) => {
    onSelectTool(toolId);
  };

  const handleShapeClick = (shapeId) => {
    const newElement = {
      id: generateId(),
      type: shapeId,
      x: 100,
      y: 100,
      ...DEFAULT_SHAPE_PROPS[shapeId],
      events: {}
    };
    onAddShape(newElement);
  };

  const handleLayoutClick = (layoutId) => {
    const newElement = {
      id: generateId(),
      type: layoutId,
      x: 100,
      y: 100,
      ...DEFAULT_SHAPE_PROPS[layoutId],
      events: {}
    };
    onAddShape(newElement);
  };

  const handleComponentClick = (componentId) => {
    const newElement = {
      id: generateId(),
      type: componentId,
      x: 100,
      y: 100,
      ...DEFAULT_COMPONENT_PROPS[componentId],
      events: {}
    };
    onAddComponent(newElement);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="section">
          <h3 onClick={() => toggleSection('tools')}>
            <Icons.Settings size={16} />
            Tools
            <Icons.ChevronDown 
              size={16} 
              style={{ 
                marginLeft: 'auto',
                transform: expandedSections.tools ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s'
              }} 
            />
          </h3>
          {expandedSections.tools && (
            <div className="tools">
              {tools.map(tool => (
                <div
                  key={tool.id}
                  className={`tool ${selectedTool === tool.id ? 'selected' : ''}`}
                  onClick={() => handleToolClick(tool.id)}
                  title={tool.label}
                >
                  {tool.icon}
                  <span>{tool.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h3 onClick={() => toggleSection('shapes')}>
            <Icons.Square size={16} />
            Shapes
            <Icons.ChevronDown 
              size={16} 
              style={{ 
                marginLeft: 'auto',
                transform: expandedSections.shapes ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s'
              }} 
            />
          </h3>
          {expandedSections.shapes && (
            <div className="tools">
              {shapes.map(shape => (
                <div
                  key={shape.id}
                  className="tool"
                  onClick={() => handleShapeClick(shape.id)}
                  title={shape.label}
                >
                  {shape.icon}
                  <span>{shape.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h3 onClick={() => toggleSection('layouts')}>
            <Icons.Layout size={16} />
            Layouts
            <Icons.ChevronDown 
              size={16} 
              style={{ 
                marginLeft: 'auto',
                transform: expandedSections.layouts ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s'
              }} 
            />
          </h3>
          {expandedSections.layouts && (
            <div className="tools">
              {layouts.map(layout => (
                <div
                  key={layout.id}
                  className="tool"
                  onClick={() => handleLayoutClick(layout.id)}
                  title={layout.label}
                >
                  {layout.icon}
                  <span>{layout.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h3 onClick={() => toggleSection('components')}>
            <Icons.Box size={16} />
            Components
            <Icons.ChevronDown 
              size={16} 
              style={{ 
                marginLeft: 'auto',
                transform: expandedSections.components ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s'
              }} 
            />
          </h3>
          {expandedSections.components && (
            <div className="tools">
              {components.map(component => (
                <div
                  key={component.id}
                  className="tool"
                  onClick={() => handleComponentClick(component.id)}
                  title={component.label}
                >
                  {component.icon}
                  <span>{component.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h3>
            <Icons.Image size={16} />
            Background
          </h3>
          <div style={{ padding: '0 12px' }}>
            <div style={{ display: 'flex', marginBottom: '8px' }}>
              <button 
                className={backgroundTab === 'color' ? 'active' : ''}
                onClick={() => setBackgroundTab('color')}
              >
                Color
              </button>
              <button 
                className={backgroundTab === 'image' ? 'active' : ''}
                onClick={() => setBackgroundTab('image')}
              >
                Image
              </button>
            </div>
            
            {backgroundTab === 'color' ? (
              <div className="property-control">
                <label>Background Color</label>
                <div className="color-picker">
                  <input 
                    type="color" 
                    value={canvasBackground.color} 
                    onChange={handleBackgroundColorChange}
                  />
                  <input 
                    type="text" 
                    value={canvasBackground.color} 
                    onChange={handleBackgroundColorChange}
                  />
                </div>
              </div>
            ) : (
              <div>
                <input 
                  type="file" 
                  id="background-upload"
                  accept="image/*"
                  onChange={handleBackgroundImageChange}
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="background-upload"
                  className="upload-button"
                >
                  Upload Image
                </label>
                {canvasBackground.image && (
                  <button 
                    onClick={() => onCanvasBackgroundChange('image', null)}
                    className="remove-button"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryPanel = ({ history, index, onUndo, onRedo, canUndo, canRedo }) => {
  return (
    <div className="history-panel">
      <div className="panel-header">
        <h3>History</h3>
      </div>
      <div className="panel-content">
        <div className="history-actions">
          <button onClick={onUndo} disabled={!canUndo} title="Undo">
            <Icons.ArrowLeft size={16} />
          </button>
          <button onClick={onRedo} disabled={!canRedo} title="Redo">
            <Icons.ArrowRight size={16} />
          </button>
        </div>
        <div className="history-list">
          {history.map((item, i) => (
            <div 
              key={i} 
              className={`history-item ${i === index ? 'active' : ''}`}
            >
              {i === 0 ? 'Initial State' : `Action ${i}`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LayersPanel = ({ 
  elements, 
  selectedElement, 
  onSelectElement, 
  onToggleVisibility,
  onChangeZIndex,
  onGroupElements,
  onUngroupElements,
  selectedElements,
  groupName,
  setGroupName,
  showGroupNameInput,
  setShowGroupNameInput
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const renderLayerItem = (element, depth = 0) => {
    const isSelected = element.id === selectedElement || selectedElements.includes(element.id);
    const hasChildren = element.type === SHAPE_TYPES.GROUP && element.children;
    
    return (
      <div key={element.id}>
        <div
          className={`layer-item ${isSelected ? 'selected' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectElement(element.id);
          }}
          style={{ paddingLeft: `${depth * 16}px` }}
        >
          {getElementIcon(element.type)}
          <span style={{ flex: 1, marginLeft: '8px' }}>
            {element.name || element.type}
          </span>
          <div 
            className="layer-visibility"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(element.id);
            }}
          >
            {element.visible === false ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
          </div>
        </div>
        {hasChildren && (
          <div style={{ marginLeft: '16px' }}>
            {element.children.map(child => {
              const childElement = elements.find(el => el.id === child.id);
              return childElement ? renderLayerItem(childElement, depth + 1) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="layers-panel">
      <div className="panel-header">
        <span>Layers</span>
        <div className="panel-actions">
          <button 
            onClick={() => {
              if (selectedElements.length >= 2) {
                setShowGroupNameInput(true);
              }
            }}
            disabled={selectedElements.length < 2}
            title="Group (Ctrl+G)"
          >
            <Icons.Layers size={16} />
          </button>
          <button 
            onClick={onUngroupElements}
            disabled={!selectedElement || selectedElement.type !== SHAPE_TYPES.GROUP}
            title="Ungroup (Ctrl+Shift+G)"
          >
            <Icons.Layers size={16} />
          </button>
        </div>
      </div>
      {showGroupNameInput && (
        <div className="group-name-input">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            autoFocus
          />
          <button onClick={() => {
            if (groupName.trim()) {
              onGroupElements(groupName);
            }
          }}>OK</button>
          <button onClick={() => setShowGroupNameInput(false)}>Cancel</button>
        </div>
      )}
      <div className="panel-content">
        <div className="search-input">
          <Icons.Search size={16} />
          <input 
            type="text" 
            placeholder="Search layers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="layers-list">
          {elements
            .filter(el => !el.parentId) // Only show top-level elements
            .filter(el => 
              (el.name || el.type).toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(el => renderLayerItem(el))}
        </div>
      </div>
    </div>
  );
};

const EventHandlerEditor = ({ 
  element, 
  onUpdateEventHandlers,
  availableElements
}) => {
  const [activeEvent, setActiveEvent] = useState(EVENT_TYPES.CLICK);
  const [actionType, setActionType] = useState('none');
  const [targetElement, setTargetElement] = useState('');
  const [propertyToUpdate, setPropertyToUpdate] = useState('');
  const [newValue, setNewValue] = useState('');
  const [customCode, setCustomCode] = useState('');

  useEffect(() => {
    if (element?.events?.[activeEvent]) {
      const handler = element.events[activeEvent];
      if (handler.actionType) {
        setActionType(handler.actionType);
        setTargetElement(handler.targetElement || '');
        setPropertyToUpdate(handler.propertyToUpdate || '');
        setNewValue(handler.newValue || '');
        setCustomCode(handler.customCode || '');
      } else {
        // Handle legacy string-based handlers
        setActionType('custom');
        setCustomCode(handler.toString());
      }
    } else {
      resetForm();
    }
  }, [activeEvent, element]);

  const resetForm = () => {
    setActionType('none');
    setTargetElement('');
    setPropertyToUpdate('');
    setNewValue('');
    setCustomCode('');
  };

  const handleSave = () => {
    if (actionType === 'none') {
      // Remove the event handler
      const updatedEvents = { ...element.events };
      delete updatedEvents[activeEvent];
      onUpdateEventHandlers(updatedEvents);
      return;
    }

    let handler;
    if (actionType === 'custom') {
      handler = customCode;
    } else {
      handler = {
        actionType,
        targetElement,
        propertyToUpdate,
        newValue
      };
    }

    onUpdateEventHandlers({
      ...element.events,
      [activeEvent]: handler
    });
  };

  const getPropertyOptions = () => {
    if (!targetElement) return [];
    const target = availableElements.find(el => el.id === targetElement);
    if (!target) return [];
    
    // Return all properties that can be modified
    return Object.keys(target).filter(
      key => !['id', 'type', 'x', 'y', 'parentId', 'children'].includes(key)
    );
  };

  return (
    <div className="event-handler-editor">
      <div className="panel-header">
        <h3>Event Handlers</h3>
      </div>
      <div className="panel-content">
        <div className="property-control">
          <label>Event Type</label>
          <select
            value={activeEvent}
            onChange={(e) => setActiveEvent(e.target.value)}
          >
            {Object.values(EVENT_TYPES).map(eventType => (
              <option key={eventType} value={eventType}>{eventType}</option>
            ))}
          </select>
        </div>

        <div className="property-control">
          <label>Action Type</label>
          <select
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
          >
            <option value="none">No Action</option>
            <option value="updateProperty">Update Property</option>
            <option value="toggleVisibility">Toggle Visibility</option>
            <option value="custom">Custom Code</option>
          </select>
        </div>

        {actionType === 'updateProperty' && (
          <>
            <div className="property-control">
              <label>Target Element</label>
              <select
                value={targetElement}
                onChange={(e) => setTargetElement(e.target.value)}
              >
                <option value="">Select Element</option>
                {availableElements.map(el => (
                  <option key={el.id} value={el.id}>
                    {el.name || el.type} ({el.id.slice(-4)})
                  </option>
                ))}
              </select>
            </div>

            <div className="property-control">
              <label>Property to Update</label>
              <select
                value={propertyToUpdate}
                onChange={(e) => setPropertyToUpdate(e.target.value)}
                disabled={!targetElement}
              >
                <option value="">Select Property</option>
                {getPropertyOptions().map(prop => (
                  <option key={prop} value={prop}>{prop}</option>
                ))}
              </select>
            </div>

            <div className="property-control">
              <label>New Value</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter new value"
              />
            </div>
          </>
        )}

        {actionType === 'custom' && (
          <div className="property-control">
            <label>Custom Code</label>
            <textarea
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              rows={5}
              placeholder="(element, event) => { /* your code here */ }"
            />
          </div>
        )}

        <div className="property-row" style={{ marginTop: '16px' }}>
          <button onClick={handleSave} className="element-button">
            Save Handler
          </button>
          <button onClick={resetForm} className="element-button secondary">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const PropertiesPanel = ({
  selectedElement,
  onUpdateProps,
  onDelete,
  onDuplicate,
  canvasBackground,
  onCanvasBackgroundChange,
  pages,
  currentPage,
  onPageChange,
  onAddPage,
  onRemovePage,
  elements,
  onUpdateEventHandlers
}) => {
  const [activeTab, setActiveTab] = useState('properties');

  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <div className="panel-header">
          <h3>Properties</h3>
        </div>
        <div className="panel-content empty">
          <p>No element selected</p>
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (property, value) => {
    onUpdateProps({ [property]: value });
  };

  const handleTextChange = (e) => {
    handlePropertyChange('text', e.target.value);
  };

  const handleNameChange = (e) => {
    handlePropertyChange('name', e.target.value);
  };

  const handlePositionChange = (axis, value) => {
    const position = { ...selectedElement };
    position[axis] = Number(value);
    onUpdateProps(position);
  };

  const handleSizeChange = (dimension, value) => {
    const size = { ...selectedElement };
    size[dimension] = Number(value);
    onUpdateProps(size);
  };

  const renderCommonProperties = () => (
    <div className="property-group">
      <h4>General</h4>
      <div className="property-control">
        <label>Name</label>
        <input
          type="text"
          value={selectedElement.name || ''}
          onChange={handleNameChange}
          placeholder="Element Name"
        />
      </div>
      <div className="property-row">
        <div className="property-control">
          <label>X</label>
          <input
            type="number"
            value={selectedElement.x || 0}
            onChange={(e) => handlePositionChange('x', e.target.value)}
          />
        </div>
        <div className="property-control">
          <label>Y</label>
          <input
            type="number"
            value={selectedElement.y || 0}
            onChange={(e) => handlePositionChange('y', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderSizeProperties = () => {
    if (selectedElement.width !== undefined && selectedElement.height !== undefined) {
      return (
        <div className="property-group">
          <h4>Size</h4>
          <div className="property-row">
            <div className="property-control">
              <label>Width</label>
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) => handleSizeChange('width', e.target.value)}
                min="1"
              />
            </div>
            <div className="property-control">
              <label>Height</label>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) => handleSizeChange('height', e.target.value)}
                min="1"
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderTextProperties = () => {
    if (selectedElement.text !== undefined) {
      return (
        <div className="property-group">
          <h4>Text</h4>
          <div className="property-control">
            <label>Content</label>
            <textarea
              value={selectedElement.text}
              onChange={handleTextChange}
              rows={3}
            />
          </div>
          <div className="property-row">
            <div className="property-control">
              <label>Font Size</label>
              <input
                type="number"
                value={selectedElement.fontSize || 16}
                onChange={(e) => handlePropertyChange('fontSize', Number(e.target.value))}
                min="8"
                max="72"
              />
            </div>
            <div className="property-control">
              <label>Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                />
                <input
                  type="text"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => handlePropertyChange('color', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderStyleProperties = () => {
    if (selectedElement.fill || selectedElement.backgroundColor) {
      return (
        <div className="property-group">
          <h4>Style</h4>
          <div className="property-control">
            <label>Background</label>
            <div className="color-picker">
              <input
                type="color"
                value={selectedElement.fill || selectedElement.backgroundColor || '#ffffff'}
                onChange={(e) => handlePropertyChange(
                  selectedElement.fill ? 'fill' : 'backgroundColor', 
                  e.target.value
                )}
              />
              <input
                type="text"
                value={selectedElement.fill || selectedElement.backgroundColor || '#ffffff'}
                onChange={(e) => handlePropertyChange(
                  selectedElement.fill ? 'fill' : 'backgroundColor', 
                  e.target.value
                )}
              />
            </div>
          </div>
          {selectedElement.borderRadius !== undefined && (
            <div className="property-control">
              <label>Border Radius</label>
              <input
                type="number"
                value={selectedElement.borderRadius || 0}
                onChange={(e) => handlePropertyChange('borderRadius', Number(e.target.value))}
                min="0"
              />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderComponentProperties = () => {
    switch (selectedElement.type) {
      case COMPONENT_TYPES.BUTTON:
        return (
          <div className="property-group">
            <h4>Button</h4>
            <div className="property-control">
              <label>Text</label>
              <input
                type="text"
                value={selectedElement.text || 'Button'}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
              />
            </div>
            <div className="property-control">
              <label>Variant</label>
              <select
                value={selectedElement.variant || 'primary'}
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </div>
        );
      case COMPONENT_TYPES.INPUT:
        return (
          <div className="property-group">
            <h4>Input</h4>
            <div className="property-control">
              <label>Placeholder</label>
              <input
                type="text"
                value={selectedElement.placeholder || 'Enter text...'}
                onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
              />
            </div>
          </div>
        );
      case COMPONENT_TYPES.TEXTAREA:
        return (
          <div className="property-group">
            <h4>Textarea</h4>
            <div className="property-control">
              <label>Placeholder</label>
              <input
                type="text"
                value={selectedElement.placeholder || 'Enter text...'}
                onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
              />
            </div>
          </div>
        );
      case COMPONENT_TYPES.SELECT:
        return (
          <div className="property-group">
            <h4>Select</h4>
            <div className="property-control">
              <label>Options</label>
              <textarea
                value={selectedElement.options ? selectedElement.options.join('\n') : ''}
                onChange={(e) => handlePropertyChange('options', e.target.value.split('\n'))}
                rows={3}
              />
            </div>
          </div>
        );
      case COMPONENT_TYPES.CARD:
        return (
          <div className="property-group">
            <h4>Card</h4>
            <div className="property-control">
              <label>Title</label>
              <input
                type="text"
                value={selectedElement.title || 'Card Title'}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
              />
            </div>
            <div className="property-control">
              <label>Content</label>
              <textarea
                value={selectedElement.content || 'Card content...'}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );
      case COMPONENT_TYPES.NAVBAR:
        return (
          <div className="property-group">
            <h4>Navbar</h4>
            <div className="property-control">
              <label>Title</label>
              <input
                type="text"
                value={selectedElement.title || 'My App'}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
              />
            </div>
            <div className="property-control">
              <label>Links</label>
              <textarea
                value={selectedElement.links ? selectedElement.links.join('\n') : ''}
                onChange={(e) => handlePropertyChange('links', e.target.value.split('\n'))}
                rows={3}
              />
            </div>
          </div>
        );
      case COMPONENT_TYPES.TABS:
        return (
          <div className="property-group">
            <h4>Tabs</h4>
            <div className="property-control">
              <label>Tabs</label>
              <textarea
                value={selectedElement.tabs ? selectedElement.tabs.join('\n') : ''}
                onChange={(e) => handlePropertyChange('tabs', e.target.value.split('\n'))}
                rows={3}
              />
            </div>
          </div>
        );
      case COMPONENT_TYPES.ACCORDION:
        return (
          <div className="property-group">
            <h4>Accordion</h4>
            <div className="property-control">
              <label>Items</label>
              <textarea
                value={selectedElement.items ? JSON.stringify(selectedElement.items, null, 2) : ''}
                onChange={(e) => {
                  try {
                    handlePropertyChange('items', JSON.parse(e.target.value));
                  } catch (e) {
                    // Invalid JSON
                  }
                }}
                rows={5}
              />
            </div>
          </div>
        );
      case COMPONENT_TYPES.TABLE:
        return (
          <div className="property-group">
            <h4>Table</h4>
            <div className="property-control">
              <label>Columns</label>
              <textarea
                value={selectedElement.columns ? selectedElement.columns.join('\n') : ''}
                onChange={(e) => handlePropertyChange('columns', e.target.value.split('\n'))}
                rows={3}
              />
            </div>
            <div className="property-control">
              <label>Data</label>
              <textarea
                value={selectedElement.data ? selectedElement.data.map(row => row.join(',')).join('\n') : ''}
                onChange={(e) => handlePropertyChange('data', e.target.value.split('\n').map(row => row.split(',')))}
                rows={5}
              />
            </div>
          </div>
        );
      case COMPONENT_TYPES.LIST:
        return (
          <div className="property-group">
            <h4>List</h4>
            <div className="property-control">
              <label>Items</label>
              <textarea
                value={selectedElement.items ? selectedElement.items.join('\n') : ''}
                onChange={(e) => handlePropertyChange('items', e.target.value.split('\n'))}
                rows={3}
              />
            </div>
          </div>
        );
      case COMPONENT_TYPES.DROPDOWN:
        return (
          <div className="property-group">
            <h4>Dropdown</h4>
            <div className="property-control">
              <label>Options</label>
              <textarea
                value={selectedElement.options ? selectedElement.options.join('\n') : ''}
                onChange={(e) => handlePropertyChange('options', e.target.value.split('\n'))}
                rows={3}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPagesControl = () => (
    <div className="property-group">
      <h4>Pages</h4>
      <div className="property-control">
        <label>Current Page</label>
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
        >
          {pages.map((page, index) => (
            <option key={index} value={index}>
              Page {index + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="property-row">
        <button 
          onClick={onAddPage}
          className="element-button"
        >
          Add Page
        </button>
        <button 
          onClick={onRemovePage}
          disabled={pages.length <= 1}
          className="element-button secondary"
        >
          Remove Page
        </button>
      </div>
    </div>
  );

  return (
    <div className="properties-panel">
      <div className="panel-header">
        <h3>{selectedElement.name || selectedElement.type}</h3>
        <div className="panel-actions">
          <button onClick={onDuplicate} title="Duplicate (Ctrl+D)">
            <Icons.Copy size={16} />
          </button>
          <button onClick={onDelete} title="Delete (Delete)">
            <Icons.Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="panel-tabs">
        <button 
          className={activeTab === 'properties' ? 'active' : ''}
          onClick={() => setActiveTab('properties')}
        >
          <Icons.Sliders size={16} />
          <span>Properties</span>
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          <Icons.Activity size={16} />
          <span>Events</span>
        </button>
        <button 
          className={activeTab === 'pages' ? 'active' : ''}
          onClick={() => setActiveTab('pages')}
        >
          <Icons.File size={16} />
          <span>Pages</span>
        </button>
      </div>
      <div className="panel-content">
        {activeTab === 'properties' ? (
          <>
            {renderCommonProperties()}
            {renderSizeProperties()}
            {renderStyleProperties()}
            {renderTextProperties()}
            {renderComponentProperties()}
          </>
        ) : activeTab === 'events' ? (
          <EventHandlerEditor 
            element={selectedElement}
            onUpdateEventHandlers={onUpdateEventHandlers}
            availableElements={elements}
          />
        ) : (
          renderPagesControl()
        )}
      </div>
    </div>
  );
};

// Main Editor Component
const DesignEditor = () => {
  // State management with history
  const { state: pages, push: pushHistory, undo, redo, canUndo, canRedo, history, index } = useHistory([{
    id: generateId(),
    name: 'Page 1',
    elements: [],
    background: { color: '#ffffff', image: null }
  }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const currentPage = pages[currentPageIndex];
  const elements = currentPage.elements;

  // Editor state
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [canvasSize, setCanvasSize] = useState(BREAKPOINTS.DESKTOP);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [zoom, setZoom] = useState(1);
  const [gridSnap, setGridSnap] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [alignmentGuides, setAlignmentGuides] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);

  const canvasRef = useRef(null);
  const designAreaRef = useRef(null);

  // Current user and time
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentUser = 'Designer';

  const [groupName, setGroupName] = useState('');
  const [showGroupNameInput, setShowGroupNameInput] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            if (!e.shiftKey) handleUndo();
            break;
          case 'y':
            if (e.shiftKey) handleRedo();
            break;
          case 'd':
            handleDuplicateElement();
            break;
          case 'g':
            if (e.shiftKey) handleUngroupElements();
            else handleGroupElements();
            break;
          case 'delete':
          case 'backspace':
            handleDeleteElement();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, selectedElement, selectedElements]);

  // Update clock element every second
  useEffect(() => {
    const timer = setInterval(() => {
      const hasClock = elements.some(el => el.type === COMPONENT_TYPES.CLOCK);
      if (hasClock) {
        const newElements = elements.map(el => 
          el.type === COMPONENT_TYPES.CLOCK ? { ...el, timestamp: Date.now() } : el
        );
        updatePage({ elements: newElements });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [elements]);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update page in history
  const updatePage = (updates) => {
    const newPages = [...pages];
    newPages[currentPageIndex] = { ...currentPage, ...updates };
    pushHistory(newPages);
  };

  // Update canvas background
  const updateCanvasBackground = (property, value) => {
    updatePage({ 
      background: { ...currentPage.background, [property]: value } 
    });
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    const prevPages = undo();
    if (prevPages.length > 0 && currentPageIndex >= prevPages.length) {
      setCurrentPageIndex(prevPages.length - 1);
    }
  };

  const handleRedo = () => {
    const nextPages = redo();
    if (nextPages.length > 0 && currentPageIndex >= nextPages.length) {
      setCurrentPageIndex(nextPages.length - 1);
    }
  };

  // Element selection
  const handleElementClick = (elementId, isMultiSelect = false) => {
    if (isMultiSelect) {
      if (selectedElements.includes(elementId)) {
        setSelectedElements(selectedElements.filter(id => id !== elementId));
      } else {
        setSelectedElements([...selectedElements, elementId]);
      }
      setSelectedElement(null);
    } else {
      setSelectedElement(elementId);
      setSelectedElements([]);
    }
  };

  // Element manipulation
  const handleAddShape = (shape) => {
    const newElements = [...elements, shape];
    updatePage({ elements: newElements });
    handleElementClick(shape.id);
  };

  const handleAddComponent = (component) => {
    const newElements = [...elements, component];
    updatePage({ elements: newElements });
    handleElementClick(component.id);
  };

  const handleUpdateElementProps = (props) => {
    if (!selectedElement && selectedElements.length === 0) return;
    
    const newElements = elements.map(el => {
      if (el.id === selectedElement || selectedElements.includes(el.id)) {
        return { ...el, ...props };
      }
      return el;
    });
    
    updatePage({ elements: newElements });
  };

  const handleUpdateEventHandlers = (eventHandlers) => {
    if (!selectedElement) return;
    
    const newElements = elements.map(el => {
      if (el.id === selectedElement) {
        return { ...el, events: eventHandlers };
      }
      return el;
    });
    
    updatePage({ elements: newElements });
  };

  const handleDeleteElement = () => {
    if (!selectedElement && selectedElements.length === 0) return;
    
    const idsToDelete = selectedElement ? [selectedElement] : selectedElements;
    const newElements = elements.filter(el => !idsToDelete.includes(el.id));
    
    updatePage({ elements: newElements });
    setSelectedElement(null);
    setSelectedElements([]);
  };

  const handleDuplicateElement = () => {
    if (!selectedElement && selectedElements.length === 0) return;
    
    const idsToDuplicate = selectedElement ? [selectedElement] : selectedElements;
    const elementsToDuplicate = elements.filter(el => idsToDuplicate.includes(el.id));
    
    const newElements = [
      ...elements,
      ...elementsToDuplicate.map(el => ({
        ...JSON.parse(JSON.stringify(el)),
        id: generateId(),
        x: el.x + 20,
        y: el.y + 20
      }))
    ];
    
    updatePage({ elements: newElements });
  };

  // Grouping functionality
  const handleGroupElements = useCallback((groupName = 'Group') => {
    if (selectedElements.length < 2) return;
  
    // Filter out any elements that are already in a group
    const elementsToGroup = elements.filter(el => 
      selectedElements.includes(el.id) && !el.parentId
    );
  
    if (elementsToGroup.length < 2) return;
  
    // Calculate group bounds
    const minX = Math.min(...elementsToGroup.map(el => el.x));
    const minY = Math.min(...elementsToGroup.map(el => el.y));
    const maxX = Math.max(...elementsToGroup.map(el => el.x + (el.width || 0)));
    const maxY = Math.max(...elementsToGroup.map(el => el.y + (el.height || 0)));
  
    // Create new group
    const newGroup = {
      id: generateId(),
      type: SHAPE_TYPES.GROUP,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      children: elementsToGroup.map(el => ({ 
        id: el.id,
        x: el.x - minX,
        y: el.y - minY
      })),
      name: groupName
    };
  
    // Update children positions relative to group and set parentId
    const updatedElements = elements.map(el => {
      if (elementsToGroup.some(groupEl => groupEl.id === el.id)) {
        return {
          ...el,
          x: el.x - minX,
          y: el.y - minY,
          parentId: newGroup.id
        };
      }
      return el;
    });
  
    // Add the new group to the elements
    const newElements = [...updatedElements, newGroup];
  
    updatePage({ elements: newElements });
    setSelectedElement(newGroup.id);
    setSelectedElements([]);
    setGroupName('');
    setShowGroupNameInput(false);
  }, [elements, selectedElements, updatePage]);

  const handleUngroupElements = () => {
    if (!selectedElement) return;
    
    const group = elements.find(el => el.id === selectedElement);
    if (!group || !group.children) return;
    
    // Get children elements and restore their original positions
    const updatedChildren = elements
      .filter(el => group.children.some(child => child.id === el.id))
      .map(child => ({
        ...child,
        x: group.x + child.x,
        y: group.y + child.y,
        parentId: undefined
      }));
    
    // Remove group and add back children
    const newElements = [
      ...elements.filter(el => el.id !== selectedElement),
      ...updatedChildren
    ];
    
    updatePage({ elements: newElements });
    setSelectedElement(null);
  };

  // Drag functionality
  const handleElementDrag = (newX, newY) => {
    if (!selectedElement && selectedElements.length === 0) return;
  
    // Get the currently selected element's dimensions
    const selectedEl = elements.find(el => el.id === selectedElement);
    const selectedWidth = selectedEl?.width || 0;
    const selectedHeight = selectedEl?.height || 0;
  
    // Calculate boundaries
    const minX = 0;
    const minY = 0;
    const maxX = canvasSize.width - selectedWidth;
    const maxY = canvasSize.height - selectedHeight;
  
    // Apply boundary constraints
    let constrainedX = Math.max(minX, Math.min(newX, maxX));
    let constrainedY = Math.max(minY, Math.min(newY, maxY));
  
    // Check for alignment guides
    const guides = [];
    const SNAP_THRESHOLD = 5;
  
    elements.forEach(el => {
      if (!el || el.id === selectedElement || selectedElements.includes(el.id) || el.parentId) return;
  
      const elWidth = el.width || 0;
      const elHeight = el.height || 0;
      const elCenterX = el.x + (elWidth / 2);
      const elCenterY = el.y + (elHeight / 2);
      const selectedCenterX = constrainedX + (selectedWidth / 2);
      const selectedCenterY = constrainedY + (selectedHeight / 2);
  
      // Check horizontal alignment (top, center, bottom)
      if (Math.abs(constrainedY - el.y) < SNAP_THRESHOLD) {
        guides.push({ type: 'horizontal', position: el.y });
      } else if (Math.abs(constrainedY + selectedHeight - (el.y + elHeight)) < SNAP_THRESHOLD) {
        guides.push({ type: 'horizontal', position: el.y + elHeight });
      } else if (Math.abs(selectedCenterY - elCenterY) < SNAP_THRESHOLD) {
        guides.push({ type: 'horizontal', position: elCenterY });
      }
  
      // Check vertical alignment (left, center, right)
      if (Math.abs(constrainedX - el.x) < SNAP_THRESHOLD) {
        guides.push({ type: 'vertical', position: el.x });
      } else if (Math.abs(constrainedX + selectedWidth - (el.x + elWidth)) < SNAP_THRESHOLD) {
        guides.push({ type: 'vertical', position: el.x + elWidth });
      } else if (Math.abs(selectedCenterX - elCenterX) < SNAP_THRESHOLD) {
        guides.push({ type: 'vertical', position: elCenterX });
      }
    });
  
    // Snap to guides if close enough
    let snappedX = constrainedX;
    let snappedY = constrainedY;
    
    guides.forEach(guide => {
      if (guide.type === 'horizontal' && Math.abs(constrainedY - guide.position) < SNAP_THRESHOLD) {
        snappedY = guide.position;
      } else if (guide.type === 'vertical' && Math.abs(constrainedX - guide.position) < SNAP_THRESHOLD) {
        snappedX = guide.position;
      }
    });
  
    setAlignmentGuides(guides);
  
    const newElements = elements.map(el => {
      if (el.id === selectedElement || selectedElements.includes(el.id)) {
        return {
          ...el,
          x: gridSnap ? Math.round(snappedX / 10) * 10 : snappedX,
          y: gridSnap ? Math.round(snappedY / 10) * 10 : snappedY
        };
      }
      return el;
    });
    
    updatePage({ elements: newElements });
  };

  const handleElementDragEnd = () => {
    setAlignmentGuides([]);
  };

  const { handleMouseDown: handleDragStart, handleMouseMove, handleMouseUp } = useDrag(
    handleElementDrag,
    handleElementDragEnd
  );

  // Canvas viewport controls
  const handleCanvasResize = (width, height) => {
    setCanvasSize({ width, height });
  };

  const handleZoomChange = (newZoom) => {
    setZoom(Math.max(0.25, Math.min(3, newZoom)));
  };

  const handleViewportChange = (size) => {
    setViewportSize(size);
    switch (size) {
      case 'mobile':
        handleCanvasResize(BREAKPOINTS.MOBILE.width, BREAKPOINTS.MOBILE.height);
        break;
      case 'tablet':
        handleCanvasResize(BREAKPOINTS.TABLET.width, BREAKPOINTS.TABLET.height);
        break;
      case 'desktop':
        handleCanvasResize(BREAKPOINTS.DESKTOP.width, BREAKPOINTS.DESKTOP.height);
        break;
      default:
        break;
    }
  };

  // Layer visibility
  const handleToggleVisibility = (elementId) => {
    const newElements = elements.map(el => {
      if (el.id === elementId) {
        return { ...el, visible: el.visible === undefined ? false : !el.visible };
      }
      return el;
    });
    updatePage({ elements: newElements });
  };

  // Z-index management
  const handleChangeZIndex = (elementId, direction) => {
    const elementIndex = elements.findIndex(el => el.id === elementId);
    if (elementIndex === -1) return;

    const newElements = [...elements];
    if (direction === 'up' && elementIndex < newElements.length - 1) {
      [newElements[elementIndex], newElements[elementIndex + 1]] = 
        [newElements[elementIndex + 1], newElements[elementIndex]];
    } else if (direction === 'down' && elementIndex > 0) {
      [newElements[elementIndex], newElements[elementIndex - 1]] = 
        [newElements[elementIndex - 1], newElements[elementIndex]];
    } else if (direction === 'top') {
      const element = newElements.splice(elementIndex, 1)[0];
      newElements.push(element);
    } else if (direction === 'bottom') {
      const element = newElements.splice(elementIndex, 1)[0];
      newElements.unshift(element);
    }

    updatePage({ elements: newElements });
  };

  // Page management
  const handlePageChange = (index) => {
    setCurrentPageIndex(index);
    setSelectedElement(null);
    setSelectedElements([]);
  };

  const handleAddPage = () => {
    const newPage = {
      id: generateId(),
      name: `Page ${pages.length + 1}`,
      elements: [],
      background: { color: '#ffffff', image: null }
    };
    const newPages = [...pages, newPage];
    pushHistory(newPages);
    setCurrentPageIndex(newPages.length - 1);
  };

  const handleRemovePage = () => {
    if (pages.length <= 1) return;
    
    const newPages = pages.filter((_, index) => index !== currentPageIndex);
    pushHistory(newPages);
    setCurrentPageIndex(Math.min(currentPageIndex, newPages.length - 1));
  };

  // Event handler execution
  const executeEventHandler = (element, eventType, event) => {
    if (!element.events || !element.events[eventType]) return;

    const handler = element.events[eventType];
    
    if (typeof handler === 'function') {
      // Execute custom code handler
      try {
        handler(element, event);
      } catch (e) {
        console.error('Error executing custom event handler:', e);
      }
    } else if (typeof handler === 'object') {
      // Handle structured event handler
      switch (handler.actionType) {
        case 'updateProperty':
          if (handler.targetElement && handler.propertyToUpdate) {
            const target = elements.find(el => el.id === handler.targetElement);
            if (target) {
              const newElements = elements.map(el => {
                if (el.id === target.id) {
                  return { 
                    ...el, 
                    [handler.propertyToUpdate]: handler.newValue 
                  };
                }
                return el;
              });
              updatePage({ elements: newElements });
            }
          }
          break;
        case 'toggleVisibility':
          if (handler.targetElement) {
            const target = elements.find(el => el.id === handler.targetElement);
            if (target) {
              const newElements = elements.map(el => {
                if (el.id === target.id) {
                  return { 
                    ...el, 
                    visible: el.visible === undefined ? false : !el.visible 
                  };
                }
                return el;
              });
              updatePage({ elements: newElements });
            }
          }
          break;
        default:
          break;
      }
    }
  };

  // Element rendering
  const renderElement = (element) => {
    if (element.visible === false) return null;
  
    const isSelected = element.id === selectedElement || selectedElements.includes(element.id);
    const isGroup = element.type === SHAPE_TYPES.GROUP;
    
    // Ensure element stays within canvas bounds
    const canvasWidth = canvasSize.width;
    const canvasHeight = canvasSize.height;
    // For circle/star/polygon, derive display size from radius if width/height not set
    const derivedSize = element.radius ? element.radius * 2 :
                        element.outerRadius ? element.outerRadius * 2 : 0;
    const elementWidth = element.width || derivedSize || 100;
    const elementHeight = element.height || derivedSize || 100;
    
    const boundedX = Math.max(0, Math.min(element.x, canvasWidth - elementWidth));
    const boundedY = Math.max(0, Math.min(element.y, canvasHeight - elementHeight));
  
    const elementStyle = {
      position: 'absolute',
      left: `${boundedX}px`,
      top: `${boundedY}px`,
      width: `${elementWidth}px`,
      height: `${elementHeight}px`,
      border: isSelected ? '2px solid #1e88e5' : 'none',
      cursor: selectedTool === 'select' ? 'move' : 'pointer',
      opacity: element.opacity !== undefined ? element.opacity : 1,
      zIndex: elements.findIndex(el => el.id === element.id),
      padding: element.padding !== undefined ? `${element.padding}px` : '0',
      margin: element.margin !== undefined ? `${element.margin}px` : '0',
      boxShadow: element.shadow ? 
        `${element.shadow.offsetX || 0}px ${element.shadow.offsetY || 2}px ${element.shadow.blur || 4}px ${element.shadow.color || 'rgba(0,0,0,0.1)'}` : 
        'none',
      borderWidth: element.border?.width || '0',
      borderStyle: element.border?.style || 'solid',
      borderColor: element.border?.color || 'transparent',
      borderRadius: element.borderRadius ? `${element.borderRadius}px` : '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: element.fill || element.backgroundColor || 'transparent',
      pointerEvents: 'auto'
    };
  
    // Animation styles
    if (element.animationType && element.animationType !== ANIMATION_TYPES.NONE) {
      elementStyle.animation = `${element.animationType} ${element.animationDuration || 500}ms ease ${element.animationDelay || 0}ms`;
    }
  
    let content;
    switch (element.type) {
      case SHAPE_TYPES.RECTANGLE:
        content = (
          <div 
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.fill || 'transparent',
              border: `${element.strokeWidth || 1}px solid ${element.stroke || 'transparent'}`,
              borderRadius: element.borderRadius || 0
            }}
          />
        );
        break;
        
      case SHAPE_TYPES.CIRCLE:
        content = (
          <div 
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: element.fill || 'transparent',
              border: `${element.strokeWidth || 1}px solid ${element.stroke || 'transparent'}`
            }}
          />
        );
        break;
        
      case SHAPE_TYPES.TEXT:
        content = (
          <div 
            style={{
              width: '100%',
              height: '100%',
              fontSize: `${element.fontSize || 16}px`,
              fontFamily: element.fontFamily || 'Arial',
              color: element.color || '#000000',
              fontWeight: element.fontWeight || 'normal',
              textAlign: element.textAlign || 'left',
              display: 'flex',
              alignItems: element.textAlign === 'center' ? 'center' : 'flex-start',
              justifyContent: element.textAlign === 'center' ? 'center' : 
                            element.textAlign === 'right' ? 'flex-end' : 'flex-start',
              padding: '8px',
              wordBreak: 'break-word'
            }}
          >
            {element.text || 'Text Element'}
          </div>
        );
        break;
        
      case SHAPE_TYPES.STAR:
        content = (
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points="50,0 61,35 98,35 68,57 79,92 50,72 21,92 32,57 2,35 39,35"
              fill={element.fill || 'transparent'}
              stroke={element.stroke || 'transparent'}
              strokeWidth={element.strokeWidth || 1}
            />
          </svg>
        );
        break;

      case SHAPE_TYPES.POLYGON:
        const sides = element.sides || 6;
        const radius = element.radius || 50;
        const points = [];
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
          points.push(
            (50 + radius * Math.cos(angle)).toFixed(2) + ',' + 
            (50 + radius * Math.sin(angle)).toFixed(2)
          );
        }
        content = (
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points={points.join(' ')}
              fill={element.fill || 'transparent'}
              stroke={element.stroke || 'transparent'}
              strokeWidth={element.strokeWidth || 1}
            />
          </svg>
        );
        break;

      case SHAPE_TYPES.LINE:
        const angle = Math.atan2(element.y2 || 0, element.x2 || 100);
        const length = Math.sqrt(Math.pow(element.x2 || 100, 2) + Math.pow(element.y2 || 0, 2));
        content = (
          <div
            style={{
              position: 'absolute',
              width: `${length}px`,
              height: `${element.strokeWidth || 2}px`,
              backgroundColor: element.stroke || '#000000',
              transform: `rotate(${angle}rad)`,
              transformOrigin: '0 0'
            }}
          />
        );
        break;

      case SHAPE_TYPES.IMAGE:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${element.src || 'https://via.placeholder.com/200x150'})`,
              backgroundSize: element.backgroundSize || 'cover',
              backgroundPosition: element.backgroundPosition || 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        );
        break;
        
      case SHAPE_TYPES.ARROW:
        const arrowAngle = Math.atan2(element.y2 || 0, element.x2 || 100);
        const arrowLength = Math.sqrt(Math.pow(element.x2 || 100, 2) + Math.pow(element.y2 || 0, 2));
        const arrowSize = element.arrowSize || 10;
        content = (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
              style={{
                position: 'absolute',
                width: `${arrowLength}px`,
                height: `${element.strokeWidth || 2}px`,
                backgroundColor: element.stroke || '#000000',
                transform: `rotate(${arrowAngle}rad)`,
                transformOrigin: '0 0'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: `${element.x2 || 100}px`,
                top: `${element.y2 || 0}px`,
                width: `${arrowSize}px`,
                height: `${arrowSize}px`,
                border: `${element.strokeWidth || 2}px solid ${element.stroke || '#000000'}`,
                borderLeft: 'none',
                borderBottom: 'none',
                transform: `rotate(${arrowAngle}rad) translateX(-${arrowSize}px)`,
                transformOrigin: '0 0'
              }}
            />
          </div>
        );
        break;
  
      case SHAPE_TYPES.CONTAINER:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.background || '#f8f8f8',
              display: 'flex',
              flexDirection: 'column',
              padding: '8px',
              gap: '8px'
            }}
          >
            {element.children && element.children.map(childId => {
              const child = elements.find(el => el.id === childId);
              return child ? renderElement(child) : null;
            })}
          </div>
        );
        break;
        
      case SHAPE_TYPES.GRID_LAYOUT:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.background || '#f8f8f8',
              display: 'grid',
              gridTemplateColumns: `repeat(${element.columns || 3}, 1fr)`,
              gap: `${element.gap || 10}px`,
              padding: '8px'
            }}
          >
            {element.children && element.children.map(childId => {
              const child = elements.find(el => el.id === childId);
              return child ? renderElement(child) : null;
            })}
          </div>
        );
        break;
        
      case SHAPE_TYPES.FLEX_LAYOUT:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.background || '#f8f8f8',
              display: 'flex',
              flexDirection: element.direction || 'row',
              gap: `${element.gap || 10}px`,
              padding: '8px'
            }}
          >
            {element.children && element.children.map(childId => {
              const child = elements.find(el => el.id === childId);
              return child ? renderElement(child) : null;
            })}
          </div>
        );
        break;
        
      case SHAPE_TYPES.STACK_LAYOUT:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.background || '#f8f8f8',
              display: 'flex',
              flexDirection: 'column',
              padding: '8px'
            }}
          >
            {element.children && element.children.map((childId, index) => {
              const child = elements.find(el => el.id === childId);
              return child ? (
                <div 
                  key={index}
                  style={{ 
                    marginBottom: index < element.children.length - 1 ? `${element.spacing || 10}px` : '0' 
                  }}
                >
                  {renderElement(child)}
                </div>
              ) : null;
            })}
          </div>
        );
        break;
        
      case SHAPE_TYPES.GROUP:
        const groupChildren = elements.filter(el => 
          el.parentId === element.id
        );
      
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              border: isSelected ? '2px dashed #1e88e5' : 'none',
              backgroundColor: isSelected ? 'rgba(30, 136, 229, 0.1)' : 'transparent'
            }}
          >
            {groupChildren.map(child => renderElement({
              ...child,
              x: child.x,
              y: child.y
            }))}
            {isSelected && (
              <div className="group-handle">
                {element.name || 'Group'}
              </div>
            )}
          </div>
        );
        break;
  
      case COMPONENT_TYPES.BUTTON:
        content = (
          <button
            style={{
              width: '100%',
              height: '100%',
              padding: element.size === 'small' ? '4px 8px' : 
                      element.size === 'large' ? '12px 24px' : '8px 16px',
              backgroundColor: element.variant === 'primary' ? '#1e88e5' : 
                             element.variant === 'secondary' ? '#6c757d' : 
                             element.variant === 'outline' ? 'transparent' : '#f5f5f5',
              color: element.variant === 'outline' ? element.color || '#1e88e5' : 
                    (element.variant === 'primary' || element.variant === 'secondary') ? 'white' : 'black',
              border: element.variant === 'outline' ? `1px solid ${element.color || '#1e88e5'}` : 'none',
              borderRadius: `${element.borderRadius || 4}px`,
              fontSize: element.size === 'small' ? '12px' : 
                       element.size === 'large' ? '18px' : '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={(e) => {
              executeEventHandler(element, EVENT_TYPES.CLICK, e);
            }}
          >
            {element.text || 'Button'}
          </button>
        );
        break;
        
      case COMPONENT_TYPES.INPUT:
        content = (
          <div style={{ width: '100%', height: '100%', padding: '8px' }}>
            <input
              type="text"
              placeholder={element.placeholder || 'Enter text...'}
              style={{
                width: '100%',
                height: '100%',
                padding: '8px',
                border: `${element.borderWidth || 1}px solid ${element.borderColor || '#dddddd'}`,
                borderRadius: `${element.borderRadius || 4}px`,
                fontSize: `${element.fontSize || 14}px`,
                color: element.color || '#333333',
                backgroundColor: element.backgroundColor || '#ffffff'
              }}
              onChange={(e) => {
                handlePropertyChange('value', e.target.value);
                executeEventHandler(element, EVENT_TYPES.CHANGE, e);
              }}
              onFocus={(e) => executeEventHandler(element, EVENT_TYPES.FOCUS, e)}
              onBlur={(e) => executeEventHandler(element, EVENT_TYPES.BLUR, e)}
              onKeyDown={(e) => executeEventHandler(element, EVENT_TYPES.KEY_DOWN, e)}
              onKeyUp={(e) => executeEventHandler(element, EVENT_TYPES.KEY_UP, e)}
            />
          </div>
        );
        break;
        
      case COMPONENT_TYPES.TEXTAREA:
        content = (
          <div style={{ width: '100%', height: '100%', padding: '8px' }}>
            <textarea
              placeholder={element.placeholder || 'Enter text...'}
              style={{
                width: '100%',
                height: '100%',
                padding: '8px',
                border: `${element.borderWidth || 1}px solid ${element.borderColor || '#dddddd'}`,
                borderRadius: `${element.borderRadius || 4}px`,
                fontSize: `${element.fontSize || 14}px`,
                color: element.color || '#333333',
                backgroundColor: element.backgroundColor || '#ffffff',
                resize: 'none'
              }}
              onChange={(e) => {
                handlePropertyChange('value', e.target.value);
                executeEventHandler(element, EVENT_TYPES.CHANGE, e);
              }}
              onFocus={(e) => executeEventHandler(element, EVENT_TYPES.FOCUS, e)}
              onBlur={(e) => executeEventHandler(element, EVENT_TYPES.BLUR, e)}
            />
          </div>
        );
        break;
        
      case COMPONENT_TYPES.SELECT:
        content = (
          <div style={{ width: '100%', height: '100%', padding: '8px' }}>
            <select
              style={{
                width: '100%',
                height: '100%',
                padding: '8px',
                border: `${element.borderWidth || 1}px solid ${element.borderColor || '#dddddd'}`,
                borderRadius: `${element.borderRadius || 4}px`,
                fontSize: `${element.fontSize || 14}px`,
                color: element.color || '#333333',
                backgroundColor: element.backgroundColor || '#ffffff'
              }}
              onChange={(e) => {
                handlePropertyChange('selected', e.target.value);
                executeEventHandler(element, EVENT_TYPES.CHANGE, e);
              }}
            >
              {element.options && element.options.map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
        break;
        
      case COMPONENT_TYPES.CARD:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.backgroundColor || '#ffffff',
              border: `${element.borderWidth || 1}px solid ${element.borderColor || '#dddddd'}`,
              borderRadius: `${element.borderRadius || 8}px`,
              boxShadow: element.shadow ? 
                `${element.shadow.offsetX || 0}px ${element.shadow.offsetY || 2}px ${element.shadow.blur || 4}px ${element.shadow.color || 'rgba(0,0,0,0.1)'}` : 
                'none',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => executeEventHandler(element, EVENT_TYPES.CLICK, e)}
          >
            <div style={{ 
              padding: '16px', 
              borderBottom: `${element.borderWidth || 1}px solid ${element.borderColor || '#dddddd'}`,
              fontWeight: 'bold'
            }}>
              {element.title || 'Card Title'}
            </div>
            <div style={{ 
              padding: '16px', 
              flex: 1,
              fontSize: '14px'
            }}>
              {element.content || 'Card content goes here...'}
            </div>
          </div>
        );
        break;
        
      case COMPONENT_TYPES.NAVBAR:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.backgroundColor || '#2d3748',
              color: element.color || '#ffffff',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px'
            }}
          >
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: '18px',
              marginRight: '24px'
            }}>
              {element.title || 'My App'}
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '16px',
              flex: 1
            }}>
              {element.links && element.links.map((link, i) => (
                <div 
                  key={i} 
                  style={{ 
                    padding: '12px 0',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    // Update active link
                    handlePropertyChange('activeLink', i);
                    executeEventHandler(element, EVENT_TYPES.CLICK, { ...e, link });
                  }}
                >
                  {link}
                </div>
              ))}
            </div>
          </div>
        );
        break;
        
      case COMPONENT_TYPES.TABS:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.backgroundColor || '#ffffff',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #ddd'
            }}>
              {element.tabs && element.tabs.map((tab, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 16px',
                    borderBottom: element.activeTab === i ? '2px solid #1e88e5' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    handlePropertyChange('activeTab', i);
                    executeEventHandler(element, EVENT_TYPES.CLICK, { ...e, tabIndex: i });
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>
            <div style={{
              flex: 1,
              padding: '16px'
            }}>
              {element.tabs && element.tabs[element.activeTab || 0]}
            </div>
          </div>
        );
        break;
        
      case COMPONENT_TYPES.ACCORDION:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.backgroundColor || '#ffffff',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {element.items && element.items.map((item, i) => (
              <div key={i} style={{ borderBottom: '1px solid #ddd' }}>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: item.open ? '#f8f9fa' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onClick={(e) => {
                  const newItems = [...element.items];
                  newItems[i] = { ...newItems[i], open: !newItems[i].open };
                  handlePropertyChange('items', newItems);
                  executeEventHandler(element, EVENT_TYPES.CLICK, { ...e, itemIndex: i });
                }}
                >
                  <span>{item.title}</span>
                  <Icons.ChevronDown size={16} style={{
                    transform: item.open ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s'
                  }} />
                </div>
                {item.open && (
                  <div style={{ padding: '12px 16px' }}>
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
        break;
        
      case COMPONENT_TYPES.TABLE:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.backgroundColor || '#ffffff',
              overflow: 'auto'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {element.columns && element.columns.map((col, i) => (
                    <th key={i} style={{ 
                      padding: '12px',
                      borderBottom: '1px solid #ddd',
                      textAlign: 'left'
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {element.data && element.data.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ 
                        padding: '12px',
                        borderBottom: '1px solid #eee'
                      }}
                      onClick={(e) => executeEventHandler(element, EVENT_TYPES.CLICK, { ...e, row: i, col: j })}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        break;
        
      case COMPONENT_TYPES.LIST:
        content = (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.backgroundColor || '#ffffff',
              overflow: 'auto'
            }}
          >
            <ul style={{ 
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {element.items && element.items.map((item, i) => (
                <li key={i} style={{ 
                  padding: '12px 16px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer'
                }}
                onClick={(e) => executeEventHandler(element, EVENT_TYPES.CLICK, { ...e, itemIndex: i })}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
        break;
        
      case COMPONENT_TYPES.DROPDOWN:
        content = (
          <div style={{ width: '100%', height: '100%', padding: '8px' }}>
            <div style={{ 
              position: 'relative',
              width: '100%',
              height: '100%'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={(e) => executeEventHandler(element, EVENT_TYPES.CLICK, e)}
              >
                <span>
                  {element.options && element.options[element.selected || 0]}
                </span>
                <Icons.ChevronDown size={16} />
              </div>
            </div>
          </div>
        );
        break;
        
      case COMPONENT_TYPES.CLOCK:
        const now = element.timestamp ? new Date(element.timestamp) : new Date();
        const clockSize = element.size || 100;
        content = (
          <div 
            style={{ 
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              style={{ 
                width: `${clockSize}px`,
                height: `${clockSize}px`,
                borderRadius: '50%',
                border: `${element.borderWidth || 2}px solid ${element.borderColor || '#333333'}`,
                position: 'relative',
                backgroundColor: element.backgroundColor || 'white'
              }}
            >
              {/* Clock face */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '2px',
                    height: '8px',
                    backgroundColor: '#333',
                    left: '50%',
                    top: '4px',
                    transformOrigin: `50% ${clockSize/2 - 4}px`,
                    transform: `rotate(${i * 30}deg) translateY(-${clockSize/2 - 10}px)`
                  }}
                />
              ))}
              
              {/* Clock hands */}
              <div
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: `${clockSize/2 - 20}px`,
                  backgroundColor: '#333',
                  left: '50%',
                  bottom: '50%',
                  transformOrigin: '50% 100%',
                  transform: `translateX(-2px) rotate(${now.getHours() % 12 * 30 + now.getMinutes() * 0.5}deg)`
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  width: '2px',
                  height: `${clockSize/2 - 10}px`,
                  backgroundColor: '#333',
                  left: '50%',
                  bottom: '50%',
                  transformOrigin: '50% 100%',
                  transform: `translateX(-1px) rotate(${now.getMinutes() * 6}deg)`
                }}
              />
              {element.showSeconds !== false && (
                <div
                  style={{
                    position: 'absolute',
                    width: '1px',
                    height: `${clockSize/2 - 5}px`,
                    backgroundColor: 'red',
                    left: '50%',
                    bottom: '50%',
                    transformOrigin: '50% 100%',
                    transform: `translateX(-0.5px) rotate(${now.getSeconds() * 6}deg)`
                  }}
                />
              )}
              
              {/* Center dot */}
              <div
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#333',
                  borderRadius: '50%',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>
        );
        break;
        
      default:
        content = (
          <div 
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8f8f8',
              color: '#666',
              fontSize: '14px',
              textAlign: 'center',
              padding: '8px'
            }}
            onClick={(e) => executeEventHandler(element, EVENT_TYPES.CLICK, e)}
          >
            {element.type}
            {element.name && `: ${element.name}`}
          </div>
        );
    }
  
    return (
      <div
        key={element.id}
        style={elementStyle}
        onClick={(e) => {
          e.stopPropagation();
          handleElementClick(element.id, e.ctrlKey || e.metaKey);
        }}
        onMouseDown={(e) => {
          if (selectedTool === 'select') {
            e.stopPropagation();
            handleDragStart(e, element.x, element.y);
          }
        }}
        onMouseEnter={(e) => executeEventHandler(element, EVENT_TYPES.MOUSE_ENTER, e)}
        onMouseLeave={(e) => executeEventHandler(element, EVENT_TYPES.MOUSE_LEAVE, e)}
      >
        {isGroup && (
          <div className="group-handle">
            {element.name || 'Group'}
          </div>
        )}
        {content}
        {isSelected && (
          <div className="selection-handles">
            <div className="resize-handle resize-handle-nw" />
            <div className="resize-handle resize-handle-ne" />
            <div className="resize-handle resize-handle-sw" />
            <div className="resize-handle resize-handle-se" />
            <div className="resize-handle resize-handle-n" />
            <div className="resize-handle resize-handle-s" />
            <div className="resize-handle resize-handle-w" />
            <div className="resize-handle resize-handle-e" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="design-editor">
      <header className="editor-header">
        <div className="logo">
          <Icons.Layout size={24} />
          <span>Design Editor</span>
        </div>
        <div className="toolbar">
          <button onClick={handleUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <Icons.ArrowUp size={16} />
          </button>
          <button onClick={handleRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            <Icons.ArrowDown size={16} />
          </button>
          <div className="divider" />
          <button 
            onClick={() => setShowLayers(!showLayers)} 
            className={showLayers ? 'active' : ''}
            title="Toggle Layers"
          >
            <Icons.Layers size={16} />
          </button>
          <div className="divider" />
          <button 
            className={viewportSize === 'desktop' ? 'active' : ''}
            onClick={() => handleViewportChange('desktop')}
            title="Desktop View"
          >
            <Icons.Monitor size={16} />
          </button>
          <button 
            className={viewportSize === 'tablet' ? 'active' : ''}
            onClick={() => handleViewportChange('tablet')}
            title="Tablet View"
          >
            <Icons.Tablet size={16} />
          </button>
          <button 
            className={viewportSize === 'mobile' ? 'active' : ''}
            onClick={() => handleViewportChange('mobile')}
            title="Mobile View"
          >
            <Icons.Smartphone size={16} />
          </button>
          <div className="divider" />
          <div className="zoom-controls">
            <button onClick={() => handleZoomChange(zoom - 0.25)} title="Zoom Out">
              <Icons.Minus size={16} />
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={() => handleZoomChange(zoom + 0.25)} title="Zoom In">
              <Icons.Plus size={16} />
            </button>
          </div>
        </div>
        <div className="user-controls">
          <span>{currentTime}</span>
          <span className="username">{currentUser}</span>
        </div>
      </header>

      <div className="editor-content">
        <Sidebar
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
          onAddShape={handleAddShape}
          onAddComponent={handleAddComponent}
          onCanvasBackgroundChange={updateCanvasBackground}
          canvasBackground={currentPage.background}
        />

        <div 
          className="design-area"
          ref={designAreaRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {showRulers && (
            <div className="rulers">
              <div className="ruler ruler-horizontal" />
              <div className="ruler ruler-vertical" />
            </div>
          )}
          
          <div 
            className={`canvas-container ${viewportSize}`}
            style={{
              transform: `scale(${zoom})`,
              width: `${canvasSize.width}px`,
              height: `${canvasSize.height}px`
            }}
          >
            <div 
              className="canvas"
              ref={canvasRef}
              onClick={() => {
                setSelectedElement(null);
                setSelectedElements([]);
              }}
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: currentPage.background.color,
                backgroundImage: currentPage.background.image ? `url(${currentPage.background.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 0 20px rgba(0,0,0,0.1)'
              }}
            >
              {elements
                .filter(el => !el.parentId) // Only render top-level elements
                .map(renderElement)}
              {alignmentGuides.map((guide, i) => (
                <div
                  key={i}
                  className={`alignment-guide ${guide.type}`}
                  style={{
                    [guide.type === 'horizontal' ? 'top' : 'left']: `${guide.position}px`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {showLayers && (
          <>
            <HistoryPanel
              history={history}
              index={index}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
            />

            <LayersPanel
              elements={elements}
              selectedElement={selectedElement}
              selectedElements={selectedElements}
              onSelectElement={handleElementClick}
              onToggleVisibility={handleToggleVisibility}
              onChangeZIndex={handleChangeZIndex}
              onGroupElements={() => {
                if (selectedElements.length >= 2 && !showGroupNameInput) {
                  setShowGroupNameInput(true);
                }
              }}
              onUngroupElements={handleUngroupElements}
              groupName={groupName}
              setGroupName={setGroupName}
              showGroupNameInput={showGroupNameInput}
              setShowGroupNameInput={setShowGroupNameInput}
            />
          </>
        )}

        {!isMobileView && (
          <PropertiesPanel 
            selectedElement={selectedElement ? elements.find(el => el.id === selectedElement) : null}
            onUpdateProps={handleUpdateElementProps}
            onDelete={handleDeleteElement}
            onDuplicate={handleDuplicateElement}
            canvasBackground={currentPage.background}
            onCanvasBackgroundChange={updateCanvasBackground}
            pages={pages}
            currentPage={currentPageIndex}
            onPageChange={handlePageChange}
            onAddPage={handleAddPage}
            onRemovePage={handleRemovePage}
            elements={elements}
            onUpdateEventHandlers={handleUpdateEventHandlers}
          />
        )}
      </div>
      {showGroupNameInput && (
        <div className="group-name-modal">
          <div className="modal-content">
            <h3>Enter Group Name</h3>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && groupName.trim()) {
                  handleGroupElements(groupName);
                }
              }}
            />
            <div className="modal-actions">
              <button 
                onClick={() => {
                  if (groupName.trim()) {
                    handleGroupElements(groupName);
                  }
                }}
                className="confirm-button"
              >
                Create Group
              </button>
              <button 
                onClick={() => {
                  setShowGroupNameInput(false);
                  setGroupName('');
                }}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignEditor;