import logoLeft from "../assets/logo-white-1.png";
import logoRight from "../assets/logo-white-2.png";

import Steps from "../components/Steps";

import "./Home.scss";

const Home = ({ onGoSign }) => {
  return (
    <div className="home">
      <img className="logo-left" src={logoLeft} alt="logo-left" />
      <img className="logo-right" src={logoRight} alt="logo-right" />
      <h1 className="slogan">
        隨時隨地都能簽，
        <br />
        SIGNooo幫你省下大筆時間！
      </h1>
      <Steps />
      <div className="ready-go">
        <p className="ready-text">只需三步驟，立即簽署您的文件！</p>
        <button onClick={onGoSign}>立即簽署文件</button>
      </div>
    </div>
  );
};

export default Home;
