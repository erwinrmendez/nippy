import { useContext, useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { NotesContext } from "../../contexts/NotesContext";
import { GlobalContext } from "../../contexts/GlobalContext";
import { TabName } from "./TabName";
import RichTextEditor from "../Editor/RichTextEditor";
import { ReactComponent as Left } from "../../assets/left.svg";
import { ReactComponent as Right } from "../../assets/right.svg";
import { updateActiveTab } from "../../utils/helpers";

const Container = styled.div`
  margin-top: 1em;
`;

const Empty = styled.div`
  background: var(--color-background);
  color: var(--color-dark-gray);
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 360px;
  border-radius: 5px;
`;

const TabHeader = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 0.5em 0.5em 0;
  background: var(--color-background);
  border-radius: 5px 5px 0 0;
  display: flex;

  > .arrow {
    width: 12px;
    height: 27px;
    background: var(--color-background);
    position: absolute;
    text-align: center;
    cursor: pointer;
    display: ${(props) => (props.isScrollable ? "inline-block" : "none")};
    border: 1px solid var(--color-light-gray);

    &:hover {
      background: var(--color-light-gray);
    }

    &:first-child {
      left: 0.5em;
    }

    &:last-child {
      right: 0.5em;
    }

    > svg {
      width: 10px;
      height: 10px;
      margin: 8px 1px;

      & path {
        fill: var(--color-dark-gray);
      }
    }
  }
`;

const TabHeaderSep = styled.div`
  margin-top: -1px;
  height: 10px;
  background: #ffffff;
  border-top: 1px solid var(--color-light-gray);
  border-bottom: 1px solid var(--color-light-gray);
`;

const TabBody = styled.div`
  background: #fff;
  border-radius: 0 0 5px 5px;
  height: 300px;
  overflow: auto;
  padding-bottom: 1em;

  & .DraftEditor-root {
    font-family: "Source Code Pro", monospace;
    font-size: 14px;
    outline: none;
    border: none;
    resize: none;
    flex: 1;
    border-radius: 0 5px 5px 0;
    white-space: pre-wrap;
  }
`;

const TabsContainer = () => {
  const { notes, handleDelete, reorderNotes } = useContext(NotesContext);
  const { activeTab, setActiveTab } = useContext(GlobalContext);

  const visibleNotes = notes.filter((note) => note.show === true);
  const [isEmpty, setIsEmpty] = useState(visibleNotes.length === 0);
  const [isScrollable, setIsScrollable] = useState(false);

  // Refs
  const headerRef = useRef(null);
  const intervalRef = useRef(null);

  // Scroll event
  // example adapted from https://dirask.com/posts/React-mouse-button-press-and-hold-example-pzrAap
  // <--
  useEffect(() => {
    return () => stopScroll();
  }, []);

  const onScrollRight = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      headerRef.current.scrollLeft += 5;
    }, 10);
  };

  const onScrollLeft = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      headerRef.current.scrollLeft -= 5;
    }, 10);
  };

  const stopScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  // --/>

  // Scroll active tab into view
  useEffect(() => {
    if (!isEmpty) {
      setTimeout(() => {
        headerRef.current.querySelector(".active").scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    }

    // eslint-disable-next-line
  }, [activeTab]);

  // Set isScrollable to true when scroll bar is visible
  useEffect(() => {
    if (headerRef.current) {
      const el = headerRef.current;
      setIsScrollable(el.offsetWidth < el.scrollWidth);
    }
  }, [visibleNotes]);

  // Set isEmpty state
  useEffect(() => {
    setIsEmpty(visibleNotes.length === 0);
  }, [visibleNotes]);

  // Handle click on tab
  const handleClick = (name) => {
    updateActiveTab(name);
    setActiveTab(name);
  };

  // Delete note
  const deleteNote = async (name) => {
    let idx = visibleNotes.map((e) => e.name).indexOf(name);
    idx = idx === 0 ? 1 : idx - 1;

    await handleDelete(name);
    if ((visibleNotes.length > 1) & (name === activeTab)) {
      updateActiveTab(visibleNotes[idx].name);
      setActiveTab(visibleNotes[idx].name);
    }
  };

  // Drag and drop reorder tabs
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const srcIndex = result.source.index;
    const destIndex = result.destination.index;
    reorderNotes(srcIndex, destIndex);
  };

  return (
    <Container>
      {isEmpty ? (
        <Empty>Start adding your notes and snippets...</Empty>
      ) : (
        <>
          <TabHeader ref={headerRef} isScrollable={isScrollable}>
            <span
              className="arrow"
              onMouseDown={onScrollLeft}
              onMouseUp={stopScroll}
              onMouseLeave={stopScroll}
            >
              <Left />
            </span>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable" direction="horizontal">
                {(provided, _) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {notes
                      .filter((note) => note.show === true)
                      .map((note, index) => (
                        <Draggable
                          key={index}
                          draggableId={"tab-" + index}
                          index={index}
                        >
                          {(provided, _) => (
                            <TabName
                              provided={provided}
                              note={note}
                              current={note.name === activeTab ? true : false}
                              handleClick={handleClick}
                              deleteNote={deleteNote}
                            />
                          )}
                        </Draggable>
                      ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <span
              className="arrow"
              onMouseDown={onScrollRight}
              onMouseUp={stopScroll}
              onMouseLeave={stopScroll}
            >
              <Right />
            </span>
          </TabHeader>
          <TabHeaderSep />
          <TabBody>
            {notes
              .filter((note) => note.name === activeTab)
              .map((note) => (
                <RichTextEditor key={note.name} note={note} />
              ))}
          </TabBody>
        </>
      )}
    </Container>
  );
};

export default TabsContainer;
