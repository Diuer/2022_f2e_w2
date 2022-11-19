import { useState } from "react";
import "./App.scss";

import Header from "./sections/header";
import Home from "./sections/Home";
import SignDialog from "./sections/SignDialog";

function App() {
  const [isShowDialog, setIsShowDialog] = useState(false);

  const openDialog = () => {
    setIsShowDialog(true);
  };

  const closeDialog = () => {
    setIsShowDialog(false);
  };

  return (
    <div className="App">
      <Header onGoSign={openDialog} />
      <Home onGoSign={openDialog} />
      {isShowDialog && <SignDialog onClose={closeDialog} />}
    </div>
  );
}

export default App;
