import { useState } from "react";

import btnClose from "../assets/btn-close.png";

import Steps from "../components/Steps";

import "./SignDialog.scss";

const SignDialog = ({ onClose }) => {
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
        <div className="btn fake-btn">
          <label htmlFor="select-pdf">
            <input type="file" id="select-pdf" />
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
      </div>
    </>
  );
};

export default SignDialog;
