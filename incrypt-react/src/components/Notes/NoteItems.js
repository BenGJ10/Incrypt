import { MdRemoveRedEye } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import { truncateText } from "../../utils/truncateText";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import { motion } from "framer-motion";

const NoteItems = ({ parsedContent, id, noteDateValue, createdAt, animationIndex = 0 }) => {
  const rawDate = noteDateValue || createdAt;
  const formattedDate =
    rawDate && moment(rawDate).isValid()
      ? moment(rawDate).format("D MMMM YYYY")
      : "Unknown date";

  const delay = Math.min(animationIndex * 0.1, 0.6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="relative flex min-h-72 max-h-80 flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-surface px-4 py-4 shadow-card-md transition-shadow duration-200 hover:shadow-custom"
    >
      <div
        className="mb-4 flex-1 text-body text-text-main ql-editor"
        dangerouslySetInnerHTML={{ __html: truncateText(parsedContent) }}
      ></div>
      <div className="flex items-center justify-between border-t border-border-subtle pt-3 text-[12px] text-text-muted">
        <span>{formattedDate}</span>
        <Link to={`/notes/${id}`}>
          <Tooltip title="View note">
            <IconButton size="small">
              <MdRemoveRedEye className="text-text-muted" />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </motion.div>
  );
};

export default NoteItems;
