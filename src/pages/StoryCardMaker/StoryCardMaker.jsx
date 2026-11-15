import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import AboutModal from '../../components/AboutModal';
import './storyCardMaker.css';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

export default function StoryCardMaker() {
  const { isDark, toggleTheme } = useTheme();

  // Canvas and DOM refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  // App State
  const [currentImgObj, setCurrentImgObj] = useState(null);
  const [currentScale, setCurrentScale] = useState(0.7);
  const [cornerRadius, setCornerRadius] = useState(110);
  const [rotation, setRotation] = useState(0);
  const [patternIndex, setPatternIndex] = useState(0);
  const [activeColors, setActiveColors] = useState([]);
  const [cachedPalette, setCachedPalette] = useState([]);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeControl, setActiveControl] = useState(null); // 'scale' | 'corners' | 'rotate' | null
  const [toastMessage, setToastMessage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = 'Story Card Studio — Azizi Yahya';
  }, []);

  // Toast timer ref
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Menu click outside & Escape listeners
  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !menuBtnRef.current?.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  // Modal open scroll-lock
  useEffect(() => {
    if (aboutOpen) {
      document.body.classList.add('modal-open');
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setAboutOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.classList.remove('modal-open');
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [aboutOpen]);

  // Gradient computation
  const getGradientConfig = useCallback(
    (img, palette, currentActiveColors, pIndex) => {
      let finalPalette = palette;
      if (!finalPalette || finalPalette.length === 0) {
        const sc = document.createElement('canvas');
        const w = 64;
        const h = 64;
        sc.width = w;
        sc.height = h;
        const sctx = sc.getContext('2d');
        sctx.drawImage(img, 0, 0, w, h);

        const colors = [];
        const step = 4;
        for (let i = 0; i < w; i += step) {
          for (let j = 0; j < h; j += step) {
            const pixel = sctx.getImageData(i, j, 1, 1).data;
            const lum = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
            const max = Math.max(pixel[0], pixel[1], pixel[2]);
            const min = Math.min(pixel[0], pixel[1], pixel[2]);
            const sat = max === 0 ? 0 : (max - min) / max;
            if (lum > 20 && lum < 235 && sat > 0.15) {
              colors.push({
                rgb: `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`,
                score: sat * 2 + (lum > 50 && lum < 200 ? 1 : 0),
              });
            }
          }
        }

        colors.sort((a, b) => b.score - a.score);
        finalPalette = colors.slice(0, 10).map((c) => c.rgb);

        if (finalPalette.length < 2) {
          finalPalette = ['#1e1b4b', '#312e81', '#4338ca'];
        }
        setCachedPalette(finalPalette);
      }

      let c1, c2;
      if (currentActiveColors && currentActiveColors.length >= 2) {
        [c1, c2] = currentActiveColors;
      } else {
        const idx1 = pIndex % finalPalette.length;
        const idx2 = (pIndex + 2) % finalPalette.length;
        c1 = finalPalette[idx1];
        c2 = finalPalette[idx2] || finalPalette[0];
      }

      const patterns = [
        { type: 'linear', direction: [0, 0, CANVAS_WIDTH, CANVAS_HEIGHT] },
        { type: 'radial' },
        { type: 'linear', direction: [0, CANVAS_HEIGHT, CANVAS_WIDTH, 0] },
        { type: 'linear', direction: [0, 0, 0, CANVAS_HEIGHT] },
      ];

      return {
        colors: [c1, c2],
        ...patterns[pIndex % patterns.length],
      };
    },
    []
  );

  // Render to canvas
  const renderCanvas = useCallback(
    (img, scale, cornerRad, rot, pIndex, currColors, palette) => {
      const canvas = canvasRef.current;
      if (!canvas || !img) return;

      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // 1. Draw gradient background
      const gradient = getGradientConfig(img, palette, currColors, pIndex);

      if (gradient.type === 'radial') {
        const grad = ctx.createRadialGradient(
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2,
          0,
          CANVAS_WIDTH / 2,
          CANVAS_HEIGHT / 2,
          CANVAS_HEIGHT / 1.2
        );
        grad.addColorStop(0, gradient.colors[0]);
        grad.addColorStop(1, gradient.colors[1]);
        ctx.fillStyle = grad;
      } else {
        const grad = ctx.createLinearGradient(...gradient.direction);
        grad.addColorStop(0, gradient.colors[0]);
        grad.addColorStop(1, gradient.colors[1]);
        ctx.fillStyle = grad;
      }
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 2. Compute card geometry
      const targetWidth = CANVAS_WIDTH * scale;
      const scaleFactor = targetWidth / img.width;
      const finalWidth = targetWidth;
      const finalHeight = img.height * scaleFactor;

      // Card coordinates centered around (0, 0) in translated space
      const cardX = -finalWidth / 2;
      const cardY = -finalHeight / 2;

      const drawSquircle = (c, qx, qy, qw, qh, r) => {
        c.beginPath();
        if (r <= 0) {
          c.rect(qx, qy, qw, qh);
          return;
        }
        const maxR = Math.min(qw, qh) / 2.6;
        const effectiveR = Math.min(r, maxR);
        const p = effectiveR * 1.28;
        const cv = effectiveR * 0.5;
        c.moveTo(qx + p, qy);
        c.lineTo(qx + qw - p, qy);
        c.bezierCurveTo(qx + qw - cv, qy, qx + qw, qy + cv, qx + qw, qy + p);
        c.lineTo(qx + qw, qy + qh - p);
        c.bezierCurveTo(qx + qw, qy + qh - cv, qx + qw - cv, qy + qh, qx + qw - p, qy + qh);
        c.lineTo(qx + p, qy + qh);
        c.bezierCurveTo(qx + cv, qy + qh, qx, qy + qh - cv, qx, qy + qh - p);
        c.lineTo(qx, qy + p);
        c.bezierCurveTo(qx, qy + cv, qx + cv, qy, qx + p, qy);
        c.closePath();
      };

      ctx.save();
      // Translate to canvas center and rotate
      ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      if (rot !== 0) {
        ctx.rotate((rot * Math.PI) / 180);
      }

      // Drop shadows
      const shadows = [
        { blur: 180, alpha: 0.15 },
        { blur: 80, alpha: 0.1 },
        { blur: 30, alpha: 0.05 },
      ];
      shadows.forEach((s) => {
        ctx.shadowColor = `rgba(0,0,0,${s.alpha})`;
        ctx.shadowBlur = s.blur;
        ctx.shadowOffsetY = s.blur / 2;
        drawSquircle(ctx, cardX, cardY, finalWidth, finalHeight, cornerRad);
        ctx.fill();
      });

      // Clip squircle & draw image
      ctx.shadowColor = 'transparent';
      ctx.clip();
      ctx.drawImage(img, cardX, cardY, finalWidth, finalHeight);
      ctx.restore();

      setPreviewSrc(canvas.toDataURL('image/jpeg', 1.0));
    },
    [getGradientConfig]
  );

  // File loading
  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image');
      return;
    }
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setCurrentImgObj(img);
        setCachedPalette([]);
        setActiveColors([]);
        setPatternIndex(0);
        setCurrentScale(0.7);
        setCornerRadius(110);
        setRotation(0);
        setActiveControl(null);

        renderCanvas(img, 0.7, 110, 0, 0, [], []);
        setIsLoading(false);
        showToast('Studio ready');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  // Drag & drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Control handlers
  const handleScaleChange = (val) => {
    const newScale = val / 100;
    setCurrentScale(newScale);
    if (currentImgObj) {
      renderCanvas(
        currentImgObj,
        newScale,
        cornerRadius,
        rotation,
        patternIndex,
        activeColors,
        cachedPalette
      );
    }
  };

  const handleCornerChange = (val) => {
    setCornerRadius(val);
    if (currentImgObj) {
      renderCanvas(
        currentImgObj,
        currentScale,
        val,
        rotation,
        patternIndex,
        activeColors,
        cachedPalette
      );
    }
  };

  const handleRotationChange = (val) => {
    setRotation(val);
    if (currentImgObj) {
      renderCanvas(
        currentImgObj,
        currentScale,
        cornerRadius,
        val,
        patternIndex,
        activeColors,
        cachedPalette
      );
    }
  };

  const handleRotateStep = (delta) => {
    let newRot = rotation + delta;
    while (newRot > 180) newRot -= 360;
    while (newRot < -180) newRot += 360;
    handleRotationChange(newRot);
  };

  const handleShuffle = () => {
    if (!currentImgObj) return;
    const nextPattern = patternIndex + 1;
    setPatternIndex(nextPattern);
    renderCanvas(
      currentImgObj,
      currentScale,
      cornerRadius,
      rotation,
      nextPattern,
      activeColors,
      cachedPalette
    );
    showToast('Gradient refreshed');
  };

  const handleReset = () => {
    setCurrentImgObj(null);
    setPreviewSrc(null);
    setCachedPalette([]);
    setActiveColors([]);
    setPatternIndex(0);
    setCurrentScale(0.7);
    setCornerRadius(110);
    setRotation(0);
    setActiveControl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Project cleared');
  };

  // Export / Share
  const isMobileExport =
    typeof navigator !== 'undefined' &&
    !!navigator.share &&
    !!navigator.canShare;

  const handleShareOrDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImgObj) {
      showToast('Upload an image first');
      return;
    }

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          showToast('Failed to generate image');
          return;
        }

        const fileName = `story-card-${Date.now()}.jpg`;
        const file = new File([blob], fileName, { type: 'image/jpeg' });

        if (
          isMobileExport &&
          navigator.canShare &&
          navigator.canShare({ files: [file] })
        ) {
          try {
            await navigator.share({
              files: [file],
              title: 'Story Card',
              text: 'Created with Story Card Studio',
            });
            showToast('Shared successfully');
          } catch (err) {
            if (err.name !== 'AbortError') {
              downloadBlob(blob, fileName);
            }
          }
        } else {
          downloadBlob(blob, fileName);
        }
      },
      'image/jpeg',
      1.0
    );
  };

  const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Card saved to gallery');
  };

  return (
    <div className="story-card-page">
      {/* Ambient Animated Glow Circles */}
      <div className="story-ambient-bg" aria-hidden="true">
        <div className="story-ambient-circle story-circle-1" />
        <div className="story-ambient-circle story-circle-2" />
      </div>

      {/* Hidden Real Canvas for Full-Resolution Rendering */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      {/* Header */}
      <header className="story-header">
        <div className="header-left">
          <Link
            to="/"
            className="back-btn"
            title="Back to home"
            aria-label="Back to home"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>

          <div className="header-title-block">
            <div className="header-eyebrow">Creative</div>
            <div className="header-title">
              Story Card Studio{' '}
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  opacity: 0.6,
                  marginLeft: '4px',
                  verticalAlign: 'middle',
                }}
              >
                v2.1.0
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="header-actions">
          <button
            ref={menuBtnRef}
            className="icon-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <svg
              className="menu-icon"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
              stroke="none"
            >
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {/* Context Popover Menu */}
          {menuOpen && (
            <div
              ref={menuRef}
              className="story-floating-menu"
              role="menu"
            >
              <button
                className="menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  fileInputRef.current?.click();
                }}
                role="menuitem"
              >
                <svg
                  style={{ width: '18px', height: '18px' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span>Upload Image</span>
              </button>

              <div className="menu-divider" />

              <button
                className="menu-item"
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                role="menuitem"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isDark ? (
                    <svg
                      style={{ width: '18px', height: '18px' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.07l1.42-1.42m12.72-12.72l1.42-1.42" />
                    </svg>
                  ) : (
                    <svg
                      style={{ width: '18px', height: '18px' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                  <span>Theme</span>
                </div>
              </button>

              <div className="menu-divider" />

              <button
                className="menu-item"
                onClick={() => {
                  setMenuOpen(false);
                  setAboutOpen(true);
                }}
                role="menuitem"
              >
                <svg
                  style={{ width: '18px', height: '18px' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>About</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main>
        <section className="story-workspace">
          <div className="story-canvas-container">
            <div
              className={`story-canvas-preview-wrap ${isDragOver ? 'drag-over' : ''}`}
              onClick={() => {
                if (!currentImgObj) fileInputRef.current?.click();
              }}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Empty state */}
              {!currentImgObj && !isLoading && (
                <div className="story-empty-state">
                  <div className="story-empty-icon">
                    <svg
                      style={{ width: '32px', height: '32px' }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3>Upload an image</h3>
                    <p>Drag and drop or click to start</p>
                  </div>
                </div>
              )}

              {/* Loader */}
              {isLoading && <div className="story-loader" />}

              {/* Generated Image Preview */}
              {previewSrc && (
                <img
                  src={previewSrc}
                  alt="Story Card Preview"
                  className="story-preview-img"
                />
              )}
            </div>

            {/* State 2: Editor Overlay Controls */}
            {currentImgObj && (
              <div className="story-editor-section">
                <div
                  className="story-edit-toolbar"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Scale Toggle Button */}
                  <div className="story-action-item">
                    <button
                      className={`icon-btn ${activeControl === 'scale' ? 'active' : ''}`}
                      onClick={() =>
                        setActiveControl((prev) => (prev === 'scale' ? null : 'scale'))
                      }
                      title="Adjust Scale"
                      aria-label="Adjust Scale"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                        />
                      </svg>
                    </button>
                    <span className="story-action-label">Scale</span>
                  </div>

                  {/* Corner Slider Toggle Button */}
                  <div className="story-action-item">
                    <button
                      className={`icon-btn ${activeControl === 'corners' ? 'active' : ''}`}
                      onClick={() =>
                        setActiveControl((prev) =>
                          prev === 'corners' ? null : 'corners'
                        )
                      }
                      title="Adjust Corners"
                      aria-label="Adjust Corners"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                      >
                        <rect
                          x="5"
                          y="5"
                          width="14"
                          height="14"
                          rx={cornerRadius > 0 ? '4' : '0'}
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                    <span className="story-action-label">Corners</span>
                  </div>

                  {/* Rotate Slider Toggle Button */}
                  <div className="story-action-item">
                    <button
                      className={`icon-btn ${activeControl === 'rotate' ? 'active' : ''}`}
                      onClick={() =>
                        setActiveControl((prev) =>
                          prev === 'rotate' ? null : 'rotate'
                        )
                      }
                      title="Rotate Card"
                      aria-label="Rotate Card"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                    <span className="story-action-label">Rotate</span>
                  </div>

                  {/* Shuffle Pattern Button */}
                  <div className="story-action-item">
                    <button
                      className="icon-btn"
                      onClick={handleShuffle}
                      title="Shuffle Pattern"
                      aria-label="Shuffle Pattern"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                      </svg>
                    </button>
                    <span className="story-action-label">Shuffle</span>
                  </div>

                  {/* Reset Button */}
                  <div className="story-action-item">
                    <button
                      className="icon-btn"
                      onClick={handleReset}
                      title="New Project"
                      aria-label="Reset Project"
                    >
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                    </button>
                    <span className="story-action-label">Reset</span>
                  </div>

                  {/* Main Export / Save Button */}
                  <div className="story-action-item">
                    <button
                      className="primary"
                      onClick={handleShareOrDownload}
                      title={isMobileExport ? 'Share Card' : 'Download Card'}
                      aria-label={isMobileExport ? 'Share Card' : 'Download Card'}
                    >
                      {isMobileExport ? (
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      ) : (
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      )}
                    </button>
                    <span className="story-action-label">
                      {isMobileExport ? 'Share' : 'Save'}
                    </span>
                  </div>
                </div>

                {/* Floating Control Card (Switches dynamically between Scale, Corners, and Rotate) */}
                <div
                  className={`story-control-card ${activeControl ? 'visible' : ''}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {activeControl === 'scale' && (
                    <div className="story-slider-container">
                      <div className="story-slider-header">
                        <span>Scale</span>
                        <span className="story-slider-val">
                          {Math.round(currentScale * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="90"
                        value={Math.round(currentScale * 100)}
                        onChange={(e) => handleScaleChange(Number(e.target.value))}
                      />
                      <div className="story-quick-presets">
                        <button
                          className={`story-preset-chip ${Math.round(currentScale * 100) === 55 ? 'active' : ''}`}
                          onClick={() => handleScaleChange(55)}
                        >
                          55%
                        </button>
                        <button
                          className={`story-preset-chip ${Math.round(currentScale * 100) === 70 ? 'active' : ''}`}
                          onClick={() => handleScaleChange(70)}
                        >
                          70%
                        </button>
                        <button
                          className={`story-preset-chip ${Math.round(currentScale * 100) === 85 ? 'active' : ''}`}
                          onClick={() => handleScaleChange(85)}
                        >
                          85%
                        </button>
                      </div>
                    </div>
                  )}

                  {activeControl === 'corners' && (
                    <div className="story-slider-container">
                      <div className="story-slider-header">
                        <span>Corners</span>
                        <span className="story-slider-val">{cornerRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="180"
                        step="2"
                        value={cornerRadius}
                        onChange={(e) => handleCornerChange(Number(e.target.value))}
                      />
                      <div className="story-quick-presets">
                        <button
                          className={`story-preset-chip ${cornerRadius === 0 ? 'active' : ''}`}
                          onClick={() => handleCornerChange(0)}
                        >
                          Sharp
                        </button>
                        <button
                          className={`story-preset-chip ${cornerRadius === 60 ? 'active' : ''}`}
                          onClick={() => handleCornerChange(60)}
                        >
                          60px
                        </button>
                        <button
                          className={`story-preset-chip ${cornerRadius === 110 ? 'active' : ''}`}
                          onClick={() => handleCornerChange(110)}
                        >
                          110px
                        </button>
                        <button
                          className={`story-preset-chip ${cornerRadius === 160 ? 'active' : ''}`}
                          onClick={() => handleCornerChange(160)}
                        >
                          Round
                        </button>
                      </div>
                    </div>
                  )}

                  {activeControl === 'rotate' && (
                    <div className="story-slider-container">
                      <div className="story-slider-header">
                        <span>Rotation</span>
                        <span className="story-slider-val">{rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={rotation}
                        onChange={(e) =>
                          handleRotationChange(Number(e.target.value))
                        }
                      />
                      <div className="story-quick-presets">
                        <button
                          className="story-preset-chip"
                          onClick={() => handleRotateStep(-90)}
                          title="Rotate 90 degrees counter-clockwise"
                        >
                          ↺ -90°
                        </button>
                        <button
                          className={`story-preset-chip ${rotation === 0 ? 'active' : ''}`}
                          onClick={() => handleRotationChange(0)}
                          title="Reset rotation to 0 degrees"
                        >
                          0°
                        </button>
                        <button
                          className="story-preset-chip"
                          onClick={() => handleRotateStep(90)}
                          title="Rotate 90 degrees clockwise"
                        >
                          +90° ↻
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Toast Notification */}
      <div
        className={`story-toast ${toastMessage ? 'active' : ''}`}
        role="status"
      >
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
        <span>{toastMessage}</span>
      </div>

      {/* Shared About Modal */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
        title="Story Card Studio"
        version="v2.1.0"
        description={
          <>
            A professional design studio for creating{' '}
            <strong>gradient-matched</strong> story backgrounds. Automatically
            samples your images to build a perfectly coordinated aesthetic in
            seconds.
          </>
        }
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        }
        accentGradient="linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)"
        accentColor="#4f46e5"
      />
    </div>
  );
}
