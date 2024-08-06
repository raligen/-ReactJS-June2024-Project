import { useState } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "components/comment-section/CommentSection";

import commentsApi from "../../api/comments-api";



import ArticleHeader from "./article-header/ArticleHeader"; 
import ReadNext from "./read-next/ReadNext";

const initialValues = {
  title:'',
  description:'',
  category:'',
  creator:'',
  content:'',
  pubDate:'',
  source_icon:'',
}


export default function ArticleDetails(){
  const {articleId} = useParams()    
  const [article, setArticle] = useGetOneArticles(articleId);
  const {isAuthenticated} = useAuthContext();

  const {
    changeHandler,
    submitHandler,
    values,
  } = useForm(initialValues, (values) => {

  })

  const [comment, setComment] = useState('');

  const commentSubmitHandler = async (e) => {
    e.preventDefault();

    const newComment = await commentsApi.create(articleId, username, comment)
  }

  return (
    <>
    <ArticleHeader />

    <div className="container pt-4 pb-4">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-8">
          <article className="article-post">
            <p>
              Holy grail funding non-disclosure agreement advisor ramen
              bootstrapping ecosystem. Beta crowdfunding iteration assets business
              plan paradigm shift stealth mass market seed money rockstar niche
              market marketing buzz market.
            </p>
            <p>
              Burn rate release facebook termsheet equity technology. Interaction
              design rockstar network effects handshake creative startup direct
              mailing. Technology influencer direct mailing deployment return on
              investment seed round.
            </p>
            <p>
              Termsheet business model canvas user experience churn rate low
              hanging fruit backing iteration buyer seed money. Virality release
              launch party channels validation learning curve paradigm shift
              hypotheses conversion. Stealth leverage freemium venture startup
              business-to-business accelerator market.
            </p>
            <p>
              Freemium non-disclosure agreement lean startup bootstrapping holy
              grail ramen MVP iteration accelerator. Strategy market ramen
              leverage paradigm shift seed round entrepreneur crowdfunding social
              proof angel investor partner network virality.
            </p>
          </article>

        {isAuthenticated && (
        <CommentSection />
        )}
        </div>
      </div>
    </div>
   


      <ReadNext />
  </>  
  );
}