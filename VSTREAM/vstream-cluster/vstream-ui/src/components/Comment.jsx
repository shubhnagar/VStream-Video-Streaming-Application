import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Trash2, Edit2, X } from "lucide-react";
import { getAddCommentUrl, getCommentsUrl, getCommentByIdUrl } from "../http/VideoServiceUrls";
import { getUsernameUrl } from "../http/UserServiceUrls"; 

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [usernames, setUsernames] = useState({}); // Store usernames by userId
  const [loading, setLoading] = useState(true);

  const fetchUserName = async (userId) => {
    try {
      const response = await fetch(getUsernameUrl(userId), {
        method: "GET",
      });
      if (response.ok) {
        const userData = await response.json();
        setUsernames((prevUsernames) => ({
          ...prevUsernames,
          [userId]: userData.username, // Save username by userId
        }));
      } else {
        console.error("Failed to fetch username");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };


  // Fetch comments for the video when the page loads
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(getCommentsUrl(videoId)); // API to get comments
        if (response.ok) {
          const fetchedComments = await response.json();
          setComments(fetchedComments);

          // Fetch usernames for all the userIds in the comments
          fetchedComments.forEach((comment) => {
            if (!usernames[comment.userId]) {
              fetchUserName(comment.userId); // Fetch username if not already fetched
            }
          });
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);


  const addComment = async () => {
    if (!newComment.trim()) return;

    const authToken = localStorage.getItem("authToken");
    let userId;
    try {
      // Decode the JWT to extract user information
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.user_id; // Replace with the correct key for uploaderId
    } catch (error) {
      console.error("Failed to decode authToken:", error);
      return;
    }

    const commentDTO = {
      videoId: videoId, // Pass the video ID as a UUID
      userId: userId, // Replace with the logged-in user's ID (as UUID)
      content: newComment, // Use "content" to align with the backend's DTO
    };

    try {
      const response = await fetch(getAddCommentUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentDTO),
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments([savedComment, ...comments]); // Add new comment to the list
        setNewComment(""); // Clear the input field
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const editComment = async () => {
    if (!editText.trim()) {
      console.warn("Content cannot be empty.");
      return;
    }
  
    const authToken = localStorage.getItem("authToken");
    let userId;
    try {
      // Decode the JWT to extract user information
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.user_id; // Replace with the correct key for uploaderId
    } catch (error) {
      console.error("Failed to decode authToken:", error);
      return;
    }
  
    try {
      const response = await fetch(getCommentByIdUrl(editingId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the token for secured endpoints
        },
        body: editText, // The backend expects just the content string
      });
  
      if (response.ok) {
        const updatedComment = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === editingId ? updatedComment : editText
          )
        ); // Update the specific comment in the list
        console.log("Comment updated successfully.");
        window.location.reload();
      } else if (response.status === 404) {
        console.error("Comment not found.");
      } else {
        console.error("Failed to update comment.");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  

  const deleteComment = async (commentId) => {
    const authToken = localStorage.getItem("authToken");
  
    try {
      const response = await fetch(getCommentByIdUrl(commentId),
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token for secured endpoints
          },
        }
      );
  
      if (response.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        ); // Remove the comment from the list
        setShowAlert(true); // Show success alert
        setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
        console.log(`Comment with ID ${commentId} deleted successfully.`);
        window.location.reload();
      } else if (response.status === 404) {
        console.error(`Comment with ID ${commentId} not found.`);
      } else {
        console.error(`Failed to delete comment with ID ${commentId}.`);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const saveEdit = () => {
    setComments(
      comments.map((comment) =>
        editComment()
      )
    );
    setEditingId(null);
  };

  const toggleLike = (id) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked,
            }
          : comment
      )
    );
  };

  return (
    <div className="mt-8 w-full mx-auto px-4">
      {showAlert && (
        <div className="mb-4 p-4 bg-green-50 text-green-800 rounded-lg">
          Comment deleted successfully
        </div>
      )}

      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-none"
        />
        <button
          onClick={addComment}
          disabled={!newComment.trim()}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post Comment
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.commentId}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  {comment.userId.slice(0, 1)} {/* Display user's initial */}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{comment.userId}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()} {/* Format timestamp */}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleLike(comment.commentId)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
                    comment.isLiked
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>{comment.likes}</span>
                  {/* <span>likes</span> */}
                </button>
                <button
                  onClick={() => {
                    setEditingId(comment.commentId);
                    setEditText(comment.content);
                  }}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteComment(comment.commentId)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {editingId === comment.commentId ? (
              <div className="mt-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-none"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-700">{comment.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
