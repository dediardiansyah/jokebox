"use client";

import React, { useRef, useEffect, useState } from "react";
// Pustaka Fabric.js dimuat secara dinamis melalui CDN di dalam useEffect.

const FabricCanvasComponent = () => {
  // Ref untuk mendapatkan elemen DOM <canvas>
  const canvasEl = useRef(null);
  // Ref untuk membungkus seluruh area canvas (digunakan untuk klik di luar)
  const wrapperRef = useRef(null);
  // Ref untuk menyimpan instance Fabric.Canvas
  const fabricCanvasRef = useRef(null);
  const imageInputRef = useRef(null);

  const [status, setStatus] = useState("Loading Fabric.js library...");
  const [jsonOutput, setJsonOutput] = useState("");

  // State untuk tinggi canvas yang dapat diubah ukurannya
  const initialHeight = 400;
  const [canvasHeight, setCanvasHeight] = useState(initialHeight);
  // Ref untuk melacak status dragging
  const isResizing = useRef(false);

  // State untuk kontrol Grid
  const [isGridEnabled, setIsGridEnabled] = useState(false);
  const GRID_SIZE = 10;
  const GRID_LINE_COLOR = "#e5e7eb"; // Abu muda

  // --- Fungsi Utilitas ---

  const loadFabricScript = (callback) => {
    if (window.fabric) {
      callback(window.fabric);
      return;
    }
    const scriptId = "fabric-js-cdn";
    if (document.getElementById(scriptId)) {
      document.getElementById(scriptId).onload = () => callback(window.fabric);
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js";
    script.onload = () => {
      console.log("Fabric.js script loaded.");
      callback(window.fabric);
    };
    script.onerror = () => {
      setStatus("Error loading Fabric.js CDN.");
    };
    document.head.appendChild(script);
  };

  const drawGrid = (canvas) => {
    const context = canvas.getContext();
    const GRID_LINE_WIDTH = 1;

    // Simpan status context asli
    context.save();

    context.strokeStyle = GRID_LINE_COLOR;
    context.lineWidth = GRID_LINE_WIDTH;

    // Hapus grid lama jika ada (berjalan di atas lapisan latar belakang canvas)
    canvas.clearContext(context, 0, 0, canvas.width, canvas.height);

    // Gambar garis vertikal
    for (let x = 0; x < canvas.width / GRID_SIZE; x++) {
      context.beginPath();
      context.moveTo(x * GRID_SIZE + 0.5, 0);
      context.lineTo(x * GRID_SIZE + 0.5, canvas.height);
      context.stroke();
    }

    // Gambar garis horizontal
    for (let y = 0; y < canvas.height / GRID_SIZE; y++) {
      context.beginPath();
      context.moveTo(0, y * GRID_SIZE + 0.5);
      context.lineTo(canvas.width, y * GRID_SIZE + 0.5);
      context.stroke();
    }

    // Kembalikan status context
    context.restore();

    // Set background drawing sebagai gambar grid
    // Membuat objek fabric.Image dari elemen canvas grid
    const gridImage = new window.fabric.Image(canvas.getElement());

    // Mengatur background image dan memastikan objek latar belakang tidak dapat dipilih/dipindahkan
    canvas.setBackgroundImage(gridImage, canvas.renderAll.bind(canvas), {
      originX: "left",
      originY: "top",
      left: 0,
      top: 0,
      selectable: false,
      evented: false,
    });

    canvas.renderAll();
  };

  // --- Logika Kontrol Canvas ---

  const exportCanvasObjects = () => {
    if (!fabricCanvasRef.current) return;
    // Export dengan menyertakan properti penting untuk rekonstruksi objek
    const json = fabricCanvasRef.current.toJSON(["left", "top", "scaleX", "scaleY", "angle", "width", "height", "fill", "text", "fontSize", "fontFamily"]);
    setJsonOutput(JSON.stringify(json, null, 2));
    setStatus("Canvas objects exported to JSON.");
  };

  const saveCanvasDesign = () => {
    if (!fabricCanvasRef.current) return;

    const designData = fabricCanvasRef.current.toJSON([
      "left",
      "top",
      "scaleX",
      "scaleY",
      "angle",
      "width",
      "height",
      "fill",
      "text",
      "fontSize",
      "fontFamily",
    ]);

    // Dalam aplikasi Next.js nyata, Anda akan melakukan fetch ke /api/save-canvas di sini
    console.log("Simulating saving design to PostgreSQL via Prisma...");
    console.log("Data to be saved:", designData);

    // Mensimulasikan POST request ke API Route
    fetch("/api/save-canvas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "My Canvas Design", data: designData }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus("Design saved successfully! (Simulated)");
        console.log("DB Response (Simulated):", data);
      })
      .catch((error) => {
        setStatus("Error saving design (Simulated)");
        console.error("Save Error (Simulated):", error);
      });

    setStatus("Design JSON generated. (Simulated) Ready to be saved to DB.");
    setJsonOutput(JSON.stringify(designData, null, 2));
  };

  const addTextBox = () => {
    if (!fabricCanvasRef.current || !window.fabric) return;
    const { IText } = window.fabric;
    const canvas = fabricCanvasRef.current;

    const newText = new IText("Double click to edit", {
      left: canvas.width / 2 - 100,
      top: canvas.height / 2 - 20,
      fontFamily: "Inter, sans-serif",
      fontSize: 24,
      fill: "#dc2626",
    });

    canvas.add(newText);
    canvas.setActiveObject(newText);
    canvas.renderAll();
    setStatus("Dynamic Text Box added.");
  };

  const triggerImageUpload = () => {
    imageInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    if (!fabricCanvasRef.current || !window.fabric) return;
    const file = e.target.files[0];
    if (!file) return;

    const canvas = fabricCanvasRef.current;
    const reader = new FileReader();

    reader.onload = (f) => {
      const data = f.target.result;
      window.fabric.Image.fromURL(
        data,
        (img) => {
          // Atur skala agar gambar sesuai dengan canvas
          const scaleFactor = Math.min(
            (canvas.width - 50) / img.width,
            (canvas.height - 50) / img.height,
            1 // Jangan perbesar gambar jika sudah besar
          );

          img.set({
            left: 50,
            top: 50,
            scaleX: scaleFactor,
            scaleY: scaleFactor,
            hasControls: true,
          });

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          setStatus("Image uploaded successfully.");
        },
        { crossOrigin: "anonymous" }
      ); // Tambahkan crossOrigin untuk penanganan gambar yang lebih baik
    };
    reader.readAsDataURL(file);
    // Kosongkan input agar event change bisa terulang jika file yang sama dipilih lagi
    e.target.value = null;
  };

  // --- Logika Deselect Klik di Luar ---
  const handleClickOutside = (e) => {
    if (!fabricCanvasRef.current || !wrapperRef.current) return;

    // Cek apakah klik terjadi di luar area wrapper canvas
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      if (fabricCanvasRef.current.getActiveObject()) {
        fabricCanvasRef.current.discardActiveObject();
        fabricCanvasRef.current.renderAll();
      }
    }
  };

  // --- Logika Resize Canvas ---

  const handleResize = (e) => {
    if (!isResizing.current || !fabricCanvasRef.current || !canvasEl.current) return;

    const canvasRect = canvasEl.current.getBoundingClientRect();
    // Pastikan tinggi minimum 100px
    const newHeight = Math.max(100, e.clientY - canvasRect.top);

    setCanvasHeight(newHeight);

    fabricCanvasRef.current.setDimensions({ width: 570, height: newHeight });

    // Gambar ulang grid agar sesuai dengan ukuran baru
    if (isGridEnabled) {
      drawGrid(fabricCanvasRef.current);
    }

    fabricCanvasRef.current.renderAll();
    setStatus(`Canvas Height: ${Math.round(newHeight)}px. Drag to resize.`);
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
    document.body.style.cursor = "default";
    setStatus(`Canvas Height: ${Math.round(canvasHeight)}px. Ready.`);
  };

  const startResize = (e) => {
    e.preventDefault();
    if (!fabricCanvasRef.current) return;

    isResizing.current = true;
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
    document.body.style.cursor = "ns-resize";
  };

  // --- Logika Snap Grid ---

  const snapToGrid = (options) => {
    if (!isGridEnabled || !fabricCanvasRef.current) return;
    const target = options.target;

    // Snap Posisi (Moving)
    target.set({
      left: Math.round(target.left / GRID_SIZE) * GRID_SIZE,
      top: Math.round(target.top / GRID_SIZE) * GRID_SIZE,
    });

    // Snap Scaling (Mengubah Ukuran) - memastikan batas tetap di grid
    if (options.transform) {
      // Logika ini kompleks untuk disnap ke grid secara visual
      // Cukup snap posisi saat ini dan rotasi
    }

    // Snap Rotasi (45 derajat)
    const angleSnap = 45;
    target.set({
      angle: Math.round(target.angle / angleSnap) * angleSnap,
    });

    target.setCoords();
    fabricCanvasRef.current.renderAll();
  };

  const toggleGrid = () => {
    const newGridState = !isGridEnabled;
    setIsGridEnabled(newGridState);
    setStatus(`Snap Grid is now ${newGridState ? "Enabled" : "Disabled"}.`);

    // Tampilkan/Sembunyikan grid visual di latar belakang
    if (fabricCanvasRef.current) {
      if (newGridState) {
        drawGrid(fabricCanvasRef.current);
      } else {
        // Hapus background image (grid)
        fabricCanvasRef.current.setBackgroundImage(null, fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current));
        fabricCanvasRef.current.renderAll();
      }
    }
  };

  // --- Efek Inisialisasi Fabric.js ---

  useEffect(() => {
    let cleanupFunction = () => {};

    loadFabricScript((fabricInstance) => {
      if (!fabricInstance || !canvasEl.current) {
        setStatus("Initialization failed: Fabric.js object not found or canvas element missing.");
        return;
      }

      if (!fabricCanvasRef.current && canvasEl.current) {
        try {
          // 1. Inisialisasi Fabric.js Canvas
          const canvas = new fabricInstance.Canvas(canvasEl.current, {
            width: 570,
            selection: true,
            height: canvasHeight,
            backgroundColor: "#ffffff", // Atur background putih
          });

          fabricCanvasRef.current = canvas;

          // Tambahkan listener untuk Snap Grid
          canvas.on({
            "object:moving": snapToGrid,
            "object:scaling": snapToGrid,
            "object:rotating": snapToGrid,
          });

          // 2. Tambahkan objek contoh
          const rect = new fabricInstance.Rect({
            left: 100,
            top: 100,
            fill: "#0ea5e9",
            stroke: "#075985",
            strokeWidth: 3,
            width: 80,
            height: 80,
            angle: 15,
            opacity: 0.9,
            shadow: "rgba(0,0,0,0.3) 5px 5px 5px",
          });

          const text = new fabricInstance.IText("Resizable Canvas!", {
            left: 250,
            top: 50,
            fontFamily: "Inter, sans-serif",
            fontSize: 32,
            fill: "#1e40af",
            fontWeight: "bold",
          });

          canvas.add(rect, text);
          canvas.renderAll();

          setStatus(`Canvas Height: ${canvasHeight}px. Drag the blue bar below to resize.`);

          // Tambahkan listener klik di luar
          document.addEventListener("mousedown", handleClickOutside);

          // Cleanup function
          cleanupFunction = () => {
            console.log("Canvas disposed.");
            canvas.dispose();
            fabricCanvasRef.current = null;
            document.removeEventListener("mousedown", handleClickOutside);
          };
        } catch (error) {
          setStatus(`Error initializing Fabric.js: ${error.message}`);
          console.error("Fabric.js Initialization Error:", error);
        }
      }
    });

    return cleanupFunction;
  }, []); // Dependency array kosong agar hook hanya berjalan saat mount

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <div className="w-[570px]" ref={wrapperRef}>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-3 text-center">Next.js + Fabric.js Editor</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Status: <span className="font-semibold text-blue-600">{status}</span>
        </p>

        {/* Kontrol Button */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 p-3 bg-white rounded-lg shadow-md">
          <button onClick={addTextBox} className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-red-500 hover:bg-red-600 transition shadow-md">
            Add Text Box
          </button>
          <button
            onClick={triggerImageUpload}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-pink-500 hover:bg-pink-600 transition shadow-md"
          >
            Add Image
          </button>
          <input type="file" ref={imageInputRef} onChange={handleImageUpload} style={{ display: "none" }} accept="image/*" />
          <button
            onClick={exportCanvasObjects}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-green-500 hover:bg-green-600 transition shadow-md"
          >
            Export JSON Objects
          </button>
          <button
            onClick={saveCanvasDesign}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 transition shadow-md"
          >
            Save Design to DB (Simulated)
          </button>
          <button
            onClick={toggleGrid}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition shadow-md ${
              isGridEnabled ? "bg-gray-700 text-white hover:bg-gray-800" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Toggle Snap Grid (10px)
          </button>
        </div>

        <div className="rounded-lg overflow-hidden shadow-xl transition-shadow bg-white shadow-2xl border-2 border-gray-200">
          <canvas ref={canvasEl} width="570" height={canvasHeight} />

          {/* Resize Handle */}
          <div className="relative w-full cursor-ns-resize transition-colors group" onMouseDown={startResize} style={{ height: "10px", cursor: "ns-resize" }}>
            <div className="flex justify-center -mt-2.5">
              <div className="w-12 h-1 bg-blue-800 rounded-full shadow-md group-hover:w-16 transition-all duration-200"></div>
            </div>
            <div className="h-full w-full"></div>
          </div>
        </div>

        {/* JSON Output Area */}
        {jsonOutput && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-lg w-full">
            <h3 className="text-sm font-semibold text-gray-100 mb-2">Exported/Saved JSON:</h3>
            <pre className="text-xs text-green-400 whitespace-pre-wrap break-words overflow-auto max-h-60">{jsonOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default FabricCanvasComponent;
