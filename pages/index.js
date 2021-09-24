import Head from "next/head";
import Snippet from "../components/Snippet";
import useSWR from "swr";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function Home() {
  const { data: snippets, mutate } = useSWR("/api/snippets");
  const [layoutId, setLayoutId] = useState(null);
  const [layout, setLayout] = useState(null);

  useEffect(() => {
    const fetchLayout = async () => {
      let fetchedLayout = await fetch("/api/getLayout/guest", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchedLayout = await fetchedLayout.json();
      console.log(fetchedLayout);
      setLayout(fetchedLayout.data.layout);
      setLayoutId(fetchedLayout.id);
    };
    fetchLayout();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    // Do nothing if item is dropped outside the list
    if (!destination) {
      return;
    }

    // Do nothing if the item is dropped into the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newLayout = layout;

    // Remove the snippet from layout array using its source index
    newLayout.splice(source.index, 1);

    // Insert the snippet ID into its new destination index
    newLayout.splice(destination.index, 0, draggableId);

    setLayout(newLayout);

    //push the new layout to database
    try {
      await fetch("/api/updateLayout", {
        method: "PUT",
        body: JSON.stringify({ id: layoutId, layout: newLayout }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <Head>
          <title>Snippets</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="">
          <Header
            title="Drag and Drop Code Snippets"
            subtitle="create a new snippet and re-arrange at will! all changes are persisted to database"
          />
          <Droppable droppableId={"snippets"} type="snippets">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  backgroundColor: snapshot.isDraggingOver
                    ? "rgba(0,0,0,0.2)"
                    : null,
                  boxShadow: snapshot.isDraggingOver
                    ? "inset 2px 2px 4px rgba(0,0,0,0.2)"
                    : null,
                  borderRadius: 10,
                  padding: 10,
                  transition: "background-color 0.1s ease-out",
                  trasition: "box-shadow 0.1s ease-out",
                }}
              >
                {snippets &&
                  layout &&
                  layout.map((id, index) => {
                    //find snippet matches ID
                    const snippet = snippets.find((snippet) => {
                      return id == snippet.id;
                    });

                    //returns this snippet
                    return snippet ? (
                      <Snippet
                        index={index}
                        key={snippet.id}
                        snippet={snippet}
                        snippetDeleted={mutate}
                      />
                    ) : null;
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </main>
      </div>
    </DragDropContext>
  );
}
