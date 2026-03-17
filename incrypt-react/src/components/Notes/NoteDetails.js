import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import Errors from "../Errors";
import toast from "react-hot-toast";
import Modals from "../PopModal";
import Card from "../ui/Card";
import Button from "../ui/Button";

const NoteDetails = () => {
  const { id } = useParams();
  //open modal for deleteing a note
  const [modalOpen, setModalOpen] = useState(false);

  const [note, setNote] = useState(null);

  const [editorContent, setEditorContent] = useState(note?.parsedContent);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noteEditLoader, setNoteEditLoader] = useState(false);
  const [editEnable, setEditEnable] = useState(false);
  const navigate = useNavigate();

  const fetchNoteDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/notes");
      const foundNote = response.data.find((n) => n.id.toString() === id);
      if (foundNote) {
        foundNote.parsedContent = JSON.parse(foundNote.content).content; // Parse content
        setNote(foundNote);
      } else {
        setError("Invalid Note");
      }
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("Error fetching note details", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchNoteDetails();
    }
  }, [id, fetchNoteDetails]);

  useEffect(() => {
    if (note?.parsedContent) {
      setEditorContent(note.parsedContent);
    }
  }, [note?.parsedContent]);

  if (error) {
    return <Errors message={error} />;
  }

  const handleChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  //edit the note content
  const onNoteEditHandler = async () => {
    if (editorContent.trim().length === 0) {
      return toast.error("Note content Shouldn't be empty");
    }

    try {
      setNoteEditLoader(true);
      const noteData = { content: editorContent };
      await api.put(`/notes/${id}`, noteData);
      toast.success("Note update successful");
      setEditEnable(false);
      fetchNoteDetails();
    } catch (err) {
      toast.error("Update Note Failed");
    } finally {
      setNoteEditLoader(false);
    }
  };

  //navigate to the previous page
  const onBackHandler = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-bg-subtle py-6 sm:py-8">
      <div className="mx-auto w-[92%] max-w-5xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-h1 font-semibold text-text-main">
              Note details
            </h1>
            {note?.createdAt && (
              <p className="text-body text-text-muted">
                Created{" "}
                {moment(note.createdAt).format("MMMM DD, YYYY, hh:mm A")}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onBackHandler}
              className="hidden sm:inline-flex rounded-full"
            >
              Go back
            </Button>
            {!loading && (
              <>
                {!editEnable && (
                  <Button
                    size="sm"
                    onClick={() => setEditEnable(true)}
                    className="min-w-[80px] rounded-full"
                  >
                    Edit
                  </Button>
                )}
                {!editEnable && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setModalOpen(true)}
                    className="rounded-full"
                  >
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {loading ? (
          <Card className="flex min-h-[320px] flex-col justify-center gap-4 p-6">
            <div className="space-y-3">
              <div className="h-3 w-32 animate-pulse rounded-full bg-bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-full bg-bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-bg-muted" />
              <div className="h-3 w-4/6 animate-pulse rounded-full bg-bg-muted" />
            </div>
            <span className="text-body text-text-muted">Loading note...</span>
          </Card>
        ) : (
          <Card className={editEnable ? "flex flex-col overflow-hidden" : "space-y-6"}>
            {editEnable ? (
              <>
                <div className="h-72 sm:h-80 overflow-hidden">
                  <ReactQuill
                    className="h-full"
                    value={editorContent}
                    onChange={handleChange}
                    modules={{
                      toolbar: [
                        [
                          {
                            header: [1, 2, 3, 4, 5, 6],
                          },
                        ],
                        [{ size: [] }],
                        [
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "blockquote",
                        ],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["clean"],
                      ],
                    }}
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-border-subtle bg-bg-surface p-4">
                  <Button
                    variant="secondary"
                    onClick={() => setEditEnable(false)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={onNoteEditHandler}
                    disabled={noteEditLoader}
                    className="min-w-[140px] rounded-full"
                  >
                    {noteEditLoader ? "Updating..." : "Update Note"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div
                  className="ql-editor text-text-main"
                  dangerouslySetInnerHTML={{
                    __html: note?.parsedContent,
                  }}
                />
              </>
            )}
          </Card>
        )}

        <div className="sm:hidden">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBackHandler}
            className="w-full rounded-full"
          >
            Go back
          </Button>
        </div>
      </div>
      <Modals open={modalOpen} setOpen={setModalOpen} noteId={id} />
    </div>
  );
};

export default NoteDetails;
