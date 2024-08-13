import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import articlesAPI from "../../api/articles-api";
import { useForm } from "../../hooks/useForm";
import { useAuthContext } from "../../contexts/AuthContext";
import { useGetOneArticles} from "../../hooks/useArticles";
import commentsAPI from "../../api/comments-api";
import  { useCreateComment, useGetAllComments } from "../../hooks/useComments";


//import ReadNext from "./read-next/ReadNext";

const initialValues = {
  comment: ''
}

export default function ArticleDetails({
  _id, 
  title, 
  description,
  content, 
  category,
  creator, 
  image_url, 
  pubDate
}){
  const navigate = useNavigate();
  const {articleId} = useParams();      
  const [comments, setComments] = useGetAllComments(articleId);
  const createComment = useCreateComment();
  // const {email, userId } = useAuthContext();
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
      } catch (err) {
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

  // const isOwner = userId === article._ownerId;
  
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

        
        </div>
      </div>
    </div>
   
  </>  
  );
}