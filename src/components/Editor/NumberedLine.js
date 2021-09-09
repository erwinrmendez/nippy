// Line component to display line numbers in code editor
// Example taken from: https://gist.github.com/lixiaoyan/79b5740f213b8526d967682f6cd329c0

import { EditorBlock } from "draft-js";
import styled from "styled-components";

const LineDiv = styled.div`
  position: relative;
  background: #ffffff;

  &.active {
    background: #f3f3f3;
  }

  &::before {
    content: attr(data-line-number);
    position: absolute;
    left: 5px;
    top: 1px;
    opacity: 0.5;
    font-size: 12px;
  }
`;

const LineTextDiv = styled.div`
  margin-left: 2em;
`;

const NumberedLine = (props) => {
  const { block, contentState } = props;
  const { currentLine } = props.blockProps;
  const lineNumber =
    contentState
      .getBlockMap()
      .toList()
      .findIndex((item) => item.key === block.key) + 1;

  return (
    <LineDiv
      data-line-number={lineNumber}
      // currentLine={currentLine === lineNumber}
      className={currentLine === lineNumber && "active"}
    >
      <LineTextDiv>
        <EditorBlock {...props} />
      </LineTextDiv>
    </LineDiv>
  );
};

export default NumberedLine;
