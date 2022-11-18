import cn from "clsx";

import "./Steps.scss";

const Steps = ({ nowStep }) => {
  return (
    <div className="step-container">
      <span className={cn("step-item", { active: nowStep === 0 })}>
        上傳文件
      </span>
      <hr />
      <span className={cn("step-item", { active: nowStep === 1 })}>
        建立簽名檔
      </span>
      <hr />
      <span className={cn("step-item", { active: nowStep === 2 })}>
        簽署文件
      </span>
    </div>
  );
};

export default Steps;
