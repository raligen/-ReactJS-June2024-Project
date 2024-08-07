import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useGetOneArticles} from "../../hooks/useArticles";

import { useForm } from "../../hooks/useForm";
import { useAuthContext } from "../../contexts/AuthContext";


const initialValues = {
    title: '', 
    category: '', 
    creator: '', 
    content: '', 
    description: '', 
    image_url: ''
}; 

export default function ArticleEdit(){
    const navigate = useNavigate();
    const {articleId} = useParams();
    const [article] = useGetOneArticles(articleId);
    const initialFormValues = useMemo(() => Object.assign({}, initialValues, article), [article]);
    const {
        changeHandler,
        submitHandler,
        values,
    } = useForm(initialFormValues, async (values) => {
        const isConfirmed = confirm('Are you sure you want to update this article?');
        if (isConfirmed) { 
        await articlesAPI.update(articleId, values);
        navigate(`/articles/${articleId}/details`);
        }
    });

    return (
        <div className="d-flex p-2 center">
        <div className="p-5 border bg-lightgrey">
        <div>
            <h5 className="font-weight-bold secondfont">Create an Article</h5>
        </div>

        <form onSubmit={submitHandler} className="mt-3"> 

        <div className="row form-group">

            <div className="col">
                <input type="text" className="form-control" name="title" value={values.title} onChange={changeHandler} placeholder="Article title"/>
            </div>

            <div className="col">
                <input type="text" className="form-control" name="creator" value={values.creator} onChange={changeHandler} placeholder="Your name"/>
            </div>

            <div className="col">
                <input type="text" className="form-control" name="image_url" value={values.image_url} onChange={changeHandler} placeholder="Provide an image url..."/>
            </div>
        
        </div>

        <div className="col">
                <input type="text" className="form-control" name="category" value={values.category} onChange={changeHandler} placeholder="Politics, Business, Health..."/>
         </div>

        <div className="form-group">
            <textarea 
                    className="form-control" 
                    id="exampleFormControlTextarea1" 
                    rows="2"
                    placeholder="Short description"
                    name="description"
                    value={values.description}
                    onChange={changeHandler}
            >
            </textarea>
        </div>
        <div className="form-group">
            <textarea 
                    className="form-control" 
                    id="exampleFormControlTextarea1" 
                    rows="6"
                    placeholder="Write your article here..."
                    name="content"
                    value={values.content}
                    onChange={changeHandler}
            >
            </textarea>
        </div>
       
        <button type="submit" className="btn btn-success btn-round">
          Edit
        </button>
      
      </form>
      </div>
      </div>
    );
}
