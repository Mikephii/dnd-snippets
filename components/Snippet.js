import React from "react";
import Code from "./Code";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { Droppable, Draggable } from "react-beautiful-dnd";

export default function Snippet({ snippet, snippetDeleted, index }) {
  // const { user } = useUser();
  // console.log(user, snippet);

  const deleteSnippet = async () => {
    const id = snippet.id;
    try {
      await fetch("/api/deleteSnippet", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      snippetDeleted();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Draggable draggableId={snippet.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div
            className="bg-gray-100 p-4 rounded-md my-2"
            style={{
              boxShadow: snapshot.isDragging
                ? "6px 6px 8px rgba(0,0,0,0.6)"
                : "3px 3px 4px rgba(0,0,0,0.5)",
              margin: snapshot.isDragging ? "-15px 15px 15px -15px" : null,
              transition: "margin 0.3s ease",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl text-gray-800 font-bold">
                {snippet.data.name}
              </h2>
              <span className="font-bold text-xs text-blue-900 px-2 py-1 rounded-lg ">
                {snippet.data.language}
              </span>
            </div>
            <p className="text-gray-900 mb-4">{snippet.data.description}</p>
            <Code code={snippet.data.code} />

            <Link href={`/edit/${snippet.id}`}>
              <a className="text-gray-800 mr-2">Edit</a>
            </Link>
            <Link href="/">
              <a onClick={deleteSnippet} className="text-gray-800 mr-2">
                Delete
              </a>
            </Link>
          </div>
        </div>
      )}
    </Draggable>
  );
}
