import logoLeft from "../assets/logo-white-1.png";
import logoRight from "../assets/logo-white-2.png";

import "./Home.scss";

const Home = () => {
  return (
    <div className="home">
      <img className="logo-left" src={logoLeft} alt="logo-left" />
      <img className="logo-right" src={logoRight} alt="logo-right" />
      <h1 className="slogan">
        隨時隨地都能簽，
        <br />
        SIGNooo幫你省下大筆時間！
      </h1>
      <div className="step-container">
        <span className="step-item">上傳文件</span>
        <hr />
        <span className="step-item">建立簽名檔</span>
        <hr />
        <span className="step-item">簽署文件</span>
      </div>
      <div className="ready-go">
        <p className="ready-text">只需三步驟，立即簽署您的文件！</p>
        <button>立即簽署文件</button>
      </div>
    </div>
  );
};

export default Home;
