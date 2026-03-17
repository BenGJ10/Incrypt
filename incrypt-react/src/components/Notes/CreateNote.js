import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MdNoteAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Card from "../ui/Card";
import Button from "../ui/Button";

const CreateNote = () => {
  const navigate = useNavigate();

  const [editorContent, setEditorContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (content) => {
    setEditorContent(content);
  };

  const handleSubmit = async () => {
    if (editorContent.trim().length === 0) {
      return toast.error("Note content is required");
    }

    try {
      setLoading(true);

      const noteData = {
        content: editorContent,
      };

      await api.post("/notes", noteData);

      toast.success("Note created successfully");

      navigate("/notes");
    } catch (err) {
      toast.error("Error creating note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-bg-subtle py-6 sm:py-8">
      <div className="mx-auto w-[92%] max-w-4xl space-y-4">

        {/* Header */}
        <div className="flex items-center gap-2">
          <MdNoteAlt className="text-2xl text-primary" />
          <h1 className="text-h1 font-semibold text-text-main">
            Create note
          </h1>
        </div>

        {/* Editor Card */}
        <Card className="flex flex-col overflow-hidden">

          {/* Editor */}
          <div className="h-72 sm:h-80 overflow-hidden">
            <ReactQuill
              className="h-full"
              value={editorContent}
              onChange={handleChange}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
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

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-border-subtle p-4 bg-bg-surface">
            <Button
              variant="secondary"
              onClick={() => navigate("/notes")}
              className="rounded-full"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-[140px] rounded-full"
            >
              {loading ? "Creating…" : "Create Note"}
            </Button>
          </div>

        </Card>
      </div>
    </div>
  );
};

export default CreateNote;