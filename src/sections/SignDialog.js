import { useState } from "react";

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
  const [step, setStep] = useState(0);

  return (
    <>
      <div className="mask"></div>
      <div className="sign-dialog">
        <img
          className="btn-close"
          src={btnClose}
          alt="btn-close"
          onClick={onClose}
        />
        <Steps nowStep={step} />
        {step === 0 && (
          <>
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
            <div className="btn fake-btn">
              <label htmlFor="select-pdf">
                <input type="file" id="select-pdf" />
                繪製新的簽名檔
              </label>
              <p className="btn-text">繪製新的簽名檔案</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SignDialog;
