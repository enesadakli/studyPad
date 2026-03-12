import { useEffect, useRef, useCallback, useState } from 'react';
import {
  Canvas, PencilBrush, Line, Circle, Rect, Ellipse,
  IText, FabricImage, FabricText,
} from 'fabric';
import { useNotesStore } from '../../store/notesStore';
import { useUIStore } from '../../store/uiStore';
import CanvasToolbar from './CanvasToolbar';
import TemplateSelector from './TemplateSelector';

const HISTORY_LIMIT = 50;

async function applyTemplate(canvas, template) {
  const { width, height } = canvas;
  canvas.backgroundColor = '#1a1a2e';

  const toRemove = canvas.getObjects().filter(o => o.data?.isTemplate);
  toRemove.forEach(o => canvas.remove(o));

  if (template === 'lined') {
    for (let y = 40; y < height; y += 32) {
      const line = new Line([0, y, width, y], { stroke: '#1e3a5f', strokeWidth: 1, selectable: false, evented: false });
      line.data = { isTemplate: true };
      canvas.add(line);
    }
  } else if (template === 'grid') {
    for (let y = 0; y < height; y += 32) {
      const line = new Line([0, y, width, y], { stroke: '#1e3a5f', strokeWidth: 1, selectable: false, evented: false });
      line.data = { isTemplate: true };
      canvas.add(line);
    }
    for (let x = 0; x < width; x += 32) {
      const line = new Line([x, 0, x, height], { stroke: '#1e3a5f', strokeWidth: 1, selectable: false, evented: false });
      line.data = { isTemplate: true };
      canvas.add(line);
    }
  } else if (template === 'dotted') {
    for (let y = 32; y < height; y += 32) {
      for (let x = 32; x < width; x += 32) {
        const dot = new Circle({ left: x - 1.5, top: y - 1.5, radius: 1.5, fill: '#1e3a5f', selectable: false, evented: false });
        dot.data = { isTemplate: true };
        canvas.add(dot);
      }
    }
  } else if (template === 'cornell') {
    const vline = new Line([width * 0.3, 0, width * 0.3, height * 0.8], { stroke: '#1e3a5f', strokeWidth: 1, selectable: false, evented: false });
    vline.data = { isTemplate: true };
    const hline = new Line([0, height * 0.8, width, height * 0.8], { stroke: '#1e3a5f', strokeWidth: 1, selectable: false, evented: false });
    hline.data = { isTemplate: true };
    const t1 = new FabricText('Anahtar Kelimeler', { left: 10, top: 10, fontSize: 11, fill: '#8892a4', selectable: false, evented: false });
    t1.data = { isTemplate: true };
    const t2 = new FabricText('Notlar', { left: width * 0.3 + 10, top: 10, fontSize: 11, fill: '#8892a4', selectable: false, evented: false });
    t2.data = { isTemplate: true };
    const t3 = new FabricText('Özet', { left: 10, top: height * 0.8 + 8, fontSize: 11, fill: '#8892a4', selectable: false, evented: false });
    t3.data = { isTemplate: true };
    canvas.add(vline, hline, t1, t2, t3);
  }

  canvas.renderAll();
}

export default function CanvasEditor() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const isHistoryAction = useRef(false);
  const autoSaveTimer = useRef(null);
  const containerRef = useRef(null);

  const { activeCourseId, activePageId, getActivePage, saveCanvasData } = useNotesStore();
  const {
    selectedTool, penColor, penSize, highlighterColor, highlighterOpacity, eraserSize,
    showTemplateSelector, setShowTemplateSelector,
  } = useUIStore();

  const [zoom, setZoom] = useState(1);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const pushHistory = useCallback(() => {
    if (!fabricRef.current || isHistoryAction.current) return;
    const json = JSON.stringify(fabricRef.current.toDatalessJSON(['data']));
    const idx = historyIndexRef.current;
    historyRef.current = historyRef.current.slice(0, idx + 1);
    historyRef.current.push(json);
    if (historyRef.current.length > HISTORY_LIMIT) historyRef.current.shift();
    historyIndexRef.current = historyRef.current.length - 1;
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    const json = historyRef.current[historyIndexRef.current];
    isHistoryAction.current = true;
    fabricRef.current.loadFromJSON(JSON.parse(json)).then(() => {
      fabricRef.current.renderAll();
      isHistoryAction.current = false;
    });
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    const json = historyRef.current[historyIndexRef.current];
    isHistoryAction.current = true;
    fabricRef.current.loadFromJSON(JSON.parse(json)).then(() => {
      fabricRef.current.renderAll();
      isHistoryAction.current = false;
    });
  }, []);

  const scheduleSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      if (!fabricRef.current) return;
      const data = JSON.stringify(fabricRef.current.toDatalessJSON(['data']));
      saveCanvasData(activeCourseId, activePageId, data);
    }, 30000);
  }, [activeCourseId, activePageId, saveCanvasData]);

  const saveNow = useCallback(() => {
    if (!fabricRef.current) return;
    const data = JSON.stringify(fabricRef.current.toDatalessJSON(['data']));
    saveCanvasData(activeCourseId, activePageId, data);
  }, [activeCourseId, activePageId, saveCanvasData]);

  // Init canvas
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !canvasRef.current) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const canvas = new Canvas(canvasRef.current, {
      width, height,
      backgroundColor: '#1a1a2e',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    const page = getActivePage();
    if (page?.canvasData) {
      canvas.loadFromJSON(JSON.parse(page.canvasData)).then(() => {
        canvas.renderAll();
        pushHistory();
      });
    } else {
      applyTemplate(canvas, page?.template || 'blank').then(() => pushHistory());
    }

    canvas.on('object:added', () => { if (!isHistoryAction.current) pushHistory(); });
    canvas.on('object:modified', () => { if (!isHistoryAction.current) { pushHistory(); scheduleSave(); } });
    canvas.on('object:removed', () => { if (!isHistoryAction.current) pushHistory(); });
    canvas.on('path:created', () => { if (!isHistoryAction.current) { pushHistory(); scheduleSave(); } });

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
      if (e.ctrlKey && e.shiftKey && e.key === 'Z') { e.preventDefault(); redo(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        const active = canvas.getActiveObjects();
        if (active.length) {
          active.forEach(o => canvas.remove(o));
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); saveNow(); }
    };
    window.addEventListener('keydown', handleKeyDown);

    const ro = new ResizeObserver(() => {
      if (!fabricRef.current) return;
      fabricRef.current.setDimensions({ width: container.clientWidth, height: container.clientHeight });
    });
    ro.observe(container);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
      window.removeEventListener('keydown', handleKeyDown);
      ro.disconnect();
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [activeCourseId, activePageId]);

  // Tool mode
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = true;

    if (selectedTool === 'pen') {
      canvas.isDrawingMode = true;
      const brush = new PencilBrush(canvas);
      brush.color = penColor;
      brush.width = penSize;
      canvas.freeDrawingBrush = brush;
    } else if (selectedTool === 'highlighter') {
      canvas.isDrawingMode = true;
      const brush = new PencilBrush(canvas);
      const hex = highlighterColor;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      brush.color = `rgba(${r},${g},${b},${highlighterOpacity})`;
      brush.width = 20;
      canvas.freeDrawingBrush = brush;
    } else if (selectedTool === 'eraser') {
      canvas.isDrawingMode = true;
      const brush = new PencilBrush(canvas);
      brush.color = canvas.backgroundColor || '#1a1a2e';
      brush.width = eraserSize;
      canvas.freeDrawingBrush = brush;
    } else if (selectedTool !== 'select') {
      canvas.isDrawingMode = false;
      canvas.selection = false;
    }
  }, [selectedTool, penColor, penSize, highlighterColor, highlighterOpacity, eraserSize]);

  // Shape / text tools
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    if (['pen', 'highlighter', 'eraser', 'select'].includes(selectedTool)) return;

    let isDown = false;
    let startX, startY, shape;

    const onMouseDown = (opt) => {
      const pointer = canvas.getViewportPoint(opt.e);
      startX = pointer.x;
      startY = pointer.y;
      isDown = true;

      if (selectedTool === 'text') {
        const text = new IText('Metin yaz...', {
          left: startX, top: startY, fontSize: 16, fill: penColor, fontFamily: 'Inter, sans-serif',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        text.selectAll();
        isDown = false;
        return;
      }
      if (selectedTool === 'rect') {
        shape = new Rect({ left: startX, top: startY, width: 0, height: 0, fill: 'transparent', stroke: penColor, strokeWidth: 2 });
      } else if (selectedTool === 'circle') {
        shape = new Ellipse({ left: startX, top: startY, rx: 0, ry: 0, fill: 'transparent', stroke: penColor, strokeWidth: 2 });
      } else if (selectedTool === 'arrow') {
        shape = new Line([startX, startY, startX, startY], { stroke: penColor, strokeWidth: 2 });
      }
      if (shape) canvas.add(shape);
    };

    const onMouseMove = (opt) => {
      if (!isDown || !shape) return;
      const pointer = canvas.getViewportPoint(opt.e);
      const w = pointer.x - startX;
      const h = pointer.y - startY;
      if (selectedTool === 'rect') {
        shape.set({ left: w < 0 ? pointer.x : startX, top: h < 0 ? pointer.y : startY, width: Math.abs(w), height: Math.abs(h) });
      } else if (selectedTool === 'circle') {
        shape.set({ rx: Math.abs(w) / 2, ry: Math.abs(h) / 2 });
      } else if (selectedTool === 'arrow') {
        shape.set({ x2: pointer.x, y2: pointer.y });
      }
      canvas.renderAll();
    };

    const onMouseUp = () => { isDown = false; shape = null; };

    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:move', onMouseMove);
    canvas.on('mouse:up', onMouseUp);
    return () => {
      canvas.off('mouse:down', onMouseDown);
      canvas.off('mouse:move', onMouseMove);
      canvas.off('mouse:up', onMouseUp);
    };
  }, [selectedTool, penColor]);

  // Pointer pressure
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas || selectedTool !== 'pen') return;
    const el = canvas.upperCanvasEl;
    const handler = (e) => {
      if (e.pressure && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = Math.max(1, penSize * (0.5 + e.pressure));
      }
    };
    el.addEventListener('pointermove', handler);
    return () => el.removeEventListener('pointermove', handler);
  }, [selectedTool, penSize]);

  // Ctrl+scroll zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handler = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const canvas = fabricRef.current;
      if (!canvas) return;
      let z = canvas.getZoom();
      z = e.deltaY > 0 ? z * 0.95 : z * 1.05;
      z = Math.min(Math.max(z, 0.2), 5);
      canvas.setZoom(z);
      setZoom(z);
    };
    container.addEventListener('wheel', handler, { passive: false });
    return () => container.removeEventListener('wheel', handler);
  }, []);

  // Image drop
  const handleDragOver = (e) => { e.preventDefault(); setIsDraggingFile(true); };
  const handleDragLeave = () => setIsDraggingFile(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.src = ev.target.result;
        img.onload = () => {
          const canvas = fabricRef.current;
          if (!canvas) return;
          const fabricImg = new FabricImage(img);
          const maxW = canvas.width * 0.5;
          if (fabricImg.width > maxW) fabricImg.scale(maxW / fabricImg.width);
          fabricImg.set({ left: 100, top: 100 });
          canvas.add(fabricImg);
          canvas.setActiveObject(fabricImg);
          canvas.renderAll();
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleTemplateChange = (template) => {
    if (fabricRef.current) applyTemplate(fabricRef.current, template);
    setShowTemplateSelector(false);
  };

  const exportPNG = () => {
    if (!fabricRef.current) return;
    const a = document.createElement('a');
    a.href = fabricRef.current.toDataURL({ format: 'png', quality: 1 });
    a.download = `studypad-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <CanvasToolbar
        onUndo={undo} onRedo={redo} onSave={saveNow} onExportPNG={exportPNG}
        zoom={zoom} onZoomReset={() => { fabricRef.current?.setZoom(1); setZoom(1); }}
      />
      <div
        ref={containerRef}
        className={`flex-1 relative overflow-hidden ${isDraggingFile ? 'ring-2 ring-blue-400 ring-inset' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <canvas ref={canvasRef} />
        {isDraggingFile && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-900/30 pointer-events-none z-10">
            <p className="text-blue-300 text-lg font-medium">Görseli bırak</p>
          </div>
        )}
      </div>
      {showTemplateSelector && (
        <TemplateSelector onSelect={handleTemplateChange} onClose={() => setShowTemplateSelector(false)} />
      )}
    </div>
  );
}
