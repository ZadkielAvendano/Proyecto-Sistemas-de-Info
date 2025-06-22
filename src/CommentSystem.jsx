import { useState } from 'react';
import avatar from "./assets/unimet_logo.png";

const starOptions = {
  '5star': '⭐⭐⭐⭐⭐',
  '4stars': '⭐⭐⭐⭐',
  '3stars': '⭐⭐⭐',
  '2stars': '⭐⭐',
  '1star': '⭐'
};

const CommentSystem = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [rating, setRating] = useState('5star');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment,
      author: author || 'Anonymous',
      date: new Date().toLocaleString(),
      ProfilePicture: avatar,
      rating: rating, 
      stars: starOptions[rating] 
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className="comment-system">
      <h2>Comentarios ({comments.length})</h2>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="author">Nombre (opcional)</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Nombre"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="comment">Tu comentario</label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario aqui"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select 
            id="rating" 
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value="5star">⭐⭐⭐⭐⭐</option>
            <option value="4stars">⭐⭐⭐⭐</option>
            <option value="3stars">⭐⭐⭐</option>
            <option value="2stars">⭐⭐</option>
            <option value="1star">⭐</option>
          </select>
        </div>
        
        <button type="submit">Postear comentario</button>
      </form>
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No hay comentarios, se el primero en subir un comentario!!</p>
        ) : (
          <>
            {displayedComments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-meta">
                  <div className="comment-date">{comment.date}</div>
                  <div className="comment-author"> 
                    <img src={comment.ProfilePicture} alt="" /> 
                    {comment.author}: {comment.text}
                  </div>
                  <div className="comment-stars">{comment.stars}</div>
                </div>
              </div>
            ))}
            {comments.length > 3 && !showAllComments && (
              <button 
                onClick={() => setShowAllComments(true)}
                className="show-more-btn"
              >
                Mostrar más comentarios
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSystem;