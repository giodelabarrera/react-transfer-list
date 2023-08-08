import { useState, useCallback, useRef } from "react";
import "./styles.css";

export default function App() {
  return (
    <div>
      <div>
        <TransferList />
      </div>
    </div>
  );
}

function useTransferList({ initialLeftValues, initialRightValues }) {
  const [leftValues, setLeftValues] = useState(initialLeftValues);
  const [rightValues, setRightValues] = useState(initialRightValues);

  const moveFromRightToLeft = useCallback((values) => {
    setRightValues((prevRightValues) =>
      prevRightValues.filter((value) => values.includes(value) === false)
    );
    setLeftValues((prevLeftValues) => [...prevLeftValues, ...values]);
  }, []);

  const moveFromLeftToRight = useCallback((values) => {
    setLeftValues((prevLeftValues) =>
      prevLeftValues.filter((value) => values.includes(value) === false)
    );
    setRightValues((prevRightValues) => [...prevRightValues, ...values]);
  }, []);

  return {
    leftValues,
    rightValues,
    moveFromRightToLeft,
    moveFromLeftToRight
  };
}

function TransferList() {
  const leftFormRef = useRef();
  const rightFormRef = useRef();

  const {
    leftValues,
    rightValues,
    moveFromRightToLeft,
    moveFromLeftToRight
  } = useTransferList({
    initialLeftValues: ["HTML", "JavaScript", "CSS", "TypeScript"],
    initialRightValues: ["React", "Angular", "Vue", "Svelte"]
  });

  const handleMoveAllRightToLeft = () => {
    moveFromRightToLeft(rightValues);
  };

  const handleMoveSelectedRightToLeft = () => {
    const form = rightFormRef.current;
    const values = new FormData(form).getAll("item");
    moveFromRightToLeft(values);
  };

  const handleMoveSelectedLeftToRight = () => {
    const form = leftFormRef.current;
    const values = new FormData(form).getAll("item");
    moveFromLeftToRight(values);
  };

  const handleMoveAllLeftToRight = () => {
    moveFromLeftToRight(leftValues);
  };

  return (
    <section className="transfer-list">
      <div className="transfer-list__box">
        <form ref={leftFormRef}>
          <List items={leftValues}>{(item) => <Item text={item} />}</List>
        </form>
      </div>
      <div className="btn-group transfer-list__box">
        <div>
          <button type="button" onClick={handleMoveAllRightToLeft}>
            {"<<"}
          </button>
        </div>
        <div>
          <button type="button" onClick={handleMoveSelectedRightToLeft}>
            {"<"}
          </button>
        </div>
        <div>
          <button type="button" onClick={handleMoveSelectedLeftToRight}>
            {">"}
          </button>
        </div>
        <div>
          <button type="button" onClick={handleMoveAllLeftToRight}>
            {">>"}
          </button>
        </div>
      </div>
      <div className="transfer-list__box">
        <form ref={rightFormRef}>
          <List items={rightValues}>{(item) => <Item text={item} />}</List>
        </form>
      </div>
    </section>
  );
}

function List({ items, children }) {
  return (
    <ul className="list">
      {items.map((item) => (
        <li key={item}>{children(item)}</li>
      ))}
    </ul>
  );
}

function Item({ text, onChange }) {
  return (
    <label>
      <input name="item" type="checkbox" onChange={onChange} value={text} />
      {text}
    </label>
  );
}
