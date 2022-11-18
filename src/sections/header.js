import logo from "../assets/logo.png";

import "./Header.scss";

const Header = () => {
  return (
    <div className="header">
      <img className="logo" src={logo} alt="logo" />
      <ul className="operation-container">
        <li>服務介紹</li>
        <li>簽署文件</li>
        <li>註冊</li>
        <li>登入</li>
      </ul>
    </div>
  );
};

export default Header;
