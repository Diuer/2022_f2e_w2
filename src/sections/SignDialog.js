import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import cn from "clsx";

import {
  // Document,
  // Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { pdfjs } from "react-pdf/dist/esm/entry.webpack5";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import btnClose from "../assets/btn-close.png";

import Steps from "../components/Steps";

import "./SignDialog.scss";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#e4e4e4",
  },
  section: {
    display: "flex",
    height: "100%",
    width: "100%",
    position: "relative",
  },
});

const SignDialog = ({ onClose, onUpload }) => {
  const refCanvas = useRef();
  const [step, setStep] = useState(0);
  const [isPainting, setIsPainting] = useState(false);
  const [signName, setSignName] = useState("");

  const onPointerDown = (e) => {
    // e.preventDefault();
    setIsPainting(true);
  };

  const onPointerUp = (e) => {
    setIsPainting(false);
    refCanvas.current.getContext("2d").beginPath();
  };

  const onPointerLeave = (e) => {
    setIsPainting(false);
    refCanvas.current.getContext("2d").beginPath();
  };

  const onPointerMove = (e) => {
    if (!isPainting) return;

    const { x, y } = getPaintPosition(e);

    refCanvas.current.getContext("2d").lineTo(x, y);
    refCanvas.current.getContext("2d").stroke();
  };

  // 取得滑鼠 / 手指在畫布上的位置
  const getPaintPosition = (e) => {
    const canvasSize = refCanvas.current.getBoundingClientRect();

    if (e.type === "mousemove") {
      return {
        x: e.clientX - canvasSize.left,
        y: e.clientY - canvasSize.top,
      };
    } else {
      return {
        x: e.touches[0].clientX - canvasSize.left,
        y: e.touches[0].clientY - canvasSize.top,
      };
    }
  };

  // 重新設定畫布
  const reset = () => {
    refCanvas.current
      .getContext("2d")
      .clearRect(0, 0, refCanvas.current.width, refCanvas.current.height);
  };

  const saveSign = () => {
    // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
    const newImg = refCanvas.current.toDataURL("image/png");
    localStorage.setItem("signImage", newImg);
    localStorage.setItem("signName", signName);
  };

  return (
    <>
      <div className="mask"></div>
      <div className={cn("sign-dialog", { "is-rotate-logo": step === 1.1 })}>
        <img
          className="btn-close"
          src={btnClose}
          alt="btn-close"
          onClick={onClose}
        />
        {step === 0 && (
          <>
            <Steps nowStep={step} />
            <div className="btn fake-btn">
              <label htmlFor="select-pdf">
                <input
                  type="file"
                  id="select-pdf"
                  accept=".pdf"
                  onChange={(e) => {
                    onUpload(e);
                    setStep(1);
                  }}
                />
                上傳PDF檔案
              </label>
              <p className="btn-text">從你的裝置直接上傳PDF檔案。</p>
            </div>
            <div className="btn fake-btn">
              <label htmlFor="select-pdf">
                <input type="file" id="select-pdf" />
                拍照上傳文件
              </label>
              <p className="btn-text">使用裝置相機將實體文件拍下後上傳。</p>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <Steps nowStep={step} />
            <div className="btn fake-btn">
              <button
                onClick={() => {
                  setStep(1.1);
                }}
              >
                繪製新的簽名檔
              </button>
              <p className="btn-text">繪製新的簽名檔案</p>
            </div>
            <div className="btn fake-btn">
              <label htmlFor="select-pdf">
                <input
                  type="file"
                  id="select-pdf"
                  accept=".pdf"
                  onChange={(e) => {
                    onUpload(e);
                    setStep(2);
                  }}
                />
                上傳現有簽名檔
              </label>
              <p className="btn-text">從你的裝置直接上傳簽名檔案。</p>
            </div>
          </>
        )}
        {step === 1.1 && (
          <>
            <div className="dialog-header">新增新的簽名檔</div>
            <div className="sign-form">
              <label className="">簽名檔名稱</label>
              <input
                className=""
                placeholder="請輸入此簽名檔名稱"
                value={signName}
                onChange={(e) => {
                  setSignName(e.target.value);
                }}
              />
              <div className="sign-board">
                <div className="sign-board-tab-container">
                  <span className="sign-board-tab active">繪製簽名檔</span>
                  <span className="sign-board-tab">上傳簽名檔</span>
                </div>
                <div className="sign-board-content">
                  <canvas
                    className="create-sign-canvas"
                    ref={refCanvas}
                    onMouseDown={onPointerDown}
                    onTouchStart={onPointerDown}
                    onMouseUp={onPointerUp}
                    onTouchEnd={onPointerUp}
                    onMouseLeave={onPointerLeave}
                    onTouchCancel={onPointerLeave}
                    onMouseMove={onPointerMove}
                    onTouchMove={onPointerMove}
                    width="790"
                    height="391"
                  ></canvas>
                  <div className="button-container">
                    <button className="disabled">重作</button>
                    <button onClick={reset}>刪除</button>
                  </div>
                </div>
              </div>
              <div className="btn fake-btn">
                <button
                  className={cn({ disabled: !signName })}
                  onClick={() => {
                    saveSign();
                    onClose();
                  }}
                >
                  確認新增簽名檔
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SignDialog;
