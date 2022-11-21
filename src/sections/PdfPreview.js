import { useEffect, useRef, useState, useMemo, createRef } from "react";
import { pdfjs } from "react-pdf/dist/esm/entry.webpack5";

import dragIcon from "../assets/drag-icon.png";
import editIcon from "../assets/edit-icon.png";

import "./PdfPreview.scss";

function PdfPreview({ file }) {
  const refPdfPreview = useRef();
  const refPdfCanvas = useMemo(
    () =>
      Array(file.maxPage)
        .fill(0)
        .map((i) => createRef()),
    [file.maxPage]
  );
  const [page, setPage] = useState(0);
  const [signInfo, setSignInfo] = useState({
    signName: localStorage.getItem("signName"),
    signImage: localStorage.getItem("signImage"),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderPDF = async () => {
    const viewport = file.pdfPage.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    file.pdfPage.render({
      canvasContext: canvas.getContext("2d"),
      viewport: viewport,
    });
    refPdfPreview.current.innerHTML = "";
    refPdfPreview.current.appendChild(canvas);

    for (let index = 0; index < file.maxPage; index++) {
      refPdfCanvas[index].current.innerHTML = "";
      const perPdfPage = await file.pdfDoc.getPage(index + 1);
      const viewport = perPdfPage.getViewport({ scale: 0.3 });
      const perCanvas = document.createElement("canvas");
      perCanvas.width = viewport.width;
      perCanvas.height = viewport.height;
      perPdfPage.render({
        canvasContext: perCanvas.getContext("2d"),
        viewport: viewport,
      });
      refPdfCanvas[index].current.appendChild(perCanvas);
    }
  };

  useEffect(() => {
    if (!!file.pdfDoc && !!file.pdfPage) {
      renderPDF(file);
    }
  }, [file, renderPDF]);

  const handlePage = async (index) => {
    console.log(index + 1);
    const perPdfPage = await file.pdfDoc.getPage(index + 1);
    const viewport = perPdfPage.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    perPdfPage.render({
      canvasContext: canvas.getContext("2d"),
      viewport: viewport,
    });
    refPdfPreview.current.innerHTML = "";
    refPdfPreview.current.appendChild(canvas);
  };

  return (
    <div className="pdf-preview">
      <div className="pdf-container">
        <div className="pdf-info">
          <input
            className="pdf-info-name"
            defaultValue={file.info?.name}
            readOnly
          />
          <input
            className="pdf-info-now-page"
            defaultValue={page + 1}
            readOnly
          />
          /{file.maxPage}
        </div>
        <div className="pdf-content">
          <div className="pdf-side-bar">
            {Array(file.maxPage)
              .fill("")
              .map((item, index) => (
                <div
                  ref={refPdfCanvas[index]}
                  className={`pdf-side-canvas-${index + 1}`}
                  key={index}
                  onClick={() => handlePage(index)}
                ></div>
              ))}
          </div>
          <div className="pdf-preview-canvas" ref={refPdfPreview}></div>
        </div>
      </div>
      <div className="sign-container">
        <h1>簽署文件</h1>
        <h2 className="title">您的簽名</h2>
        <div className="content sign-content">
          {signInfo.signName && signInfo.signImage && (
            <>
              <img className="drag-icon" src={dragIcon} alt="drag-icon" />
              <img
                className="sign-image"
                src={signInfo.signImage}
                alt="sign-saved"
              />
              <img className="edit-icon" src={editIcon} alt="edit-icon" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PdfPreview;
