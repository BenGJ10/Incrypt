import * as React from "react";
import { AiOutlineWarning } from "react-icons/ai";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ModalShell from "./ui/ModalShell";
import Button from "./ui/Button";

export default function Modals({ open, setOpen, noteId }) {
  const navigate = useNavigate();
  const [noteDeleteLoader, setNoteDeleteLoader] = React.useState(false);

  const onNoteDeleteHandler = async () => {
    try {
      setNoteDeleteLoader(true);

      await api.delete(`/notes/${noteId}`);

      toast.success("Note deleted successfully");
      setOpen(false);
      navigate("/notes");
    } catch (err) {
      toast.error("Delete note failed");
    } finally {
      setNoteDeleteLoader(false);
    }
  };

  return (
    <ModalShell
      open={open}
      onClose={() => setOpen(false)}
      title="Delete note"
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            className="rounded-full"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            className="rounded-full"
            onClick={onNoteDeleteHandler}
            disabled={noteDeleteLoader}
          >
            {noteDeleteLoader ? "Deleting…" : "Delete"}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AiOutlineWarning className="text-xl" />
        </div>
        <div>
          <p className="text-body font-medium text-text-main">
            Are you sure you want to delete this note?
          </p>
          <p className="mt-1 text-[12px] text-text-muted">
            This action can&apos;t be undone.
          </p>
        </div>
      </div>
    </ModalShell>
  );
}