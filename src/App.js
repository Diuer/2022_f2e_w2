import { useRef, useState, useCallback } from "react";
import { pdfjs } from "react-pdf/dist/esm/entry.webpack5";

import "./App.scss";

import Header from "./sections/header";
import Home from "./sections/Home";
import SignDialog from "./sections/SignDialog";
import PdfPreview from "./sections/PdfPreview";

function App() {
  const [isShowDialog, setIsShowDialog] = useState(true);
  const [pdf, setPdf] = useState();

  const openDialog = () => {
    setIsShowDialog(true);
  };

  const closeDialog = () => {
    setIsShowDialog(false);
  };

  const uploadPdf = useCallback((e) => {
    if (e.target.files[0] === undefined) return;

    try {
      const [file] = e.target.files;
      const fileReader = new FileReader();
      console.log(file);
      fileReader.readAsArrayBuffer(file);
      fileReader.addEventListener("load", async () => {
        // 獲取readAsArrayBuffer產生的結果，並用來渲染PDF
        const typedarray = new Uint8Array(fileReader.result);

        const pdfDoc = await pdfjs.getDocument(typedarray).promise;
        const pdfPage = await pdfDoc.getPage(1);
        setPdf({
          info: file,
          dataBuffer: typedarray,
          maxPage: pdfDoc.numPages,
          pdfDoc,
          pdfPage,
        });
      });
    } catch (e) {
      setPdf();
    }
  }, []);

  return (
    <div className="App">
      <Header onGoSign={openDialog} />
      {!pdf && <Home onGoSign={openDialog} />}
      {pdf && <PdfPreview file={pdf} />}
      {isShowDialog && (
        <SignDialog onClose={closeDialog} onUpload={uploadPdf} />
      )}
    </div>
  );
}

export default App;
