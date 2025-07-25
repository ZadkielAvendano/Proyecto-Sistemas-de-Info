import { useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { UserContext } from './context/UserContext';
import avatar from "./assets/unimet_logo.png";
import { useNavigate } from 'react-router';
import { supabase } from './config/supabase.js';

const starOptions = {
  '5star': '⭐⭐⭐⭐⭐',
  '4stars': '⭐⭐⭐⭐',
  '3stars': '⭐⭐⭐',
  '2stars': '⭐⭐',
  '1star': '⭐'
};

const CommentSystem = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [rating, setRating] = useState('5star');
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión y cargar comentarios
  useEffect(() => {
    const initialize = async () => {
      await fetchComments();
    };

    initialize();
  }, []);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setComments(data || []);
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          text: newComment,
          author: user.user_metadata?.nombre || user.email.split('@')[0],
          author_id: user.id,
          rating: rating,
          stars: starOptions[rating],
          profile_picture: user.user_metadata?.avatar_url || avatar
        }])
        .select();

      if (error) throw error;

      setComments([data[0], ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error enviando comentario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className="comment-system">
      <h2>Comentarios ({comments.length})</h2>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="comment">Tu comentario</label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario aquí"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="rating">Calificación</label>
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
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Publicar comentario'}
        </button>
      </form>
      
      <div className="comments-list">
        {isLoading && comments.length === 0 ? (
          <p>Cargando comentarios...</p>
        ) : comments.length === 0 ? (
          <p>No hay comentarios, ¡sé el primero en comentar!</p>
        ) : (
          <>
            {displayedComments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-meta">
                  <div className="comment-date">
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                  <div className="comment-author"> 
                    <img 
                      src={comment.profile_picture} 
                      alt={`Avatar de ${comment.author}`}
                      onError={(e) => {
                        e.target.src = avatar;
                      }}
                    /> 
                    <span className="author-name">{comment.author}</span>: {comment.text}
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
                Mostrar más comentarios ({comments.length - 3})
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentSystem;