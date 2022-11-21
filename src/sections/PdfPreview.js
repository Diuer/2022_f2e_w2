import { useEffect, useRef, useState, useMemo, createRef } from "react";
import { pdfjs } from "react-pdf/dist/esm/entry.webpack5";
import { fabric } from "fabric";
import { jsPDF } from "jspdf";

import dragIcon from "../assets/drag-icon.png";
import editIcon from "../assets/edit-icon.png";

import "./PdfPreview.scss";

const Base64Prefix = "data:application/pdf;base64,";

function PdfPreview({ file }) {
  const refPdfPreview = useRef();
  const doc = new jsPDF();
  const canvas = new fabric.Canvas(document.querySelector("#canvas"));
  const refPdfCanvas = useMemo(
    () =>
      Array(file.maxPage)
        .fill(0)
        .map((i) => createRef()),
    [file.maxPage]
  );
  const [page, setPage] = useState(0);
  const [signInfo] = useState({
    signName: localStorage.getItem("signName"),
    signImage: localStorage.getItem("signImage"),
  });

  const renderCanvas = async (printPage) => {
    canvas.requestRenderAll();
    const pdfData = await printPDF(file.info, printPage);
    const pdfImage = await pdfToImage(pdfData);

    // 透過比例設定 canvas 尺寸
    canvas.setWidth(pdfImage.width / window.devicePixelRatio);
    canvas.setHeight(pdfImage.height / window.devicePixelRatio);

    // 將 PDF 畫面設定為背景
    canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
  };

  useEffect(() => {
    if (!!file.pdfDoc && !!file.pdfPage) {
      renderCanvas();

      const getSide = async () => {
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
      getSide();
    }
  }, [file, renderCanvas]);

  const readBlob = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", reject);
      reader.readAsDataURL(blob);
    });
  };
  const printPDF = async (pdfData, printPage = 1) => {
    pdfData = await readBlob(pdfData);

    const data = atob(pdfData.substring(Base64Prefix.length));

    const pdfDoc = await pdfjs.getDocument({ data }).promise;
    const pdfPage = await pdfDoc.getPage(printPage);

    const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport,
    };
    const renderTask = pdfPage.render(renderContext);

    return renderTask.promise.then(() => canvas);
  };

  const pdfToImage = async (pdfData) => {
    const scale = 1 / window.devicePixelRatio;

    return new fabric.Image(pdfData, {
      id: "renderPDF",
      scaleX: scale,
      scaleY: scale,
    });
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
                  onClick={async () => {
                    renderCanvas(index + 1);
                  }}
                ></div>
              ))}
          </div>
          <canvas
            id="canvas"
            className="pdf-preview-canvas"
            ref={refPdfPreview}
          ></canvas>
        </div>
      </div>
      <div className="sign-container">
        <h1>簽署文件</h1>
        <h2 className="title">您的簽名</h2>
        <div className="content sign-content">
          {signInfo.signName && signInfo.signImage && (
            <>
              <img
                className="drag-icon"
                src={dragIcon}
                alt="drag-icon"
                onClick={() => {
                  fabric.Image.fromURL(signInfo.signImage, (image) => {
                    image.top = 0;
                    image.scaleX = 1;
                    image.scaleY = 1;
                    canvas.add(image);
                  });
                }}
              />
              <img
                className="sign-image"
                src={signInfo.signImage}
                alt="sign-saved"
              />
              <img className="edit-icon" src={editIcon} alt="edit-icon" />
            </>
          )}
        </div>
        <button
          className="save-sign-document"
          onClick={() => {
            const image = canvas.toDataURL("image/png");
            const width = doc.internal.pageSize.width;
            const height = doc.internal.pageSize.height;
            doc.addImage(image, "png", 0, 0, width, height);
            doc.save("document-signed.pdf");
          }}
        >
          確定簽署此文件
        </button>
      </div>
    </div>
  );
}

export default PdfPreview;
