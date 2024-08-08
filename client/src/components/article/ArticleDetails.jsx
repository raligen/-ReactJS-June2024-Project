import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import articlesAPI from "../../api/articles-api";
import commentsAPI from "../../api/comments-api";
import { useForm } from "../../hooks/useForm";
import { useAuthContext } from "../../contexts/AuthContext";
import { useGetOneArticles} from "../../hooks/useArticles";
import  { useCreateComment, useGetAllComments } from "../../hooks/useComments";

import ReadNext from "./read-next/ReadNext";

const initialValues = {
  comment: ''
}

export default function ArticleDetails(){
  const navigate = useNavigate();
  const {articleId} = useParams();      
  const [comments, setComments] = useGetAllComments(articleId);
  const createComment = useCreateComment();
  const {email, userId } = useAuthContext();
  const [article] = useGetOneArticles(articleId);
  const { isAuthenticated } = useAuthContext(); 
  const {
    changeHandler,
    submitHandler,
    values,
  } = useForm(initialValues, async ({ comment }) => {
      try {
        const newComment = await createComment(articleId, comment);
        setComments(oldComments => [...oldComments, newComment]);
      } catch (error) {
        console.log(err.message);
      }
     
  });

  const articleDeleteHandler = async () => {
    const isConfirmed = confirm(`Are you sure you want to delete ${article.title} article?`);
    if (!isConfirmed) { 
      return;
    }
    try {
      await articlesAPI.remove(articleId);
      navigate('/');
    } catch(err) {
      console.log(err.message);
    }
  }

  const isOwner = userId === article._ownerId;
  
  return (
    <>
      <div className="container">
        <div className="jumbotron jumbotron-fluid mb-3 pl-0 pt-0 pb-0 bg-white position-relative">
          <div className="h-100 tofront">
            <div className="row justify-content-between">
              <div className="col-md-6 pt-6 pb-6 pr-6 align-self-center">
                <h1 className="text-uppercase font-weight-bold">
                  <p className="text-danger">
                    {article.category}
                  </p>
                </h1>
                <h1 className="display-4 secondfont mb-3 font-weight-bold">
                  {article.title}
                </h1>
                <div className="d-flex align-items-center">
                  <small className="ml-2">
                    <span>
                      {article.source_name}
                    </span>
                    <span className="text-muted">
                      {article.pubDate}
                    </span>
                  </small>
                </div>
              </div>
              <div className="col-md-6 pr-0">
                <img src={article.image_url} className="shadow" />
              </div>
            </div>
          </div>
        </div>
      </div>

    <div className="container pt-4 pb-4">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-8">
          <article className="article-post">
            <p>
             {article.content}
            </p>
          </article>

          {/* write a comment */}
          <div className="container">
              <div className="p-3 m-0 border-0 bd-example">

                {isAuthenticated && (
                  <div className="card bg-light">
                    <header className="card-header border-0 bg-transparent">
                      <img
                        src="https://via.placeholder.com/40x40"
                        className="rounded-circle me-2"
                      />
                      <a className="fw-semibold text-decoration-none">{comment.author.email}</a>
                    </header>
                    <div className="card-body py-1">
                      <form onSubmit={submitHandler}>
                        <div>
                          <label
                            htmlFor="exampleFormControlTextarea1"
                            className="visually-hidden"
                          >
                            Comment
                          </label>
                          <textarea
                            className="form-control form-control-sm border border-2 rounded-1"
                            id="exampleFormControlTextarea1"
                            style={{ height: 50 }}
                            placeholder="Add a comment..."
                            minLength={3}
                            maxLength={255}
                            required=""
                            defaultValue={""}
                            name="comment"
                            value={values.comment}
                            onChange={changeHandler}
                          />
                        </div>
                      </form>
                    </div>
                    <footer className="card-footer bg-transparent border-0 text-end">
                      <button className="btn btn-link btn-sm me-2 text-decoration-none">
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary btn-sm">
                        Submit
                      </button>
                    </footer>
                  </div>
                 )}

        {/* comments number */}
        {comments.length === 0 &&
        <aside className="d-flex justify-content-between align-items-center my-4">
          <h4 className="h6">No Comments</h4>
        </aside>}

        {/* show comments */}
        {comments.map(comment => (
        <article key={comment._id} className="card bg-light">
          <header className="card-header border-0 bg-transparent d-flex align-items-center">
            <div>
              <img
                src="https://via.placeholder.com/40x40"
                className="rounded-circle me-2"
              />
              <a className="fw-semibold text-decoration-none">{comment.author.email}</a>
            </div>
          </header>
          <div className="card-body py-2 px-3">
            {comment.comment}
          </div>
          {isOwner && (
            <footer class="card-footer bg-white border-0 py-1 px-3">
                <Link to={`/articles/${_id}/edit`} type="button" className="btn btn-link btn-sm text-decoration-none">
                  Edit
                </Link>
                <button onClick={articleDeleteHandler} type="button" className="btn btn-link btn-sm text-decoration-none">
                  Delete
                </button>
            </footer>              
            )}
        </article>
        ))}

      </div>      
      </div>
        
        </div>
      </div>
    </div>
   
  </>  
  );
}