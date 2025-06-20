import { useState } from 'react';
import avatar from "./assets/unimet_logo.png";

const CommentSystem = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment,
      author: author || 'Anonymous',
      date: new Date().toLocaleString()
    };
    
    setComments([...comments, comment]);
    setNewComment('');
  };

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
        
        <button type="submit">Postear comentario</button>
      </form>
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No hay comentarios, se el primero en subir un comentario!!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment">
                <div className="comment-meta">
                <div className="comment-date">{comment.date}</div>
                
                <div className="comment-author"> <img src= {avatar} alt="" /> {comment.author}: {comment.text}</div>
              
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSystem;