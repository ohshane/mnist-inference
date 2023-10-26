import React, { useRef, useEffect } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);

  const getCanvasAsArray = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    const grayscaleArray = [];

    for (let y = 0; y < canvas.height; y++) {
      const row = [];
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
        row.push(Math.round(grayscale));
      }
      grayscaleArray.push(row);
    }

    return grayscaleArray;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initialize canvas
    const initializeCanvas = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 10;
    };

    initializeCanvas();

    // Drawing event listeners
    let drawing = false;

    const startDrawing = (e) => {
      drawing = true;
      draw(e);
    };

    const stopDrawing = () => {
      drawing = false;
      ctx.beginPath();
    };

    const draw = (e) => {
      if (!drawing) return;

      console.log(getCanvasAsArray());

      ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    };

    const clearCanvas = (e) => {
      e.preventDefault();
      if (e.key === 'Escape' || e.button === 2) {
        initializeCanvas();
      }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('contextmenu', clearCanvas);
    document.addEventListener('keydown', clearCanvas);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('contextmenu', clearCanvas);
      document.removeEventListener('keydown', clearCanvas);
    };
  }, []);

  return <canvas className="Canvas" ref={canvasRef} width={112} height={112} />;
};

export default Canvas;
