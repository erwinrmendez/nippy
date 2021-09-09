import { useContext, useEffect, useRef, useState } from "react";
import {
  EditorState,
  RichUtils,
  CompositeDecorator,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import Editor from "@draft-js-plugins/editor";
import createLinkDetectionPlugin from "draft-js-link-detection-plugin";
import { NotesContext } from "../../contexts/NotesContext";
import NumberedLine from "./NumberedLine";
import Link from "./Link";
import "../../../node_modules/draft-js/dist/Draft.css";

// Add puglin for links (@draft-js-plugins/linkify did not work, so I am using draft-js-link-detection-plugin that seems to work just fine).
const linkDetectionPlugin = createLinkDetectionPlugin();
const plugins = [linkDetectionPlugin];

// Link strategy
const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

// Link decorator
const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

const RichTextEditor = ({ note }) => {
  const { handleChangeContent } = useContext(NotesContext);
  const [editorState, setEditorState] = useState(() =>
    note.content
      ? EditorState.createWithContent(convertFromRaw(note.content), decorator)
      : EditorState.createEmpty(decorator)
  );

  // Assign ref to editor
  const editor = useRef(null);
  const editorContainer = useRef(null);

  // Assign focus to editor
  const focusEditor = () => {
    editor.current.focus();
  };

  // update content when editorState changes (autosave)
  useEffect(() => {
    handleChangeContent({
      name: note.name,
      content: convertToRaw(editorState.getCurrentContent()),
    });

    // eslint-disable-next-line
  }, [editorState]);

  // Get current line number
  const currentBlockKey = editorState.getSelection().getStartKey();
  const currentLine =
    editorState
      .getCurrentContent()
      .getBlockMap()
      .keySeq()
      .findIndex((k) => k === currentBlockKey) + 1;

  // Force re-render by updating editorState (use when cursor changes position to change line background)
  useEffect(() => {
    const forcedUpdate = EditorState.forceSelection(
      editorState,
      editorState.getSelection()
    );
    setEditorState(forcedUpdate);

    if (currentLine) {
      setTimeout(() => {
        editorContainer.current.querySelector(".active").scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 200);
    }

    // eslint-disable-next-line
  }, [currentLine]);

  // Custom block for Numbered Lines
  const blockRendererFn = () => ({
    component: NumberedLine,
    props: {
      currentLine,
    },
  });

  // Handle key commands
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  return (
    <div onClick={focusEditor} ref={editorContainer}>
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        blockRendererFn={blockRendererFn}
        handleKeyCommand={handleKeyCommand}
        plugins={plugins}
      />
    </div>
  );
};

export default RichTextEditor;
