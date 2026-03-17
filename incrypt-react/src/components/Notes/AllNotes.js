import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import NoteItems from "./NoteItems";
import { FiFilePlus } from "react-icons/fi";
import Errors from "../Errors";
import Card from "../ui/Card";
import Button from "../ui/Button";

const NOTES_CACHE_KEY = "incrypt-notes-cache";

const getNoteDateValue = (note) => {
  return (
    note?.createdAt ||
    note?.createdDate ||
    note?.updatedAt ||
    note?.timestamp ||
    null
  );
};

const normalizeAndSortNotes = (notes) => {
  return notes
    .map((note) => ({
      ...note,
      noteDateValue: note?.noteDateValue || getNoteDateValue(note),
    }))
    .sort(
      (a, b) =>
        new Date(b.noteDateValue || 0).getTime() -
        new Date(a.noteDateValue || 0).getTime()
    );
};

const getCachedNotes = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const cachedNotes = window.sessionStorage.getItem(NOTES_CACHE_KEY);
    return cachedNotes ? normalizeAndSortNotes(JSON.parse(cachedNotes)) : [];
  } catch (error) {
    return [];
  }
};

const AllNotes = () => {
  const [notes, setNotes] = useState(getCachedNotes);
  const [loading, setLoading] = useState(() => getCachedNotes().length === 0);
  const [error, setError] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/notes");

      const parsedNotes = normalizeAndSortNotes(
        response.data.map((note) => ({
          ...note,
          parsedContent: JSON.parse(note.content).content,
        }))
      );

      setNotes(parsedNotes);
      setError(false);

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          NOTES_CACHE_KEY,
          JSON.stringify(parsedNotes)
        );
      }
    } catch (error) {
      setError(error.response.data.message);
      console.error("Error fetching notes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //calling the function here to fetch all notes
    fetchNotes();
  }, []);

  //to show an errors
  if (error) {
    return <Errors message={error} />;
  }

  const showSkeleton = loading && notes.length === 0;
  const showRefreshingState = loading && notes.length > 0;

  return (
    <div className="min-h-[calc(100vh-74px)] bg-bg-subtle py-6 sm:py-8">
      <div className="mx-auto w-[92%] max-w-6xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-h1 font-semibold text-text-main">My notes</h1>
          <Link to="/create-note">
            <Button
              size="md"
              className="inline-flex items-center gap-2 rounded-full"
            >
              <FiFilePlus className="text-lg" />
              <span>Create note</span>
            </Button>
          </Link>
        </div>

        {showSkeleton ? (
          <Card className="flex min-h-[18rem] flex-col justify-center gap-5 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="space-y-3 rounded-3xl border border-border-subtle bg-bg-surface p-5"
                >
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded-full bg-bg-muted" />
                  <div className="h-3 w-5/6 animate-pulse rounded-full bg-bg-muted" />
                  <div className="h-3 w-4/6 animate-pulse rounded-full bg-bg-muted" />
                </div>
              ))}
            </div>
            <span className="text-body text-text-muted">Loading your notes...</span>
          </Card>
        ) : (
          <div className="relative min-h-[18rem]">
            {showRefreshingState && (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
                <div className="rounded-full border border-border-subtle bg-bg-surface/95 px-4 py-2 text-sm text-text-muted shadow-sm backdrop-blur">
                  Refreshing notes...
                </div>
              </div>
            )}
            {notes && notes?.length === 0 ? (
              <Card className="flex min-h-[18rem] flex-col items-center justify-center text-center">
                <h2 className="mb-3 text-h2 font-semibold text-text-main">
                  No notes yet
                </h2>
                <p className="mb-6 max-w-md text-body text-text-muted">
                  Create your first note to capture secure, encrypted
                  information in Incrypt.
                </p>
                <Link to="/create-note">
                  <Button
                    size="md"
                    className="inline-flex items-center gap-2 rounded-full"
                  >
                    <FiFilePlus className="text-lg" />
                    <span>Create note</span>
                  </Button>
                </Link>
              </Card>
            ) : (
              <div
                className={
                  showRefreshingState
                    ? "grid grid-cols-1 gap-5 pt-4 opacity-70 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid grid-cols-1 gap-5 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }
              >
                {notes.map((item, index) => (
                  <NoteItems
                    key={item.id}
                    {...item}
                    id={item.id}
                    animationIndex={index}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNotes;
